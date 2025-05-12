import { z } from "zod";
export const pseudoSchema = z.string().min(3).max(25).regex(/^[a-zA-Z0-9_-]+$/);
export const playlistIdArray = z.array(z.string().min(1));