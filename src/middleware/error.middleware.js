const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Duplicate key (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors).map(e => e.message)
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired"
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};

export default errorHandler;