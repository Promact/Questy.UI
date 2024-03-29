import { of as observableOf, Observable, BehaviorSubject } from "rxjs";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { async } from "@angular/core/testing";
import { BrowserModule, By } from "@angular/platform-browser";
import { FormsModule, FormGroup } from "@angular/forms";
import {
  MaterialModule,
  MdDialogRef,
  OverlayRef,
  MdDialogModule,
  MdDialog,
  MdSnackBar,
  MdSnackBarRef,
} from "@angular/material";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { QuestionsService } from "../../questions/questions.service";
import { Http, HttpModule } from "@angular/http";
import { inject } from "@angular/core/testing";
import { Test, TestQuestion } from "../../tests/tests.model";
import { testsRouting } from "../../tests/tests.routing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpService } from "../../core/http.service";
import { MockTestData } from "../../Mock_Data/test_data.mock";
import { tick } from "@angular/core/testing";
import { Location, LocationStrategy, APP_BASE_HREF } from "@angular/common";
import { NgModule, Input, Output, EventEmitter } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { PopoverModule } from "ngx-popover";
import { ClipboardModule } from "ngx-clipboard";
import { Md2AccordionModule } from "md2";
import { Category } from "../../questions/category.model";
import { QuestionBase } from "../../questions/question";
import { QuestionType } from "../../questions/enum-questiontype";
import { DifficultyLevel } from "../../questions/enum-difficultylevel";
import { TestService } from "../../tests/tests.service";
import { IndividualReportComponent } from "./individual-report.component";
import { ReportService } from "../report.service";
import { ChartsModule } from "ng2-charts";
import { TestAttendee } from "../testattendee.model";
import { Report } from "../report.model";
import { TestStatus } from "../enum-test-state";
import { TestLogs } from "../testlogs.model";
import { TestConduct } from "../testConduct.model";
import { TestAnswers } from "../testanswers.model";
import { SingleMultipleAnswerQuestion } from "../../questions/single-multiple-question";
import { SingleMultipleAnswerQuestionOption } from "../../questions/single-multiple-answer-question-option.model";
import { QuestionDisplay } from "../../questions/question-display";
import { TestCodeSolutionDetails } from "../test-code-solution-details.model";
import { CodeSnippetTestCasesDetails } from "../code-snippet-test-cases-details.model";
import { ProgrammingLanguage } from "../programminglanguage.enum";

class MockRouter {
  navigate() {
    return true;
  }

  isActive() {
    return true;
  }

  navigateByUrl(url: string) {
    return url;
  }
}

class MockWindow {
  location: {
    href: "";
  };
}

describe("Individual Report Component", () => {
  let individualReport: IndividualReportComponent;
  let fixture: ComponentFixture<IndividualReportComponent>;

  const multipleQuestionOption = new SingleMultipleAnswerQuestionOption();
  multipleQuestionOption.id = 1;
  multipleQuestionOption.isAnswer = false;
  multipleQuestionOption.option = "1903";
  multipleQuestionOption.singleMultipleAnswerQuestionId = 1;

  const multipleQuestionOption1 = new SingleMultipleAnswerQuestionOption();
  multipleQuestionOption1.id = 6;
  multipleQuestionOption1.isAnswer = true;
  multipleQuestionOption1.option = "1911";
  multipleQuestionOption1.singleMultipleAnswerQuestionId = 1;

  const multipleQuestionOption2 = new SingleMultipleAnswerQuestionOption();
  multipleQuestionOption2.id = 7;
  multipleQuestionOption2.isAnswer = true;
  multipleQuestionOption2.option = "1912";
  multipleQuestionOption2.singleMultipleAnswerQuestionId = 1;

  const multipleQuestonOptionsArray =
    new Array<SingleMultipleAnswerQuestionOption>();
  multipleQuestonOptionsArray[0] = multipleQuestionOption;
  multipleQuestonOptionsArray[1] = multipleQuestionOption1;
  multipleQuestonOptionsArray[2] = multipleQuestionOption2;

  const singleMultipleQuestion = new SingleMultipleAnswerQuestion();
  singleMultipleQuestion.id = 1;
  singleMultipleQuestion.singleMultipleAnswerQuestionOption =
    multipleQuestonOptionsArray;

  const question1 = new QuestionBase();
  question1.question.id = 5;
  question1.question.categoryID = 4;
  question1.question.questionDetail =
    "When were the battles of Terrains fought?";
  question1.question.questionType = QuestionType.multipleAnswer;
  question1.question.difficultyLevel = DifficultyLevel.Medium;
  question1.singleMultipleAnswerQuestion = singleMultipleQuestion;
  question1.question.isSelect = true;

  const singleQuestionOption = new SingleMultipleAnswerQuestionOption();
  singleQuestionOption.id = 4;
  singleQuestionOption.isAnswer = false;
  singleQuestionOption.option = "Babur";
  singleQuestionOption.singleMultipleAnswerQuestionId = 2;

  const singleQuestionOption1 = new SingleMultipleAnswerQuestionOption();
  singleQuestionOption1.id = 2;
  singleQuestionOption1.isAnswer = true;
  singleQuestionOption1.option = "Humayun";
  singleQuestionOption1.singleMultipleAnswerQuestionId = 2;

  const singleAnswerQuestonOptionsArray =
    new Array<SingleMultipleAnswerQuestionOption>();
  singleAnswerQuestonOptionsArray[0] = singleQuestionOption;
  singleAnswerQuestonOptionsArray[1] = singleQuestionOption1;

  const singleMultipleQuestion1 = new SingleMultipleAnswerQuestion();
  singleMultipleQuestion.id = 2;
  singleMultipleQuestion.singleMultipleAnswerQuestionOption =
    singleAnswerQuestonOptionsArray;

  const question = new QuestionBase();
  question.question.id = 4;
  question.question.categoryID = 4;
  question.question.questionDetail = "Who was the father of Akbar?";
  question.question.questionType = QuestionType.singleAnswer;
  question.question.difficultyLevel = DifficultyLevel.Easy;
  question.singleMultipleAnswerQuestion = singleMultipleQuestion1;
  question.question.isSelect = true;

  const question2 = new QuestionBase();
  question2.question.id = 6;
  question2.question.categoryID = 4;
  question2.question.questionDetail = "Print Hello World.";
  question2.question.questionType = QuestionType.codeSnippetQuestion;
  question2.question.difficultyLevel = DifficultyLevel.Hard;
  question2.question.isSelect = true;

  const testCodeSolutionDetails = new TestCodeSolutionDetails();
  testCodeSolutionDetails.codeSolution =
    '#include <stdio.h>↵int main()↵{↵     printf("Hello World");↵     return 0;↵}';
  testCodeSolutionDetails.language = 2;
  testCodeSolutionDetails.numberOfSuccessfulAttempts = 1;
  testCodeSolutionDetails.totalNumberOfAttempts = 2;

  const codeSnippetQuestionTestCasesDetails = new CodeSnippetTestCasesDetails();
  codeSnippetQuestionTestCasesDetails.actualOutput = "Hello World";
  codeSnippetQuestionTestCasesDetails.expectedOutput = "Hello World";
  codeSnippetQuestionTestCasesDetails.testCaseInput = "Hello World";
  codeSnippetQuestionTestCasesDetails.testCaseMarks = 5;
  codeSnippetQuestionTestCasesDetails.testCaseName = "Print";
  codeSnippetQuestionTestCasesDetails.testCaseType = 0;
  codeSnippetQuestionTestCasesDetails.isTestCasePassing = true;
  codeSnippetQuestionTestCasesDetails.memory = 80;
  codeSnippetQuestionTestCasesDetails.processing = 81;

  const codeSnippetDetailsArray = new Array<CodeSnippetTestCasesDetails>();
  codeSnippetDetailsArray[0] = codeSnippetQuestionTestCasesDetails;

  const category = new Category();
  category.id = 4;
  category.categoryName = "history";
  category.isSelect = true;
  category.numberOfSelectedQuestion = 0;
  category.questionList[0] = question;
  category.questionList[1] = question1;
  category.isAccordionOpen = false;
  category.isAlreadyClicked = false;

  const test = new Test();
  test.id = 4;
  test.numberOfTestAttendees = 2;
  test.testName = "History";
  test.link = "a6thsjk8";
  test.duration = 10;
  test.warningTime = 5;
  test.startDate = "2017-10-16T06:51:49.4283026Z";
  test.endDate = "2017-10-17T06:51:49.4283026Z";
  test.correctMarks = "3";
  test.incorrectMarks = "1";

  const report = new Report();
  report.totalMarksScored = 50;
  report.percentage = 50;
  report.testStatus = TestStatus.completedTest;
  report.percentile = 75;
  report.timeTakenByAttendee = 3600;

  const testLogs = new TestLogs();
  testLogs.visitTestLink = new Date(
    "Wed Oct 11 2017 06:53:13 GMT+0530 (India Standard Time)"
  );
  testLogs.fillRegistrationForm = new Date(
    "Wed Oct 11 2017 06:53:13 GMT+0530 (India Standard Time)"
  );
  testLogs.startTest = new Date(
    "Wed Oct 11 2017 06:53:15 GMT+0530 (India Standard Time)"
  );
  testLogs.finishTest = new Date(
    "Tue Oct 17 2017 09:08:45 GMT+0530 (India Standard Time)"
  );
  testLogs.resumeTest = new Date(
    "Wed Oct 11 2017 06:57:04 GMT+0530 (India Standard Time)"
  );
  testLogs.awayFromTestWindow = new Date(
    "Wed Oct 11 2017 07:00:31 GMT+0530 (India Standard Time)"
  );

  const testAttendee = new TestAttendee();
  testAttendee.id = 5;
  testAttendee.firstName = "Madhurima";
  testAttendee.lastName = "Das";
  testAttendee.rollNumber = "14";
  testAttendee.TestId = 4;
  testAttendee.email = "dasmadhurima87@gmail.com";
  testAttendee.testLogs = testLogs;
  testAttendee.report = report;
  testAttendee.test = test;

  const testAnswers = new TestAnswers();
  testAnswers.id = 2021;
  testAnswers.answeredOption = 6;

  const testAnswers1 = new TestAnswers();
  testAnswers1.id = 2025;
  testAnswers1.answeredOption = 2;

  const testAnswers2 = new TestAnswers();
  testAnswers2.id = 2023;
  testAnswers2.answeredOption = 7;

  const testAnswers3 = new TestAnswers();
  testAnswers3.id = 2024;
  testAnswers3.answeredCodeSnippet =
    '#include <stdio.h>↵int main()↵{↵     printf("Hello World");↵     return 0;↵}';

  const questionDisplay = new QuestionDisplay();
  questionDisplay.id = 8;
  questionDisplay.category = category;
  questionDisplay.difficultyLevel = question.question.difficultyLevel;
  questionDisplay.singleMultipleAnswerQuestion = singleMultipleQuestion1;
  questionDisplay.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption =
    singleAnswerQuestonOptionsArray;
  questionDisplay.questionDetail = question.question.questionDetail;
  questionDisplay.questionType = question.question.questionType;

  const questionDisplay1 = new QuestionDisplay();
  questionDisplay1.id = 9;
  questionDisplay1.category = category;
  questionDisplay1.difficultyLevel = question1.question.difficultyLevel;
  questionDisplay1.singleMultipleAnswerQuestion = singleMultipleQuestion;
  questionDisplay1.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption =
    multipleQuestonOptionsArray;
  questionDisplay1.questionDetail = question1.question.questionDetail;
  questionDisplay1.questionType = question1.question.questionType;

  const questionDisplay2 = new QuestionDisplay();
  questionDisplay2.id = 10;
  questionDisplay2.category = category;
  questionDisplay2.difficultyLevel = question2.question.difficultyLevel;
  questionDisplay2.questionDetail = question2.question.questionDetail;
  questionDisplay2.questionType = question2.question.questionType;
  questionDisplay2.singleMultipleAnswerQuestion = null;

  const testQuestions = new TestQuestion();
  testQuestions.id = 1;
  testQuestions.answerStatus = 0;
  testQuestions.testId = test.id;
  testQuestions.questionId = 4;
  testQuestions.question = questionDisplay;

  const testQuestions1 = new TestQuestion();
  testQuestions1.id = 2;
  testQuestions1.answerStatus = 0;
  testQuestions1.testId = test.id;
  testQuestions1.questionId = 5;
  testQuestions1.question = questionDisplay1;

  const testQuestions2 = new TestQuestion();
  testQuestions2.id = 3;
  testQuestions2.codeSolution =
    '#include <stdio.h>↵int main()↵{↵     printf("Hello World");↵     return 0;↵}';
  testQuestions2.codeToDisplay =
    '#include <stdio.h>↵int main()↵{↵     printf("Hello World");↵     return 0;↵}';
  testQuestions2.compilationStatus = "Successful";
  testQuestions2.isCodeSnippetTestCaseDetailsVisible = true;
  testQuestions2.isCodeSolutionDetailsVisible = true;
  testQuestions2.isCompilationStatusVisible = true;
  testQuestions2.language = 2;
  testQuestions2.numberOfSuccessfulAttemptsByAttendee = 1;
  testQuestions2.questionId = 6;
  testQuestions2.questionStatus = 0;
  testQuestions2.scoreOfCodeSnippetQuestion = "1";
  testQuestions2.testId = test.id;
  testQuestions2.totalNumberOfAttemptsMadeByAttendee = 2;
  testQuestions2.testCodeSolutionDetails = testCodeSolutionDetails;
  testQuestions2.codeSnippetQuestionTestCasesDetails = codeSnippetDetailsArray;
  testQuestions2.question = questionDisplay2;
  testQuestions2.answerStatus = 0;

  let urls: any[];
  let router: Router;
  const testAnswersList = new Array<TestAnswers>();
  testAnswersList[0] = testAnswers;
  testAnswersList[1] = testAnswers1;
  testAnswersList[2] = testAnswers2;
  testAnswersList[3] = testAnswers3;

  const testQuestionsList = new Array<TestQuestion>();
  testQuestionsList[0] = testQuestions;
  testQuestionsList[1] = testQuestions1;
  testQuestionsList[2] = testQuestions2;

  const testAttendee1 = new TestAttendee();
  testAttendee1.id = 11;
  testAttendee1.firstName = "Bidisha";
  testAttendee1.lastName = "Das";
  testAttendee1.rollNumber = "114";
  testAttendee1.TestId = 4;
  testAttendee1.email = "dasbidisha87@gmail.com";
  testAttendee1.testLogs = testLogs;
  testAttendee1.report = report;
  testAttendee1.test = test;

  const testAttendee2 = new TestAttendee();
  testAttendee2.id = 12;
  testAttendee2.firstName = "Sneha";
  testAttendee2.lastName = "Das";
  testAttendee2.rollNumber = "184";
  testAttendee2.TestId = 4;
  testAttendee2.email = "dassneha87@gmail.com";
  testAttendee2.testLogs = testLogs;
  testAttendee2.report = report;
  testAttendee2.test = test;

  const testAttendeeIdArray = new Array<number>();
  testAttendeeIdArray[0] = testAttendee.id;
  testAttendeeIdArray[1] = testAttendee1.id;
  testAttendeeIdArray[2] = testAttendee2.id;

  class MockDialog {
    open() {
      return true;
    }

    close() {
      return true;
    }
  }

  beforeEach(async(() => {
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [IndividualReportComponent],
      },
    });

    TestBed.configureTestingModule({
      declarations: [IndividualReportComponent],

      providers: [
        TestService,
        HttpService,
        ReportService,
        { provide: MdDialogRef, useClass: MockDialog },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: window, useClass: MockWindow },
      ],

      imports: [
        BrowserModule,
        FormsModule,
        MaterialModule,
        RouterModule.forRoot([]),
        HttpModule,
        BrowserAnimationsModule,
        PopoverModule,
        ClipboardModule,
        Md2AccordionModule,
        MdDialogModule,
        ChartsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualReportComponent);
    individualReport = fixture.componentInstance;
  });

  it("should get all the details of the test attendee that are to be displayed in the report", () => {
    spyOn(ReportService.prototype, "getTestAttendeeById").and.callFake(() => {
      return observableOf(testAttendee);
    });
    spyOn(
      ReportService.prototype,
      "getTotalNumberOfAttemptedQuestions"
    ).and.callFake(() => {
      return observableOf(3);
    });
    spyOn(ReportService.prototype, "getStudentPercentile").and.callFake(() => {
      return observableOf(75.5);
    });
    spyOn(ReportService.prototype, "getTestAttendeeAnswers").and.callFake(
      () => {
        return observableOf(testAnswersList);
      }
    );
    spyOn(ReportService.prototype, "getTestQuestions").and.callFake(() => {
      return observableOf(testQuestionsList);
    });
    individualReport.testQuestions = testQuestionsList;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(codeSnippetDetailsArray);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf("3");
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(testCodeSolutionDetails);
      }
    );
    individualReport.getTestAttendeeDetails();
    expect(individualReport.testName).toBe(testAttendee.test.testName);
    expect(individualReport.testId).toBe(testAttendee.test.id);
    expect(individualReport.correctMarks).toBe(testAttendee.test.correctMarks);
    expect(individualReport.incorrectmarks).toBe(
      testAttendee.test.incorrectMarks
    );
    expect(individualReport.hideSign).toBe(false);
    expect(individualReport.marks).toBe(testAttendee.report.totalMarksScored);
    expect(individualReport.percentage).toBe(testAttendee.report.percentage);
    expect(individualReport.timeTakenInHoursVisible).toBe(true);
    expect(individualReport.timeTakenInMinutesVisible).toBe(false);
    expect(individualReport.timeTakenInSecondsVisible).toBe(false);
    expect(individualReport.resumeTestLog).toBe(true);
  });

  it("should check number of correct options given by a test attendee for single answer question", () => {
    individualReport.testAnswers = testAnswersList;
    individualReport.noOfAnswersCorrectGivenbyAttendee(
      singleAnswerQuestonOptionsArray
    );
    expect(individualReport.noOfAnswersCorrect).toBe(1);
  });

  it("should check number of correct options given by a test attendee for single answer question", () => {
    individualReport.testAnswers = testAnswersList;
    individualReport.noOfAnswersCorrectGivenbyAttendee(
      multipleQuestonOptionsArray
    );
    expect(individualReport.noOfAnswersCorrect).toBe(2);
  });

  it("should check if the answers given by the candidate are correct or not", () => {
    individualReport.testAnswers = testAnswersList;
    const a = individualReport.isAttendeeAnswerCorrect(6, true);
    expect(a).toBe(true);
  });

  it("should set the test status of a particular candidate as completed", () => {
    individualReport.testAttendee = testAttendee;
    individualReport.testFinishStatus();
    expect(individualReport.testStatus).toBe("Completed");
  });

  it("should set the test status of a particular candidate as Incomplete", () => {
    testAttendee.report.testStatus = TestStatus.allCandidates;
    individualReport.testAttendee = testAttendee;
    individualReport.testFinishStatus();
    expect(individualReport.testStatus).toBe("Incomplete");
  });

  it("should set the test status of a particular candidate as Expired", () => {
    testAttendee.report.testStatus = TestStatus.expiredTest;
    individualReport.testAttendee = testAttendee;
    individualReport.testFinishStatus();
    expect(individualReport.testStatus).toBe("Expired");
  });

  it("should set the test status of a particular candidate as Blocked", () => {
    testAttendee.report.testStatus = TestStatus.blockedTest;
    individualReport.testAttendee = testAttendee;
    individualReport.testFinishStatus();
    expect(individualReport.testStatus).toBe("Blocked");
  });

  it("should set the test status of a particular candidate as Unfinished", () => {
    testAttendee.report.testStatus = TestStatus.unfinishedTest;
    individualReport.testAttendee = testAttendee;
    individualReport.testFinishStatus();
    expect(individualReport.testStatus).toBe("Unfinished");
  });

  it("should calculate the number of correct questions in each difficulty level", () => {
    individualReport.difficultywiseCorrectQuestions(
      testQuestions.question.difficultyLevel
    );
    expect(individualReport.easy).toBe(1);
    expect(individualReport.medium).toBe(0);
    expect(individualReport.hard).toBe(0);
    expect(individualReport.showPieChart).toBe(true);
  });

  it("should calculate the number of correct questions in difficulty level of type hard", () => {
    individualReport.difficultywiseCorrectQuestions(
      testQuestions2.question.difficultyLevel
    );
    expect(individualReport.hard).toBe(1);
  });

  it("should not have any data for the difficulty level pie chart", () => {
    individualReport.difficultywiseCorrectQuestions(4);
    expect(individualReport.showPieChart).toBe(false);
  });

  it("should set the details for question pie chart value", () => {
    individualReport.testQuestions = testQuestionsList;
    individualReport.correctAnswers = 1;
    individualReport.incorrectAnswers = 1;
    individualReport.questionPieChartValue();
    expect(individualReport.totalQuestions).toBe(3);
    expect(individualReport.notAttempted).toBe(1);
  });

  it("should calculate the number of correct and incorrect answers given by test attendee", () => {
    individualReport.testQuestions = testQuestionsList;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(codeSnippetDetailsArray);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf("3");
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(testCodeSolutionDetails);
      }
    );
    individualReport.attendeeAnswers();
    expect(individualReport.correctAnswers).toBe(3);
    expect(individualReport.incorrectAnswers).toBe(0);
    expect(
      individualReport.testQuestions[2].isCodeSnippetTestCaseDetailsVisible
    ).toBe(true);
    expect(individualReport.testQuestions[2].isCompilationStatusVisible).toBe(
      true
    );
    expect(individualReport.testQuestions[2].compilationStatus).toBe(
      testQuestions2.compilationStatus
    );
    expect(individualReport.testQuestions[2].language).toBe(
      testQuestions2.language
    );
    expect(
      individualReport.testQuestions[2].numberOfSuccessfulAttemptsByAttendee
    ).toBe(1);
    expect(
      individualReport.testQuestions[2].totalNumberOfAttemptsMadeByAttendee
    ).toBe(2);
    expect(individualReport.testQuestions[2].codeSolution).toBe(
      testQuestions2.codeSolution
    );
    expect(individualReport.testQuestions[2].codeToDisplay).toBe(
      testQuestions2.codeToDisplay
    );
    expect(individualReport.testQuestions[2].isCodeSolutionDetailsVisible).toBe(
      true
    );
  });

  it("should calculate the number of correct and incorrect answers given by test attendee when code snippet question score is negative", () => {
    individualReport.testQuestions = testQuestionsList;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(null);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf("-1");
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(null);
      }
    );
    individualReport.attendeeAnswers();
    expect(individualReport.correctAnswers).toBe(2);
    expect(individualReport.incorrectAnswers).toBe(0);
    expect(
      individualReport.testQuestions[2].isCodeSnippetTestCaseDetailsVisible
    ).toBe(false);
    expect(individualReport.testQuestions[2].isCompilationStatusVisible).toBe(
      false
    );
    expect(individualReport.testQuestions[2].language).toBe(
      ProgrammingLanguage.c
    );
    expect(
      individualReport.testQuestions[2].numberOfSuccessfulAttemptsByAttendee
    ).toBe(0);
    expect(
      individualReport.testQuestions[2].totalNumberOfAttemptsMadeByAttendee
    ).toBe(0);
    expect(individualReport.testQuestions[2].codeSolution).toBe(" ");
    expect(individualReport.testQuestions[2].isCodeSolutionDetailsVisible).toBe(
      false
    );
  });

  it("should calculate correct and incorrect answers when score of code snippet question is 0", () => {
    individualReport.testQuestions = testQuestionsList;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(codeSnippetDetailsArray);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf(0);
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(testCodeSolutionDetails);
      }
    );
    individualReport.attendeeAnswers();
    expect(individualReport.correctAnswers).toBe(2);
    expect(individualReport.incorrectAnswers).toBe(1);
    expect(individualReport.testQuestions[2].answerStatus).toBe(1);
    expect(
      individualReport.testQuestions[2].isCodeSnippetTestCaseDetailsVisible
    ).toBe(true);
    expect(individualReport.testQuestions[2].isCompilationStatusVisible).toBe(
      true
    );
    expect(individualReport.testQuestions[2].isCodeSolutionDetailsVisible).toBe(
      true
    );
    expect(individualReport.testQuestions[2].compilationStatus).toBe(
      testQuestions2.compilationStatus
    );
    expect(individualReport.testQuestions[2].language).toBe(
      testQuestions2.language
    );
    expect(
      individualReport.testQuestions[2].numberOfSuccessfulAttemptsByAttendee
    ).toBe(1);
    expect(
      individualReport.testQuestions[2].totalNumberOfAttemptsMadeByAttendee
    ).toBe(2);
    expect(individualReport.testQuestions[2].codeSolution).toBe(
      testQuestions2.codeSolution
    );
    expect(individualReport.testQuestions[2].codeToDisplay).toBe(
      testQuestions2.codeToDisplay
    );
  });

  it("should calculate correct and incorrect answers when score of code snippet question is greater than 0", () => {
    individualReport.testQuestions = testQuestionsList;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(codeSnippetDetailsArray);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf(1.5);
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(testCodeSolutionDetails);
      }
    );
    individualReport.attendeeAnswers();
    expect(individualReport.correctAnswers).toBe(2);
    expect(individualReport.incorrectAnswers).toBe(1);
    expect(individualReport.testQuestions[2].questionStatus).toBe(0);
    expect(
      individualReport.testQuestions[2].isCodeSnippetTestCaseDetailsVisible
    ).toBe(true);
    expect(individualReport.testQuestions[2].isCompilationStatusVisible).toBe(
      true
    );
    expect(individualReport.testQuestions[2].isCodeSolutionDetailsVisible).toBe(
      true
    );
    expect(individualReport.testQuestions[2].compilationStatus).toBe(
      testQuestions2.compilationStatus
    );
    expect(individualReport.testQuestions[2].language).toBe(
      testQuestions2.language
    );
    expect(
      individualReport.testQuestions[2].numberOfSuccessfulAttemptsByAttendee
    ).toBe(1);
    expect(
      individualReport.testQuestions[2].totalNumberOfAttemptsMadeByAttendee
    ).toBe(2);
    expect(individualReport.testQuestions[2].codeSolution).toBe(
      testQuestions2.codeSolution
    );
    expect(individualReport.testQuestions[2].codeToDisplay).toBe(
      testQuestions2.codeToDisplay
    );
  });

  it("should calculate correct and incorrect answers when single-multiple answer question is answered wrong by the test attendee", () => {
    individualReport.testQuestions = testQuestionsList;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    testAnswers2.answeredOption = 1;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(codeSnippetDetailsArray);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf(1.5);
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(testCodeSolutionDetails);
      }
    );
    individualReport.attendeeAnswers();
    expect(individualReport.correctAnswers).toBe(1);
    expect(individualReport.incorrectAnswers).toBe(2);
    expect(individualReport.testQuestions[2].questionStatus).toBe(0);
    expect(
      individualReport.testQuestions[2].isCodeSnippetTestCaseDetailsVisible
    ).toBe(true);
    expect(individualReport.testQuestions[2].isCompilationStatusVisible).toBe(
      true
    );
    expect(individualReport.testQuestions[2].isCodeSolutionDetailsVisible).toBe(
      true
    );
    expect(individualReport.testQuestions[2].compilationStatus).toBe(
      testQuestions2.compilationStatus
    );
    expect(individualReport.testQuestions[2].language).toBe(
      testQuestions2.language
    );
    expect(
      individualReport.testQuestions[2].numberOfSuccessfulAttemptsByAttendee
    ).toBe(1);
    expect(
      individualReport.testQuestions[2].totalNumberOfAttemptsMadeByAttendee
    ).toBe(2);
    expect(individualReport.testQuestions[2].codeSolution).toBe(
      testQuestions2.codeSolution
    );
    expect(individualReport.testQuestions[2].codeToDisplay).toBe(
      testQuestions2.codeToDisplay
    );
  });

  it("should get details of the test attendee that are to be displayed in the report", () => {
    spyOn(ReportService.prototype, "getTestAttendeeById").and.callFake(() => {
      return observableOf(testAttendee);
    });
    spyOn(
      ReportService.prototype,
      "getTotalNumberOfAttemptedQuestions"
    ).and.callFake(() => {
      return observableOf(3);
    });
    spyOn(ReportService.prototype, "getStudentPercentile").and.callFake(() => {
      return observableOf(75.5);
    });
    spyOn(ReportService.prototype, "getTestAttendeeAnswers").and.callFake(
      () => {
        return observableOf(testAnswersList);
      }
    );
    spyOn(ReportService.prototype, "getTestQuestions").and.callFake(() => {
      return observableOf(testQuestionsList);
    });
    individualReport.testQuestions = testQuestionsList;
    testAttendee.test.incorrectMarks = "0";
    testAttendee.report.timeTakenByAttendee = 7200;
    testAttendee.testLogs.disconnectedFromServer = null;
    testAttendee.testLogs.resumeTest = null;
    testAttendee.testLogs.closeWindowWithoutFinishingTest = null;
    testAttendee.testLogs.awayFromTestWindow = null;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(codeSnippetDetailsArray);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf("3");
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(testCodeSolutionDetails);
      }
    );
    individualReport.getTestAttendeeDetails();
    expect(individualReport.hideSign).toBe(true);
    expect(individualReport.timeTakenInHoursVisible).toBe(true);
    expect(individualReport.timeTakenInMinutesVisible).toBe(false);
    expect(individualReport.timeTakenInSecondsVisible).toBe(false);
  });

  it("should display time taken in seconds label only", () => {
    spyOn(ReportService.prototype, "getTestAttendeeById").and.callFake(() => {
      return observableOf(testAttendee);
    });
    spyOn(
      ReportService.prototype,
      "getTotalNumberOfAttemptedQuestions"
    ).and.callFake(() => {
      return observableOf(3);
    });
    spyOn(ReportService.prototype, "getStudentPercentile").and.callFake(() => {
      return observableOf(75.5);
    });
    spyOn(ReportService.prototype, "getTestAttendeeAnswers").and.callFake(
      () => {
        return observableOf(testAnswersList);
      }
    );
    spyOn(ReportService.prototype, "getTestQuestions").and.callFake(() => {
      return observableOf(testQuestionsList);
    });
    testAttendee.report.timeTakenByAttendee = 61;
    individualReport.testQuestions = testQuestionsList;
    individualReport.testAttendee = testAttendee;
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.testAnswers = testAnswersList;
    spyOn(
      ReportService.prototype,
      "getCodeSnippetQuestionTestCasesDetails"
    ).and.callFake(() => {
      return observableOf(codeSnippetDetailsArray);
    });
    spyOn(ReportService.prototype, "getCodeSnippetQuestionMarks").and.callFake(
      () => {
        return observableOf("3");
      }
    );
    spyOn(ReportService.prototype, "getTestCodeSolutionDetails").and.callFake(
      () => {
        return observableOf(testCodeSolutionDetails);
      }
    );
    individualReport.getTestAttendeeDetails();
    expect(individualReport.timeTakenInHoursVisible).toBe(false);
    expect(individualReport.timeTakenInMinutesVisible).toBe(true);
    expect(individualReport.timeTakenInSecondsVisible).toBe(true);
  });

  it("should navigate the user to the previous individual report", () => {
    spyOn(ReportService.prototype, "getAttendeeIdList").and.callFake(() => {
      return observableOf(testAttendeeIdArray);
    });
    individualReport.testAttendeeId = 5;
    individualReport.moveToPreviousIndividualReport();
    window.location.href = "localhost:9876/";
    expect(individualReport.idOfTestAttendee).toBe(testAttendee2.id);
    individualReport.testAttendeeId = testAttendee1.id;
    individualReport.moveToPreviousIndividualReport();
    window.location.href = "localhost:9876/";
    expect(individualReport.idOfTestAttendee).toBe(testAttendee.id);
  });

  it("should not navigate the user to the previous individual report when wrong attendee id given", () => {
    spyOn(ReportService.prototype, "getAttendeeIdList").and.callFake(() => {
      return observableOf(testAttendeeIdArray);
    });
    individualReport.testAttendeeId = 7;
    individualReport.moveToPreviousIndividualReport();
    window.location.href = "localhost:9876/";
    expect(individualReport.idOfTestAttendee).toBe(undefined);
  });

  it("should navigate the user to the next individual report", () => {
    spyOn(ReportService.prototype, "getAttendeeIdList").and.callFake(() => {
      return observableOf(testAttendeeIdArray);
    });
    individualReport.testAttendeeId = testAttendee1.id;
    individualReport.moveToNextIndividualReport();
    window.location.href = "localhost:9876/";
    expect(individualReport.idOfTestAttendee).toBe(testAttendee2.id);
    individualReport.testAttendeeId = testAttendee2.id;
    individualReport.moveToNextIndividualReport();
    window.location.href = "localhost:9876/";
    expect(individualReport.idOfTestAttendee).toBe(testAttendee.id);
    individualReport.testAttendeeId = testAttendee.id;
    individualReport.moveToNextIndividualReport();
    window.location.href = "localhost:9876/";
    expect(individualReport.idOfTestAttendee).toBe(testAttendee1.id);
  });

  it("should call the isCorrectAnswer()", () => {
    spyOn(individualReport, "isCorrectAnswer").and.callThrough();
    individualReport.isCorrectAnswer(true);
    individualReport.isCorrectAnswer(false);
    expect(individualReport.isCorrectAnswer).toHaveBeenCalledTimes(2);
  });

  it("should not get valid test attendee id to navigate to next individual report", () => {
    spyOn(ReportService.prototype, "getAttendeeIdList").and.callFake(() => {
      return observableOf(testAttendeeIdArray);
    });
    individualReport.testAttendeeId = 7;
    individualReport.moveToPreviousIndividualReport();
    window.location.href = "localhost:9876/";
    expect(individualReport.idOfTestAttendee).toBe(undefined);
  });
});
