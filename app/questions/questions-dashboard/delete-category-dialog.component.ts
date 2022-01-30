import { Component } from "@angular/core";
import { CategoryService } from "../categories.service";
import { Category } from "../../questions/category.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialogRef } from "@angular/material/dialog";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  moduleId: module.id,
  selector: "delete-category-dialog",
  templateUrl: "delete-category-dialog.html",
})
export class DeleteCategoryDialogComponent {
  private response!: HttpErrorResponse;

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
    this.snackBar.open(message, "Dismiss", {
      duration: 3000,
    });
  }

  /**
   * Method to delete Category
   */
  deleteCategory(category: Category) {
    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.dialog.close(category);
        this.openSnackBar(this.successMessage);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.response = err;
          this.errorMessage = this.response["error"] as string;
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
