import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { Advert } from 'src/app/models/advert.model';
import { AdvertStatus } from 'src/app/models/advert.status.enum';
import { User } from 'src/app/models/user.model';
import { AdvertService } from 'src/app/services/advert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-advert-managment',
  templateUrl: './advert-managment.component.html',
  styleUrls: ['./advert-managment.component.css']
})
export class AdvertManagmentComponent implements OnInit {

  filteredUsers: User[];
  spinnerStyle = Spinkit;
  selectedUserAdverts: Advert[] = [];
  loading: boolean;
  allAdverts: Advert[];
  allUsers: User[];
  busyDeleting = false;
  notificationMessage: string;
  selectedAdvertHeadline: string;

  statusToChange: string;
  selectedAdvert: Advert;
  disableAction = false;

  get selectedUser(): User {
    return this.userService.selectedUser;
  }
  set selectedUser(value: User) {
    this.userService.selectedUser = value;
  }

  set returnPage(value: string) {
    this.userService.returnPage = value;
  }

  constructor(
    private advertService: AdvertService,
    private userService: UserService,
    private router: Router,) { };

  ngOnInit(): void {
    this.loading = true;
    this.returnPage = '/advert-management';
    if (this.selectedUser) {
      this.selectedUser = this.selectedUser;
      this.getSelectedUserAdverts();
    }
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers().subscribe({
      next: allUsers => {
        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i].isAdmin === true) {
            allUsers.splice(i, 1);
          }
        }
        this.allUsers = allUsers;
        this.filteredUsers = allUsers;
        this.loading = false;
      }
    })
  }

  getSelectedUserAdverts() {
    this.loading = true;
    this.advertService.getAllAdvertsByUserId(this.selectedUser.id).subscribe({
      next: selectedUserAdverts => {
        this.selectedUserAdverts = selectedUserAdverts;
        this.loading = false;
      },
      error: err => {
        console.log('Failed to fetch all adverts.');
        console.error(err);
        this.selectedUserAdverts = [];
        this.loading = false;
      }
    });
  }

  prepChangeAdvertStatus(advert: Advert, change: string) {
    this.selectedAdvert = advert;
    this.statusToChange = change;
  }
  changeAdvertStatus() {
    if (this.statusToChange === 'HIDDEN') {
      this.selectedAdvert.advertStatus = AdvertStatus.Hidden;
      this.notificationMessage = "HIDDEN"
    }
    if (this.statusToChange === 'LIVE') {
      this.selectedAdvert.advertStatus = AdvertStatus.Live;
      this.notificationMessage = "LIVE"
    }
    if (this.statusToChange === 'DELETED') {
      console.log(this.statusToChange);
      this.selectedAdvert.advertStatus = AdvertStatus.Deleted;
      this.notificationMessage = "DELETED"
    }
    this.selectedAdvertHeadline = this.selectedAdvert.headline;
    this.loading = true;
    this.advertService.editAdvert(this.selectedAdvert).subscribe();
    this.statusToChange = undefined;
    this.selectedAdvert = undefined;
    this.getSelectedUserAdverts();
  }

  setSelectedUser(user: User) {
    this.statusToChange = undefined;
    this.selectedUser = user;
    this.getSelectedUserAdverts();
  }

  setSelectedAdvert(advert: Advert) {
    this.selectedAdvert = advert;
  };

  cancel() {
    this.statusToChange = undefined;
    this.selectedAdvert = undefined;
    this.busyDeleting = false;
    this.disableAction = false;
  }

}