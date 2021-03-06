import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CategoryService } from "../categories.service";
import { Category } from "../category.model";
import { QuestionBase } from "../question";
import { Router, ActivatedRoute } from "@angular/router";
import { QuestionsService } from "../questions.service";
import { DifficultyLevel } from "../enum-difficultylevel";
import { SingleMultipleAnswerQuestionOption } from "../single-multiple-answer-question-option.model";
import { MockRouteService } from "./mock-route.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  moduleId: module.id,
  selector: "questions-single-multiple-answer",
  templateUrl: "questions-single-multiple-answer.html",
})
export class SingleMultipleAnswerQuestionComponent implements OnInit {
  indexOfOptionSelected: number | null | undefined;
  categoryName: string;
  optionIndex!: number;
  questionId!: number;
  difficultyLevelSelected: string;
  noOfOptionShown: number | null | undefined;
  isClose: boolean;
  isQuestionEmpty!: boolean;
  isSingleAnswerQuestion!: boolean;
  isEditQuestion!: boolean;
  isduplicateQuestion: boolean;
  isNoOfOptionOverLimit!: boolean;
  categoryArray: Category[];
  difficultyLevel: string[];
  singleMultipleAnswerQuestion: QuestionBase;
  isTwoOptionSame: boolean;
  editor;
  selectedCategoryName!: string;
  selectedDifficultyLevel!: string;
  isCategorySelected: boolean;
  isDifficultyLevelSelected: boolean;
  loader!: boolean;

  private successMessage = "Question saved successfully.";
  private failedMessage = "Question failed to save.";

  constructor(
    private categoryService: CategoryService,
    private questionService: QuestionsService,
    private router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private mockRouteService: MockRouteService
  ) {
    this.noOfOptionShown = 2;
    this.indexOfOptionSelected = null;
    this.isClose = true;
    this.isduplicateQuestion = false;
    this.isTwoOptionSame = false;
    this.difficultyLevelSelected = "default";
    this.categoryName = "default";
    this.categoryArray = new Array<Category>();
    this.singleMultipleAnswerQuestion = new QuestionBase();
    this.difficultyLevel = ["Easy", "Medium", "Hard"];
    for (let i = 0; i < this.noOfOptionShown; i++) {
      const option = {} as SingleMultipleAnswerQuestionOption;
      option.id = this.findMaxId() + 1;
      this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.push(
        option
      );
    }
    this.isCategorySelected = false;
    this.isDifficultyLevelSelected = false;
  }

  ngOnInit() {
    this.loader = true;
    const currentUrl = this.router.url;
    this.selectedCategoryName = this.route.snapshot.params[
      "categoryName"
    ] as string;
    this.selectedDifficultyLevel = this.route.snapshot.params[
      "difficultyLevelName"
    ] as string;
    this.questionId = +this.route.snapshot.params["id"];
    this.getQuestionType();
    this.getAllCategories();
    if (this.questionId > 0 && !currentUrl.includes("duplicate")) {
      this.isEditQuestion = true;
      this.getQuestionById(this.questionId);
    } else if (currentUrl.includes("duplicate")) {
      this.getQuestionById(this.questionId);
      this.isduplicateQuestion = true;
    }
  }

  /**
   * Gets Question of specific Id
   * @param id: Id of the Question
   */
  getQuestionById(id: number) {
    this.questionService.getQuestionById(id).subscribe((response) => {
      this.singleMultipleAnswerQuestion = response;
      this.getCategoryName();
      this.loader = false;
      this.difficultyLevelSelected =
        DifficultyLevel[
          this.singleMultipleAnswerQuestion.question.difficultyLevel
        ];
      this.indexOfOptionSelected =
        this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.findIndex(
          (x) => x.isAnswer === true
        );
      this.noOfOptionShown =
        this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.length;
      this.isClose = this.noOfOptionShown === 2;
      if (this.noOfOptionShown === 10) {
        this.isNoOfOptionOverLimit = true;
      }
    });
  }

  /**
   * Finds the greatest Id of option and increments it
   */
  private findMaxId() {
    return this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion
      ?.singleMultipleAnswerQuestionOption.length === 0
      ? 0
      : Math.max(
          ...this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption.map(
            (o) => o.id
          )
        );
  }

  /**
   * Return category list
   */
  getAllCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (CategoriesList) => {
        this.categoryArray = CategoriesList;
        if (
          this.selectedCategoryName === undefined &&
          this.selectedDifficultyLevel === undefined
        ) {
          this.selectedCategoryName = "AllCategory";
          this.selectedDifficultyLevel = "All";
        }
        this.showPreSelectedCategoryAndDifficultyLevel(
          this.selectedCategoryName,
          this.selectedDifficultyLevel
        );
        this.loader = false;
      },
      error: () => {
        this.snackBar.open("Failed to load category.", "Dismiss", {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Redirect to question dashboard page
   */
  async cancelButtonClicked() {
    await this.router.navigate([
      "/questions/dashboard",
      this.selectedCategoryName,
      this.selectedDifficultyLevel,
    ]);
  }

  /**
   * Remove option from display page
   */
  removeOption(optionIndex: number) {
    this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.splice(
      optionIndex,
      1
    );
    if (
      this.noOfOptionShown !== undefined &&
      this.noOfOptionShown !== null &&
      this.indexOfOptionSelected !== undefined &&
      this.indexOfOptionSelected !== null
    ) {
      this.noOfOptionShown--;
      if (this.noOfOptionShown === 2) {
        this.isClose = true;
      }

      if (+this.indexOfOptionSelected > optionIndex) {
        this.indexOfOptionSelected--;
      } else if (+this.indexOfOptionSelected === optionIndex) {
        this.indexOfOptionSelected = null;
      }
      if (this.noOfOptionShown === 9) {
        this.isNoOfOptionOverLimit = false;
      }
    }
  }

  /**
   * Add option on display page
   */
  addOption() {
    if (this.noOfOptionShown !== undefined && this.noOfOptionShown !== null)
      this.noOfOptionShown++;
    this.isClose = this.noOfOptionShown === 2;
    const newOption = {} as SingleMultipleAnswerQuestionOption;
    newOption.id = this.findMaxId() + 1;
    this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.push(
      newOption
    );
    if (this.noOfOptionShown === 10) {
      this.isNoOfOptionOverLimit = true;
    }
  }

  isTwoOptionsSame(optionName: string, optionIndex: number) {
    this.isTwoOptionSame = false;
    if (
      optionName.trim() !== "" &&
      this.noOfOptionShown !== undefined &&
      this.noOfOptionShown !== null
    ) {
      for (let i = 0; i < this.noOfOptionShown; i++) {
        if (i !== optionIndex)
          this.isTwoOptionSame =
            this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption[
              i
            ].option.trim() === optionName.trim();
        if (this.isTwoOptionSame) {
          break;
        }
      }
    }
    this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption[
      optionIndex
    ].isTwoOptionsSame = this.isTwoOptionSame;
  }

  /**
   * Get question type of question based on current url
   */
  getQuestionType() {
    const url = this.mockRouteService.getCurrentUrl(this.router);
    if (url === "/questions/single-answer") {
      this.singleMultipleAnswerQuestion.question.questionType = 0;
      this.isSingleAnswerQuestion = true;
      this.isEditQuestion = false;
    } else if (url === "/questions/multiple-answers") {
      this.singleMultipleAnswerQuestion.question.questionType = 1;
      this.isSingleAnswerQuestion = false;
      this.isEditQuestion = false;
    } else if (url.includes("edit-single")) {
      this.isSingleAnswerQuestion = true;
    } else if (url.includes("single-answer/duplicate")) {
      this.isSingleAnswerQuestion = true;
      this.isEditQuestion = false;
      this.isduplicateQuestion = true;
    } else if (url.includes("edit-multiple")) {
      this.isSingleAnswerQuestion = false;
    } else if (url.includes("multiple-answers/duplicate")) {
      this.isSingleAnswerQuestion = false;
      this.isEditQuestion = false;
      this.isduplicateQuestion = true;
    } else if (url.includes("/questions/single-answer")) {
      this.singleMultipleAnswerQuestion.question.questionType = 0;
      this.isSingleAnswerQuestion = true;
      this.isEditQuestion = false;
    } else if (url.includes("/questions/multiple-answers")) {
      this.singleMultipleAnswerQuestion.question.questionType = 1;
      this.isSingleAnswerQuestion = false;
      this.isEditQuestion = false;
    }
  }

  /**
   * Get category id based on category name
   * @param category: Category selected by the user
   */
  getCategoryId(category: string) {
    this.categoryName = category;
    this.singleMultipleAnswerQuestion.question.categoryID =
      this.categoryArray.find((x) => x.categoryName === this.categoryName)
        ?.id as number;
  }

  /**
   * Get category name based on category Id
   */
  getCategoryName() {
    this.categoryName = this.categoryArray.find(
      (x) => x.id === this.singleMultipleAnswerQuestion.question.categoryID
    )?.categoryName as string;
  }

  /**
   * Sets the difficulty level
   * @param difficulty: Difficulty level selected by the user
   */
  setDifficultyLevel(difficulty: string) {
    this.difficultyLevelSelected = difficulty;
  }

  /**
   * Check at least one option is selected or not
   */
  isOptionSelected() {
    if (this.singleMultipleAnswerQuestion.question.questionType === 0) {
      return this.indexOfOptionSelected === null ? false : true;
    }
    if (this.singleMultipleAnswerQuestion.question.questionType === 1) {
      return this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption.some(
        (x) => x.isAnswer === true
      );
    }
  }

  /**
   * Add or update or duplicate single/multiple answer question and redirect to question dashboard page
   * @param singleAnswerQuestion: Question of singleMultipleAnswerType will be added, edited or duplicated
   */
  saveSingleMultipleAnswerQuestion(singleMultipleAnswerQuestion: QuestionBase) {
    this.singleMultipleAnswerQuestion.question.difficultyLevel =
      DifficultyLevel[this.difficultyLevelSelected] as DifficultyLevel;
    this.singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption.forEach(
      (x) => (x.id = 0)
    );
    if (singleMultipleAnswerQuestion.question.questionType === 0) {
      singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption.forEach(
        (x) => (x.isAnswer = false)
      );
      singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption[
        this.indexOfOptionSelected as number
      ].isAnswer = true;
    }
    if (this.isduplicateQuestion) {
      singleMultipleAnswerQuestion.question.id = 0;
      singleMultipleAnswerQuestion.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption.forEach(
        (x) => (x.id = 0)
      );
    }
    (this.isEditQuestion
      ? this.questionService.updateSingleMultipleAnswerQuestion(
          this.questionId,
          singleMultipleAnswerQuestion
        )
      : this.questionService.addSingleMultipleAnswerQuestion(
          singleMultipleAnswerQuestion
        )
    ).subscribe({
      next: async () => {
        this.snackBar.open(this.successMessage, "Dismiss", { duration: 3000 });
        await this.router.navigate([
          "questions/dashboard",
          this.categoryName,
          this.difficultyLevelSelected,
        ]);
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(`${this.failedMessage} ${err.message}`, "Dismiss", {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Show pre-selected category and difficulty level while adding question
   * @param categoryName: Name of the category selected
   * @param difficultyLevel: Name of the difficulty level selected
   */
  showPreSelectedCategoryAndDifficultyLevel(
    categoryName: string,
    difficultyLevel: string
  ) {
    if (categoryName !== "AllCategory" && difficultyLevel !== "All") {
      this.isCategorySelected = true;
      this.isDifficultyLevelSelected = true;
      this.categoryName = categoryName;
      this.difficultyLevelSelected = difficultyLevel;
      this.singleMultipleAnswerQuestion.question.categoryID = (
        this.categoryArray.find(
          (x) => x.categoryName === this.categoryName
        ) as Category
      ).id;
    } else if (categoryName === "AllCategory" && difficultyLevel !== "All") {
      this.isCategorySelected = false;
      this.isDifficultyLevelSelected = true;
      this.difficultyLevelSelected = difficultyLevel;
    } else if (categoryName !== "AllCategory" && difficultyLevel === "All") {
      this.isCategorySelected = true;
      this.isDifficultyLevelSelected = false;
      this.categoryName = categoryName;
      this.singleMultipleAnswerQuestion.question.categoryID = (
        this.categoryArray.find(
          (x) => x.categoryName === this.categoryName
        ) as Category
      ).id;
    }
  }
}
