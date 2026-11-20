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
    'requestPayloadHash',
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

const budgetSchema = z
  .object({
    min: z.number().min(0, 'budget.min cannot be negative').max(10000000, 'budget.min exceeds limit').default(500),
    max: z.number().min(0, 'budget.max cannot be negative').max(10000000, 'budget.max exceeds limit').default(3500),
    currency: z.string().trim().max(10).default('INR'),
  })
  .refine((b) => b.max >= b.min, {
    message: 'budget.max must be greater than or equal to budget.min',
    path: ['max'],
  });

const createConsultationSchema = z
  .object({
    recipientName: z.string().trim().max(100, 'recipientName cannot exceed 100 characters').optional().default('Recipient'),
    relationship: z.string().trim().min(1, 'relationship is required').max(50, 'relationship cannot exceed 50 characters'),
    occasion: z.string().trim().min(1, 'occasion is required').max(50, 'occasion cannot exceed 50 characters'),
    interests: z.array(z.string().trim().max(100, 'Each interest cannot exceed 100 characters')).max(30).optional().default([]),
    personality: z.array(z.string().trim().max(100, 'Each personality trait cannot exceed 100 characters')).max(30).optional().default([]),
    desiredEmotion: z.string().trim().min(1, 'desiredEmotion is required').max(50, 'desiredEmotion cannot exceed 50 characters'),
    budget: budgetSchema.optional().default({ min: 500, max: 3500, currency: 'INR' }),
    productCategories: z.array(z.string().trim().max(100)).max(30).optional().default([]),
    exclusions: z.array(z.string().trim().max(100)).max(30).optional().default([]),
    notes: z.string().trim().max(1000, 'notes cannot exceed 1000 characters').optional().default(''),
    status: z.enum(['in_progress', 'completed', 'saved']).optional().default('completed'),
    idempotencyKey: z
      .string()
      .trim()
      .min(1, 'idempotencyKey cannot be empty')
      .max(128, 'idempotencyKey cannot exceed 128 characters')
      .regex(/^[\w\-.:]+$/, 'idempotencyKey contains invalid characters')
      .optional(),
    // Passthrough checks to catch injected fields
    userId: z.any().optional(),
    user: z.any().optional(),
    _id: z.any().optional(),
    __v: z.any().optional(),
    guestSessionId: z.any().optional(),
    guestSessionHash: z.any().optional(),
    guestSessionExpiresAt: z.any().optional(),
    requestPayloadHash: z.any().optional(),
  })
  .superRefine(rejectOwnershipFields);

const updateConsultationSchema = z
  .object({
    recipientName: z.string().trim().max(100).optional(),
    relationship: z.string().trim().min(1).max(50).optional(),
    occasion: z.string().trim().min(1).max(50).optional(),
    interests: z.array(z.string().trim().max(100)).max(30).optional(),
    personality: z.array(z.string().trim().max(100)).max(30).optional(),
    desiredEmotion: z.string().trim().min(1).max(50).optional(),
    budget: budgetSchema.optional(),
    productCategories: z.array(z.string().trim().max(100)).max(30).optional(),
    exclusions: z.array(z.string().trim().max(100)).max(30).optional(),
    notes: z.string().trim().max(1000).optional(),
    status: z.enum(['in_progress', 'completed', 'saved']).optional(),
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
  createConsultationSchema,
  updateConsultationSchema,
};
