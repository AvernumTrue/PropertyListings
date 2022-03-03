import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.css']
})
export class SellerProfileComponent implements OnInit {

  spinnerStyle = Spinkit;
  sellerProfileForm!: FormGroup;
  user: User;
  errorMessage: string;
  displayMessage: string;
  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;
  disableButtons = false;
  userId: number;
  loading: boolean;

  private validationMessage: { [K in string]: { [K in string]: string } } = {
    phoneNumber: {
      pattern: 'Phone Number must be at least 6 non-whitespace characters long.',
      minlength: 'Phone Number must be at least 6 characters.',
      maxlength: 'Phone Number cannot exceed 30 characters.',
    },
    email: {
      required: 'Please enter an email address.',
      minlength: 'Email address must be at least 6 characters.',
      maxlength: 'Email address cannot exceed 100 characters.',
      email: 'Please enter a valid email address',
    }
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
      default:
        console.log("No Message");
        break;
    }
  }

  createForm(): void {
    this.sellerProfileForm = this.fb.group({
      email: [this.user?.email ?? '', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.email]],
      phoneNumber: [this.user?.phoneNumber ?? '', [Validators.minLength(6), Validators.maxLength(30), Validators.pattern(/(\s*(?:\S\s*){6,30}$)/)]]
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
    this.user.email = this.sellerProfileForm.get('email')?.value;
    this.user.phoneNumber = this.sellerProfileForm.get('phoneNumber')?.value;
  }

  submit() {
    if (this.sellerProfileForm.status === 'VALID') {
      this.disableButtons = true;
      this.selectMessage("savingMessage");
      this.editUser();
    } else {
      this.disableButtons = false;
      this.selectMessage("invalidMessage");
      this.sellerProfileForm.markAllAsTouched();
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
    this.sellerProfileForm.reset();
    this.router.navigate(['/my-adverts']);
  }
}