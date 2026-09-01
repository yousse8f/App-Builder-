import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {
  ROOT,
  PROJECTS_DIR,
  ensureDirs,
  listProjects,
  loadProject,
  saveProject,
  createProject,
  saveAsset,
  projectDir,
  safeName,
  deleteProject,
} from './store.js';

// Backend API configuration
const BACKEND_API_URL = 'http://localhost:3001/api/v1';

async function fetchProjectFromBackend(projectId) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch project from backend:', error);
    return null;
  }
}

async function fetchClientTemplates(clientId, token) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_API_URL}/clients/${clientId}/templates`, {
      headers,
    });
    if (!response.ok) {
      console.error('Failed to fetch client templates:', response.status);
      return [];
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch client templates:', error);
    return [];
  }
}

// Helper function to extract authenticated clientId from request
async function getAuthenticatedClientId(req) {
  // Try to get token from headers
  const authHeader = req.headers['authorization'];
  let token = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  // If no token in headers, try query parameters
  if (!token) {
    const url = new URL(req.url, 'http://localhost');
    token = url.searchParams.get('token');
  }
  
  // Validate token with backend and extract clientId
  if (token) {
    try {
      const validationResult = await validateTokenWithBackend(token);
      if (validationResult && validationResult.valid && validationResult.user) {
        return validationResult.user.clientId || null;
      }
    } catch (e) {
      console.error('Failed to validate token:', e);
    }
  }
  
  return null;
}

// Helper function to extract clientId from request (for backward compatibility)
async function getClientId(req, body = null) {
  // First try authenticated clientId
  const authenticatedClientId = await getAuthenticatedClientId(req);
  if (authenticatedClientId) return authenticatedClientId;
  
  // Try to get clientId from query parameters
  const url = new URL(req.url, 'http://localhost');
  const clientId = url.searchParams.get('clientId');
  if (clientId) return clientId;
  
  // Try to get clientId from body for POST requests (less secure)
  if (body && body.clientId) {
    return body.clientId;
  }
  
  return null;
}

// Helper function to extract token from request
function getToken(req) {
  // Try to get token from headers
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try to get token from query parameters
  const url = new URL(req.url, 'http://localhost');
  const token = url.searchParams.get('token');
  if (token) return token;
  
  return null;
}

// Helper function to validate token with backend
async function validateTokenWithBackend(token) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/validate-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Failed to validate token with backend:', error);
    return null;
  }
}

// Helper function to extract userName from request (for backward compatibility, but not used in strict security)
function getUserName(req) {
  const url = new URL(req.url, 'http://localhost');
  return url.searchParams.get('userName') || null;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const json = (res, code, data) => {
  const body = JSON.stringify(data);
  res.writeHead(code, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization',
  });
  res.end(body);
};

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, {
      'access-control-allow-origin': '*',
    }).end('Not found');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    'content-type': MIME[ext] || 'application/octet-stream',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
  });
  fs.createReadStream(filePath).pipe(res);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Resolve a URL path inside a root dir, blocking traversal.
function resolveWithin(rootDir, urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const full = path.resolve(rootDir, '.' + (decoded.startsWith('/') ? decoded : '/' + decoded));
  const rel = path.relative(rootDir, full);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;
  return full;
}

export function createServer({ renderProject } = {}) {
  ensureDirs();

  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const p = url.pathname;

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200, {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'access-control-allow-headers': 'Content-Type, Authorization',
      });
      res.end();
      return;
    }

    try {
      // ---------- API ----------
      if (p.startsWith('/api/')) {
        if (p === '/api/projects' && req.method === 'GET') {
          const clientId = await getAuthenticatedClientId(req);
          
          // Authentication is required - no anonymous access
          if (!clientId) {
            return json(res, 401, { error: 'Authentication required' });
          }
          
          const allProjects = listProjects();
          
          // Filter projects by clientId - strict isolation
          const filteredProjects = allProjects.filter(project => {
            try {
              const projectData = loadProject(project.name);
              return projectData.clientId === clientId;
            } catch (e) {
              console.error(`Failed to load project ${project.name}:`, e);
              return false;
            }
          });
          
          return json(res, 200, filteredProjects);
        }
        if (p === '/api/projects' && req.method === 'POST') {
          const body = JSON.parse((await readBody(req)).toString() || '{}');
          const authenticatedClientId = await getAuthenticatedClientId(req);
          const token = req.headers['authorization']?.substring(7);

          // Authentication is required
          if (!authenticatedClientId) {
            return json(res, 401, { error: 'Authentication required' });
          }

          // Always use the authenticated clientId - prevent users from creating projects for other clients
          body.clientId = authenticatedClientId;

          // If projectId is provided, fetch project data from backend
          if (body.projectId) {
            const backendProject = await fetchProjectFromBackend(body.projectId);
            if (backendProject) {
              body.name = backendProject.name || body.name;
              body.app = backendProject.name || body.app;
              body.backendProjectId = body.projectId;
              // Verify that the backend project belongs to the authenticated client
              if (backendProject.clientId && backendProject.clientId !== authenticatedClientId) {
                return json(res, 403, { 
                  error: 'Access denied: project belongs to another client' 
                });
              }
            }
          }

          // If templateId is provided, verify client has access to this template
          if (body.templateId) {
            const clientTemplates = await fetchClientTemplates(authenticatedClientId, token);
            const hasAccess = clientTemplates.some(ct => 
              ct.templateId === body.templateId && ct.isActive
            );

            if (!hasAccess) {
              return json(res, 403, { 
                error: 'Access denied: client does not have access to this template' 
              });
            }
          }

          const proj = createProject(body.name, body);
          // Set clientId in the project
          proj.clientId = authenticatedClientId;
          saveProject(body.name, proj);

          return json(res, 201, proj);
        }

        const m = p.match(/^\/api\/project\/([^/]+)(\/.*)?$/);
        if (m) {
          const name = safeName(decodeURIComponent(m[1]));
          const sub = m[2] || '';
          const authenticatedClientId = await getAuthenticatedClientId(req);

          // Authentication is required for all project operations
          if (!authenticatedClientId) {
            return json(res, 401, { error: 'Authentication required' });
          }

          if (!sub && req.method === 'GET') {
            const project = loadProject(name);
            
            // Check if user has access to this project
            if (project.clientId && project.clientId !== authenticatedClientId) {
              return json(res, 403, { error: 'Access denied: project belongs to another client' });
            }
            
            // If project has backendProjectId, fetch fresh data from backend
            if (project.backendProjectId) {
              const backendProject = await fetchProjectFromBackend(project.backendProjectId);
              if (backendProject) {
                project.name = backendProject.name || project.name;
                project.app = backendProject.name || project.app;
              }
            }
            return json(res, 200, project);
          }
          if (!sub && req.method === 'PUT') {
            const project = loadProject(name);
            
            // Check if user has access to this project before updating
            if (project.clientId && project.clientId !== authenticatedClientId) {
              return json(res, 403, { error: 'Access denied: project belongs to another client' });
            }
            
            const body = JSON.parse((await readBody(req)).toString());
            
            // Ensure clientId cannot be changed
            body.clientId = project.clientId;
            
            saveProject(name, body);
            return json(res, 200, { ok: true });
          }
          if (!sub && req.method === 'DELETE') {
            const project = loadProject(name);
            
            // Check if user has access to this project before deleting
            if (project.clientId && project.clientId !== authenticatedClientId) {
              return json(res, 403, { error: 'Access denied: project belongs to another client' });
            }
            
            deleteProject(name);
            return json(res, 200, { ok: true });
          }
          if (sub === '/upload' && req.method === 'POST') {
            const project = loadProject(name);
            
            // Check if user has access to this project before uploading
            if (project.clientId && project.clientId !== authenticatedClientId) {
              return json(res, 403, { error: 'Access denied: project belongs to another client' });
            }
            
            const filename = req.headers['x-filename'] || 'shot.png';
            const buf = await readBody(req);
            const rel = saveAsset(name, String(filename), buf);
            return json(res, 200, { path: rel });
          }
          if (sub === '/render' && req.method === 'POST') {
            const project = loadProject(name);
            
            // Check if user has access to this project before rendering
            if (project.clientId && project.clientId !== authenticatedClientId) {
              return json(res, 403, { error: 'Access denied: project belongs to another client' });
            }
            
            if (!renderProject) return json(res, 501, { error: 'renderer unavailable' });
            const body = JSON.parse((await readBody(req)).toString() || '{}');
            const out = await renderProject(name, body);
            return json(res, 200, out);
          }
          if (sub === '/reveal' && req.method === 'POST') {
            const project = loadProject(name);
            
            // Check if user has access to this project before revealing
            if (project.clientId && project.clientId !== authenticatedClientId) {
              return json(res, 403, { error: 'Access denied: project belongs to another client' });
            }
            
            const { execFile } = await import('node:child_process');
            execFile('open', [projectDir(name)]);
            return json(res, 200, { ok: true });
          }
        }
        // Get available templates filtered by client
        if (p === '/api/templates' && req.method === 'GET') {
          const authenticatedClientId = await getAuthenticatedClientId(req);
          const token = req.headers['authorization']?.substring(7);

          // Authentication is required - no anonymous or admin access
          if (!authenticatedClientId) {
            return json(res, 401, { error: 'Authentication required' });
          }

          // Fetch client's assigned templates
          const clientTemplates = await fetchClientTemplates(authenticatedClientId, token);
          
          // Get all available templates
          const templatesResponse = await fetch(`${BACKEND_API_URL}/screenshots/templates`);
          if (!templatesResponse.ok) {
            return json(res, 200, []);
          }

          const allTemplates = await templatesResponse.json();
          const assignedTemplateIds = new Set(clientTemplates.map(ct => ct.templateId));

          // Filter and apply custom names - strict client isolation
          const filteredTemplates = allTemplates
            .filter(template => assignedTemplateIds.has(template.id))
            .map(template => {
              const clientTemplate = clientTemplates.find(ct => ct.templateId === template.id);
              return {
                ...template,
                name: clientTemplate?.customName || template.name,
              };
            });

          return json(res, 200, filteredTemplates);
        }

        // Authentication endpoint for auto-login
        if (p === '/api/auth/status' && req.method === 'GET') {
          const token = getToken(req);
          
          if (!token) {
            return json(res, 200, { authenticated: false, user: null });
          }

          const validationResult = await validateTokenWithBackend(token);
          
          if (validationResult && validationResult.valid) {
            return json(res, 200, { 
              authenticated: true, 
              user: validationResult.user 
            });
          }
          
          return json(res, 200, { authenticated: false, user: null });
        }

        return json(res, 404, { error: 'unknown endpoint' });
      }

      // ---------- static ----------
      if (p === '/' || p === '/index.html') {
        // Inject user context into the HTML
        let html = fs.readFileSync(path.join(ROOT, 'src/editor/index.html'), 'utf-8');
        const token = getToken(req);
        
        // Auto-login: if token is provided, validate it and inject user data
        if (token) {
          const validationResult = await validateTokenWithBackend(token);
          if (validationResult && validationResult.valid) {
            const userData = validationResult.user;
            html = html.replace(
              '</head>',
              `<script>window.APPSHOT_USER = { 
                id: '${userData.id}', 
                name: '${userData.name}', 
                email: '${userData.email}',
                role: '${userData.role}',
                clientId: '${userData.clientId || ''}',
                authenticated: true 
              };</script></head>`
            );
          } else {
            // Token validation failed - deny access completely
            res.writeHead(401, {
              'content-type': 'text/html; charset=utf-8',
            });
            res.end('<html><body><h1>Authentication Required</h1><p>Please login to access this application.</p></body></html>');
            return;
          }
        } else {
          // No authentication provided - deny access completely
          res.writeHead(401, {
            'content-type': 'text/html; charset=utf-8',
          });
          res.end('<html><body><h1>Authentication Required</h1><p>Please login to access this application.</p></body></html>');
          return;
        }
        
        res.writeHead(200, {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store',
          'access-control-allow-origin': '*',
        });
        res.end(html);
        return;
      }
      if (p.startsWith('/src/')) {
        const f = resolveWithin(ROOT, p);
        return f ? serveFile(res, f) : res.writeHead(403).end('Forbidden');
      }
      if (p.startsWith('/projects/')) {
        // Check authentication for project files
        let authenticatedClientId = await getAuthenticatedClientId(req);
        
        if (!authenticatedClientId) {
          return res.writeHead(401).end('Authentication required');
        }
        
        const f = resolveWithin(PROJECTS_DIR, p.slice('/projects'.length));
        
        // Additional check: verify the project belongs to the authenticated client
        if (f) {
          const pathParts = p.split('/');
          if (pathParts.length >= 3) {
            const projectName = pathParts[2];
            try {
              const project = loadProject(projectName);
              if (project.clientId && project.clientId !== authenticatedClientId) {
                return res.writeHead(403).end('Access denied');
              }
            } catch (e) {
              // If we can't load the project, deny access
              return res.writeHead(403).end('Access denied');
            }
          }
        }
        
        return f ? serveFile(res, f) : res.writeHead(403).end('Forbidden');
      }
      if (p.startsWith('/out/')) {
        // Check authentication for output files
        let authenticatedClientId = await getAuthenticatedClientId(req);
        
        if (!authenticatedClientId) {
          return res.writeHead(401).end('Authentication required');
        }
        
        const f = resolveWithin(ROOT, p);
        
        // Additional check: verify the output belongs to the authenticated client
        if (f) {
          const pathParts = p.split('/');
          if (pathParts.length >= 3) {
            const projectName = pathParts[2];
            try {
              const project = loadProject(projectName);
              if (project.clientId && project.clientId !== authenticatedClientId) {
                return res.writeHead(403).end('Access denied');
              }
            } catch (e) {
              // If we can't load the project, deny access
              return res.writeHead(403).end('Access denied');
            }
          }
        }
        
        return f ? serveFile(res, f) : res.writeHead(403).end('Forbidden');
      }
      res.writeHead(404).end('Not found');
    } catch (err) {
      json(res, 500, { error: String(err && err.message ? err.message : err) });
    }
  });
}

export function startServer(opts = {}) {
  const server = createServer(opts);
  return new Promise((resolve) => {
    server.listen(opts.port ?? 0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ port, server, url: `http://127.0.0.1:${port}`, close: () => server.close() });
    });
  });
}
