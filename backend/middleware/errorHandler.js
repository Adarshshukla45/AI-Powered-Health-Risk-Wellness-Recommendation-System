/**
 * Centralized error handler. Register this LAST, after all routes.
 * Never sends err.stack or raw error objects to the client — logs
 * full detail server-side only, per project security requirements.
 */
function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error("[error]", err.message);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong. Please try again.";

  // Mongoose validation errors -> user-friendly 400
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }
  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `That ${field} is already in use.`;
  }
  // Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid identifier provided.";
  }

  res.status(statusCode).json({ message });
}

module.exports = { notFound, errorHandler };
