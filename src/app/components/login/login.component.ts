import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  user: User;
  users: [];
  foo: string

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
    this.createForm();
    // this.tryLogin();
  }

  tryLogin() {
    this.userService.getUsers().subscribe({
      next: users => {
        users = users;
        console.log('All Users', users);

        let correctUser = 0;
        while (correctUser === 0) {
          for (const user of users) {

            const enteredEmail = this.loginForm.get('email').value;
            const enteredPassword = this.loginForm.get('password').value;

            if (user.email === enteredEmail) {
              console.log(`Email Matches`);
              if (user.password === enteredPassword) {
                console.log(`User Matches`);
                correctUser = 1;
                // authenticate(user);
                // TODO set user as authenticated
              } else {
                const correctPassword = false
                // console.log(`Incorrect Password`)
              }
            } else {
              const correctEmail = false
              // console.log(`Email not found`)
            }
            console.log(user.email);
            console.log(user.password);
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

    this.tryLogin();

    // console.log(`Selected User Password: ${this.foo}`);
    // console.log(`password ${this.loginForm.get('password')?.value}`);
    // console.log(`email ${this.loginForm.get('email')?.value}`);

    // if (this.foo === this.loginForm.get('password')?.value) {
    //   console.log(`Passwords Match!`)
    // } else {
    //   console.log(`Passwords do not Match`)
    // }
  }
}