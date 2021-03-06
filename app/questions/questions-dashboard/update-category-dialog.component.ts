import { Component, Injectable } from "@angular/core";
import { CategoryService } from "../categories.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Category } from "../category.model";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
@Component({
  moduleId: module.id,
  selector: "update-category-dialog",
  templateUrl: "update-category-dialog.html",
})
export class UpdateCategoryDialogComponent {
  private response!: HttpErrorResponse;
  private successMessage: string;

  isCategoryNameExist: boolean;
  errorMessage!: string;
  category!: Category;
  responseObject!: Category;
  isButtonClicked: boolean;

  constructor(
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<UpdateCategoryDialogComponent>,
    public snackBar: MatSnackBar
  ) {
    this.isCategoryNameExist = false;
    this.successMessage = "Section Name Updated Successfully";
    this.isButtonClicked = false;
  }

  /**
   * Open snackbar
   */
  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 3000,
    });
  }

  /**
   *Method to update Category
   * @param category: Category object
   */
  updateCategory(category: Category) {
    this.isButtonClicked = true;
    category.categoryName = category.categoryName.trim();
    if (category.categoryName) {
      this.categoryService.updateCategory(category.id, category).subscribe({
        next: (result) => {
          this.responseObject = result;
          this.dialogRef.close(this.responseObject);
          this.openSnackBar(this.successMessage);
        },
        error: (err: HttpErrorResponse) => {
          this.isCategoryNameExist = true;
          this.response = err;
          //this.errorMessage = this.response["error"][0] as string;
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
   * Method to call updateCategory() method when enter key will be pressed
   * @param category:Category object
   */
  onEnter(category: Category) {
    if (!this.isButtonClicked && category.categoryName) {
      this.updateCategory(category);
    }
  }
}
