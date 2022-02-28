import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  displayMessage: string;
  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;
  disableButtons = false;
  user: User;

  private validationMessage: { [K in string]: { [K in string]: string } } = {
    email: {
      required: 'Please enter an email address.',
      minlength: 'Email address must be at least 6 characters.',
      maxlength: 'Email address cannot exceed 100 characters.',
      pattern: 'Email address must include an @ symbol.',
    },
    password: {
      required: 'Please enter the password.',
      minlength: 'Password must be at least 8 characters.',
      maxlength: 'Password cannot exceed 100 characters.',
      valueMatches: 'Passwords do not match',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  selectMessage(message: string) {
    switch (message) {
      case "loggingInMessage":
        this.primaryMessage = "Logging in...";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      case "incorrectDetailsMessage":
        this.primaryMessage = "";
        this.dangerMessage = "Incorrect Password or Email Address";
        this.successMessage = "";
        break;
      case "LoginErrorMessage":
        this.primaryMessage = "";
        this.dangerMessage = "There was an error logging in.";
        this.successMessage = "";
        break;
      case "loginSuccessfulMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Login Successful. Navigating to My Adverts Page";
        break;
      case "AdminLoginSuccessfulMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Login Successful. Navigating to User Managment Page";
        break;
      default:
        console.log("Error no message found");
        break;
    }
  }

  tryLogin() {
    this.selectMessage("loggingInMessage");

    this.userService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).pipe(delay(2000)).subscribe({
      next: () => {
        this.userService.getUser(Number(localStorage.getItem('loggedInId'))).pipe(delay(2000)).subscribe({
          next: async user => {
            this.user = user;
            if (this.user.isAdmin === false) {
              this.selectMessage("loginSuccessfulMessage");
              await new Promise(resolve => setTimeout(resolve, 3000));
              this.router.navigate(['/my-adverts']);
            } else {
              this.selectMessage("AdminLoginSuccessfulMessage");
              await new Promise(resolve => setTimeout(resolve, 3000));
              this.router.navigate(['/user-management']);
            }
          }
        })

      },
      error: () => {
        this.disableButtons = false;
        this.selectMessage("incorrectDetailsMessage");
      },
    });
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
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

  submit() {
    this.disableButtons = true;
    if (this.loginForm.status === 'VALID') {
      this.tryLogin();
    } else {
      this.disableButtons = false;
      this.selectMessage("invalidMessage");
    }
    this.loginForm.markAllAsTouched();
  }
}