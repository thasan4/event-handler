import LogEntry from '../models/logEntry.js';

// Middleware function for logging HTTP requests and responses
export default (req, res, next) => {
  // Create a new log entry with the request details
  const logEntry = new LogEntry({
    request: {
      headers: req.headers,
      body: req.body,
      method: req.method,
      url: req.url
    },
    timestamp: new Date()
  });

  // Save the original write and end functions of the response object
  let oldWrite = res.write,
    oldEnd = res.end;

  // Array to hold response chunks
  let chunks = [];

  // Override the response's write function
  res.write = (...restArgs) => {
    // Add the data to the chunks array
    chunks.push(Buffer.from(restArgs[0]));
    // Call the original write function
    oldWrite.apply(res, restArgs);
  };

  // Override the response's end function
  res.end = (...restArgs) => {
    if (restArgs[0]) {
      chunks.push( Buffer.from(restArgs[0]));
    }
    let body = Buffer.concat(chunks).toString('utf8');

    // Add the response details to the log entry
    logEntry.response = {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.getHeaders(),
      body: body
    };

    logEntry.save();

    oldEnd.apply(res, restArgs);
  };

  next();
}