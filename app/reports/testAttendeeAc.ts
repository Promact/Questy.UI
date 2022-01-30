import { Report } from "./report";

export class TestAttendeeAc {
  id!: number;
  rollNumber!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  contactNumber!: string;
  createdDateTime!: Date;
  starredCandidate!: boolean;
  checkedCandidate!: boolean;
  report: Report;
  backToTest!: boolean;
  generatingReport: boolean;
  reporNotFoundYet!: boolean;

  constructor() {
    this.report = {} as Report;
    this.generatingReport = false;
  }
}
