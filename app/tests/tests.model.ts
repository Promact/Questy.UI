import { TestOrder } from "./enum-testorder";
import { Category } from "../questions/category.model";
import { AllowTestResume } from "./enum-allowtestresume";
import { QuestionStatus, AnswerStatus } from "../conduct/question_status.enum";
import { QuestionDisplay } from "../questions/question-display";
import { TestIPAddress } from "./test-IPAdddress";
import { CodeSnippetTestCasesDetails } from "../reports/code-snippet-test-cases-details.model";
import { TestCodeSolutionDetails } from "../reports/test-code-solution-details.model";
import { ProgrammingLanguage } from "../reports/programminglanguage.enum";
import { Injectable } from "@angular/core";

@Injectable()
export class Test {
  id!: number;
  testName!: string;
  link!: string;
  startDate!: Date | string;
  endDate!: Date | string;
  duration!: number;
  warningTime!: number;
  focusLostTime!: number;
  warningMessage!: string;
  correctMarks!: number;
  incorrectMarks!: number;
  browserTolerance!: number;
  createdDateTime!: Date;
  questionOrder!: TestOrder;
  optionOrder!: TestOrder;
  allowTestResume!: AllowTestResume;
  categoryAcList!: Category[];
  testIpAddress: TestIPAddress[] = [];
  isEditTestEnabled!: boolean;
  isQuestionMissing!: boolean;
  public isPaused: boolean;
  public isLaunched: boolean;
  numberOfTestAttendees!: number;
  numberOfTestSections!: number;
  numberOfTestQuestions!: number;
  testCopiedNumber!: number;

  constructor() {
    this.isLaunched = false;
    this.isPaused = false;
  }
}

export class TestCategory {
  public id!: number;
  public categoryId!: number;
  public testId!: number;
  public isSelect!: boolean;
}

export class TestQuestion {
  public id!: number;
  public testId!: number;
  public questionId!: number;
  public isSelect!: boolean;
  public question!: QuestionDisplay;
  public questionStatus!: QuestionStatus;
  public answerStatus!: AnswerStatus;
  public codeSnippetQuestionTestCasesDetails: CodeSnippetTestCasesDetails[];
  public testCodeSolutionDetails: TestCodeSolutionDetails;
  public language!: ProgrammingLanguage;
  public numberOfSuccessfulAttemptsByAttendee!: number;
  public totalNumberOfAttemptsMadeByAttendee!: number;
  public scoreOfCodeSnippetQuestion!: string;
  public compilationStatus!: string;
  public codeSolution!: string;
  public codeToDisplay!: string;
  public isCodeSolutionDetailsVisible!: boolean;
  public isCodeSnippetTestCaseDetailsVisible!: boolean;
  public isCompilationStatusVisible!: boolean;

  constructor() {
    this.codeSnippetQuestionTestCasesDetails =
      new Array<CodeSnippetTestCasesDetails>();
    this.testCodeSolutionDetails = {} as TestCodeSolutionDetails;
  }
}

export interface TestQuestionAC {
  id: number;

  categoryID: number;

  isSelect: boolean;
}
