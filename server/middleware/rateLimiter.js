const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Stricter rate limiting for task creation
const createTaskLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 task creations per minute
  message: {
    error: 'Too many task creation requests, please wait a moment before trying again.'
  }
});

module.exports = {
  limiter,
  createTaskLimiter
};
