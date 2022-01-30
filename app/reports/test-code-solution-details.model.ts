import { ProgrammingLanguage } from "./programminglanguage.enum";

export interface TestCodeSolutionDetails {
  language: ProgrammingLanguage;
  totalNumberOfAttempts: number;
  numberOfSuccessfulAttempts: number;
  codeSolution: string;
}
