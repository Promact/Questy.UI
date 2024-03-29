﻿import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TestsComponent } from "./tests.component";
import { TestsDashboardComponent } from "./tests-dashboard/tests-dashboard.component";
import { TestSettingsComponent } from "./test-settings/test-settings.component";
import { TestSectionsComponent } from "./test-sections/test-sections.component";
import { TestQuestionsComponent } from "./test-questions/test-questions.component";
import { TestViewComponent } from "./test-view/test-view.component";
import { TestPreviewComponent } from "./test-preview/test-preview.compponent";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";

const testsRoutes: Routes = [
  {
    path: "tests",
    component: TestsComponent,
    children: [
      { path: "", component: TestsDashboardComponent },
      { path: ":id/settings", component: TestSettingsComponent },
      { path: ":id/sections", component: TestSectionsComponent },
      { path: ":id/questions", component: TestQuestionsComponent },
      { path: ":id/view", component: TestViewComponent },
      { path: ":link/preview", component: TestPreviewComponent },
      { path: "**", redirectTo: "/404" },
      { path: "404", component: PageNotFoundComponent },
    ],
  },
];

export const testsRouting: ModuleWithProviders<RouterModule> =
  RouterModule.forChild(testsRoutes);
