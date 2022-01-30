import { Category } from "../questions/category.model";

export interface TestDetails {
  id: number;
  testName: string;
  categoryAcList: Category[];
}
