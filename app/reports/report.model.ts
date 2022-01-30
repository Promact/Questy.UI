import { TestStatus } from "./enum-test-state";

export class Report {
  totalMarksScored!: number;
  percentage!: number;
  percentile!: number;
  testStatus: TestStatus;
  timeTakenByAttendee: number;
  isTestPausedUnWillingly!: boolean;
  isAllowResume!: boolean;
  totalCorrectAttempts!: number;

  constructor() {
    this.testStatus = TestStatus.allCandidates;
    this.timeTakenByAttendee = 0;
  }
}
