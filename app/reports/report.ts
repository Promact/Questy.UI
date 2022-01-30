import { TestStatus } from "../reports/enum-test-state";

export interface Report {
  totalMarksScored: number;
  percentage: number;
  percentile: number;
  timeTakenByAttendee: number;
  testStatus: TestStatus;
  isTestPausedUnWillingly: boolean;
  totalCorrectAttempts: number;
}
