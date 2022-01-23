import { NgModule } from "@angular/core";
import { SharedComponentsModule } from "./shared-components.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { NgChartsModule } from "ng2-charts";
//import { PopoverModule } from "ngx-popover";
import { ClipboardModule } from "ngx-clipboard";
import { SelectTextAreaDirective } from "../tests/directive";
import { CommonModule } from "@angular/common";
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
@NgModule({
  imports: [
    SharedComponentsModule,
    BrowserAnimationsModule,
    RouterModule,
    MatExpansionModule,
    MatTableModule,
    MatMenuModule,
    MatChipsModule,
    MatAutocompleteModule,
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
    MatMenuModule,
    MatChipsModule,
    MatAutocompleteModule,
    CKEditorModule,
    NgChartsModule,
    ClipboardModule,
    SelectTextAreaDirective,
  ],
})
export class SharedModule {}
