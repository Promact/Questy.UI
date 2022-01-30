import { Component } from "@angular/core";
import { Category } from "../category.model";
import { CategoryService } from "../categories.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  moduleId: module.id,
  selector: "add-category-dialog",
  templateUrl: "add-category-dialog.html",
})
export class AddCategoryDialogComponent {
  private response!: HttpErrorResponse;
  private successMessage: string;

  isCategoryNameExist: boolean;
  errorMessage!: string;
  category: Category;
  responseObject!: Category;
  isButtonClicked: boolean;

  constructor(
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    public snackBar: MatSnackBar
  ) {
    this.isCategoryNameExist = false;
    this.category = {} as Category;
    this.successMessage = "Section Added Successfully";
    this.isButtonClicked = false;
  }

  /**
   * Open snackBar
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, "Dismiss", {
      duration: 3000,
    });
  }

  /**
   *Method to add Category
   * @param category:Category object
   */
  addCategory(category: Category) {
    this.isButtonClicked = true;
    category.categoryName = category.categoryName.trim();
    if (category.categoryName) {
      this.categoryService.addCategory(category).subscribe({
        next: (result) => {
          this.responseObject = result;
          this.dialogRef.close(this.responseObject);
          this.openSnackBar(this.successMessage);
        },
        error: (err: HttpErrorResponse) => {
          this.isCategoryNameExist = true;
          this.response = err;
          this.errorMessage = this.response["error"] as string;
          this.isButtonClicked = false;
        },
      });
    }
  }

  /**
   *Method to toggle error message
   */
  changeErrorMessage() {
    this.isCategoryNameExist = false;
  }

  /**
   * Method to call addCategory() method when enter key will be pressed
   * @param category:Category object
   */
  onEnter(category: Category) {
    if (!this.isButtonClicked && category.categoryName)
      this.addCategory(category);
  }
}
