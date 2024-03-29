﻿import { Component, OnInit } from "@angular/core";
import { TestService } from "../tests.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { DeselectCategoryComponent } from "../test-sections/deselect-category.component";
import { TestDetails } from "../test-details";
import { Category } from "../../questions/category.model";
import { Test, TestCategory } from "../tests.model";

@Component({
  moduleId: module.id,
  selector: "test-sections",
  templateUrl: "test-sections.html",
})
export class TestSectionsComponent implements OnInit {
  testDetails: Test;
  testId!: number;
  testCategories: Category[];
  testCategoryObj: TestCategory;
  testDetailsObj!: TestDetails;
  loader: boolean;
  testNameReference!: string;
  isEditTestEnabled!: boolean;
  isCategoryExist: boolean;
  disablePreview: boolean;
  testCategoryAC: TestCategory[] = [];

  constructor(
    public dialog: MatDialog,
    private testService: TestService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarRef: MatSnackBar
  ) {
    this.testCategoryObj = new TestCategory();
    this.testCategories = new Array<Category>();
    this.testCategories = [];
    this.testDetails = new Test();
    this.isCategoryExist = false;
    this.disablePreview = false;
    this.loader = true;
  }

  /**
   * Gets the Id of the Test from the route and fills the Settings saved for the selected Test in their respective fields
   */
  ngOnInit() {
    this.testId = this.route.snapshot.params["id"] as number;
    this.getTestById(this.testId);
    this.isTestAttendeeExist();
  }

  /**
   * Gets the Settings and details saved for a particular Test
   * @param id contains the value of the test Id from the route
   */
  getTestById(id: number) {
    this.testService.getTestById(id).subscribe({
      next: (response) => {
        this.testDetails = response;
        this.testCategories = this.testDetails.categoryAcList.filter(
          (x) => x.questionCount !== 0
        );
        this.disablePreview =
          this.testDetails.categoryAcList === null ||
          this.testDetails.categoryAcList.every((x) => !x.isSelect) ||
          this.testDetails.categoryAcList.every(
            (x) => x.numberOfSelectedQuestion === 0
          );
        this.isCategoryExist =
          this.testDetails.categoryAcList.length === 0 ? false : true;
        this.testNameReference = this.testDetails.testName;
        this.loader = false;
      },
      error: async () => {
        this.loader = false;
        this.openSnackbar("No test found for this id.");
        await this.router.navigate(["/tests"]);
      },
    });
  }

  /**
   * To Select or Deselect a Category from list
   * @param category
   */
  onSelect(category: Category) {
    if (this.isEditTestEnabled) {
      if (!category.isSelect) category.isSelect = true;
      else {
        this.testService
          .deselectCategory(category.id, this.testDetails.id)
          .subscribe({
            next: (isQuestionAdded) => {
              if (isQuestionAdded) {
                this.testCategoryObj.testId = this.testId;
                this.testCategoryObj.categoryId = category.id;
                const dialogRef = this.dialog.open(DeselectCategoryComponent, {
                  data: this.testCategoryObj,
                });
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) category.isSelect = false;
                });
              } else {
                category.isSelect = false;
              }
            },
            error: () => {
              this.openSnackbar("Something went wrong.Please try again later.");
            },
          });
      }
    }
  }

  /**
   * To save the test categories and move further
   * @param isSelectButton whose value will indicate what to do next, if it is false it will save changes to the test and exit to the test dashboard. And if the isSelectButton is true, it will save changes and move to the question selection page.
   */
  async saveCategoryToExitOrMoveNext(isSelectButton: boolean) {
    this.testDetails.categoryAcList.forEach((x) => {
      const testCategory = new TestCategory();
      testCategory.categoryId = x.id;
      testCategory.isSelect = x.isSelect;
      this.testCategoryAC.push(testCategory);
    });
    this.loader = true;
    if (this.isEditTestEnabled) {
      this.testService
        .addTestCategories(this.testDetails.id, this.testCategoryAC)
        .subscribe({
          next: async (response) => {
            if (response) {
              if (isSelectButton) {
                this.loader = false;
                await this.router.navigate([`/tests/${this.testId}/questions`]);
              } else {
                this.loader = false;
                await this.router.navigate(["/tests"]);
              }
            }
          },
          error: () => {
            this.loader = false;
            this.openSnackbar("Something went wrong, try again");
          },
        });
    } else if (isSelectButton)
      await this.router.navigate([`/tests/${this.testId}/questions`]);
    else await this.router.navigate(["/tests"]);
  }

  /**
   *To display message in snackbar whenever required
   */
  openSnackbar(message: string) {
    return this.snackbarRef.open(message, "Dismiss", {
      duration: 4000,
    });
  }

  /**
   * Checks if any candidate has taken the test
   */
  isTestAttendeeExist() {
    this.testService.isTestAttendeeExist(this.testId).subscribe((res) => {
      this.isEditTestEnabled = !res;
    });
  }
}
