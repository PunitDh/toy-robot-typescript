import { CommandResult } from "./types";

export function successMessage(message: string = ""): CommandResult {
  return {
    success: true,
    message,
  };
}

export function errorMessage(message: string = ""): CommandResult {
  return {
    success: false,
    message,
  };
}
