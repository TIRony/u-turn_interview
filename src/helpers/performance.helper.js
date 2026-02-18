function logPerformance(operation, duration, metadata = {}) {
  const metaString = Object.keys(metadata).length > 0 
    ? ` | ${JSON.stringify(metadata)}` 
    : '';
  
  console.log(`${operation} completed in ${duration}ms${metaString}`);
}

function measureTime(startTime) {
  return Date.now() - startTime;
}

function createTimer() {
  return Date.now();
}

module.exports = {
  logPerformance,
  measureTime,
  createTimer,
};
