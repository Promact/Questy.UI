import { Component } from "@angular/core";
import { Test } from "../tests.model";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TestService } from "../tests.service";
import { Router } from "@angular/router";

@Component({
  moduleId: module.id,
  selector: "delete-test-dialog",
  templateUrl: "delete-test-dialog.html",
})
export class DeleteTestDialogComponent {
  testToDelete!: Test;
  testArray: Test[] = new Array<Test>();
  isDeleteAllowed!: boolean;
  errorMessage: string;
  successMessage: string;

  constructor(
    private testService: TestService,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public dialog: MatDialogRef<any>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    this.errorMessage = "Something went wrong.Please try again later.";
    this.successMessage = "The selected test is deleted.";
  }

  /**
   * Delete the test from the test dashboard page
   */
  deleteTest() {
    const url = this.router.url;
    this.testService.deleteTest(this.testToDelete.id).subscribe({
      next: async () => {
        this.testArray.splice(this.testArray.indexOf(this.testToDelete), 1);
        this.dialog.close();
        this.snackBar.open(this.successMessage, "Dismiss", {
          duration: 3000,
        });
        if (url === `/tests/${String(this.testToDelete.id)}/view`)
          await this.router.navigate(["/tests"]);
      },
      error: () => {
        this.snackBar.open(this.errorMessage, "Dismiss", {
          duration: 3000,
        });
      },
    });
  }
}
