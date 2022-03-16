import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup } from '@angular/forms';

const materialModules = [
  MatIconModule
];
@Component({
  selector: 'pl-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: User[] = [];
  surnameForm: FormGroup;
  surnameFilter: string;
  filteredUsers: User[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { };

  ngOnInit(): void {
    this.createForm();
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.filteredUsers = users;
      }
    });
  }

  createForm(): void {
    this.surnameForm = this.fb.group({
      surname: [''],
    });
  }

  // private _surnameFilter = '';
  // get surnameFilter(): string {
  //   return this._surnameFilter;
  // }
  // set surnameFilter(value: string) {
  //   this._surnameFilter = value;
  //   this.performFilter();
  // }

  // performFilter(): void {

  //   this.users = this.users.filter((user) =>
  //     user.surname.includes(this.surnameFilter));
  // }

  search() {
    this.surnameFilter = this.surnameForm.get('surname').value?.trim();
    this.filteredUsers = this.users.filter((user) =>
      user.surname.includes(this.surnameFilter));
    console.log(this.users);
  }
}