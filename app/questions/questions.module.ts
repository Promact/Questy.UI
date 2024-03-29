﻿import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { questionsRouting } from "./questions.routing";
import { QuestionsComponent } from "./questions.component";
import { UpdateCategoryDialogComponent } from "./questions-dashboard/update-category-dialog.component";
import { QuestionsDashboardComponent } from "./questions-dashboard/questions-dashboard.component";
import { AddCategoryDialogComponent } from "./questions-dashboard/add-category-dialog.component";
import { DeleteCategoryDialogComponent } from "./questions-dashboard/delete-category-dialog.component";
import { DeleteQuestionDialogComponent } from "./questions-dashboard/delete-question-dialog.component";
import { SingleMultipleAnswerQuestionComponent } from "./questions-single-multiple-answer/questions-single-multiple-answer.component";
import { QuestionsProgrammingComponent } from "./questions-programming/questions-programming.component";
import { QuestionsService } from "./questions.service";
import { CategoryService } from "./categories.service";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { EditorModule } from "@tinymce/tinymce-angular";
import { MockRouteService } from "./questions-single-multiple-answer/mock-route.service";

@NgModule({
  imports: [
    SharedModule,
    questionsRouting,
    InfiniteScrollModule,
    EditorModule,
    // EditorModule.withConfig({
    //   entity_encoding: "raw",
    //   element_format: "html",
    //   forced_root_block: "",
    //   browser_spellcheck: true,
    // }),
  ],
  declarations: [
    QuestionsComponent,
    QuestionsDashboardComponent,
    AddCategoryDialogComponent,
    SingleMultipleAnswerQuestionComponent,
    UpdateCategoryDialogComponent,
    QuestionsProgrammingComponent,
    DeleteCategoryDialogComponent,
    DeleteQuestionDialogComponent,
  ],
  entryComponents: [
    AddCategoryDialogComponent,
    DeleteCategoryDialogComponent,
    DeleteQuestionDialogComponent,
    UpdateCategoryDialogComponent,
  ],
  providers: [QuestionsService, CategoryService, MockRouteService],
})
export class QuestionsModule {}
