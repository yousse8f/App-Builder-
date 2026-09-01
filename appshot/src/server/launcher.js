import { startServer } from './index.js';

const PORT = process.argv[2] || 4321;

console.log(`Starting Appshot Server on port ${PORT}...`);

// Start server without render function (rendering can be done via CLI)
startServer({
  port: PORT
}).then(({ port, url }) => {
  console.log(`Appshot Server running on ${url}`);
  console.log(`PID: ${process.pid}`);
  console.log('Server is ready to accept connections');
  
  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
  });
  
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
