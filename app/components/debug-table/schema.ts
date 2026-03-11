import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  rank: z.number(),
  title: z.string(),
  stability: z.number(),
  difficulty: z.number(),
  nexReviewMs: z.number(),
  label: z.string(),
})

export type Task = z.infer<typeof taskSchema>
