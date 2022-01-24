import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TestCategory } from "../tests.model";
import { TestService } from "../tests.service";

@Component({
  moduleId: module.id,
  selector: "deselect-category",
  templateUrl: "deselect-category.html",
})
export class DeselectCategoryComponent {
  constructor(
    public testService: TestService,
    public dialogRef: MatDialogRef<DeselectCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TestCategory,
    public snackbarRef: MatSnackBar
  ) {}

  /**
   * When user selects 'Yes' to deselect the category, category is deselected
   */
  yesDeselectCategory() {
    this.testService.removeDeselectedCategory(this.data).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: () => {
        this.openSnackbar("Something went wrong.Please try again later.");
        this.dialogRef.close();
      },
    });
  }

  /**
   *To display message in snackbar whenever required
   */
  openSnackbar(message: string) {
    return this.snackbarRef.open(message, "Dismiss", {
      duration: 4000,
    });
  }
}
