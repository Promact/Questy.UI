import { Component } from "@angular/core";
import { TestAttendees } from "./register.model";
import { ConductService } from "../conduct.service";
import { Router } from "@angular/router";
import { ConnectionService } from "../../core/connection.service";
import { SessionData } from "../session.model";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "register",
  templateUrl: "register.html",
})
export class RegisterComponent {
  loader: boolean;
  isErrorMessage: boolean | undefined;
  testAttendees: TestAttendees = {} as TestAttendees;

  constructor(
    private conductService: ConductService,
    private router: Router,
    private connectionService: ConnectionService
  ) {
    this.loader = true;
    this.conductService.getSessionPath().subscribe({
      next: async (path: SessionData) => {
        if (path) await this.router.navigate([path.path], { replaceUrl: true });
        this.loader = false;
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        this.isErrorMessage = true;
      },
    });

    void this.connectionService.startConnection();
  }

  /**
   * This method used for register test attendee.
   */
  registerTestAttendee() {
    const registrationUrl = window.location.pathname;
    const magicString = registrationUrl.substring(
      registrationUrl.indexOf("/conduct/") + 9,
      registrationUrl.indexOf("/register")
    );
    this.conductService
      .registerTestAttendee(magicString, this.testAttendees)
      .subscribe({
        next: async (response) => {
          if (response) {
            await this.connectionService.registerAttendee(response.id);
            await this.connectionService.sendReport(response);
            this.isErrorMessage = false;
            this.loader = false;
            await this.router.navigate(["instructions"], { replaceUrl: true });
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.isErrorMessage = true;
            this.loader = false;
          }
        },
      });
  }
}
