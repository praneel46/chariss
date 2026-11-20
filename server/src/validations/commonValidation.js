const { z } = require('zod');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectIdParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid ID format. Must be a 24-character hexadecimal ObjectId.'),
});

const consultationIdParamSchema = z.object({
  consultationId: z
    .string({ required_error: 'consultationId is required' })
    .regex(objectIdRegex, 'Invalid consultation ID format. Must be a 24-character hexadecimal ObjectId.'),
});

module.exports = {
  objectIdRegex,
  objectIdParamSchema,
  consultationIdParamSchema,
};
