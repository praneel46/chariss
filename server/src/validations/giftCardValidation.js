const { z } = require('zod');

// Helper to reject unauthorized ownership or session injection in client request bodies
function rejectOwnershipFields(data, ctx) {
  const forbiddenFields = [
    'userId',
    'user',
    '_id',
    '__v',
    'guestSessionId',
    'guestSessionHash',
    'guestSessionExpiresAt',
  ];
  for (const field of forbiddenFields) {
    if (field in data && data[field] !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Field '${field}' is forbidden in client request bodies. User and session identities are strictly managed by the server.`,
        path: [field],
      });
    }
  }
}

const createGiftCardSchema = z
  .object({
    recipientName: z.string().trim().max(100, 'recipientName cannot exceed 100 characters').optional().default(''),
    senderName: z.string().trim().max(100, 'senderName cannot exceed 100 characters').optional().default(''),
    occasion: z.string().trim().max(50, 'occasion cannot exceed 50 characters').optional().default('General'),
    templateId: z.string().trim().min(1, 'templateId is required').max(50, 'templateId cannot exceed 50 characters'),
    message: z.string().trim().min(1, 'message is required').max(2000, 'message cannot exceed 2000 characters'),
    tone: z.enum(['heartfelt', 'playful', 'romantic', 'formal', 'short', 'poetic']).optional().default('heartfelt'),
    alignment: z.enum(['left', 'center', 'right']).optional().default('center'),
    fontSize: z.enum(['sm', 'md', 'lg']).optional().default('md'),
    designSettings: z.record(z.any()).optional().default({}),
    imageUrl: z
      .string()
      .trim()
      .max(1000, 'imageUrl cannot exceed 1000 characters')
      .url('Invalid imageUrl URL format')
      .optional()
      .nullable()
      .or(z.literal(''))
      .default(null),
    userId: z.any().optional(),
    user: z.any().optional(),
    _id: z.any().optional(),
    __v: z.any().optional(),
    guestSessionId: z.any().optional(),
    guestSessionHash: z.any().optional(),
    guestSessionExpiresAt: z.any().optional(),
  })
  .superRefine(rejectOwnershipFields);

const updateGiftCardSchema = z
  .object({
    recipientName: z.string().trim().max(100).optional(),
    senderName: z.string().trim().max(100).optional(),
    occasion: z.string().trim().max(50).optional(),
    templateId: z.string().trim().min(1).max(50).optional(),
    message: z.string().trim().min(1).max(2000).optional(),
    tone: z.enum(['heartfelt', 'playful', 'romantic', 'formal', 'short', 'poetic']).optional(),
    alignment: z.enum(['left', 'center', 'right']).optional(),
    fontSize: z.enum(['sm', 'md', 'lg']).optional(),
    designSettings: z.record(z.any()).optional(),
    imageUrl: z.string().trim().max(1000).url().optional().nullable().or(z.literal('')),
    userId: z.any().optional(),
    user: z.any().optional(),
    _id: z.any().optional(),
    __v: z.any().optional(),
    guestSessionId: z.any().optional(),
    guestSessionHash: z.any().optional(),
    guestSessionExpiresAt: z.any().optional(),
  })
  .superRefine(rejectOwnershipFields);

module.exports = {
  createGiftCardSchema,
  updateGiftCardSchema,
};
