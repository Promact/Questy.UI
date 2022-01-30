import { TestConduct } from "./testConduct.model";

export interface TestAnswers {
  id: number;
  testConductId: number;
  answeredCodeSnippet: string;
  answeredOption: number;
  testCoduct: TestConduct;
}
