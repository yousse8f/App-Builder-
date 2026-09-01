import { startServer } from './src/server/index.js';
import { renderProject } from './src/cli/renderer.js';

const { url, port } = await startServer({ 
  port: 4321,
  renderProject 
});
console.log(`Appshot server running at ${url}`);