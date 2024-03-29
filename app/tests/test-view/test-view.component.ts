﻿import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DeleteTestDialogComponent } from "../tests-dashboard/delete-test-dialog.component";
import { Category } from "../../questions/category.model";
import { TestService } from "../tests.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DifficultyLevel } from "../../questions/enum-difficultylevel";
import { Test } from "../tests.model";
import { QuestionType } from "../../questions/enum-questiontype";
import { DuplicateTestDialogComponent } from "../tests-dashboard/duplicate-test-dialog.component";
import screenfull from "screenfull";

@Component({
  moduleId: module.id,
  selector: "test-view",
  templateUrl: "test-view.html",
})
export class TestViewComponent implements OnInit {
  testDetails: Test;
  testId!: number;
  totalNumberOfQuestions: number[];
  questionType = QuestionType;
  difficultyLevel = DifficultyLevel;
  optionName: string[];
  isDeleteAllowed!: boolean;
  tests: Test[];
  isEditTestEnabled!: boolean;
  loader!: boolean;
  count!: number;
  copiedContent!: boolean;
  testLink!: string;
  tooltipMessage: string;
  isCategorySelected: boolean;
  disablePreview: boolean;
  duplicateTestDialogData!: DuplicateTestDialogComponent;
  deleteTestDialogData!: DeleteTestDialogComponent;

  constructor(
    public dialog: MatDialog,
    private testService: TestService,
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.testDetails = new Test();
    this.tests = new Array<Test>();
    this.optionName = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    this.totalNumberOfQuestions = [];
    this.tooltipMessage = "Copy to Clipboard";
    this.isCategorySelected = false;
    this.disablePreview = false;
  }

  ngOnInit() {
    this.loader = true;
    this.testId = this.route.snapshot.params["id"] as number;
    this.getTestDetails(this.testId);
    this.getAllTests();
  }

  // get All The Tests From Server
  getAllTests() {
    this.testService.getTests().subscribe((response) => {
      this.tests = response;
    });
    this.isTestAttendeeExist();
  }
  openSnackBar(text: string) {
    this.snackBar.open(text, "Dismiss", {
      duration: 3000,
    });
  }

  async openNewWindowForPreview() {
    if (screenfull.isEnabled) {
      await screenfull.request();
    }
    await this.router.navigate([`tests/${this.testDetails.link}/preview`]);
  }

  /**
   * Gets the details of the Test by Id
   * @param id contains the value of the Id from the route
   */
  getTestDetails(id: number) {
    this.testService.getTestById(id).subscribe({
      next: (response) => {
        this.testDetails = response;
        this.isCategorySelected = this.testDetails.categoryAcList.some(
          function (x) {
            return x.isSelect;
          }
        );
        this.disablePreview =
          this.testDetails.categoryAcList === null ||
          this.testDetails.categoryAcList.every((x) => !x.isSelect) ||
          this.testDetails.categoryAcList.every(
            (x) => x.numberOfSelectedQuestion === 0
          );
        const linkOfTest = response.link;
        const domain = window.location.origin;
        this.testLink = domain + "/conduct/" + linkOfTest;
        this.testDetails.categoryAcList.forEach((x) => {
          if (x.numberOfSelectedQuestion === 0) x.isQuestionAbsent = true;
          else x.isQuestionAbsent = false;
        });
        this.loader = false;
      },
      error: async () => {
        this.loader = false;
        this.openSnackBar("No test found for this id.");
        await this.router.navigate(["/tests"]);
      },
    });
  }

  /**
   * Gets all the questions of particular category by passing its Id
   * @param category
   * @param i is index of category
   */
  getAllquestions(category: Category, i: number) {
    if (!category.isAccordionOpen) {
      category.isAccordionOpen = true;
      if (!category.isAlreadyClicked) {
        // If Accordion is already clicked then it wont call the server next time it is clicked,so that user can not lose its selected questions
        category.isAlreadyClicked = true;
        this.testService
          .getQuestions(this.testDetails.id, category.id)
          .subscribe((response) => {
            this.testDetails.categoryAcList[i].questionList = response; // gets the total number of questions of particular category
            this.testDetails.categoryAcList[i].questionList =
              this.testDetails.categoryAcList[i].questionList.filter(function (
                x
              ) {
                return x.question.isSelect;
              });
            this.totalNumberOfQuestions[i] =
              this.testDetails.categoryAcList[i].questionList.length;
            this.testDetails.categoryAcList[i].numberOfSelectedQuestion =
              this.testDetails.categoryAcList[i].questionList.length;
            category.selectAll = category.questionList.every(function (
              question
            ) {
              return question.question.isSelect;
            });
          });
      } else {
        category.isAlreadyClicked = true;
      }
    } else {
      category.isAccordionOpen = false;
    }
  }

  /**
   * returns 'correct' class for correct option
   * @param isAnswer
   */
  isCorrectAnswer(isAnswer: boolean) {
    if (isAnswer) {
      return "correct";
    }
  }

  /**
   * Redirects to the Test Settings Page from the Test View Page
   */
  async navigateToTestSettings() {
    await this.router.navigate([`/tests/${this.testId}/settings`]);
  }

  // Open Delete Test Dialog
  deleteTestDialog(test: Test) {
    // Checks if any candidate has taken the test
    this.testService.isTestAttendeeExist(test.id).subscribe((res) => {
      this.isDeleteAllowed = !res;
      this.deleteTestDialogData = this.dialog.open(
        DeleteTestDialogComponent
      ).componentInstance;
      this.deleteTestDialogData.testToDelete = test;
      this.deleteTestDialogData.testArray = this.tests;
      this.deleteTestDialogData.isDeleteAllowed = this.isDeleteAllowed;
    });
  }

  /**
   * Checks if any candidate has taken the test
   */
  isTestAttendeeExist() {
    this.testService.isTestAttendeeExist(this.testId).subscribe((res) => {
      if (res) {
        this.isEditTestEnabled = false;
      } else {
        this.isEditTestEnabled = true;
      }
    });
  }

  /**
   * Open duplicate test dialog
   * @param test: an object of Test class
   */
  duplicateTestDialog(test: Test) {
    const newTestObject = JSON.parse(JSON.stringify(test)) as Test;
    this.duplicateTestDialogData = this.dialog.open(
      DuplicateTestDialogComponent,
      { disableClose: true, hasBackdrop: true }
    ).componentInstance;
    this.testService
      .setTestCopiedNumber(test.testName)
      .subscribe((response) => {
        this.count = response;
        if (this.count === 1)
          this.duplicateTestDialogData.testName =
            newTestObject.testName + "_copy";
        else
          this.duplicateTestDialogData.testName = `${newTestObject.testName}_copy_${this.count}`;
      });
    this.duplicateTestDialogData.testArray = this.tests;
    this.duplicateTestDialogData.testToDuplicate = test;
  }

  /**
   * Navigates the user to the select sections page
   * @param test: an object of Test class
   */
  editTest(test: Test) {
    // Checks if any candidate has taken the test
    this.testService.isTestAttendeeExist(test.id).subscribe({
      next: async (res) => {
        if (!res) {
          await this.router.navigate([`/tests/${test.id}/sections`]);
        }
      },
    });
  }

  /**
   * Displays the tooltip message
   * @param $event is of type Event and is used to call stopPropagation()
   * @param testLink is the link of the test
   */
  showTooltipMessage($event: MouseEvent, testLink: HTMLInputElement) {
    $event.stopPropagation();
    setTimeout(() => {
      testLink.select();
    }, 0);
    this.tooltipMessage = "Copied";
  }

  /**
   * Changes the tooltip message
   */
  changeTooltipMessage() {
    this.tooltipMessage = "Copy to Clipboard";
  }
}
