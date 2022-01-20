import { CodeResponse } from "./code.response.model";

export interface Code {
  source: string;
  input: string;
  language: string;
  codeResponse: CodeResponse;
}
