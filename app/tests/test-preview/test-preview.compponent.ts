import { Component, ViewChild } from "@angular/core";
import { TestComponent } from "../../conduct/test/test.component";
import { ActivatedRoute } from "@angular/router";
import { TestService } from "../tests.service";

@Component({
  moduleId: module.id,
  selector: "test-preview",
  templateUrl: "test-preview.html",
})
export class TestPreviewComponent {
  @ViewChild(TestComponent)
  testPreview!: TestComponent;
  testLink: string;

  constructor(private route: ActivatedRoute, private testService: TestService) {
    this.testService.isTestPreviewIsCalled.next(true);
    this.testLink = this.route.snapshot.params["link"] as string;
  }
}
