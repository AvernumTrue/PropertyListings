import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-manage-my-account',
  templateUrl: './manage-my-account.component.html',
  styleUrls: ['./manage-my-account.component.css']
})

export class ManageMyAccountComponent implements OnInit {

  spinnerStyle = Spinkit;
  accountForm!: FormGroup;
  user: User;
  saveErrorMessage: string;
  displayMessage: string;
  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;
  disableButtons = false;
  userId: number;
  loading: boolean;
  changingPassword: boolean;

  private validationMessage: { [K in string]: { [K in string]: string } } = {
    forenames: {
      required: 'Please enter a forename or forenames.',
      maxlength: 'Forename cannot exceed 100 characters.',
      pattern: 'Forename must include a letter.',
    },
    surname: {
      required: 'Please enter a surname.',
      minlength: 'Surname must be at least 3 characters.',
      maxlength: 'Surname cannot exceed 100 characters.',
      pattern: 'Surname must be at least 3 letters.',
    },
    email: {
      required: 'Please enter an email address.',
      minlength: 'Email address must be at least 6 characters.',
      maxlength: 'Email address cannot exceed 100 characters.',
      email: 'Please enter a valid email address',
    },
    newPassword: {
      required: 'Please enter a new password.',
      pattern: 'Password cannot contain spaces.',
      minlength: 'Password must be at least 8 characters.',
      maxlength: 'Password cannot exceed 100 characters.',
    },
    confirmPassword: {
      required: 'Please re-enter the new password.',
      pattern: 'Password cannot contain spaces.',
      minlength: 'Password must be at least 8 characters.',
      maxlength: 'Password cannot exceed 100 characters.',
      valueMatches: 'Passwords do not match.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.createForm();
    this.userService.getUser(Number(localStorage.getItem('loggedInId'))).subscribe({
      next: user => {
        this.user = user;
        this.createForm();
        this.loading = false;
      }
    })
  }

  selectMessage(message: string) {
    switch (message) {
      case "invalidMessage":
        this.primaryMessage = "";
        this.dangerMessage = "Please ensure all fields are valid.";
        this.successMessage = "";
        break;
      case "saveErrorMessage":
        this.primaryMessage = "";
        this.dangerMessage = "There was an error saving the details.";
        this.successMessage = "";
        break;
      case "saveSuccessMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Details updated, navigating to My Adverts page...";
        break;
      case "savingMessage":
        this.primaryMessage = "Updating Details...";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      case "incorrectOldPasswordMessage":
        this.primaryMessage = "";
        this.dangerMessage = "Old Password is incorrect";
        this.successMessage = "";
        break;
      default:
        console.log("No Message");
        break;
    }
  }

  createForm(): void {

    this.accountForm = this.fb.group({
      forenames: [this.user?.forenames ?? '', [Validators.required, Validators.maxLength(100), Validators.pattern(/(^[\s\S]*[A-Za-z]{1,100}[\s\S]*$)/)]],
      surname: [this.user?.surname ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/(^[\s\S]*[A-Za-z]{3,100}[\s\S]*$)/)]],
      email: [this.user?.email ?? '', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.email]],
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: [''],
      id: 0
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

  finaliseUser() {
    this.user.forenames = this.accountForm.get('forenames')?.value.trim();
    this.user.surname = this.accountForm.get('surname')?.value.trim();
    this.user.email = this.accountForm.get('email')?.value.trim();
    if (this.changingPassword) {
      this.user.password = this.accountForm.get('newPassword')?.value.trim();
    }
    this.user.isAdmin = false;
  }

  submit() {
    this.accountForm.markAllAsTouched();

    if (this.accountForm.get('oldPassword') || this.accountForm.get('newPassword') || this.accountForm.get('confirmPassword')) {
      this.changingPassword = true;

      const valueMatches = (GetOtherValue: () => string): ValidatorFn => {
        return (c) => {
          if (c.value !== GetOtherValue()) return { valueMatches: true };
          return null;
        };
      };
      const getPassword = (): string => String(this.accountForm?.get('newPassword')?.value);

      this.accountForm.controls['newPassword'].setValidators([Validators.required, Validators.pattern(/^\S*$/i), Validators.minLength(8), Validators.maxLength(100)]);
      this.accountForm.controls['confirmPassword'].setValidators([Validators.required, Validators.pattern(/^\S*$/i), Validators.minLength(8), Validators.maxLength(100), valueMatches(getPassword)]);
      this.accountForm.controls['newPassword'].updateValueAndValidity();
      this.accountForm.controls['confirmPassword'].updateValueAndValidity();

      if (this.user.password === this.accountForm.get('oldPassword')?.value.trim()) {
        if (this.accountForm.status === 'VALID') {
          this.disableButtons = true;
          this.selectMessage("savingMessage");
          this.editUser();
        } else {
          this.disableButtons = false;
          this.selectMessage("invalidMessage");
        }

      } else {
        this.selectMessage("incorrectOldPasswordMessage");
      }

    } else {
      this.changingPassword = false;
      this.accountForm.controls['newPassword'].clearValidators();
      this.accountForm.controls['confirmPassword'].clearValidators();
      this.accountForm.controls['newPassword'].updateValueAndValidity();
      this.accountForm.controls['confirmPassword'].updateValueAndValidity();
      if (this.accountForm.status === 'VALID') {
        this.disableButtons = true;
        this.selectMessage("savingMessage");
        this.editUser();
      } else {
        this.disableButtons = false;
        this.selectMessage("invalidMessage");
      }
    }
  }

  editUser() {
    this.finaliseUser();
    this.userService.editUser(this.user).subscribe({
      next: () => {
        this.onSaveComplete();
      },
      error: () => {
        this.disableButtons = false;
        this.selectMessage("saveErrorMessage");
      }
    });
  }

  async onSaveComplete(): Promise<void> {
    this.selectMessage("saveSuccessMessage");
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.accountForm.reset();
    this.router.navigate(['/my-adverts']);
  }
}
