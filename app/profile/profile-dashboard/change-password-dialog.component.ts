import { Component } from "@angular/core";
import { ChangePasswordModel } from "../password.model";
import { MatDialogRef } from "@angular/material/dialog";
import { ProfileService } from "../profile.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  moduleId: module.id,
  selector: "change-password-dialog",
  templateUrl: "change-password-dialog.html",
})
export class ChangePasswordDialogComponent {
  constructor(
    private readonly profileService: ProfileService,
    private readonly dialog: MatDialogRef<unknown>,
    private readonly snackBar: MatSnackBar
  ) {}
  user: ChangePasswordModel = {} as ChangePasswordModel;
  isPasswordSame = true;
  response!: HttpErrorResponse;
  errorMesseage!: string;
  errorCorrection = true;
  loader!: boolean;

  /**
   * update the database with new password
   * @param userPassword: Object of type ChangePasswordModel which has the new password of the user
   */
  changePassword(userPassword: ChangePasswordModel) {
    this.loader = true;
    if (userPassword.newPassword === userPassword.confirmPassword) {
      this.isPasswordSame = true;
      this.profileService.updateUserPassword(userPassword).subscribe({
        next: () => {
          this.loader = false;
          this.dialog.close();
          this.snackBar.open("Your password has been changed.", "Dismiss", {
            duration: 3000,
          });
        },
        error: (err: HttpErrorResponse) => {
          this.loader = false;
          this.errorCorrection = true;
          this.response = err;
          this.errorMesseage = this.response["error"] as string;
        },
      });
    } else {
      this.loader = false;
      this.isPasswordSame = false;
    }
  }

  /**
   * Sets the conditions for checking and showing error message if changed password and confirm password are not same
   */
  changeCurrentPassword() {
    this.isPasswordSame = true;
    this.errorCorrection = false;
  }
}
