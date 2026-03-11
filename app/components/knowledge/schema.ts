import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const knowledgeTableItemSchema = z.object({
  rank: z.number(),
  word: z.string(),
  sentence: z.string(),
  stability: z.number(),
  difficulty: z.number(),
  nexReviewMs: z.number(),
})

export type KnowledgeTableItemSchema = z.infer<typeof knowledgeTableItemSchema>
