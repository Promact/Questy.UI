import { Injectable } from "@angular/core";
import { HttpService } from "../core/http.service";
import { Test, TestCategory, TestQuestionAC } from "./tests.model";
import { Subject } from "rxjs";
import { QuestionBase } from "app/questions/question";

@Injectable()
export class TestService {
  private testApiUrl = "api/tests";
  private testNameApiUrl = "api/tests/isUnique";
  public isTestPreviewIsCalled = new Subject<boolean>();
  constructor(private httpService: HttpService) {}

  /**
   * get list of tests
   */
  getTests() {
    return this.httpService.get<Test[]>(this.testApiUrl);
  }

  /**
   * add new test
   * @param url
   * @param test
   */
  addTests(test: Test) {
    return this.httpService.post<Test>(this.testApiUrl, test);
  }

  /**
   * get response whether test name is unique or not
   * @param testName is name of the test
   */
  IsTestNameUnique(testName: string, id: number) {
    return this.httpService.get(`${this.testNameApiUrl}/${testName}/${id}`);
  }

  /**
   * Updates the changes made to the Settings of a Test
   * @param id is used to access the Settings of that Test
   * @param body is used as an object for the Model Test
   */
  updateTestById(id: number, body: Test) {
    return this.httpService.put(`${this.testApiUrl}/${id}/settings`, body);
  }

  /**
   * Updates the status of test ie. pause or resume
   * @param id
   * @param isPause
   */
  updateTestPauseResume(id: number, isPause: boolean) {
    return this.httpService.get(
      `${this.testApiUrl}/isPausedResume/${id}/${String(isPause)}`
    );
  }
  /**
   * Deletes the ip address of a test
   * @param id
   */
  deleteTestipAddress(id: number) {
    return this.httpService.delete(`${this.testApiUrl}/deleteIp/${id}`);
  }

  /**
   * Updates the edited Test Name
   * @param id is used to access the Name of that Test
   * @param body is used as an object for the Model Test
   */
  updateTestName(id: number, body: Test) {
    return this.httpService.put(`${this.testApiUrl}/${id}`, body);
  }

  /**
   * Delete the selected test
   * @param testId: type number and has the id of the test to be deleted
   */
  deleteTest(testId: number) {
    return this.httpService.delete(`${this.testApiUrl}/${testId}`);
  }

  /**
   * Checks whether any test attendee exists
   * @param testId: type number and has the id of the test to be deleted
   */
  isTestAttendeeExist(testId: number) {
    return this.httpService.get(`${this.testApiUrl}/${testId}/testAttendee`);
  }

  addTestCategories(testId: number, testCategory: TestCategory[]) {
    return this.httpService.post(
      `${this.testApiUrl}/addTestCategories/${testId}`,
      testCategory
    );
  }

  /**
   * deletes the deselected category from TestCategory
   * @param testCategory
   */
  removeDeselectedCategory(testCategory: TestCategory) {
    return this.httpService.post(
      this.testApiUrl + "/" + "deselectCategory",
      testCategory
    );
  }

  /**
   * deselects the category
   * @param categoryId
   * @param testId
   */
  deselectCategory(categoryId: number, testId: number) {
    return this.httpService.get(
      `${this.testApiUrl}/deselectCategory/${categoryId}/${testId}`
    );
  }

  /**
   * Gets the questions of a particular category in a "Test"
   * @param testId is passed to identify that particular "Test"
   * @param categoryId is passed to identify that particular "category"
   */
  getQuestions(testId: number, categoryId: number) {
    return this.httpService.get<QuestionBase[]>(
      `${this.testApiUrl}/questions/${testId}/${categoryId}`
    );
  }

  /**
   * Adds the selected questions to the "Test"
   * @param selectedQuestions is a list of questions user wants to add to the test
   * @param testId is passed to identify that particular "Test"
   */
  addTestQuestions(selectedQuestions: TestQuestionAC[], testId: number) {
    return this.httpService.post(
      `${this.testApiUrl}/questions/${testId}`,
      selectedQuestions
    );
  }

  /**
   * Gets the details of a particular test withs all categories it contains
   * @param id is passed to identify that particular "Test"
   */
  getTestById(id: number) {
    return this.httpService.get<Test>(`${this.testApiUrl}/${id}`);
  }

  /**
   * Duplicates the selected test
   * @param testId: Id of the test that is to be duplicated
   * @param newTestId: Id of the duplicated Test
   */
  duplicateTest(testId: number, test: Test) {
    return this.httpService.post<Test>(
      `${this.testApiUrl}/${testId}/duplicateTest`,
      test
    );
  }

  /**
   * Sets the number of times the test has been updated
   * @param testName: name of the test that is duplicated
   */
  setTestCopiedNumber(testName: string) {
    return this.httpService.get<number>(
      `${this.testApiUrl}/${testName}/setTestCopiedNumber`
    );
  }
}
