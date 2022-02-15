import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  user!: User;
  errorMessage: string;

  isLoading = true;
  displayInvalidMessage = false;
  getUserErrorMessage = false;
  saveErrorMessage = false;
  saveSuccessMessage = false;
  savingMessage = false;

  // TODO make validation message for each validation error
  private validationMessage: { [K in string]: string } = {
    // required: 'Please fill in this field.'
    pattern: 'Must contain @',

  };

  userId: number;
  get isEditing() {
    return this.userId != 0;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) {
    this.userId = Number(route.snapshot.paramMap.get('userIndex'));
    console.log(this.userId)
  }

  ngOnInit(): void {
    if (this.userId !== 0) {
      this.userService.getUser(this.userId).pipe(delay(2000)).subscribe({
        next: user => {
          this.isLoading = false
          this.user = user;
          this.createForm();
        }, error: err => {
          this.getUserErrorMessage = true;
          this.isLoading = false;
          console.log(err);
        }
      });
    } else {
      this.createForm();
    }
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      // TODO : registerForm : validation
      forenames: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), Validators.pattern(/[A-Z]/i)]],
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[A-Z]/i)]],
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.pattern(/[@]/i)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],// TODO: esure passwords match
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      id: 0
    });
  }

  isInvalid(c: AbstractControl): boolean {
    return (c.touched || c.dirty) && c.errors != null;
  }

  getErrorMessage(c: AbstractControl): string | void {
    if (!this.isInvalid(c)) return undefined;
    return Object.keys(c.errors ?? {}).map(key => {
      if (key in this.validationMessage) return this.validationMessage[key];
      return `Validation ${key} failed`;
    }).join(' ');
  }

  finaliseUser() {
    this.displayInvalidMessage = false;
    const user = new User();
    user.id = this.userId;
    user.forenames = this.registerForm.get('forenames')?.value;
    user.surname = this.registerForm.get('surname')?.value;
    user.email = this.registerForm.get('email')?.value;
    user.password = this.registerForm.get('password')?.value;
    user.isAdmin = false;

    if (this.userId != null) {
      this.userId = this.userId;
    } else {
      this.userId = 0;
    }
    this.user = user;
  }

  submit() {
    this.isLoading = true;
    if (this.registerForm.status === 'VALID') {
      this.savingMessage = true;
      if (this.isEditing) {
        this.saveEdit();
      }
      if (!this.isEditing) {
        this.addUser();
      }
    } else {
      this.displayInvalidMessage = true;
    }
    this.registerForm.markAllAsTouched();
  }

  saveEdit() {
    this.finaliseUser();
    this.userService.editUser(this.user).pipe(delay(2000)).subscribe({
      next: () => {
        this.onSaveComplete();
      },
      error: err => {
        this.isLoading = false;
        this.saveErrorMessage = true;
        this.savingMessage = false;
        console.log(err);
        this.errorMessage = (`There was an error saving your changes.`);
      }
    });
  }

  addUser() {
    this.finaliseUser();
    this.userService.addUser(this.user).pipe(delay(2000)).subscribe({
      next: () => {
        this.onSaveComplete();
      },
      error: err => {
        this.isLoading = false;
        this.saveErrorMessage = true;
        this.savingMessage = false;
        console.log(`There was an error registering your details`);
      }
    });
  }

  login() {
    console.log("login clicked");
  }

  async onSaveComplete(): Promise<void> {
    this.savingMessage = false;
    this.saveSuccessMessage = true;
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.isLoading = false;
    this.registerForm.reset();
    this.router.navigate(['/my-adverts']);
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

