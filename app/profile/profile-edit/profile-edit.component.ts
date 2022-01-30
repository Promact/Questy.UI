import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ApplicationUser } from "../profile.model";
import { ProfileService } from "../profile.service";

@Component({
  moduleId: module.id,
  selector: "profile-edit",
  templateUrl: "profile-edit.html",
})
export class ProfileEditComponent implements OnInit {
  editUser: ApplicationUser = {} as ApplicationUser;
  nameLength = false;
  loader!: boolean;
  constructor(
    private readonly profileService: ProfileService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUserDetails();
  }

  /**
   * Get details of the user and display them in the profile edit page so that the user can edit them
   */
  getUserDetails() {
    this.profileService.getUserDetails().subscribe((response) => {
      this.editUser = response;
    });
  }

  /**
   * Update the details of a user
   */
  updateUserDetails() {
    this.loader = true;
    this.profileService.updateUserDetails(this.editUser).subscribe({
      next: async () => {
        this.loader = false;
        // Open Snackbar
        this.snackBar.open("Saved changes successfully.", "Dismiss", {
          duration: 3000,
        });
        await this.router.navigate(["/profile"]);
      },
    });
  }
}
