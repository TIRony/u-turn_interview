const app = require('./app');
const constants = require('./config/constants');

const { PORT, ENV } = constants.SERVER;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  
  if (ENV === 'development') {
    console.log(`Development mode enabled`);
  }
});

const gracefulShutdown = (signal) => {
  console.log(`${signal} received, shutting down...`);
  
  server.close(() => {
    console.log('Server closed');
    console.log('Database connections closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});
