import { TestCaseType } from "../questions/enum-test-case-type";

export interface CodeSnippetTestCasesDetails {
  testCaseName: string;
  testCaseType: TestCaseType;
  testCaseInput: string;
  expectedOutput: string;
  testCaseMarks: number;
  processing: number;
  memory: number;
  actualOutput: string;
  isTestCasePassing: boolean;
}
