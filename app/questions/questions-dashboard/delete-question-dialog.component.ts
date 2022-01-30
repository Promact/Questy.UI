import { Component } from "@angular/core";
import { Question } from "../question.model";
import { QuestionsService } from "../questions.service";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  moduleId: module.id,
  selector: "delete-question-dialog",
  templateUrl: "delete-question-dialog.html",
})
export class DeleteQuestionDialogComponent {
  private response!: HttpErrorResponse;

  successMessage: string;
  errorMessage: string;
  question!: Question;

  constructor(
    private questionService: QuestionsService,
    private dialogRef: MatDialogRef<DeleteQuestionDialogComponent>,
    public snackBar: MatSnackBar
  ) {
    this.successMessage = "Question deleted successfully.";
    this.errorMessage = "Something went wrong. Question can not be deleted.";
  }

  /**
   * Open a Snackbar
   * @param message:To show at Snackbar
   * @param enableRouting:Redirect to page
   */
  private openSnackBar(message: string) {
    this.snackBar.open(message, "Dismiss", {
      duration: 3000,
    });
  }

  /**
   * Method to delete Question
   * @param question:Question object
   */
  deleteQuestion(question: Question) {
    this.questionService.deleteQuestion(question.id).subscribe({
      next: () => {
        this.dialogRef.close(question);
        this.openSnackBar(this.successMessage);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 400) {
          this.response = err;
          this.errorMessage = this.response["error"] as string;
          this.dialogRef.close(null);
          this.openSnackBar(this.errorMessage);
        }
        this.dialogRef.close(null);
        this.openSnackBar(this.errorMessage);
      },
    });
  }
}
