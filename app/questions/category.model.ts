﻿import { Question } from "./question.model";
import { QuestionBase } from "./question";

export interface Category {
  id: number;
  categoryName: string;
  questionList: QuestionBase[];
  isAccordionOpen: boolean;
  isAlreadyClicked: boolean;
  selectAll: boolean;
  numberOfSelectedQuestion: number;
  isSelect: boolean;
  questionCount: number;
  isQuestionAbsent: boolean;
  numberOfRandomQuestionsSelected: number;
}
