import { QuestionType } from "../questions/enum-questiontype";
import { QuestionStatus } from "../conduct/question_status.enum";

export interface TestConduct {
  id: number;
  questionId: number;
  questionType: QuestionType;
  questionStatus: QuestionStatus;
}
