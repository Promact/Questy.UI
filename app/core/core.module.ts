import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpService } from "./http.service";

@NgModule({
  imports: [HttpClientModule],
  declarations: [],
  exports: [],
  providers: [HttpService],
})
export class CoreModule {}
