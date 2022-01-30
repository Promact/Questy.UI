import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ApplicationUser } from "../profile.model";
import { ProfileService } from "../profile.service";
import { ChangePasswordDialogComponent } from "./change-password-dialog.component";

@Component({
  moduleId: module.id,
  selector: "profile-dashboard",
  templateUrl: "profile-dashboard.html",
})
export class ProfileDashboardComponent implements OnInit {
  user: ApplicationUser = {} as ApplicationUser;
  loader: boolean;
  ngOnInit() {
    this.getUserDetails();
  }
  constructor(
    private readonly profileService: ProfileService,
    private readonly dialog: MatDialog
  ) {
    this.loader = true;
  }

  /**
   * Get details of the user
   */
  getUserDetails() {
    this.profileService.getUserDetails().subscribe((response) => {
      this.user = response;
      this.loader = false;
    });
  }

  /**
   * Open Change Password Dialog
   */
  changePasswordDialog() {
    this.dialog.open(ChangePasswordDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
    });
  }
}
