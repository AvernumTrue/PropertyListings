import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';

@Component({
  selector: 'pl-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  user!: User;
  users!: User[];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // TODO : registerForm : validation
      forename: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],// TODO : registerForm : check for @ sign
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });
  }

  submit() {
    console.log("submit clicked");
    this.user.forenames = this.registerForm.get('forenames')?.value;
    console.log(this.user.forenames);
    console.log(this.registerForm);
  }

  login() {
    console.log("login clicked");
  }
}

// Information to capture:
// - Forenames string: required: min 1 chars, max 100 chars: Forenames of the user.
// - Surname string: required: min 3 chars, max 100 chars: Surname of the user.
// - Email Address string: required: min 6 chars, max 100 chars: Check for @ sign.
// - Password string: required: min 8 chars, max 100 chars: No special characters needed
// - Password Confirm: string: should match the first password.
// Actions:
// - Register: Validate the fields and submit the form object to the API.
// - Login: A link to the login page should also be available
// On success, redirect ‘My Adverts Page’.