import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter"),
  email: z.string().trim().email("Email tidak valid").transform((email) => email.toLowerCase()),
  password: z.string().min(6, "Password minimal 6 karakter"),
  className: z.string().trim().optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(1)
});

export const materialSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  content: z.string().min(20),
  categoryId: z.string().min(1),
  thumbnail: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  orderNumber: z.coerce.number().int().default(0)
});

export const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  materialId: z.string().optional().nullable(),
  durationMinutes: z.coerce.number().min(1),
  minimumScore: z.coerce.number().min(0).max(100),
  status: z.enum(["DRAFT", "PUBLISHED"])
});

export const questionSchema = z.object({
  quizId: z.string().min(1),
  questionText: z.string().min(5),
  questionType: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "CASE_STUDY", "IMAGE_BASED"]),
  image: z.string().optional().nullable(),
  optionA: z.string().optional().nullable(),
  optionB: z.string().optional().nullable(),
  optionC: z.string().optional().nullable(),
  optionD: z.string().optional().nullable(),
  correctAnswer: z.string().min(1),
  explanation: z.string().optional().nullable(),
  point: z.coerce.number().min(1)
});

export const chatSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(2).max(2000)
});

export const reviewWorkSchema = z.object({
  score: z.coerce.number().min(0).max(100),
  feedback: z.string().min(5),
  status: z.enum(["REVIEWED", "REVISION", "APPROVED", "PUBLISHED"]),
  showFeedback: z.boolean().default(false)
});
