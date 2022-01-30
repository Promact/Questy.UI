import { Component } from "@angular/core";
import { ConnectionString } from "./setup.model";
import { SetupService } from "./setup.service";
import { EmailSettings } from "./setup.model";
import { BasicSetup } from "./setup.model";
import { RegistrationFields } from "./setup.model";
import { ServiceResponse } from "./setup.model";
import { WizardComponent } from "@ever-co/angular2-wizard";
@Component({
  selector: "setup",
  templateUrl: "setup.html",
})
export class SetupComponent {
  basicSetup: BasicSetup = {} as BasicSetup;
  emailSettings: EmailSettings = {} as EmailSettings;
  connectionString: ConnectionString = {} as ConnectionString;
  registrationFields: RegistrationFields = {} as RegistrationFields;
  confirmPasswordValid!: boolean;
  stepOneErrorMessage = false;
  stepTwoErrorMessage = false;
  stepThreeErrorMessage = false;
  loader!: boolean;
  exceptionMessage!: string;

  constructor(private setupService: SetupService) {
    this.emailSettings.connectionSecurityOption = "None";
  }

  /**
   * This method used for validating connection string.
   * @param setup: Takes the connection string value
   */
  validateConnectionString(setup: WizardComponent) {
    this.loader = true;
    this.setupService
      .validateConnectionString(this.connectionString)
      .subscribe({
        next: (response) => {
          if (response === true) setup.next();
          else this.stepOneErrorMessage = true;
          this.loader = false;
        },
        error: () => {
          this.stepOneErrorMessage = true;
          this.loader = false;
        },
      });
  }

  /**
   * This method used for verifying email Settings
   * @param setup: Takes all the field's values of emailsetting form
   */
  validateEmailSettings(setup: WizardComponent) {
    this.loader = true;
    this.setupService.validateEmailSettings(this.emailSettings).subscribe({
      next: (response) => {
        if (response === true) setup.next();
        else this.stepTwoErrorMessage = true;
        this.loader = false;
      },
      error: () => {
        this.stepTwoErrorMessage = true;
        this.loader = false;
      },
    });
  }

  /**
   * This method used for validating Password and Confirm Password matched or not.
   */
  isValidPassword() {
    this.confirmPasswordValid =
      this.registrationFields.confirmPassword ===
      this.registrationFields.password;
  }

  /**
   * This method used for Creating user
   * @param setup: Takes all the field's values of createuser form
   */
  createUser(setup: WizardComponent) {
    this.loader = true;
    this.basicSetup.emailSettings = this.emailSettings;
    this.basicSetup.connectionString = this.connectionString;
    this.basicSetup.registrationFields = this.registrationFields;
    this.setupService.createUser(this.basicSetup).subscribe({
      next: (serviceResponse: ServiceResponse) => {
        if (serviceResponse.isSuccess === true) {
          setup.complete();
          this.navigateToLogin();
        } else {
          this.stepThreeErrorMessage = true;
          this.exceptionMessage = serviceResponse.exceptionMessage;
        }
        this.loader = false;
      },
      error: () => {
        this.stepThreeErrorMessage = true;
        this.loader = false;
      },
    });
  }

  /**
   * Navigate to login page
   */
  navigateToLogin() {
    window.location.href = "/login";
  }

  previousStep1(setup: WizardComponent) {
    this.stepOneErrorMessage = false;
    this.stepTwoErrorMessage = false;
    setup.previous();
  }

  previousStep2(setup: WizardComponent) {
    this.stepTwoErrorMessage = false;
    this.stepThreeErrorMessage = false;
    setup.previous();
  }
}
