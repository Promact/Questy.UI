import { Component } from "@angular/core";

@Component({
  selector: "tests-programming-guide-dialog",
  templateUrl: "tests.programming-guide.html",
})
export class TestsProgrammingGuideDialogComponent {
  response: any;
  isDeleteAllowed!: boolean;
  errorMessage!: string;
  successMessage!: string;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
}
