import { Component } from "@angular/core";
import { Test } from "../tests.model";
import { TestService } from "../tests.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  moduleId: module.id,
  selector: "duplicate-test-dialog",
  templateUrl: "duplicate-test-dialog.html",
})
export class DuplicateTestDialogComponent {
  testName!: string;
  testArray: Test[];
  testToDuplicate!: Test;
  duplicatedTest!: Test;
  error!: boolean;
  successMessage: string;
  id!: number;
  loader!: boolean;

  constructor(
    public testService: TestService,
    public snackBar: MatSnackBar,
    public dialog: MatDialogRef<unknown>,
    private route: Router
  ) {
    this.successMessage = "The selected test has been duplicated successfully.";
    this.testArray = new Array<Test>();
  }

  /**
   * duplicates the selected test
   */
  duplicateTest() {
    this.id = this.testToDuplicate.id;
    this.duplicatedTest = JSON.parse(
      JSON.stringify(this.testToDuplicate)
    ) as Test;
    this.duplicatedTest.id = 0;
    this.duplicatedTest.testName = this.testName;
    this.loader = true;

    // Verifies that the test name is unique
    this.testService
      .IsTestNameUnique(this.duplicatedTest.testName, this.duplicatedTest.id)
      .subscribe({
        next: (isTestNameUnique) => {
          if (isTestNameUnique) {
            this.testService
              .duplicateTest(this.id, this.duplicatedTest)
              .subscribe({
                next: async (response) => {
                  this.loader = false;
                  this.testArray.unshift(response);
                  this.snackBar.open(this.successMessage, "Dismiss", {
                    duration: 3000,
                  });
                  this.dialog.close();
                  await this.route.navigate([
                    `tests/${String(response.id)}/sections`,
                  ]);
                },
                error: () => {
                  this.loader = false;
                },
              });
          } else {
            this.loader = false;
            this.error = true;
          }
        },
        error: () => {
          this.loader = false;
        },
      });
  }

  // this method is used to disable the errorMessage
  onErrorChange() {
    this.error = false;
  }
}
