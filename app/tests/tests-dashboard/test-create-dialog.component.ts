import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Test } from "../tests.model";
import { TestService } from "../tests.service";

@Component({
  moduleId: module.id,
  selector: "test-create-dialog",
  templateUrl: "test-create-dialog.html",
})
export class TestCreateDialogComponent {
  errorMessage!: boolean;
  test: Test;
  testNameReference!: string;
  isWhiteSpaceError!: boolean;
  isButtonClicked: boolean;

  constructor(
    public dialogRef: MatDialogRef<TestCreateDialogComponent>,
    private testService: TestService,
    private snackbar: MatSnackBar,
    public route: Router
  ) {
    this.test = new Test();
    this.isButtonClicked = false;
  }

  /**
   * this method is used to add a new test
   * @param testNameRef is name of the test
   */
  addTest(testNameRef: string) {
    this.isButtonClicked = true;
    this.test.testName = testNameRef;
    testNameRef = testNameRef.trim();
    if (testNameRef) {
      this.testService.IsTestNameUnique(testNameRef, this.test.id).subscribe({
        next: (isTestNameUnique) => {
          this.isButtonClicked = false;
          if (isTestNameUnique) {
            this.isButtonClicked = true;
            this.testService.addTests(this.test).subscribe({
              next: async (responses) => {
                this.isButtonClicked = false;
                this.dialogRef.close(responses);
                await this.route.navigate([`tests/${responses.id}/sections`]);
              },
              error: () => {
                this.isButtonClicked = false;
                this.openSnackbar(
                  "Something went wrong.Please try again later."
                );
              },
            });
          } else this.errorMessage = true;
        },
        error: () => {
          this.isButtonClicked = false;
          this.openSnackbar("Something went wrong.Please try again later.");
        },
      });
    } else {
      this.isWhiteSpaceError = true;
      this.testNameReference = this.testNameReference.trim();
    }
  }
  /**
    this method is used to disable the errorMessage
    */
  changeError() {
    this.errorMessage = false;
    this.isWhiteSpaceError = false;
  }
  /**
    to display error message in snackbar when any  error is caught from server
    */
  openSnackbar(message: string) {
    this.snackbar.open(message, "Dismiss", {
      duration: 4000,
    });
  }

  /**
   * When user press enter key, it will be checked first isButtonClicked is false and then test will be created so that multiple time pressing enter key will not create test with same name.
   * @param testName
   */
  onEnter(testName: string) {
    if (!this.isButtonClicked && testName) this.addTest(testName);
  }
}
