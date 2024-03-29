﻿import { Code } from "app/conduct/code.model";
import { TestBundleModel } from "app/conduct/test_bundle_model";
import { TestAttendee } from "app/conduct/test_attendee.model";
import { Test } from "app/tests/tests.model";
import { TestQuestions } from "app/conduct/test_conduct.model";
import { Category } from "app/questions/category.model";
import { TestLogs } from "app/reports/testlogs.model";
import { SingleMultipleAnswerQuestion } from "app/questions/single-multiple-question";
import { CodeSnippetQuestion } from "app/questions/code.snippet.model";

export const FakeTest: Test = {
  id: 2002,
  createdDateTime: new Date("2017-10-04T11:21:01.054085"),
  testName: "Hello",
  link: "hjxJ4cQ2fI",
  browserTolerance: 1,
  startDate: "2017-10-04T11:50:00",
  endDate: "2017-10-07T11:21:00",
  duration: 60,
  warningTime: 5,
  focusLostTime: 5,
  warningMessage: "Your test is about to end. Hurry up!!",
  correctMarks: 1,
  incorrectMarks: 0,
  isPaused: false,
  isLaunched: true,
  questionOrder: 1,
  optionOrder: 1,
  allowTestResume: 0,
  categoryAcList: [] as Category[],
  testIpAddress: [],
  numberOfTestAttendees: 18,
  numberOfTestSections: 1,
  numberOfTestQuestions: 3,
  testCopiedNumber: 0,
  isEditTestEnabled: true,
  isQuestionMissing: false,
};

export const FakeAttendee: TestAttendee = {
  id: 1,
  email: "fakeattendee@fakesite.fakenet",
  firstName: "fake",
  lastName: "u",
  contactNumber: "0000000000",
  rollNumber: "FAKE-0",
  attendeeBrowserToleranceCount: 5,
};

// Don't add any new question here until you have modified unit test
export const FakeTestQuestions: TestQuestions[] = [
  {
    question: {
      question: {
        id: 7008,
        questionDetail: "Programming Question",
        questionType: 2,
        difficultyLevel: 0,
        categoryID: 6,
        isSelect: false,
        category: {} as Category,
      },
      singleMultipleAnswerQuestion: {} as SingleMultipleAnswerQuestion,
      codeSnippetQuestion: {
        checkCodeComplexity: true,
        checkTimeComplexity: true,
        runBasicTestCase: true,
        runCornerTestCase: true,
        runNecessaryTestCase: true,
        languageList: ["C", "Cpp", "Java"],
        codeSnippetQuestionTestCases: [],
      },
    },
    questionStatus: 3,
  },
  {
    question: {
      question: {
        id: 8008,
        questionDetail: "Q2",
        questionType: 0,
        difficultyLevel: 0,
        categoryID: 6,
        isSelect: false,
        category: {} as Category,
      },
      singleMultipleAnswerQuestion: {
        id: 1000,
        singleMultipleAnswerQuestionOption: [
          {
            id: 10,
            option: "a",
            isAnswer: false,
            singleMultipleAnswerQuestionId: 1000,
            isTwoOptionsSame: false,
          },
          {
            id: 11,
            option: "b",
            isAnswer: false,
            singleMultipleAnswerQuestionId: 1000,
            isTwoOptionsSame: false,
          },
        ],
      },
      codeSnippetQuestion: {} as CodeSnippetQuestion,
    },
    questionStatus: 3,
  },
];

export const FakeTestLogs: TestLogs = {
  visitTestLink: new Date(
    "Wed Oct 11 2017 06:53:13 GMT+0530 (India Standard Time)"
  ),
  fillRegistrationForm: new Date(
    "Wed Oct 11 2017 06:53:13 GMT+0530 (India Standard Time)"
  ),
  startTest: new Date(
    "Wed Oct 11 2017 06:53:15 GMT+0530 (India Standard Time)"
  ),
  finishTest: new Date(
    "Tue Oct 17 2017 09:08:45 GMT+0530 (India Standard Time)"
  ),
  resumeTest: new Date(
    "Wed Oct 11 2017 06:57:04 GMT+0530 (India Standard Time)"
  ),
  awayFromTestWindow: new Date(
    "Wed Oct 11 2017 07:00:31 GMT+0530 (India Standard Time)"
  ),
  disconnectedFromServer: new Date(
    "Wed Oct 11 2017 07:00:31 GMT+0530 (India Standard Time)"
  ),
  closeWindowWithoutFinishingTest: new Date(
    "Wed Oct 11 2017 07:00:31 GMT+0530 (India Standard Time)"
  ),
};

export const FakeCodeResponse = {
  message: "Success",
  error: "",
  errorOccurred: false,
};

export const FakeResumeData = [
  {
    questionId: 100,
    optionChoice: [1, 2],
    code: {} as Code,
    questionStatus: 1,
    isAnswered: true,
  },
];

export const FakeBundleData: TestBundleModel = {
  test: FakeTest,
  testAttendee: FakeAttendee,
  testQuestions: FakeTestQuestions,
};
