import { throwError as observableThrowError, of as observableOf } from "rxjs";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { RouterModule, Router } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpService } from "../../core/http.service";
import { APP_BASE_HREF } from "@angular/common";
import { TestPreviewComponent } from "../../tests/test-preview/test-preview.compponent";
import { ConductService } from "../conduct.service";
import { QuestionStatus } from "../question_status.enum";
import { TestsProgrammingGuideDialogComponent } from "./tests-programming-guide-dialog.component";
import { AceEditorComponent } from "ngx-ace-editor-wrapper";
import "brace";
import "brace/theme/cobalt";
import "brace/theme/monokai";
import "brace/theme/eclipse";
import "brace/theme/solarized_light";
import "brace/mode/java";
import "brace/mode/c_cpp";
import screenfull from "screenfull";
declare let alea: any;
import { TestService } from "../../tests/tests.service";
import { PageNotFoundComponent } from "../../page-not-found/page-not-found.component";
import { TestComponent } from "./test.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { ClipboardModule } from "ngx-clipboard";
import { NgChartsModule } from "ng2-charts";
import {
  FakeTest,
  FakeTestQuestions,
  FakeTestLogs,
  FakeResumeData,
  FakeBundleData,
} from "../../Mock_Data/conduct_data.mock";
import { ConnectionService } from "../../core/connection.service";
import { MatDialogRef } from "@angular/material/dialog/dialog-ref";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { HttpClientModule } from "@angular/common/http";
import { TestQuestion } from "app/tests/tests.model";
import { TestQuestions } from "../test_conduct.model";

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

describe("Test Component", () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  let urls: any[];
  let router: Router;
  let module: NodeModule;

  class MockDialog {
    open() {
      return true;
    }

    close() {
      return true;
    }
  }

  beforeEach(
    waitForAsync(async () => {
      TestBed.overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            TestComponent,
            PageNotFoundComponent,
            TestPreviewComponent,
            TestsProgrammingGuideDialogComponent,
            AceEditorComponent,
          ],
        },
      });

      await TestBed.configureTestingModule({
        declarations: [
          TestComponent,
          PageNotFoundComponent,
          TestPreviewComponent,
          TestsProgrammingGuideDialogComponent,
          AceEditorComponent,
        ],

        providers: [
          ConnectionService,
          TestService,
          HttpService,
          ConductService,
          { provide: MatDialogRef, useClass: MockDialog },
          { provide: APP_BASE_HREF, useValue: "/" },
          { provide: window, useClass: MockWindow },
        ],

        imports: [
          BrowserModule,
          FormsModule,
          RouterModule.forRoot([]),
          HttpClientModule,
          BrowserAnimationsModule,
          PopoverModule,
          ClipboardModule,
          MatExpansionModule,
          MatDialogModule,
          NgChartsModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;

    spyOn(Window.prototype, "addEventListener").and.callFake(() => {
      console.log("listener");
    });
    spyOn(ConnectionService.prototype, "sendReport").and.callFake(() => {});
    spyOn(ConnectionService.prototype, "registerAttendee").and.callFake(
      () => {}
    );
    spyOn(ConnectionService.prototype, "startConnection").and.callFake(() => {
      console.log("connection initiated");
    });
    spyOn(ConductService.prototype, "getElapsedTime").and.callFake(() => {
      return observableOf(4.5);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should get the elapsed time", () => {
    testComponent.getElapsedTime();
    expect(testComponent.isTestReady).toBe(true);
  });

  it("should resume test", () => {
    spyOn(ConductService.prototype, "getAnswer").and.callFake(() =>
      observableOf(FakeResumeData)
    );
    spyOn(TestComponent.prototype, "navigateToQuestionIndex").and.callFake(
      () => {
        return;
      }
    );
    testComponent.testQuestions = JSON.parse(
      JSON.stringify(FakeTestQuestions)
    ) as TestQuestions[];
    testComponent.resumeTest();
    expect(testComponent.isInitializing).toBe(false);
  });

  it("should NOT resume test", () => {
    spyOn(ConductService.prototype, "getAnswer").and.callFake(() => {
      return observableThrowError(Error);
    });
    spyOn(TestComponent.prototype, "navigateToQuestionIndex").and.callFake(
      () => {
        return;
      }
    );
    spyOn(ConductService.prototype, "setElapsedTime").and.callFake(() =>
      observableOf(100)
    );

    testComponent.resumeTest();
    expect(testComponent.isInitializing).toBe(false);
  });

  it("should get Test bundle", () => {
    spyOn(ConductService.prototype, "getTestBundle").and.callFake(() =>
      observableOf(FakeBundleData)
    );

    testComponent.getTestBundle("");
    expect(testComponent.testQuestions.length).toBe(2);
    expect(testComponent.test.link).toBe("hjxJ4cQ2fI");
  });

  it("should get Test status", () => {
    spyOn(ConductService.prototype, "getTestStatus").and.callFake(() => {
      return observableOf(0);
    });
    spyOn(TestComponent.prototype, "resumeTest").and.callFake(() => {
      return observableOf();
    });

    testComponent.getTestStatus(1);
    expect(testComponent.resumeTest).toHaveBeenCalled();
  });

  it("should add answer", () => {
    spyOn(ConductService.prototype, "addAnswer").and.callFake(() => {
      return observableOf("");
    });
    spyOn(TestComponent.prototype, "markAsAnswered").and.callFake(() => {
      return;
    });

    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.testTypePreview = false;
    testComponent.addAnswer(testComponent.testQuestions[0]);
    expect(testComponent.isTestReady).toBe(true);

    testComponent.addAnswer(testComponent.testQuestions[1]);
    expect(testComponent.isTestReady).toBe(true);

    testComponent.testQuestions[1].question.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption[0].isAnswer =
      true;
    testComponent.addAnswer(testComponent.testQuestions[1]);
    expect(testComponent.isTestReady).toBe(true);
  });

  it("should mark question for review", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.markAsReview(0);
    expect(testComponent.testQuestions[0].questionStatus).toBe(
      QuestionStatus.review
    );
  });

  it("should mark question for review part 2", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.questionStatus = QuestionStatus.review;
    testComponent.markAsReview(0);
    expect(testComponent.testQuestions[0].questionStatus).toBe(
      QuestionStatus.selected
    );
  });

  it("should mark question for review part 3", () => {
    spyOn(ConductService.prototype, "addAnswer").and.callFake(() => {
      return observableOf("");
    });

    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.questionStatus = QuestionStatus.review;
    testComponent.addAnswer(testComponent.testQuestions[0]);
    testComponent.testAnswers[0].code.codeResponse.message = "res";
    testComponent.markAsReview(0);
    expect(testComponent.testQuestions[0].questionStatus).toBe(
      QuestionStatus.selected
    );
  });

  it("should mark question as answered", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.markAsAnswered(0);
    expect(testComponent.testQuestions[0].questionStatus).toBe(
      QuestionStatus.answered
    );
  });

  it("should clear response", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.clearResponse(0);
    expect(testComponent.codeAnswer).toContain("public static void main"); // Java
  });

  it("should select option (Single Option Type)", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.selectOption(1, 0, true);
    expect(
      testComponent.testQuestions[1].question.singleMultipleAnswerQuestion
        .singleMultipleAnswerQuestionOption[0].isAnswer
    ).toBeTruthy();
  });

  it("should select option (Multiple Option Type)", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.selectOption(1, 0, false);
    expect(
      testComponent.testQuestions[1].question.singleMultipleAnswerQuestion
        .singleMultipleAnswerQuestionOption[0].isAnswer
    ).toBeTruthy();
  });

  it("should select option (Multiple Option Type) part 2", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.testQuestions[1].question.singleMultipleAnswerQuestion.singleMultipleAnswerQuestionOption[0].isAnswer =
      true;
    testComponent.selectOption(1, 0, false);
    expect(
      testComponent.testQuestions[1].question.singleMultipleAnswerQuestion
        .singleMultipleAnswerQuestionOption[0].isAnswer
    ).toBeFalsy();
  });

  it("should navigate to other question", () => {
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));
    testComponent.questionIndex = -1;
    testComponent.navigateToQuestionIndex(-1);
    testComponent.navigateToQuestionIndex(0);
    testComponent.navigateToQuestionIndex(1);
    expect(testComponent.isTestReady).toBeTruthy;

    testComponent.navigateToQuestionIndex(0);
    expect(testComponent.isTestReady).toBeTruthy;

    testComponent.questionIndex = 0;
    testComponent.navigateToQuestionIndex(0);
    expect(testComponent.isTestReady).toBeTruthy;

    testComponent.questionIndex = 0;
    testComponent.questionStatus = QuestionStatus.review;
    testComponent.navigateToQuestionIndex(1);
    expect(testComponent.isTestReady).toBeTruthy;
  });

  it("should get question status", () => {
    testComponent.isCodeProcessing = true;
    const ReturnedClass = testComponent.getQuestionStatus(
      QuestionStatus.answered
    );
    expect(ReturnedClass).toBe("answered cursor-not-allowed");
  });

  it("should run support functions", () => {
    spyOn(TestComponent.prototype, "getClockInterval").and.callFake(() => {
      return;
    });

    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));

    testComponent.questionIndex = 1;
    const isLastQuestion = testComponent.isLastQuestion();
    expect(isLastQuestion).toBeTruthy();

    testComponent.ifOnline();
    expect(testComponent.isTestReady).toBeFalsy();

    testComponent.goOnline();
    expect(testComponent.getClockInterval).toHaveBeenCalled();

    testComponent.openProgramGuide();

    testComponent.onChange("abcd");
    expect(testComponent.codeAnswer).toBe("abcd");
  });

  it("should count down", () => {
    spyOn(ConductService.prototype, "setElapsedTime").and.callFake(() => {
      return observableOf("OK");
    });
    spyOn(
      ConductService.prototype,
      "setAttendeeBrowserToleranceValue"
    ).and.callFake(() => {
      return observableOf(1);
    });
    spyOn(TestComponent.prototype, "addAnswer").and.callFake(() => {
      return;
    });
    spyOn(ConductService.prototype, "addTestLogs").and.callFake(() => {
      return observableOf(FakeTestLogs);
    });
    spyOn(ConductService.prototype, "setTestStatus").and.callFake(() => {
      return observableOf(1);
    });

    testComponent.test = JSON.parse(JSON.stringify(FakeTest));
    testComponent.questionIndex = 0;
    testComponent.questionStatus = QuestionStatus.answered;
    testComponent.testQuestions = JSON.parse(JSON.stringify(FakeTestQuestions));

    // Hack: Calling private method
    testComponent["countDown"]();
    expect(
      ConductService.prototype.setAttendeeBrowserToleranceValue
    ).toHaveBeenCalled();
  });

  it("should change editor language", () => {
    spyOn(ConductService.prototype, "addAnswer").and.callFake(() => {
      return observableOf("");
    });

    fixture.whenStable().then(() => {
      testComponent.questionIndex = 0;
      testComponent.testQuestions = JSON.parse(
        JSON.stringify(FakeTestQuestions)
      );
      testComponent.addAnswer(testComponent.testQuestions[0]);
      testComponent.testAnswers[0].code.language = "c";
      testComponent.changeLanguage("c");
      expect(testComponent.editor._mode).toBe("c");
    });
  });

  it("should change editor language part 2", () => {
    fixture.whenStable().then(() => {
      testComponent.selectLanguage = "cpp";
      testComponent.changeLanguage("cpp");
      expect(testComponent.editor._mode).toBe("cpp");
    });
  });

  it("should change editor theme", () => {
    fixture.whenStable().then(() => {
      testComponent.changeTheme("eclipse");
      expect(testComponent.editor._theme).toBe("eclipse");
    });
  });

  it("should save test logs", () => {
    spyOn(ConductService.prototype, "addTestLogs").and.callFake(() => {
      return observableOf(FakeTestLogs);
    });

    testComponent.saveTestLogs();

    expect(testComponent.testLogs.resumeTest).toBe(FakeTestLogs.resumeTest);
  });
});
