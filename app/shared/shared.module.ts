import { NgModule } from "@angular/core";
import { SharedComponentsModule } from "./shared-components.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTableModule } from "@angular/material/table";
import { MatMenu } from "@angular/material/menu";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgChartsModule } from "ng2-charts";
//import { PopoverModule } from "ngx-popover";
import { ClipboardModule } from "ngx-clipboard";
import { SelectTextAreaDirective } from "../tests/directive";
import { CommonModule } from "@angular/common";

@NgModule({
  imports: [
    SharedComponentsModule,
    BrowserAnimationsModule,
    RouterModule,
    MatExpansionModule,
    MatTableModule,
    MatMenu,
    CKEditorModule,
    NgChartsModule,
    ClipboardModule,
    CommonModule,
  ],
  declarations: [SelectTextAreaDirective],
  exports: [
    SharedComponentsModule,
    MatExpansionModule,
    MatTableModule,
    MatMenu,
    CKEditorModule,
    NgChartsModule,
    ClipboardModule,
    SelectTextAreaDirective,
  ],
})
export class SharedModule {}
