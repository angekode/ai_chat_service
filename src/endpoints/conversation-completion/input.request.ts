import zod from 'zod';

export const messageScheme = zod.object({
  role: zod.enum(['user', 'assistant', 'system']),
  content: zod.string()
});

export const conversationCompletionScheme = zod.object({
  messages: zod.array(messageScheme).min(1),
  stream: zod.boolean()
});
