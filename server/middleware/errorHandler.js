const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, error: "Invalid task ID" });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, error: messages.join(", ") });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res
      .status(400)
      .json({ success: false, error: "Duplicate field value" });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
