export interface ConnectionString {
  value: string;
}

export interface EmailSettings {
  server: string;
  port: number;
  userName: string;
  password: string;
  connectionSecurityOption: string;
}

export interface RegistrationFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface BasicSetup {
  connectionString: ConnectionString;
  registrationFields: RegistrationFields;
  emailSettings: EmailSettings;
}

export interface ServiceResponse {
  isSuccess: boolean;
  exceptionMessage: string;
}
