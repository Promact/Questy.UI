import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpService } from "./http.service";

@NgModule({
  imports: [HttpClientModule],
  declarations: [],
  exports: [HttpClientModule],
  providers: [HttpService],
})
export class CoreModule {}
