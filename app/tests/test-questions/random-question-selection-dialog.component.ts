import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  moduleId: module.id,
  selector: "random-question-selection-dialog",
  templateUrl: "random-question-selection-dialog.html",
})
export class RandomQuestionSelectionDialogComponent {
  isErrorMessageVisible: boolean;
  isPatternMismatched!: boolean;

  constructor(
    public dialogRef: MatDialogRef<RandomQuestionSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      numberOfQuestions: number;
      numberOfQuestionsInSelectedCategory: number;
    }
  ) {
    this.isErrorMessageVisible = false;
  }

  /**
   * Checks whether the number of questions to be selected randomly is lesser or greater than the number of questions present in the selected category
   * @param numberOfQuestionsToBeSelectedRandomly contains the number of questions entered for selecting randomly
   */
  isNumberOfQuestionsEnteredValid(
    numberOfQuestionsToBeSelectedRandomly: number
  ) {
    this.isErrorMessageVisible =
      +numberOfQuestionsToBeSelectedRandomly >
      this.data.numberOfQuestionsInSelectedCategory;
    this.isPatternMismatched = !/^[0-9]*$/.test(
      numberOfQuestionsToBeSelectedRandomly.toString()
    );
  }

  /**
   * Closes the dialog box on pressing enter key and also passes the number of questions to be selected randomly
   * @param numberOfQuestionsEnteredToBeSelectedRandomly contains the number of questions entered for selecting randomly
   */
  onEnter(numberOfQuestionsEnteredToBeSelectedRandomly: number) {
    if (
      !this.isErrorMessageVisible &&
      !this.isPatternMismatched &&
      numberOfQuestionsEnteredToBeSelectedRandomly
    )
      this.dialogRef.close(numberOfQuestionsEnteredToBeSelectedRandomly);
  }
}
