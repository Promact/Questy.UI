import { Question } from "./question.model";
import { SingleMultipleAnswerQuestion } from "./single-multiple-question";
import { CodeSnippetQuestion } from "./code.snippet.model";

export class QuestionBase {
  question: Question;
  singleMultipleAnswerQuestion: SingleMultipleAnswerQuestion | null;
  codeSnippetQuestion: CodeSnippetQuestion | null;

  constructor() {
    this.question = new Question();
    this.singleMultipleAnswerQuestion = new SingleMultipleAnswerQuestion();
    this.codeSnippetQuestion = new CodeSnippetQuestion();
  }
}
