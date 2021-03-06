import {
  throwError as observableThrowError,
  of as observableOf,
  Observable,
} from "rxjs";
import { ComponentFixture, TestBed, tick } from "@angular/core/testing";
import { async, fakeAsync } from "@angular/core/testing";
import { TestsDashboardComponent } from "../tests-dashboard/tests-dashboard.component";
import { MockTestData } from "../../Mock_Data/test_data.mock";
import { HttpService } from "../../core/http.service";
import {
  RouterModule,
  Router,
  ActivatedRoute,
  Routes,
  Params,
} from "@angular/router";
import { QuestionsService } from "../../questions/questions.service";
import { Http, HttpModule, XHRBackend } from "@angular/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TestService } from "../tests.service";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import {
  MaterialModule,
  MdDialogModule,
  MdDialog,
  MdDialogRef,
  MdSnackBar,
} from "@angular/material";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { TestQuestionsComponent } from "./test-questions.component";
import { FilterPipe } from "../tests-dashboard/test-dashboard.pipe";
import { CreateTestFooterComponent } from "../shared/create-test-footer/create-test-footer.component";
import { CreateTestHeaderComponent } from "../shared/create-test-header/create-test-header.component";
import { Md2AccordionModule } from "md2";
import { PopoverModule } from "ngx-popover";
import { ClipboardModule } from "ngx-clipboard";
import { APP_BASE_HREF } from "@angular/common";
import { Test } from "../tests.model";
import { MockRouteService } from "../../questions/questions-single-multiple-answer/mock-route.service";

class MockActivatedRoute {
  params = observableOf({ id: MockTestData[0].id });
}

describe("Test question Component", () => {
  let router: Router;
  let testQuestion: TestQuestionsComponent;
  let fixture: ComponentFixture<TestQuestionsComponent>;
  let routeTo: any[];
  let mockdata: any[] = [];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestQuestionsComponent,
        FilterPipe,
        CreateTestFooterComponent,
        CreateTestHeaderComponent,
        TestsDashboardComponent,
      ],
      providers: [
        QuestionsService,
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        TestService,
        HttpService,
        MdSnackBar,
        { provide: APP_BASE_HREF, useValue: "/" },
        MockRouteService,
      ],
      imports: [
        BrowserModule,
        RouterModule.forRoot([]),
        FormsModule,
        MaterialModule,
        HttpModule,
        BrowserAnimationsModule,
        MdDialogModule,
        Md2AccordionModule,
        PopoverModule,
        ClipboardModule,
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    mockdata = JSON.parse(JSON.stringify(MockTestData));
    fixture = TestBed.createComponent(TestQuestionsComponent);
    testQuestion = fixture.componentInstance;
    router = TestBed.get(Router);
    spyOn(TestService.prototype, "getTestById").and.callFake((id: number) => {
      const test = mockdata.find((x) => x.id === id);
      if (test === undefined) return observableThrowError("test not found");
      else return observableOf(test);
    });
    spyOn(TestService.prototype, "getQuestions").and.returnValue(
      observableOf(MockTestData[0].categoryAcList[0].questionList)
    );
    spyOn(router, "navigate").and.callFake(function (route: any[]) {
      routeTo = route;
    });
  });

  it("getTestDetails ", () => {
    testQuestion.getTestDetails();
    expect(testQuestion.testDetails).toBe(mockdata[0]);
    expect(testQuestion.isAnyCategorySelectedForTest).toBe(true);
  });

  it("getTestDetails error handling ", () => {
    spyOn(MdSnackBar.prototype, "open").and.callThrough();
    testQuestion.testId = 5;
    testQuestion.getTestDetails();
    expect(MdSnackBar.prototype.open).toHaveBeenCalled();
    expect(testQuestion.isAnyCategorySelectedForTest).toBe(undefined);
    expect(routeTo[0]).toBe("/tests");
  });

  it("getAllQuestions ", () => {
    testQuestion.getTestDetails();
    testQuestion.getAllquestions(mockdata[0].categoryAcList[0], 0);
    mockdata[0].categoryAcList[0].isAccordionOpen = false;
    mockdata[0].categoryAcList[0].isAlreadyClicked = true;
    testQuestion.getAllquestions(mockdata[0].categoryAcList[0], 0);
    mockdata[0].categoryAcList[0].isAccordionOpen = true;
    testQuestion.getAllquestions(mockdata[0].categoryAcList[0], 0);
    const value = testQuestion.isCorrectAnswer(true);
    expect(value).toBe("correct");
  });
  it("selectQuestion ", () => {
    const questionToSelect = mockdata[0].categoryAcList[0].questionList[0];
    testQuestion.getTestDetails();
    testQuestion.getAllquestions(mockdata[0].categoryAcList[0], 0);
    testQuestion.selectQuestion(
      questionToSelect,
      mockdata[0].categoryAcList[0]
    );
    expect(testQuestion.testDetails.categoryAcList[0].selectAll).toBe(true);
    questionToSelect.question.isSelect = false;
    testQuestion.selectQuestion(
      questionToSelect,
      mockdata[0].categoryAcList[0]
    );
    expect(testQuestion.testDetails.categoryAcList[0].selectAll).toBe(false);
  });
  it("save next ", () => {
    spyOn(TestService.prototype, "addTestQuestions").and.returnValue(
      observableOf({ message: "question Added" })
    );
    testQuestion.getTestDetails();
    testQuestion.isEditTestEnabled = true;
    testQuestion.testId = MockTestData[0].id;
    testQuestion.isEditTestEnabled = false;
    testQuestion.saveNext();
    expect(routeTo[0]).toBe("tests/" + MockTestData[0].id + "/settings");
    testQuestion.isSaveExit = true;
    testQuestion.isEditTestEnabled = true;
    testQuestion.saveNext();
    expect(routeTo[0]).toBe("/tests");
    testQuestion.isSaveExit = false;
    testQuestion.saveNext();
    expect(routeTo[0]).toBe("tests/" + MockTestData[0].id + "/settings");
  });

  it("save exit", () => {
    testQuestion.saveExit();
    expect(routeTo[0]).toBe("/tests");
  });

  it("save next error handeling", () => {
    spyOn(MdSnackBar.prototype, "open").and.callThrough();
    spyOn(TestService.prototype, "addTestQuestions").and.returnValue(
      observableThrowError({ message: "question Added" })
    );
    testQuestion.isEditTestEnabled = true;
    testQuestion.saveNext();
    expect(MdSnackBar.prototype.open).toHaveBeenCalled();
  });

  it("selectAll", () => {
    testQuestion.selectAll(mockdata[0].categoryAcList[0]);
    mockdata[0].categoryAcList[0].selectAll = true;
    testQuestion.selectAll(mockdata[0].categoryAcList[0]);
    expect(
      mockdata[0].categoryAcList[0].questionList[0].question.isSelect
    ).toBe(true);
  });

  it("isTestAttendeeExist", () => {
    spyOn(TestService.prototype, "isTestAttendeeExist").and.returnValue(
      observableOf({ response: true })
    );
    testQuestion.isTestAttendeeExist();
    expect(testQuestion.isEditTestEnabled).toBe(false);
  });
});
