import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.createForm();
    this.getAllUsers();
  }

  getAllUsers() {
    let user = new User();
    this.userService.getUsers().pipe(delay(2000)).subscribe({
      next: users => {
        users = users;
        console.log(users);

        for (const user of users) {
          console.log(user.email);
          console.log(user.password);
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
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],// TODO: esure passwords match
    });
  }

  submit() {
    console.log(`submit`);
    console.log(this.loginForm.get('password')?.value);
    console.log(this.loginForm.get('email')?.value);
  }

}
