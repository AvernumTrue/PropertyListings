import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'pl-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  user: User;
  saveErrorMessage: string;
  displayMessage: string;
  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;
  disableButtons = false;
  userId: number;

  get isEditing() {
    return this.userId != 0;
  }

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
    password: {
      required: 'Please enter a password.',
      pattern: 'Password cannot contain spaces.',
      minlength: 'Password must be at least 8 characters.',
      maxlength: 'Password cannot exceed 100 characters.',
    },
    confirmPassword: {
      required: 'Please re-enter the password.',
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
    if (this.userService.getLocalStorage()) {
      this.router.navigate(['/my-adverts']);
    }
    this.createForm();
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
        this.successMessage = "Successfully registered, navigating to My Adverts page...";
        break;
      case "savingMessage":
        this.primaryMessage = "Registering...";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      default:
        console.log("No Message");
        break;
    }
  }

  createForm(): void {
    const valueMatches = (GetOtherValue: () => string): ValidatorFn => {
      return (c) => {
        if (c.value !== GetOtherValue()) return { valueMatches: true };
        return null;
      };
    };

    const getPassword = (): string => String(this.registerForm?.get('password')?.value);

    this.registerForm = this.fb.group({
      forenames: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/(^[\s\S]*[A-Za-z]{1,100}[\s\S]*$)/)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/(^[\s\S]*[A-Za-z]{3,100}[\s\S]*$)/)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^\S*$/i), Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required, Validators.pattern(/^\S*$/i), Validators.minLength(8), Validators.maxLength(100), valueMatches(getPassword)]],
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
    const user = new User();
    user.id = this.userId;
    user.forenames = this.registerForm.get('forenames')?.value.trim();
    user.surname = this.registerForm.get('surname')?.value.trim();
    user.email = this.registerForm.get('email')?.value.trim();
    user.password = this.registerForm.get('password')?.value.trim();
    user.isAdmin = false;
    this.user = user;
  }

  submit() {
    this.disableButtons = true;
    if (this.registerForm.status === 'VALID') {
      this.selectMessage("savingMessage");
      this.addUser();
    } else {
      this.disableButtons = false;
      this.selectMessage("invalidMessage");
    }
    this.registerForm.markAllAsTouched();
  }

  addUser() {
    this.finaliseUser();
    this.userService.addUser(this.user).subscribe({
      next: user => {
        this.userService.setLocalStorage(user);
        this.userService.login(this.registerForm.get('email').value, this.registerForm.get('password').value).subscribe({
          next: () => {
          }
        });
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
    this.registerForm.reset();
    this.router.navigate(['/my-adverts']);
  }
}