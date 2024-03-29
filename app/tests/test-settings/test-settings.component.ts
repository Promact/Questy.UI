﻿import { Component, OnInit } from "@angular/core";
import { TestService } from "../tests.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { TestOrder } from "../enum-testorder";
import { Test } from "../tests.model";
import { BrowserTolerance } from "../enum-browsertolerance";
import { AllowTestResume } from "../enum-allowtestresume";
import { IncompleteTestCreationDialogComponent } from "./incomplete-test-creation-dialog.component";
import { TestIPAddress } from "../test-IPAdddress";
import { every, isUndefined, isNull } from "lodash-es";
import { HttpErrorResponse } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
@Component({
  moduleId: module.id,
  selector: "test-settings",
  templateUrl: "test-settings.html",
})
export class TestSettingsComponent implements OnInit {
  isFocusLostNull!: boolean;
  showIsPausedButton!: boolean;
  isRelaunched!: boolean;
  testDetails: Test;
  testId!: number;
  validEndDate: boolean;
  endDate!: string;
  validTime: boolean;
  validStartDate: boolean;
  currentDate: Date;
  isLaunchedAlready: boolean;
  testNameUpdatedMessage!: string;
  testSettingsUpdatedMessage: string;
  testNameRef!: string;
  isTestNameExist!: boolean;
  QuestionOrder = TestOrder;
  OptionOrder = TestOrder;
  BrowserTolerance = BrowserTolerance;
  AllowTestResume = AllowTestResume;
  response!: HttpErrorResponse;
  errorMessage!: string;
  testNameReference!: string;
  isSectionOrQuestionAdded!: boolean;
  loader!: boolean;
  isAttendeeExistForTest: boolean;
  testLink!: string;
  copiedContent: boolean;
  tooltipMessage: string;
  ipAddressArray: TestIPAddress[] = [];
  numberOfIpFields: number[] = [];
  disablePreview: boolean;
  isIpAddressAdded: boolean;
  isIpAddressFieldNull!: boolean;

  constructor(
    public dialog: MatDialog,
    private testService: TestService,
    private router: Router,
    private route: ActivatedRoute,
    public snackbarRef: MatSnackBar
  ) {
    this.testDetails = new Test();
    this.isLaunchedAlready = false;
    this.validEndDate = false;
    this.validTime = false;
    this.validStartDate = false;
    this.currentDate = new Date();
    this.testSettingsUpdatedMessage =
      "The settings of the Test has been updated successfully.";
    this.isAttendeeExistForTest = false;
    this.copiedContent = true;
    this.tooltipMessage = "Copy to Clipboard";
    this.disablePreview = false;
    this.isIpAddressAdded = true;
  }

  /**
   * Gets the Id of the Test from the route and fills the Settings saved for the selected Test in their respective fields
   */
  ngOnInit() {
    this.loader = true;
    this.testId = this.route.snapshot.params["id"] as number;
    this.getTestById(this.testId);
  }

  /**
   * Gets the Settings saved for a particular Test
   * @param id contains the value of the Id from the route
   */
  getTestById(id: number) {
    this.testService.getTestById(id).subscribe({
      next: (response) => {
        this.testDetails = response;
        this.testNameReference = this.testDetails.testName;
        this.disablePreview =
          isUndefined(this.testDetails.categoryAcList) ||
          isNull(this.testDetails.categoryAcList) ||
          every(
            this.testDetails.categoryAcList,
            (category) => !category.isSelect
          ) ||
          every(
            this.testDetails.categoryAcList,
            (x) => x.numberOfSelectedQuestion === 0
          );
        this.loader = false;
        const magicString = this.testDetails.link;
        const domain = window.location.origin;
        this.testLink = `${domain}/conduct/${magicString}`;
        this.testDetails.startDate = this.toDateString(
          new Date(<string>this.testDetails.startDate)
        );
        this.testDetails.endDate = this.toDateString(
          new Date(<string>this.testDetails.endDate)
        );
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
   * Converts the utc date-time obtained for start and end test date-time fields into local date-time
   * @param date contains the start and end test field values fetched from the database
   */
  private toDateString(date: Date): string {
    return (
      date.getFullYear().toString() +
      "-" +
      `0${date.getMonth() + 1}`.slice(-2) +
      "-" +
      `0${date.getDate()}`.slice(-2) +
      "T" +
      date.toTimeString().slice(0, 5)
    );
  }

  /**
   * Open snackbar
   * @param message contains the message to be displayed when the snackbar gets opened
   */
  openSnackBar(message: string) {
    this.snackbarRef.open(message, "Dismiss", {
      duration: 4000,
    });
  }

  /**
   * Checks the End Date and Time is valid or not
   * @param endDate contains ths the value of the field End Date and Time
   */
  isEndDateValid(endDate: string | Date) {
    if (
      new Date(<string>this.testDetails.startDate) >= new Date(<string>endDate)
    ) {
      this.validEndDate = true;
      this.validStartDate = false;
    } else this.validEndDate = false;
  }

  /**
   * Checks whether the Start Date selected is valid or not
   */
  isStartDateValid() {
    this.validStartDate =
      new Date(<string>this.testDetails.startDate) < this.currentDate
        ? true
        : false;
    this.validEndDate =
      new Date(<string>this.testDetails.startDate) >=
      new Date(<string>this.testDetails.endDate)
        ? true
        : false;
  }

  /**
   * Checks whether the Warning Time set is valid
   */
  isWarningTimeValid() {
    this.validTime =
      +this.testDetails.warningTime >= +this.testDetails.duration
        ? true
        : false;
  }

  /**
   *  Updates the settings edited for the selected Test and redirects to the test dashboard after the settings of the selected Test has been successfully updated
   * @param id contains the value of the Id from the route
   * @param testObject is an object of the class Test
   */
  saveTestSettings(id: number, testObject: Test) {
    testObject.startDate = new Date(<string>testObject.startDate).toISOString();
    testObject.endDate = new Date(<string>testObject.endDate).toISOString();

    this.testService.updateTestById(id, testObject).subscribe({
      next: () => {
        this.loader = true;
        const snackBarRef = this.snackbarRef.open(
          "Saved changes successfully.",
          "Dismiss",
          {
            duration: 3000,
          }
        );
        snackBarRef.afterDismissed().subscribe({
          next: async () => {
            await this.router.navigate(["/tests"]);
            this.loader = false;
          },
        });
      },
      error: (errorHandling: HttpErrorResponse) => {
        this.loader = false;
        this.response = errorHandling;
        this.errorMessage = this.response["error"] as string;
        this.snackbarRef.open(this.errorMessage, "Dismiss", {
          duration: 3000,
        });
      },
    });
  }

  /**
   * Launches the Test and also updates the Settings edited for the selected Test
   * @param id contains the value of the Id from the route
   * @param testObject is an object of class Test
   * @param isTestLaunched is a boolean value indicating whether the test has been launched or not
   */
  launchTestDialog(id: number, testObject: Test) {
    const isCategoryAdded = this.testDetails.categoryAcList.some((x) => {
      return x.isSelect;
    });
    if (isCategoryAdded) {
      const isQuestionAdded = this.testDetails.categoryAcList.some(function (
        x
      ) {
        return x.numberOfSelectedQuestion !== 0;
      });
      if (isQuestionAdded) {
        this.testDetails.isLaunched = true;
        testObject.startDate = new Date(
          <string>testObject.startDate
        ).toISOString();
        testObject.endDate = new Date(<string>testObject.endDate).toISOString();
        this.testService.updateTestById(id, testObject).subscribe({
          next: () => {
            this.ngOnInit();
            this.openSnackBar("Your test has been launched successfully.");
          },
          error: (errorHandling: HttpErrorResponse) => {
            this.response = errorHandling;
            this.errorMessage = this.response["error"] as string;
            this.snackbarRef.open(this.errorMessage, "Dismiss", {
              duration: 3000,
            });
          },
        });
      } else {
        this.testDetails.isQuestionMissing = true;
        this.dialog.open(IncompleteTestCreationDialogComponent, {
          data: this.testDetails,
          disableClose: true,
          hasBackdrop: true,
        });
      }
    } else {
      this.testDetails.isQuestionMissing = false;
      this.dialog.open(IncompleteTestCreationDialogComponent, {
        data: this.testDetails,
        disableClose: true,
        hasBackdrop: true,
      });
    }
  }
  /**
   * Pause the test
   */
  pauseTest() {
    this.testDetails.isPaused = true;
    this.testService
      .updateTestPauseResume(this.testDetails.id, this.testDetails.isPaused)
      .subscribe((response) => {
        if (response) this.openSnackBar("Your test is paused.");
      });
  }

  IsFocusLostValid() {
    this.isFocusLostNull = this.testDetails.focusLostTime.toString() === "";
  }

  changeFocusValue() {
    this.testDetails.focusLostTime =
      this.testDetails.browserTolerance.toString() === "0" ? 0 : 5;
    this.isFocusLostNull = false;
  }

  /**
   * Resumes the test
   */
  resumeTest() {
    this.testDetails.isPaused = false;
    const testObject = JSON.parse(JSON.stringify(this.testDetails)) as Test;

    testObject.startDate = new Date(
      <string>this.testDetails.startDate
    ).toISOString();
    testObject.endDate = new Date(
      <string>this.testDetails.endDate
    ).toISOString();

    this.testService
      .updateTestById(this.testId, testObject)
      .subscribe((response) => {
        if (response) {
          this.ngOnInit();
          this.openSnackBar("Saved changes and resumed test.");
        }
      });
  }

  /**
   * Adds the IP address fields
   */
  addIpFields() {
    const ip = {} as TestIPAddress;
    this.testDetails.testIpAddress.push(ip);
    this.IpAddressAdded(ip.ipAddress);
    this.showErrorMessage(ip);
  }

  /**
   * Removes ip address fields
   * @param index contains the index of the ip address array having the ip address to be removed
   * @param ipId is the Id of the ip address to be removed
   * @param ipAddress is the value of the ip address to be removed
   */
  async removeIpAddress(index: number, ipId: number, ipAddress: string) {
    this.testDetails.testIpAddress.splice(index, 1);
    if (ipId !== undefined)
      await lastValueFrom(this.testService.deleteTestipAddress(ipId));
    this.isIpAddressAdded =
      this.testDetails.testIpAddress.length === 0 ||
      (this.testDetails.testIpAddress.length > 0 &&
        (ipAddress !== undefined ||
          ipAddress !== "" ||
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
            ipAddress
          )));
  }

  /**
   * Checks whether Ip Address has been added or not and also in correct format
   * @param ipAddress contains the Ip Address entered in the input field
   */
  IpAddressAdded(ipAddress: string) {
    this.isIpAddressAdded =
      ipAddress === undefined ||
      ipAddress === "" ||
      !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipAddress
      )
        ? false
        : true;
  }

  /**
   * Displays an error message when the Ip restriction field is empty
   * @param ipAddress : Contains the Ip address value entered by the user
   */
  showErrorMessage(ip: TestIPAddress) {
    ip.isErrorMessageVisible =
      ip.ipAddress === "" || ip.ipAddress === undefined;
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
