import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'pl-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  spinnerStyle = Spinkit;
  users: User[] = [];
  surnameForm: FormGroup;
  emailForm: FormGroup;
  surnameFilter: string;
  filteredUsers: User[] = [];
  loading: boolean;
  selectedUser: User;
  disableButtons: Boolean;
  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { };

  selectMessage(message: string) {
    switch (message) {
      case "invalidEmail":
        this.primaryMessage = "";
        this.dangerMessage = "Email Invalid";
        this.successMessage = "";
        break;
      case "emailSaveError":
        this.primaryMessage = "";
        this.dangerMessage = "Error saving email";
        this.successMessage = "";
        break;
      case "saveEmailSuccess":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Email saved";
        break;
      case "savingMessage":
        this.primaryMessage = "Saving...";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      case "unlockSaveError":
        this.primaryMessage = "";
        this.dangerMessage = "Error unlocking user";
        this.successMessage = "";
        break;
      case "unlockSuccess":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "User unlocked";
        break;
      case "savingMessage":
        this.primaryMessage = "Saving...";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      default:
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "";
        console.log("No Message");
        break;
    }
  }

  private validationMessage: { [K in string]: { [K in string]: string } } = {
    email: {
      required: 'Please enter an email address.',
      email: 'Please enter a valid email address',
    }
  };

  ngOnInit() {
    this.createSurnameForm();
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.users = this.users.filter((user) =>
          user.isAdmin === false);
        this.filteredUsers = this.users;
        this.loading = false;
      }
    });
  }

  createEmailForm() {
    this.emailForm = this.fb.group({
      email: [this.selectedUser?.email ?? '', [Validators.required, Validators.email]]
    });
  }
  createSurnameForm() {
    this.surnameForm = this.fb.group({
      surname: ['']
    });
  }

  isInvalid(c: AbstractControl): boolean {
    return (c.touched || c.dirty) && c.errors != null;
  }

  getErrorMessage(controlName: string, c: AbstractControl): string | void {
    if (!this.isInvalid(c)) return undefined;
    const failedValidationTypes = Object.keys(c.errors ?? {});
    if (failedValidationTypes.length === 0) return undefined;
    return this.validationMessage[controlName]?.[failedValidationTypes[0]] ?? `Validation ${failedValidationTypes[0]} failed`;
  }

  unlockAccount(user: User) {
    this.selectMessage("");
    this.loading = true;
    this.selectMessage("savingMessage");
    user.isLocked = false;
    this.userService.editUser(user).subscribe({
      next: () => {
        this.loading = false;
        this.selectMessage("unlockSuccess");
      },
      error: (err) => {
        console.log(err);
        this.selectMessage("unlockSaveError");
        this.loading = false;
      }
    });
  }

  clearMessages() {
    this.selectMessage("");
  }

  setSelectedUser(user: User) {
    this.selectMessage("");
    this.selectedUser = user;
    this.createEmailForm();
  }

  changeEmail() {
    this.disableButtons = true;
    this.selectMessage("savingMessage");
    if (this.emailForm.status === 'VALID') {
      this.selectedUser.email = this.emailForm.get('email').value?.trim();
      this.userService.editUser(this.selectedUser).subscribe({
        next: () => {
          this.selectMessage("saveEmailSuccess");
          this.disableButtons = false;
        },
        error: (err) => {
          console.log(err);
          this.selectMessage("emailSaveError");
          this.disableButtons = false;
        }
      });
    } else {
      this.selectMessage("invalidEmail");
      this.disableButtons = false;
    }
    this.emailForm.markAllAsTouched();
  }

  search() {
    this.surnameFilter = this.surnameForm.get('surname').value?.trim();
    this.filteredUsers = this.users.filter((user) =>
      user.surname.includes(this.surnameFilter));
  }
}