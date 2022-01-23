import { Injectable } from "@angular/core";
import { HttpService } from "../core/http.service";
import { Category } from "./category.model";

@Injectable()
export class CategoryService {
  private categoriesApiUrl = "api/category";
  constructor(private httpService: HttpService) {}

  /**
   *API to get all the categories
   */
  getAllCategories() {
    return this.httpService.get<Category[]>(this.categoriesApiUrl);
  }

  /**
   *API to add Category
   * @param category: Object of type Category
   */
  addCategory(category: Category) {
    return this.httpService.post<Category>(this.categoriesApiUrl, category);
  }

  /**
   * API to update Category
   * @param id: Id of the category that will be updated
   * @param category: Object of type Category
   */
  updateCategory(id: number, category: Category) {
    return this.httpService.put(`${this.categoriesApiUrl}/${id}`, category);
  }

  /**
   * API to delete Category
   * @param categoryId: Id of the category
   */
  deleteCategory(id: number) {
    return this.httpService.delete<Category>(`${this.categoriesApiUrl}/${id}`);
  }
}
