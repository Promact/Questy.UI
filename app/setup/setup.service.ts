import { Injectable } from "@angular/core";
import { HttpService } from "../core/http.service";
import {
  BasicSetup,
  ConnectionString,
  EmailSettings,
  ServiceResponse,
} from "./setup.model";

@Injectable()
export class SetupService {
  private connectionStringUrl = "api/setup/connectionstring";
  private emailSettingsUrl = "api/setup/mailsettings";
  private createUserUrl = "api/setup/createuser";

  constructor(private httpService: HttpService) {}

  /**
   * This method used for validating connection string
   * @param model
   */
  validateConnectionString(model: ConnectionString) {
    return this.httpService.post(this.connectionStringUrl, model);
  }

  /**
   * This method used for verifying email Settings
   * @param model
   */
  validateEmailSettings(model: EmailSettings) {
    return this.httpService.post(this.emailSettingsUrl, model);
  }

  /**
   * This method used for Creating user
   * @param model
   */
  createUser(model: BasicSetup) {
    return this.httpService.post<ServiceResponse>(this.createUserUrl, model);
  }
}
