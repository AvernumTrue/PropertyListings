import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'pl-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  // users!: User[];
  user!: User;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      // TODO : registerForm : validation
      forenames: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],// TODO : check for @ sign
      password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],// TODO: esure passwords match
      confirmPassword: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      id: 0
    });
  }

  isInvalid(c: AbstractControl): boolean {
    return (c.touched || c.dirty) && c.errors != null;
  }

  submit() {
    const user = new User();
    user.forenames = this.registerForm.get('forenames')?.value;
    user.surname = this.registerForm.get('surname')?.value;
    user.email = this.registerForm.get('email')?.value;
    user.password = this.registerForm.get('password')?.value;
    user.userId = 0;
    this.user = user;
    this.userService.addUser(this.user).subscribe({
      next: () => {
        console.log
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  login() {
    console.log("login clicked");
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.registerForm.reset();
    this.router.navigate(['/products']);
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