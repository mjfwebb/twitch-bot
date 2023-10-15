import { isError } from "./isError";

export const errorMessage = (error: unknown): string =>
  isError(error) ? error.message : "Unknown Error";
