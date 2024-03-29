﻿import { DifficultyLevel } from "../questions/enum-difficultylevel";
import { QuestionType } from "../questions/enum-questiontype";
import { Category } from "../questions/category.model";

export interface Question {
  id: number;
  questionDetail: string;
  questionType: QuestionType;
  difficultyLevel: DifficultyLevel;
  category: Category;
  categoryID: number;
  isSelect: boolean;
}
