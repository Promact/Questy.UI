/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { interval as observableInterval, Subscription } from "rxjs";
import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { Test } from "../../tests/tests.model";
import { TestQuestions } from "../test_conduct.model";
import { TestOrder } from "../../tests/enum-testorder";
import { SingleMultipleAnswerQuestionOption } from "../../questions/single-multiple-answer-question-option.model";
import { ConductService } from "../conduct.service";
import { QuestionStatus } from "../question_status.enum";
import { QuestionType } from "../../questions/enum-questiontype";
import { TestAttendee } from "../test_attendee.model";
import { TestAnswer } from "../test_answer.model";
import { TestStatus } from "../teststatus.enum";
import { TestsProgrammingGuideDialogComponent } from "./tests-programming-guide-dialog.component";
import { AceEditorComponent } from "ngx-ace-editor-wrapper";
import "brace";
import "brace/theme/cobalt";
import "brace/theme/monokai";
import "brace/theme/eclipse";
import "brace/theme/solarized_light";
import "brace/mode/java";
import "brace/mode/c_cpp";
import { TestLogs } from "../../reports/testlogs.model";
import { AllowTestResume } from "../../tests/enum-allowtestresume";
import { CodeResponse } from "../code.response.model";
import screenfull from "screenfull";
import { TestService } from "../../tests/tests.service";
import { ConnectionService } from "../../core/connection.service";
import { TestBundleModel } from "../test_bundle_model";
import * as _ from "lodash";
import { delay } from "lodash";

@Component({
  selector: "test",
  templateUrl: "test.html",
})
export class TestComponent implements OnInit {
  @ViewChild("editor")
  editor!: AceEditorComponent;
  @Input()
  testLink!: string;
  timeString: string;
  test: Test;
  testBundle: TestBundleModel;
  testTypePreview: boolean;
  selectLanguage: string;
  selectedMode: string;
  languageMode: string[];
  testQuestions: TestQuestions[];
  questionDetail!: string;
  options: SingleMultipleAnswerQuestionOption[];
  isTestReady: boolean;
  questionIndex: number;
  questionStatus: QuestionStatus;
  isQuestionSingleChoice!: boolean;
  checkedOption!: string;
  testAttendee: TestAttendee;
  testAnswers: TestAnswer[];
  isQuestionCodeSnippetType: boolean;
  themes: string[];
  codeAnswer: string;
  selectedTheme: string;
  testLogs!: TestLogs;
  codeResponse: CodeResponse;
  showResult: boolean;
  isCloseWindow!: boolean;
  timeWarning: boolean;
  testEnded: boolean;
  isCodeProcessing: boolean;
  routeForTestEnd!: ActivatedRoute | string;
  istestEnd!: boolean;
  url: string;
  isInitializing: boolean;
  isConnectionLoss!: boolean;
  isConnectionRetrieved!: boolean;
  clearTime!: NodeJS.Timeout;
  customInput: string;
  showCustomInput: boolean;
  count: number;

  private seconds: number;
  private focusLost!: number;
  private resumable!: AllowTestResume;

  private WARNING_TIME = 300;
  private WARNING_MSG = "Hurry up!";
  private TIMEOUT_TIME = 10;
  private ALERT_BROWSER_FOCUS_LOST = "Warning: Browser focus was lost.";
  private JAVA_CODE: string =
    "import java.io.*;\nimport java.util.*;\nclass Program {//Do not change class name\n" +
    "   public static void main(String[] args) {\n" +
    '       System.out.println("Hello World");\n' +
    "   }\n" +
    "}\n";
  // Temporary solution for setting coding language on resume
  private CODING_LANGUAGES: string[] = ["Java", "Cpp", "C"];
  private defaultSnackBarDuration = 3000;
  private clockIntervalListener!: Subscription;

  constructor(
    private router: Router,
    public readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly conductService: ConductService,
    private readonly location: Location,
    private readonly testService: TestService,
    private readonly connectionService: ConnectionService
  ) {
    this.languageMode = ["Java", "Cpp", "C"];
    this.seconds = 0;
    this.secToTimeString(this.seconds);
    this.isTestReady = false;
    this.selectedTheme = "monokai";
    this.timeString = this.secToTimeString(this.seconds);
    this.test = new Test();
    this.testBundle = new TestBundleModel();
    this.testTypePreview = false;
    this.testQuestions = new Array<TestQuestions>();
    this.options = new Array<SingleMultipleAnswerQuestionOption>();
    this.questionStatus = QuestionStatus.unanswered;
    this.questionIndex = -1;
    this.testAttendee = {} as TestAttendee;
    this.testAnswers = new Array<TestAnswer>();
    this.isQuestionCodeSnippetType = false;
    this.selectLanguage = "Java";
    this.selectedMode = "java";
    this.codeAnswer = this.JAVA_CODE;
    this.themes = ["eclipse", "solarized_light", "monokai", "cobalt"];
    this.codeResponse = new CodeResponse();
    this.showResult = false;
    this.timeWarning = false;
    this.testEnded = false;
    this.isCodeProcessing = false;
    this.url = window.location.pathname;
    this.isInitializing = true;
    this.showCustomInput = false;
    this.count = 0;
    this.customInput = "";
  }

  ngOnInit() {
    this.getTestBundle(this.testLink);
    void this.connectionService.startConnection();
  }

  /**
   * Request server for test bundle data which includes test, attendee and question details and initiate test
   * @param link: Test magic link
   */
  getTestBundle(link: string) {
    const url = window.location.pathname;
    if (link === "" || link === undefined) {
      this.testLink = url.substring(
        url.indexOf("/conduct/") + 9,
        url.indexOf("/test")
      );
      history.pushState(null, "", null);
      window.addEventListener("popstate", function () {
        history.pushState(null, "", null);
      });
    } else {
      this.testLink = link;
      this.testTypePreview = true;
      this.isInitializing = false;
    }
    window.addEventListener("popstate", () => {
      this.testService.isTestPreviewIsCalled.next(false);
    });

    this.conductService
      .getTestBundle(this.testLink, this.testTypePreview)
      .subscribe({
        next: async (response) => {
          this.testBundle = response;
          this.test = this.testBundle.test;
          this.testQuestions = this.testBundle.testQuestions;
          this.testAttendee = this.testBundle.testAttendee;

          this.focusLost = this.testAttendee.attendeeBrowserToleranceCount;
          this.seconds = this.test.duration * 60;
          this.WARNING_MSG = this.test.warningMessage;
          this.WARNING_TIME = this.test.warningTime * 60;
          this.resumable = this.test.allowTestResume;

          if (this.test.questionOrder === TestOrder.Random) {
            this.shuffleQuestion();
          }

          if (this.test.optionOrder === TestOrder.Random) {
            this.shuffleOption();
          }

          window.onbeforeunload = async (ev: BeforeUnloadEvent) => {
            this.isCloseWindow = true;
            this.saveTestLogs();
            await this.connectionService.stopConnection();

            // Below code snippet will execute if the user cancels the dailog {ref: https://stackoverflow.com/a/4651049/9083810}
            delay(() => {
              delay(async () => {
                await this.connectionService.startConnection();
                await this.connectionService.registerAttendee(
                  this.testAttendee.id
                );
              }, 1000);
            }, 1);
            // End of code snippet

            const dialogText =
              "WARNING: Your report will not generate. Please use End Test button.";
            ev.returnValue = dialogText;
            return dialogText;
          };

          this.isTestReady = true;
          if (this.testTypePreview) this.navigateToQuestionIndex(0);
          else this.getTestStatus();

          await this.connectionService.registerAttendee(this.testAttendee.id);
          this.clockIntervalListener = this.getClockInterval();
        },
        error: () => {
          window.location.href = window.location.origin + "/pageNotFound";
        },
      });
  }

  /**
   * saves the TestLogs if server is gone off
   */
  saveTestLogs() {
    this.conductService
      .addTestLogs(this.testAttendee.id, this.isCloseWindow, false)
      .subscribe((response) => {
        this.testLogs = response;
      });
  }

  /**
   * changes the theme of editor
   * @param theme
   */
  changeTheme(theme: string) {
    this.selectedTheme = theme;
    this.editor.setTheme(theme);
  }
  /**
   * changes language mode of editor
   * @param language
   */
  changeLanguage(language: string) {
    let codeLanguage = language.toLowerCase();

    this.changeText();

    if (this.testAnswers[this.questionIndex]) {
      const codingAnswer = this.testAnswers.find(
        (x) =>
          x.questionId ===
          this.testQuestions[this.questionIndex].question.question.id
      );
      if (
        codingAnswer !== undefined &&
        codingAnswer !== null &&
        codingAnswer.code !== undefined &&
        codingAnswer.code !== null
      ) {
        const answeredLanguage = _.isInteger(codingAnswer.code.language)
          ? codingAnswer.code.language
          : (this.CODING_LANGUAGES[codingAnswer.code.language] as string);
        if (answeredLanguage.toLowerCase() === codeLanguage) {
          this.codeAnswer = codingAnswer.code.source;
        }
      }

      if (codeLanguage.toLowerCase() === "c") codeLanguage = "c_cpp";
      this.editor.setMode(language);
    }
  }
  /**
   * changes the pre-defined text for the editor
   */
  changeText() {
    if (this.selectLanguage.toLowerCase() === "java") {
      this.codeAnswer = this.JAVA_CODE;
      this.selectedMode = "java";
    }

    if (this.selectLanguage.toLowerCase() === "cpp") {
      this.selectedMode = "c_cpp";
      this.codeAnswer = [
        "#include <iostream>",
        "using namespace std;",
        "int main()",
        "{",
        '    cout << "Hello World!";',
        "    return 0;",
        "}",
      ].join("\n");
    }
    if (this.selectLanguage.toLowerCase() === "c") {
      this.codeAnswer = [
        " #include <stdio.h>",
        "int main()",
        "{",
        '    printf("Hello, World!");',
        "    return 0;",
        "}",
      ].join("\n");
      this.selectedMode = "c_cpp";
    }
  }

  /**
   * keep tracks of what user is writing in editor
   * @param code
   */
  onChange(code: string) {
    this.codeAnswer = code;
  }

  getClockInterval() {
    return observableInterval(1000).subscribe(() => {
      void this.countDown();
    });
  }

  /**
   * Gets the TestStatus of Attendee
   * @param attendeeId: Id of Attendee
   */
  getTestStatus(id = this.testAttendee.id) {
    this.conductService.getTestStatus(id).subscribe({
      next: async (response) => {
        const testStatus = response;
        if (testStatus !== TestStatus.allCandidates) {
          // Close the window if Test is already completed
          this.routeForTestEnd = `conduct/${this.testLink}`;
          await this.router.navigate(["/test-end"], {
            relativeTo: this.routeForTestEnd as unknown as ActivatedRoute,
            replaceUrl: true,
          });
        }
        window.addEventListener("online", () => {
          this.isConnectionLoss = false;
          this.isTestReady = false;
          setTimeout(() => {
            this.isTestReady = true;
            this.isConnectionRetrieved = true;
          }, 2000);
        });

        window.addEventListener("offline", () => {
          void (async () => {
            await screenfull.exit();
          })();
          this.isTestReady = false;
          setTimeout(() => {
            this.isTestReady = true;
            this.isConnectionRetrieved = false;
            this.isConnectionLoss = true;
          }, 2000);
          this.isCloseWindow = false;

          if (this.clockIntervalListener)
            this.clockIntervalListener.unsubscribe();
        });
        window.addEventListener("blur", () => {
          this.clearTime = setTimeout(() => {
            if (this.test.browserTolerance !== 0 && !this.istestEnd)
              void (async () => await this.windowFocusLost())();
          }, this.test.focusLostTime * 1000);
        });
        window.addEventListener("focus", () => {
          clearTimeout(this.clearTime);
        });
        window.addEventListener("keydown", (event: KeyboardEvent) => {
          if (event.ctrlKey) {
            if (
              event.keyCode === 83 ||
              event.keyCode === 80 ||
              event.keyCode === 79 ||
              event.keyCode === 85 ||
              event.keyCode === 72 ||
              event.keyCode === 82 ||
              event.keyCode === 70 ||
              event.keyCode === 68 ||
              event.keyCode === 71 ||
              event.keyCode === 74 ||
              event.keyCode === 18
            )
              event.preventDefault();
          }
        });
        this.resumeTest();
      },
      error: () => {
        this.navigateToQuestionIndex(0);
      },
    });
  }
  ifOnline() {
    this.isConnectionLoss = false;
    this.isTestReady = false;
    setTimeout(() => {
      const online = navigator.onLine;
      this.isTestReady = true;
      this.isConnectionRetrieved = online;
      this.isConnectionLoss = !online;
    }, 3000);
  }

  async goOnline() {
    await document.documentElement.requestFullscreen();
    this.isConnectionRetrieved = false;
    this.clockIntervalListener = this.getClockInterval();
  }

  /**
   * Resumes Test if Attendee had already answered some question
   */
  resumeTest() {
    this.isTestReady = false;
    this.conductService.getAnswer(this.testAttendee.id).subscribe({
      next: (response) => {
        this.testAnswers = response;
        _.forEach(this.testQuestions, (question: TestQuestions) => {
          const answer = _.find(
            this.testAnswers,
            (ans) => ans.questionId === question.question.question.id
          );
          if (answer) {
            question.questionStatus = answer.questionStatus;
            _.forEach(answer.optionChoice, (opt) => {
              const selectedChoice = _.find(
                question.question.singleMultipleAnswerQuestion
                  ?.singleMultipleAnswerQuestionOption,
                (choice) => choice.id === opt
              ) as SingleMultipleAnswerQuestionOption;
              selectedChoice.isAnswer = true;
            });
          }
        });

        this.getElapsedTime();
        this.navigateToQuestionIndex(0);
        this.isInitializing = false;
      },
      error: async () => {
        await this.connectionService.updateExpectedEndTime(
          this.test.duration,
          this.test.id
        );
        this.getElapsedTime();
        this.navigateToQuestionIndex(0);
        this.isTestReady = true;
        this.isInitializing = false;
      },
    });
  }

  /**
   * Fetches the elapsed time from the server
   */
  getElapsedTime() {
    this.conductService
      .getElapsedTime(this.testAttendee.id)
      .subscribe((response) => {
        const spanTime = response;
        const spanTimeInSeconds = Math.round(spanTime * 60);
        this.seconds -= spanTimeInSeconds;
        this.isTestReady = true;
      });
  }

  /**
   * Navigate to a question by its index
   * @param index: index of question
   */
  navigateToQuestionIndex(index: number) {
    this.isTestReady = false;
    this.customInput = "";
    if (
      index < 0 ||
      index >= this.testQuestions.length ||
      this.isCodeProcessing
    ) {
      this.isTestReady = true;
      return;
    }
    this.questionDetail =
      this.testQuestions[index].question.question.questionDetail;
    this.isQuestionCodeSnippetType =
      this.testQuestions[index].question.question.questionType ===
      QuestionType.codeSnippetQuestion;

    if (!this.isQuestionCodeSnippetType) {
      this.options =
        this.testQuestions[
          index
        ].question.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption;
      // Sets boolean if question is single choice
      this.isQuestionSingleChoice =
        this.testQuestions[index].question.question.questionType ===
        QuestionType.singleAnswer;
    }

    // Save answer to database
    if (this.questionIndex !== index) {
      // Prevent add answer for the first time on page load
      if (this.questionIndex !== -1) {
        // Only add answer that are of MCQ/SCQ type
        if (
          this.testQuestions[this.questionIndex].question.question
            .questionType !== QuestionType.codeSnippetQuestion
        ) {
          this.addAnswer(this.testQuestions[this.questionIndex]);
        } else {
          // Add code snippet answer
          if (
            this.questionStatus === QuestionStatus.review ||
            this.questionStatus === QuestionStatus.unanswered
          ) {
            this.testQuestions[this.questionIndex].questionStatus =
              this.questionStatus;
            this.addAnswer(this.testQuestions[this.questionIndex]);
          }
          this.isTestReady = true;
        }
        // Restore status of previous question
        this.testQuestions[this.questionIndex].questionStatus =
          this.questionStatus;
      }
    } else {
      this.isTestReady = true;
      return;
    }

    // Set coding solution if the question is of coding type
    if (
      this.testQuestions[index].question.question.questionType ===
      QuestionType.codeSnippetQuestion
    ) {
      const codingAnswer = this.testAnswers.find(
        (x) => x.questionId === this.testQuestions[index].question.question.id
      );
      this.languageMode =
        this.testQuestions[index].question.codeSnippetQuestion?.languageList;
      if (codingAnswer !== undefined) {
        this.codeAnswer = codingAnswer.code.source;
        this.selectLanguage = isNaN(+codingAnswer.code.language)
          ? codingAnswer.code.language
          : (this.CODING_LANGUAGES[codingAnswer.code.language] as string);
        this.codeResponse = codingAnswer.code.codeResponse;
        this.showResult = true;
      } else {
        this.selectLanguage = this.languageMode[0];
        this.changeText();
        this.codeResponse = new CodeResponse();
        this.codeResponse.output = "";
      }
      this.showCustomInput = false;
      this.isTestReady = true;
    }

    // Set status of new question
    this.questionStatus = this.testQuestions[index].questionStatus;
    // Remove review status if Attendee re-visits the question
    // if (this.questionStatus === QuestionStatus.review)
    // this.questionStatus = QuestionStatus.unanswered;

    // Mark new question as selected
    this.markAsSelected(index);
    // Update question index
    this.questionIndex = index;
  }

  runCode(runOnlyDefault: boolean) {
    this.showResult = true;
    this.isCodeProcessing = true;
    this.codeResponse = new CodeResponse();

    // scroll to bottom
    window.scrollTo(0, document.body.scrollHeight);

    if (this.testTypePreview) this.codeResponse.message = this.codeAnswer;
    else {
      this.codeResponse.message = "Processing...";

      const solution = new TestAnswer();
      solution.code.source = this.codeAnswer;
      solution.code.language = this.selectLanguage;
      solution.code.input = this.showCustomInput ? this.customInput : null;
      solution.questionId =
        this.testQuestions[this.questionIndex].question.question.id;
      solution.questionStatus = QuestionStatus.answered;

      this.conductService
        .execute(this.testAttendee.id, runOnlyDefault, solution)
        .subscribe({
          next: (res) => {
            this.codeResponse = res;

            if (
              this.questionStatus !== QuestionStatus.review &&
              !runOnlyDefault &&
              !this.showCustomInput
            )
              this.questionStatus = QuestionStatus.answered;

            solution.code.codeResponse = this.codeResponse;

            // Remove previous question's answer from the array
            const index = this.testAnswers.findIndex(
              (x) => x.questionId === solution.questionId
            );
            if (index !== -1) this.testAnswers.splice(index, 1);
            this.testAnswers.push(solution);
            this.isCodeProcessing = false;
          },
          error: () => {
            this.codeResponse.message = "Oops! Server error has occured.";
            this.isCodeProcessing = false;
          },
        });
    }
  }

  /**
   * Call API to add Answer to the Database
   * @param testQuestion: TestQuestion object
   */
  addAnswer(testQuestion: TestQuestions, _callback?: () => void) {
    // Remove previous question's answer from the array
    const index = this.testAnswers.findIndex(
      (x) => x.questionId === testQuestion.question.question.id
    );
    if (index !== -1) this.testAnswers.splice(index, 1);

    // Add new answer
    const testAnswer = new TestAnswer();
    testAnswer.questionId = testQuestion.question.question.id;

    if (
      testQuestion.question.question.questionType !==
      QuestionType.codeSnippetQuestion
    ) {
      testQuestion.question.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.forEach(
        (x) => {
          if (x.isAnswer) testAnswer.optionChoice.push(x.id);
        }
      );

      if (
        testQuestion.question.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.some(
          (x) => x.isAnswer
        ) &&
        this.questionStatus !== QuestionStatus.review
      ) {
        testAnswer.questionStatus = QuestionStatus.answered;

        this.questionStatus = QuestionStatus.answered;
      } else if (this.questionStatus !== QuestionStatus.review) {
        testAnswer.questionStatus = QuestionStatus.unanswered;
      } else {
        testAnswer.questionStatus = QuestionStatus.review;
      }
    } else {
      testAnswer.code.source = this.codeAnswer;
      testAnswer.code.language = this.selectLanguage;
      testAnswer.code.codeResponse = this.codeResponse;
      if (testQuestion.questionStatus === QuestionStatus.selected) {
        testAnswer.questionStatus = QuestionStatus.unanswered;
      } else {
        testAnswer.questionStatus = testQuestion.questionStatus;
      }
    }

    this.testAnswers.push(testAnswer);
    if (this.testTypePreview) {
      this.isTestReady = true;
      const questionIndex = this.testQuestions.findIndex(
        (x) => x.question.question.id === testAnswer.questionId
      );
      this.markAsAnswered(questionIndex);
    } else {
      this.conductService.addAnswer(this.testAttendee.id, testAnswer).subscribe(
        () => {
          this.isTestReady = true;
          const questionIndex = this.testQuestions.findIndex(
            (x) => x.question.question.id === testAnswer.questionId
          );
          if (testAnswer.questionStatus === QuestionStatus.answered) {
            this.markAsAnswered(questionIndex);
          }
          // call callback method if provided
          if (_callback) _callback();
        },
        () => {
          this.isTestReady = true;
        }
      );
    }
  }

  /**
   * Marks the question as selected
   * @param index: index of the question
   */
  markAsSelected(index: number) {
    this.testQuestions[index].questionStatus = QuestionStatus.selected;
    if (this.testTypePreview) this.isTestReady = true;
  }

  /**
   * Marks the question for review
   * @param index: index of question
   */
  markAsReview(index: number) {
    if (this.questionStatus !== QuestionStatus.review)
      this.testQuestions[index].questionStatus = this.questionStatus =
        QuestionStatus.review;
    else if (
      this.testQuestions[index].question.question.questionType ===
        QuestionType.codeSnippetQuestion &&
      this.testAnswers.some(
        (x) =>
          x.questionId === this.testQuestions[index].question.question.id &&
          x.code.codeResponse.message !== ""
      )
    ) {
      this.questionStatus = QuestionStatus.answered;
    } else {
      this.questionStatus = QuestionStatus.unanswered;
      this.testQuestions[index].questionStatus = QuestionStatus.selected;
    }
  }

  /**
   * Marks the question as answered
   * @param index: index of question
   */
  markAsAnswered(index: number) {
    this.testQuestions[index].questionStatus = QuestionStatus.answered;
  }

  /**
   * Clears the response
   * @param index: index of question
   */
  clearResponse(index: number) {
    if (
      this.testQuestions[index].question.question.questionType ===
      QuestionType.codeSnippetQuestion
    ) {
      if (this.selectLanguage.toLowerCase() === "c")
        this.codeAnswer = [
          " #include <stdio.h>",
          "int main()",
          "{",
          '     printf("Hello, World!");',
          "     return 0;",
          "}",
        ].join("\n");
      if (this.selectLanguage.toLowerCase() === "cpp")
        this.codeAnswer = [
          "#include <iostream>",
          "using namespace std;",
          "int main()",
          "{",
          '     cout << "Hello World!";',
          "}",
        ].join("\n");
      if (this.selectLanguage.toLowerCase() === "java")
        this.codeAnswer = this.JAVA_CODE;
    } else
      this.testQuestions[
        index
      ].question.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.forEach(
        (x) => (x.isAnswer = false)
      );
    // Leave the reviewed question
    if (this.questionStatus !== QuestionStatus.review)
      this.questionStatus = QuestionStatus.unanswered;
  }

  /**
   * Selects an option
   * @param questionIndex
   * @param optionIndex
   * @param isSingleChoice
   */
  selectOption(
    questionIndex: number,
    optionIndex: number,
    isSingleChoice = false
  ) {
    if (isSingleChoice) {
      this.clearResponse(questionIndex);
      const smaOption =
        this.testQuestions[questionIndex].question.singleMultipleAnswerQuestion
          ?.singleMultipleAnswerQuestionOption[optionIndex];
      smaOption.isAnswer = true;
    } else {
      const checked =
        this.testQuestions[questionIndex].question.singleMultipleAnswerQuestion
          ?.singleMultipleAnswerQuestionOption[optionIndex].isAnswer;
      const smaOption =
        this.testQuestions[questionIndex].question.singleMultipleAnswerQuestion
          ?.singleMultipleAnswerQuestionOption[optionIndex];
      smaOption.isAnswer = !checked;
      if (
        !this.testQuestions[
          questionIndex
        ].question.singleMultipleAnswerQuestion?.singleMultipleAnswerQuestionOption.some(
          (x) => x.isAnswer
        )
      ) {
        this.testQuestions[questionIndex].questionStatus =
          QuestionStatus.selected;
        this.questionStatus =
          this.questionStatus !== QuestionStatus.review
            ? QuestionStatus.unanswered
            : this.questionStatus;
      }
    }
  }

  /**
   * Returns stats of question as string
   * @param status: index of the question
   */
  getQuestionStatus(status: QuestionStatus) {
    let classes = QuestionStatus[status];
    if (this.isCodeProcessing) {
      classes += " cursor-not-allowed";
    }
    return classes;
  }

  /**
   * Called when end test button is clicked
   */
  async endTestButtonClicked() {
    await this.endTest(TestStatus.completedTest);
  }

  isLastQuestion() {
    return this.questionIndex === this.testQuestions.length - 1;
  }

  openProgramGuide() {
    this.dialog.open(TestsProgrammingGuideDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
    });
  }

  // Temporary technique to highlight color code for different result Default test case passed.
  getColorCode() {
    if (
      this.codeResponse.totalTestCasePassed === 0 &&
      this.codeResponse.totalTestCases !== 0
    ) {
      return "fail";
    } else if (
      this.codeResponse.totalTestCasePassed ===
        this.codeResponse.totalTestCases &&
      this.codeResponse.totalTestCases !== 0
    ) {
      return "pass";
    } else if (this.codeResponse.totalTestCasePassed > 0) {
      return "partial-fail";
    }

    return "";
  }

  /**
   * Shuffle testQuestions
   */
  private shuffleQuestion() {
    this.testQuestions = _.shuffle(this.testQuestions);
  }

  /**
   * Shuffle options
   */
  private shuffleOption() {
    _.forEach(this.testQuestions, (x) => {
      if (
        x !== null &&
        x.question !== null &&
        x.question.singleMultipleAnswerQuestion !== null
      ) {
        x.question.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption =
          _.shuffle(
            x.question.singleMultipleAnswerQuestion
              ?.singleMultipleAnswerQuestionOption
          );
      }
    });
  }

  /**
   * Increments focus lost counter and shows warning message
   * @param event: Focus event
   */
  public async windowFocusLost() {
    this.focusLost += 1;
    let message = "";
    const duration = 0;

    if (this.focusLost <= this.test.browserTolerance) {
      message = this.ALERT_BROWSER_FOCUS_LOST;
    }

    if (this.focusLost > this.test.browserTolerance) {
      this.conductService
        .addTestLogs(this.testAttendee.id, false, false)
        .subscribe((response) => {
          this.testLogs = response;
        });

      await this.endTest(TestStatus.blockedTest);
    } else if (this.focusLost <= this.test.browserTolerance) {
      await this.openSnackBar(message, duration);
      this.conductService
        .addTestLogs(this.testAttendee.id, false, false)
        .subscribe((response) => {
          this.testLogs = response;
        });
    }
  }

  /**
   * Converts seconds to time string format HH:MM:SS
   * @param seconds: Seconds to convert
   */
  private secToTimeString(seconds: number) {
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds - hh * 3600) / 60);
    const ss = Math.floor(seconds - (hh * 3600 + mm * 60));
    return (
      (hh < 10 ? "0" + hh : hh) +
      ":" +
      (mm < 10 ? "0" + mm : mm) +
      ":" +
      (ss < 10 ? "0" + ss : ss)
    );
  }

  /**
   * Counts down time
   */
  private async countDown() {
    this.seconds = this.seconds > 0 ? this.seconds - 1 : 0;
    this.timeString = this.secToTimeString(this.seconds);

    if (this.seconds <= this.WARNING_TIME && !this.timeWarning) {
      this.timeWarning = true;
      await this.openSnackBar(this.WARNING_MSG);
    }

    if (this.seconds <= 0) {
      this.isTestReady = false;
      await this.endTest(TestStatus.expiredTest);
    }
  }

  /**
   * Updates time on the server
   */
  private setElapsedTime(_callback?: () => void) {
    const timeElapsed = this.test.duration * 60 - this.seconds;
    this.conductService
      .setElapsedTime(this.testAttendee.id, timeElapsed)
      .subscribe(() => {
        if (_callback) _callback();
      });
  }

  /**
   * Ends test and route to test-end page
   * @param testStatus: TestStatus object
   */
  private async endTest(testStatus: TestStatus) {
    if (this.testTypePreview) {
      this.testService.isTestPreviewIsCalled.next(false);
      if (screenfull.isFullscreen) await screenfull.toggle();
      this.location.back();
    }

    this.istestEnd = true;
    this.isTestReady = false;
    this.dialog.closeAll();
    window.onbeforeunload = null;

    this.snackBar.dismiss();
    this.conductService
      .setAttendeeBrowserToleranceValue(this.testAttendee.id, this.focusLost)
      .subscribe((response) => {
        this.focusLost = response;
      });
    if (this.clockIntervalListener) {
      this.clockIntervalListener.unsubscribe();
    }
    if (
      this.testQuestions[this.questionIndex].question.question.questionType !==
        QuestionType.codeSnippetQuestion ||
      (this.testQuestions[this.questionIndex].question.question.questionType ===
        QuestionType.codeSnippetQuestion &&
        this.questionStatus !== QuestionStatus.answered)
    ) {
      // Add answer and close window
      this.testQuestions[this.questionIndex].questionStatus =
        this.questionStatus;
      this.addAnswer(this.testQuestions[this.questionIndex], () => {
        this.isTestReady = false;
        this.setElapsedTime(() => {
          void this.closeWindow(testStatus);
        });
      });
    } else {
      this.setElapsedTime(() => {
        void this.closeWindow(testStatus);
      });
    }
  }

  /**
   * Closes window
   */
  private async closeWindow(testStatus: TestStatus) {
    if (this.resumable === AllowTestResume.Supervised) {
      this.conductService
        .setTestStatus(this.testAttendee.id, testStatus)
        .subscribe({
          next: async (response) => {
            if (response) {
              await this.connectionService.sendReport(response);
              await this.connectionService.updateExpectedEndTime(
                this.test.duration,
                this.test.id
              );
              this.testEnded = true;
              void this.router.navigate(["test-summary"], { replaceUrl: true });
            }
          },
        });
    } else if (
      this.resumable === AllowTestResume.Unsupervised &&
      testStatus !== TestStatus.blockedTest &&
      testStatus !== TestStatus.expiredTest
    )
      await this.router.navigate(["test-summary"], { replaceUrl: true });
    else if (
      (this.resumable === AllowTestResume.Unsupervised &&
        testStatus === TestStatus.blockedTest) ||
      testStatus === TestStatus.expiredTest
    ) {
      this.conductService
        .setTestStatus(this.testAttendee.id, testStatus)
        .subscribe(() => {
          this.testEnded = true;
          void this.router.navigate(["test-summary"], { replaceUrl: true });
        });
    }
  }

  /**
   * Opens snack bar
   * @param message: message to display
   * @param duration: duration in seconds to show snackbar
   * @param enableRouting: enable routing after snack bar dismissed
   * @param routeTo: routing path
   */
  private async openSnackBar(
    message: string,
    duration: number = this.defaultSnackBarDuration,
    enableRouting = false,
    routeTo: (string | number)[] = [""]
  ) {
    this.snackBar.open(message, "Dismiss", {
      duration: duration,
    });
    if (enableRouting) {
      await this.router.navigate(routeTo);
    }
  }
}
