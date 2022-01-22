import { CodeResponse } from "./code.response.model";

export interface Code {
  source: string;
  input: string | null;
  language: string;
  codeResponse: CodeResponse;
}
