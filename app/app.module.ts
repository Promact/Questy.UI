import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { appRouting } from "./app.routing";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/shared.module";
import { CoreModule } from "./core/core.module";
import { QuestionsModule } from "./questions/questions.module";
import { TestsModule } from "./tests/tests.module";
import { ProfileModule } from "./profile/profile.module";
import { ReportsModule } from "./reports/reports.module";
import { MatMenu } from "@angular/material/menu";

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    appRouting,
    SharedModule,
    CoreModule,
    QuestionsModule,
    TestsModule,
    ProfileModule,
    ReportsModule,
    MatMenu,
  ],
  providers: [],
  declarations: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
