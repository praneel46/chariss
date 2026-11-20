/**
 * Zod Request Validation Middleware
 */

/**
 * Validates req.body against a Zod schema.
 * Returns 400 Bad Request with structured field-level errors if validation fails.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.') || 'general';
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(issue.message);
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: formattedErrors,
      });
    }

    req.body = result.data;
    next();
  };
}

/**
 * Validates req.params against a Zod schema (e.g. MongoDB ObjectId format).
 */
function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.') || 'param';
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(issue.message);
      });

      return res.status(400).json({
        success: false,
        message: 'Invalid request parameter',
        code: 'INVALID_PARAM',
        errors: formattedErrors,
      });
    }

    req.params = result.data;
    next();
  };
}

module.exports = {
  validateBody,
  validateParams,
};
