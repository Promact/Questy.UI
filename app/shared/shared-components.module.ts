import { NgModule } from "@angular/core";
import { TestComponent } from "../conduct/test/test.component";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { AceEditorModule } from "ngx-ace-editor-wrapper";
import { ConnectionService } from "../core/connection.service";
import { TestsProgrammingGuideDialogComponent } from "app/conduct/test/tests-programming-guide-dialog.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AceEditorModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatRadioModule,
  ],
  providers: [ConnectionService],
  declarations: [
    TestComponent,
    TestsProgrammingGuideDialogComponent,
    PageNotFoundComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    AceEditorModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatRadioModule,
    TestComponent,
    PageNotFoundComponent,
  ],
})
export class SharedComponentsModule {}
