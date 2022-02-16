import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  user: User;
  users: [];

  displayInvalidMessage = false;
  incorrectDetailsMessage = false;
  loginSuccessfulMessage = false;

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
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUser(Number(localStorage.getItem('loggedInId'))).subscribe({
      next: loggedInUser => {
        loggedInUser = loggedInUser;
        console.log(loggedInUser)
      },
      error: err => {
        console.log(err);
      }
    });
    this.createForm();
  }

  tryLogin() {
    this.userService.getUsers().subscribe({
      next: users => {
        users = users;
        for (const user of users) {
          const enteredEmail = this.loginForm.get('email').value;
          const enteredPassword = this.loginForm.get('password').value;
          if (user.email === enteredEmail && user.password === enteredPassword) {
            this.incorrectDetailsMessage = false;
            this.loginSuccessfulMessage = true;
            // TODO find way to stop for loop if the correct user is found. Currently the else statment will always run and set this.incorrectDetailsMessage = true
            localStorage.setItem('loggedInId', JSON.stringify(user.id));
          } else {
            this.incorrectDetailsMessage = true;
          }
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.pattern(/[@]/i)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100),]],
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
    if (this.loginForm.status === 'VALID') {
      this.displayInvalidMessage = false;
      this.tryLogin();
    } else {
      this.displayInvalidMessage = true;
    }
    this.loginForm.markAllAsTouched();
  }
}