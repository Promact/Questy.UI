﻿import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Test } from "../../tests.model";
import { TestService } from "../../tests.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { MockRouteService } from "../../../questions/questions-single-multiple-answer/mock-route.service";

@Component({
  moduleId: module.id,
  selector: "create-test-footer",
  templateUrl: "create-test-footer.html",
})
export class CreateTestFooterComponent implements OnInit {
  testId!: number;
  isTestSection: boolean;
  isTestQuestion: boolean;
  isTestSettings: boolean;
  @Input("settingsForm")
  public settingsForm!: NgForm;
  @Input("validStartDate")
  public validStartDate!: boolean;
  @Input()
  showIsPausedButton!: boolean;
  @Input("validEndDate")
  public validEndDate!: boolean;
  @Input("validTime")
  public validTime!: boolean;
  @Input("isIpAddressAdded")
  public isIpAddressAdded!: boolean;
  @Output() saveTestSettings: EventEmitter<void>;
  @Output() launchTestDialog: EventEmitter<boolean>;
  @Output() resumeTest: EventEmitter<void>;
  @Output() saveExit: EventEmitter<void>;
  @Output() saveNext: EventEmitter<void>;
  @Output() pauseTest: EventEmitter<void>;
  @Output() SaveCategory: EventEmitter<boolean>;
  @Input("testDetails")
  public testDetails!: Test;
  @Input("isValid")
  public isValid!: boolean;
  isSelectButton!: boolean;
  isTestLaunched: boolean;
  @Input()
  loader!: boolean;
  @Input()
  isFocusLostNull!: boolean;

  constructor(
    private testService: TestService,
    public router: Router,
    private route: ActivatedRoute,
    private mockRouteService: MockRouteService
  ) {
    this.isTestSection = false;
    this.isTestQuestion = false;
    this.isTestSettings = false;
    this.saveTestSettings = new EventEmitter<void>();
    this.launchTestDialog = new EventEmitter<boolean>();
    this.pauseTest = new EventEmitter<void>();
    this.resumeTest = new EventEmitter<void>();
    this.saveExit = new EventEmitter<void>();
    this.saveNext = new EventEmitter<void>();
    this.SaveCategory = new EventEmitter<boolean>();
    this.isTestLaunched = false;
  }

  /**
   * Gets the Id of the Test from the route and fills the Settings saved for the selected Test in their respective fields
   */
  ngOnInit() {
    this.testId = this.route.snapshot.params["id"] as number;
    this.getComponent();
  }

  /**
   * Displays the Component whose route matches that of the url
   */
  getComponent() {
    const url = this.router.url;
    this.isTestSection =
      url === `/tests/${this.testId}/sections` ? true : false;
    this.isTestQuestion =
      url === `/tests/${this.testId}/questions` ? true : false;
    this.isTestSettings =
      url === `/tests/${this.testId}/settings` ? true : false;
  }

  /**
   * Emits the event saveTestSettings
   */
  updateTestSettings() {
    this.saveTestSettings.emit();
  }

  /**
   * Emits the event launchTestDialog
   */
  launchTestDialogBox() {
    this.isTestLaunched = true;
    this.launchTestDialog.emit(this.isTestLaunched);
  }
  /**
   * Emits the event SaveExit in test-questions.component
   */
  saveAndExit() {
    this.saveExit.emit();
  }
  /**
   * Emits the event AddTestQuestionin test-questions.component
   */
  addTestQuestions() {
    this.saveNext.emit();
  }

  pausTest() {
    this.pauseTest.emit();
  }

  resumTest() {
    this.resumeTest.emit();
  }

  saveSelectedCategoryAndExit() {
    this.isSelectButton = false;
    this.SaveCategory.emit(this.isSelectButton);
  }

  saveSelectedCategoryAndMoveNext() {
    this.isSelectButton = true;
    this.SaveCategory.emit(this.isSelectButton);
  }
}
