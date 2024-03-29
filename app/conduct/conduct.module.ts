﻿import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CoreModule } from "../core/core.module";
import { conductRouting } from "./conduct.routing";
import { ConductComponent } from "./conduct.component";
import { RegisterComponent } from "./register/register.component";
import { InstructionsComponent } from "./instructions/instructions.component";
import { TestSummaryComponent } from "./test-summary/test-summary.component";
import { TestEndComponent } from "./test-end/test-end.component";
import { TestConductHeaderComponent } from "./shared/test-conduct-header/test-conduct-header.component";
import { TestConductFooterComponent } from "./shared/test-conduct-footer/test-conduct-footer.component";
import { ConductService } from "./conduct.service";
import { ReportService } from "../reports/report.service";
import { TestsProgrammingGuideDialogComponent } from "./test/tests-programming-guide-dialog.component";
import { TestService } from "../tests/tests.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedComponentsModule } from "../shared/shared-components.module";
import { ConnectionService } from "../core/connection.service";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  bootstrap: [ConductComponent],
  imports: [
    SharedComponentsModule,
    SharedModule,
    BrowserModule,
    conductRouting,
    CoreModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [ConductService, ReportService, TestService, ConnectionService],
  declarations: [
    ConductComponent,
    RegisterComponent,
    InstructionsComponent,
    TestSummaryComponent,
    TestEndComponent,
    TestConductHeaderComponent,
    TestConductFooterComponent,
    TestsProgrammingGuideDialogComponent,
  ],
  entryComponents: [TestsProgrammingGuideDialogComponent],
})
export class ConductModule {}
