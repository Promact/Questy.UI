import {
  throwError as observableThrowError,
  of as observableOf,
  Observable,
  BehaviorSubject,
} from "rxjs";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { async } from "@angular/core/testing";
import { BrowserModule, By } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import {
  MaterialModule,
  MdDialogRef,
  OverlayRef,
  MdDialogModule,
  MdDialog,
  MdSnackBar,
} from "@angular/material";
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { QuestionsService } from "../../questions/questions.service";
import { Http, HttpModule } from "@angular/http";
import { TestService } from "../tests.service";
import { inject } from "@angular/core/testing";
import { Test } from "../tests.model";
import { testsRouting } from "../tests.routing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpService } from "../../core/http.service";
import { MockTestData } from "../../Mock_Data/test_data.mock";
import { tick } from "@angular/core/testing";
import { Location, LocationStrategy } from "@angular/common";
import { NgModule, Input, EventEmitter, Output } from "@angular/core";
import { fakeAsync } from "@angular/core/testing";
import { DeleteTestDialogComponent } from "../tests-dashboard/delete-test-dialog.component";
import { DuplicateTestDialogComponent } from "../tests-dashboard/duplicate-test-dialog.component";
import { TestViewComponent } from "./test-view.component";
import { PopoverModule } from "ngx-popover";
import { ClipboardModule } from "ngx-clipboard";
import { Md2AccordionModule } from "md2";
import { Category } from "../../questions/category.model";
import { QuestionBase } from "../../questions/question";
import { QuestionType } from "../../questions/enum-questiontype";
import { DifficultyLevel } from "../../questions/enum-difficultylevel";
import { TestSectionsComponent } from "../test-sections/test-sections.component";
import { CreateTestHeaderComponent } from "../shared/create-test-header/create-test-header.component";
import { CreateTestFooterComponent } from "../shared/create-test-footer/create-test-footer.component";
import { MockRouteService } from "../../questions/questions-single-multiple-answer/mock-route.service";

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

describe("Test View Component", () => {
  let testView: TestViewComponent;
  let fixture: ComponentFixture<TestViewComponent>;

  const question = new QuestionBase();
  question.question.id = 2;
  question.question.categoryID = 2;
  question.question.questionDetail = "Who was the father of Akbar?";
  question.question.questionType = QuestionType.singleAnswer;
  question.question.difficultyLevel = DifficultyLevel.Easy;
  question.singleMultipleAnswerQuestion = null;
  question.codeSnippetQuestion = null;
  question.question.isSelect = true;

  const category = new Category();
  category.id = 2;
  category.categoryName = "history";
  category.isSelect = true;
  category.numberOfSelectedQuestion = 0;
  category.questionList[0] = question;
  category.isAccordionOpen = false;
  category.isAlreadyClicked = false;

  const test = new Test();
  test.id = 2;
  test.numberOfTestAttendees = 2;
  test.testName = "History";
  test.isEditTestEnabled = true;
  test.link = "a6thsjk8";
  test.categoryAcList[0] = category;

  let router: Router;
  let urls: any[];
  let route: ActivatedRoute;

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
        entryComponents: [
          TestViewComponent,
          DeleteTestDialogComponent,
          DuplicateTestDialogComponent,
          TestSectionsComponent,
        ],
      },
    });

    TestBed.configureTestingModule({
      declarations: [
        TestViewComponent,
        DeleteTestDialogComponent,
        DuplicateTestDialogComponent,
        TestSectionsComponent,
        CreateTestHeaderComponent,
        CreateTestFooterComponent,
      ],

      providers: [
        TestService,
        HttpService,
        MdDialogModule,
        MdSnackBar,
        { provide: Router, useClass: MockRouter },
        { provide: MdDialogRef, useClass: MockDialog },
        {
          provide: ActivatedRoute,
          useValue: { params: observableOf({ id: 123 }) },
        },
        MockRouteService,
      ],

      imports: [
        BrowserModule,
        FormsModule,
        MaterialModule,
        RouterModule,
        HttpModule,
        BrowserAnimationsModule,
        PopoverModule,
        ClipboardModule,
        Md2AccordionModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestViewComponent);
    testView = fixture.componentInstance;
  });

  it("should not edit test when attendees exists for a particular test", () => {
    spyOn(TestService.prototype, "isTestAttendeeExist").and.callFake(() => {
      return observableOf(true);
    });
    spyOn(testView, "editTest").and.callThrough();
    testView.editTest(test);
    expect(testView.editTest).toHaveBeenCalled();
  });

  it("should open delete test dialog on call of deleteTestDialog with a message informing test cannot be deleted", () => {
    spyOn(TestService.prototype, "isTestAttendeeExist").and.callFake(() => {
      const result = new BehaviorSubject(true);
      return result.asObservable();
    });
    spyOn(testView.dialog, "open").and.callThrough();
    testView.deleteTestDialog(test);
    expect(testView.isDeleteAllowed).toBe(false);
    expect(testView.deleteTestDialogData.testToDelete).toBe(test);
    expect(testView.deleteTestDialogData.testArray).toBe(testView.tests);
    expect(testView.dialog.open).toHaveBeenCalled();
  });

  it("should open delete test dialog on call of deleteTestDialog with a message confirming if the user wants to delete the test", () => {
    spyOn(TestService.prototype, "isTestAttendeeExist").and.callFake(() => {
      const result = new BehaviorSubject(false);
      return result.asObservable();
    });
    spyOn(testView.dialog, "open").and.callThrough();
    testView.deleteTestDialog(test);
    expect(testView.isDeleteAllowed).toBe(true);
    expect(testView.deleteTestDialogData.testToDelete).toBe(test);
    expect(testView.deleteTestDialogData.testArray).toBe(testView.tests);
    expect(testView.dialog.open).toHaveBeenCalled();
  });

  it("should open duplicate test dialog on call of duplicateTestDialog and display test name as testName_copy", () => {
    spyOn(TestService.prototype, "setTestCopiedNumber").and.callFake(() => {
      const result = new BehaviorSubject(1);
      return result.asObservable();
    });
    spyOn(testView.dialog, "open").and.callThrough();
    testView.duplicateTestDialog(test);
    expect(testView.count).toBe(1);
    expect(testView.duplicateTestDialogData.testName).toBe(
      test.testName + "_copy"
    );
    expect(testView.duplicateTestDialogData.testArray).toBe(testView.tests);
    expect(testView.duplicateTestDialogData.testToDuplicate).toBe(test);
    expect(testView.dialog.open).toHaveBeenCalled();
  });

  it("should open duplicate test dialog on call of duplicateTestDialog and display test name as testName_copy_5 [number of times the test has been copied]", () => {
    spyOn(TestService.prototype, "setTestCopiedNumber").and.callFake(() => {
      const result = new BehaviorSubject(5);
      return result.asObservable();
    });
    spyOn(testView.dialog, "open").and.callThrough();
    testView.duplicateTestDialog(test);
    expect(testView.count).toBe(5);
    expect(testView.duplicateTestDialogData.testName).toBe(
      test.testName + "_copy_" + testView.count
    );
    expect(testView.duplicateTestDialogData.testArray).toBe(testView.tests);
    expect(testView.duplicateTestDialogData.testToDuplicate).toBe(test);
    expect(testView.dialog.open).toHaveBeenCalled();
  });

  it("should check that editing of test is enabled when number of attendees is 0", () => {
    spyOn(TestService.prototype, "isTestAttendeeExist").and.callFake(() => {
      return observableOf(false);
    });
    testView.isTestAttendeeExist();
    expect(testView.isEditTestEnabled).toBe(true);
  });

  it("should check that editing of test is disabled when number of attendees exist for the test", () => {
    spyOn(TestService.prototype, "isTestAttendeeExist").and.callFake(() => {
      return observableOf(true);
    });
    testView.isTestAttendeeExist();
    expect(testView.isEditTestEnabled).toBe(false);
  });

  it("should get all tests", () => {
    spyOn(TestService.prototype, "getTests").and.callFake(() => {
      return observableOf(MockTestData);
    });
    spyOn(TestService.prototype, "isTestAttendeeExist").and.callFake(() => {
      return observableOf(false);
    });
    testView.getAllTests();
    expect(testView.tests.length).toBe(2);
    expect(TestService.prototype.isTestAttendeeExist).toHaveBeenCalled();
  });

  it("should get the details of the test with category selected and number of questions selected 0", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableOf(test);
    });
    testView.getTestDetails(test.id);
    expect(testView.isCategorySelected).toBe(true);
    expect(testView.testDetails.categoryAcList[0].isQuestionAbsent).toBe(true);
  });

  it("should get the details of the test with no category selected", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableOf(test);
    });
    category.isSelect = false;
    testView.getTestDetails(test.id);
    expect(testView.isCategorySelected).toBe(false);
  });

  it("should get the details of the test with no questions selected of a particular category", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableOf(test);
    });
    category.numberOfSelectedQuestion = 2;
    testView.getTestDetails(test.id);
    expect(testView.testDetails.categoryAcList[0].isQuestionAbsent).toBe(false);
  });

  it("should check that preview of test is disabled", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableOf(test);
    });
    testView.getTestDetails(test.id);
    expect(testView.disablePreview).toBe(true);
  });

  it("should get all the questions of the selected category", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableOf(test);
    });
    spyOn(TestService.prototype, "getQuestions").and.callFake(() => {
      return observableOf(category.questionList);
    });
    testView.getTestDetails(test.id);
    testView.getAllquestions(category, 0);
    expect(category.isAccordionOpen).toBe(true);
    expect(category.isAlreadyClicked).toBe(true);
    expect(testView.totalNumberOfQuestions[0]).toBe(1);
    expect(
      testView.testDetails.categoryAcList[0].numberOfSelectedQuestion
    ).toBe(1);
    expect(category.selectAll).toBe(true);
  });

  it("should not get all the questions of the selected category when category is already clicked", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableOf(test);
    });
    spyOn(TestService.prototype, "getQuestions").and.callFake(() => {
      return observableOf(category.questionList);
    });
    category.isAccordionOpen = false;
    category.isAlreadyClicked = true;
    testView.getAllquestions(category, 0);
    expect(test.categoryAcList[0].isAlreadyClicked).toBe(true);
  });

  it("should not get all questions when accodion is already open", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableOf(test);
    });
    spyOn(TestService.prototype, "getQuestions").and.callFake(() => {
      return observableOf(category.questionList);
    });
    category.isAccordionOpen = true;
    testView.getAllquestions(category, 0);
    expect(test.categoryAcList[0].isAccordionOpen).toBe(false);
  });

  it("should navigate to the test settings page", () => {
    router = TestBed.get(Router);
    testView.testId = test.id;
    testView.navigateToTestSettings();
    spyOn(router, "navigate").and.callFake(function (url: any[]) {
      urls = url;
      expect(urls[0]).toBe("/tests/" + test.id + "/settings");
    });
  });

  it("should not get the details of the test on getting error", () => {
    spyOn(TestService.prototype, "getTestById").and.callFake(() => {
      return observableThrowError(Error);
    });
    spyOn(testView.snackBar, "open").and.callThrough();
    spyOn(Router.prototype, "navigate").and.callFake(function (url: any[]) {
      urls = url;
      expect(urls[0]).toBe("/tests");
    });
    testView.getTestDetails(test.id);
    expect(testView.loader).toBe(false);
    expect(testView.snackBar.open).toHaveBeenCalled();
  });

  it("should call isCorrectAnswer", () => {
    spyOn(testView, "isCorrectAnswer").and.callThrough();
    testView.isCorrectAnswer(true);
    testView.isCorrectAnswer(false);
    expect(testView.isCorrectAnswer).toHaveBeenCalledTimes(2);
  });

  it("should call showTooltipMessage()", () => {
    const event: any = {};
    event.stopPropagation = function () {};
    const element: any = {};
    element.select = function () {};
    testView.showTooltipMessage(event, element);
    expect(testView.tooltipMessage).toBe("Copied");
  });

  it("should change the tooltip message", () => {
    testView.changeTooltipMessage();
    expect(testView.tooltipMessage).toBe("Copy to Clipboard");
  });

  it("should edit test on number of attendees for a particular test is 0", () => {
    spyOn(TestService.prototype, "isTestAttendeeExist").and.callFake(() => {
      return observableOf(false);
    });
    testView.editTest(test);
    spyOn(Router.prototype, "navigate").and.callFake(function (url: any[]) {
      urls = url;
      expect(urls[0]).toBe("/tests/" + test.id + "/sections");
    });
  });
});
