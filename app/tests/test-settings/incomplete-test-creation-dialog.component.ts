import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Test } from "../tests.model";

@Component({
  moduleId: module.id,
  selector: "incomplete-test-creation",
  templateUrl: "incomplete-test-creation-dialog.html",
})
export class IncompleteTestCreationDialogComponent implements OnInit {
  testId!: number;
  isQuestionMissing!: boolean;

  constructor(
    private readonly dialogRef: MatDialogRef<IncompleteTestCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly data: Test,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    const test = this.data;
    this.testId = test.id;
    this.isQuestionMissing = test.isQuestionMissing;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
