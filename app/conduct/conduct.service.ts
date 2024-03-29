﻿import { Injectable } from "@angular/core";
import { HttpService } from "../core/http.service";
import { TestAnswer } from "./test_answer.model";
import { TestStatus } from "./teststatus.enum";
import { TestInstructions } from "./testInstructions.model";
import { Observable } from "rxjs";
import { TestBundleModel } from "./test_bundle_model";
import { CodeResponse } from "./code.response.model";
import { TestLogs } from "app/reports/testlogs.model";
import { SessionData } from "./session.model";
import { TestAttendees } from "./register/register.model";
import { Test } from "app/tests/tests.model";
import { TestAttendee } from "app/reports/testattendee.model";

@Injectable()
export class ConductService {
  private testConductUrl = "/api/conduct/";

  constructor(private readonly httpService: HttpService) {}

  /**
   * This method used for register test attendee.
   * @param magicString-It will contain test link
   * @param testAttendee-This model object contain test attendee credential which are first name, last name, email, roll number, contact number.
   */
  registerTestAttendee(magicString: string, testAttendee: TestAttendees) {
    return this.httpService.post<TestAttendees>(
      this.testConductUrl + magicString + "/register",
      testAttendee
    );
  }

  /**
   * Gets all the instruction details before starting of a particular test
   * @param testLink is used to fetch all instructions related to a particular test
   */
  getTestInstructionsByLink(testLink: string): Observable<TestInstructions> {
    return this.httpService.get<TestInstructions>(
      this.testConductUrl + testLink + "/instructions"
    );
  }

  getTestBundle(link: string, testTypePreview: boolean) {
    return this.httpService.get<TestBundleModel>(
      `${this.testConductUrl}testbundle/${link}/${String(testTypePreview)}`
    );
  }

  /**
   *Get list of Questions
   */
  getQuestions(id: number) {
    return this.httpService.get(`${this.testConductUrl}testquestion/${id}`);
  }

  /**
   * Gets the details of a particular test withs all categories it contains
   * @param id is passed to identify that particular "Test"
   */
  getTestByLink(link: string, testTypePreview: boolean) {
    return this.httpService.get(
      `${this.testConductUrl}testbylink/${link}/${String(testTypePreview)}`
    );
  }

  /**
   * Gets Test Attendee by Test Id
   * @param testId: Id of Test
   */
  getTestAttendeeByTestId(testId: number, isTestTypePreview: boolean) {
    return this.httpService.get<TestAttendee>(
      `${this.testConductUrl}attendee/${testId}/${String(isTestTypePreview)}`
    );
  }

  /**
   * Call API to add answers to the Database
   * @param attendeeId: Id of Attendee
   */
  addAnswer(attendeeId: number, testAnswer: TestAnswer) {
    return this.httpService.put(
      `${this.testConductUrl}answer/${attendeeId}`,
      testAnswer
    );
  }

  /**
   * Gets the Attendee answers
   * @param attendeeId : Id of Attendee
   */
  getAnswer(attendeeId: number) {
    return this.httpService.get<TestAnswer[]>(
      `${this.testConductUrl}answer/${attendeeId}`
    );
  }

  /**
   * Sets the time elapsed from the start of Test
   * @param attendeeId : Id of Attendee
   */
  setElapsedTime(attendeeId: number, seconds: number) {
    return this.httpService.put(
      `${this.testConductUrl}elapsetime/${attendeeId}`,
      seconds
    );
  }

  /**
   * Gets the time elapsed from the start of Test
   * @param attendeeId : Id of Attendee
   */
  getElapsedTime(attendeeId: number) {
    return this.httpService.get<number>(
      `${this.testConductUrl}elapsetime/${attendeeId}`
    );
  }

  /**
   * Sets the TestStatus of the Attendee
   * @param attendeeId: Id of Attendee
   * @param testStatus: TestStatus object
   */
  setTestStatus(attendeeId: number, testStatus: TestStatus) {
    return this.httpService.put(
      `${this.testConductUrl}teststatus/${attendeeId}`,
      testStatus
    );
  }

  /**
   * Sets the TestStatus of the Attendee
   * @param attendeeId: Id of Attendee
   * @param testStatus: TestStatus object
   */
  getTestStatus(attendeeId: number) {
    return this.httpService.get<TestStatus>(
      `${this.testConductUrl}teststatus/${attendeeId}`
    );
  }

  /**
   * Sets the values of certain fields of Test Logs Model
   * @param attendeeId is obtained from the route
   * @param body is the object of test logs model
   */
  addTestLogs(
    attendeeId: number,
    isCloseWindow: boolean,
    isTestResume: boolean
  ) {
    return this.httpService.get<TestLogs>(
      `${this.testConductUrl}testlogs/${attendeeId}/${String(
        isCloseWindow
      )}/${String(isTestResume)}`
    );
  }

  /**
   * Gets the total number of questions of a Test
   * @param testLink is obtained from the route
   */
  getTestSummary(testLink: string) {
    return this.httpService.get<number>(
      this.testConductUrl + testLink + "/test-summary"
    );
  }

  execute(attendeeId: number, runOnlyDefault: boolean, testAnswer: TestAnswer) {
    return this.httpService.post<CodeResponse>(
      `${this.testConductUrl}code/${String(runOnlyDefault)}/${attendeeId}`,
      testAnswer
    );
  }

  getTestLogs() {
    return this.httpService.get(this.testConductUrl + "testLogs");
  }

  getTestForSummary(link: string) {
    return this.httpService.get<Test>(
      this.testConductUrl + "getTestSummary/" + link
    );
  }

  /**
   * Sets the attendee browser tolerance count
   * @param attendeeId : Id of the test attendee
   * @param focusLostCount : number of browser tolerance still left for that particular attendee
   */
  setAttendeeBrowserToleranceValue(attendeeId: number, focusLostCount: number) {
    return this.httpService.get<number>(
      `${this.testConductUrl + String(attendeeId)}/${String(
        focusLostCount
      )}/setTolerance`
    );
  }

  getSessionPath() {
    return this.httpService.get<SessionData>(
      this.testConductUrl + "getSessionPath"
    );
  }
}
