import { Component } from "@angular/core";
import { CategoryService } from "../categories.service";
import { Category } from "../../questions/category.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  moduleId: module.id,
  selector: "delete-category-dialog",
  templateUrl: "delete-category-dialog.html",
})
export class DeleteCategoryDialogComponent {
  private response!: JSON;

  successMessage: string;
  errorMessage: string;
  category!: Category;
  categoryArray: Category[] = new Array<Category>();

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialogRef<DeleteCategoryDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.successMessage = "Section Deleted Successfully";
    this.errorMessage = "Something went wrong. Please try again later.";
  }

  /**
   * Open a Snackbar
   */
  openSnackBar(message: string) {
    const snackBarRef = this.snackBar.open(message, "Dismiss", {
      duration: 3000,
    });
  }

  /**
   * Method to delete Category
   */
  deleteCategory(category: Category) {
    this.categoryService.deleteCategory(category.id).subscribe({
      next: (response) => {
        this.dialog.close(category);
        this.openSnackBar(this.successMessage);
      },
      error: (err) => {
        if (err.status === 400) {
          this.response = err.json();
          this.errorMessage = this.response["error"][0];
          this.dialog.close(null);
          this.openSnackBar(this.errorMessage);
        } else {
          this.dialog.close(null);
          this.openSnackBar(this.errorMessage);
        }
      },
    });
  }
}
