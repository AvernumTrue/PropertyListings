import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
      pattern: 'Surname must include a letter.',
    },
    email: {
      required: 'Please enter an email address.',
      minlength: 'Email address must be at least 6 characters.',
      maxlength: 'Email address cannot exceed 100 characters.',
      pattern: 'Email address must include an @ symbol.',
    },
    password: {
      required: 'Please enter a password.',
      minlength: 'Password must be at least 8 characters.',
      maxlength: 'Password cannot exceed 100 characters.',
    },
    confirmPassword: {
      required: 'Please reenter the password.',
      minlength: 'Password must be at least 8 characters.',
      maxlength: 'Password cannot exceed 100 characters.',
      valueMatches: 'Passwords do not match',
    },
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
    console.log(this.userId);
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
    const valueMatches = (GetOtherValue: () => string): ValidatorFn => {
      return (c) => {
        if (c.value !== GetOtherValue()) return { valueMatches: true };
        return null;
      };
    };

    const getPassword = (): string => String(this.registerForm?.get('password')?.value);

    this.registerForm = this.fb.group({
      // TODO : registerForm : validation
      forenames: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/[A-Z]/i)]], //TODO remove leading and trailing spaces
      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/[A-Z]/i)]],//TODO remove leading and trailing spaces
      email: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100), Validators.pattern(/[@]/i)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), valueMatches(getPassword)]],
      id: 0
    });
  }

  isInvalid(c: AbstractControl): boolean {
    return (c.touched || c.dirty) && c.errors != null;
  }

  getErrorMessage(controlName: string, c: AbstractControl): string | void {
    console.log(this.isInvalid(c))
    if (!this.isInvalid(c)) return undefined;
    const failedValidationTypes = Object.keys(c.errors ?? {});
    if (failedValidationTypes.length === 0) return undefined;
    return this.validationMessage[controlName]?.[failedValidationTypes[0]] ?? `Validation ${failedValidationTypes[0]} failed`;
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

