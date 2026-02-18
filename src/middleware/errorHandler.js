function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    let message = 'An error occurred while processing your request';
    
    if (err.code === 'P2002') {
      message = 'A record with this information already exists';
    } else if (err.code === 'P2025') {
      message = 'Record not found';
    }
    
    return res.status(400).json({
      success: false,
      error: 'Database Error',
      message: message,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.message && err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  if (err.message && (err.message.includes('Invalid') || 
      err.message.includes('cannot be'))) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Input',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: statusCode === 500 ? 'Internal Server Error' : err.message,
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err
    }),
    timestamp: new Date().toISOString(),
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
