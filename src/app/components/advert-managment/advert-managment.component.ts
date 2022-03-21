import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { AdvertFilter } from 'src/app/models/advert-filter.model';
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
  selectedUser: User;
  busyDeleting = false;
  noticicationMessage: string;
  selectedAdvertHeadline: string;

  statusToChange: string;

  selectedAdvert: Advert;
  disableAction = false;

  get advertFilter(): AdvertFilter {
    return this.advertService.advertFilter;
  }
  set advertFilter(value: AdvertFilter) {
    this.advertService.advertFilter = value;
  }

  constructor(
    private advertService: AdvertService,
    private userService: UserService,
    private router: Router,) { };

  ngOnInit(): void {
    this.loading = true;
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers().subscribe({
      next: allUsers => {
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
    if (this.statusToChange === 'hide') {
      this.selectedAdvert.advertStatus = AdvertStatus.Hidden;
      this.noticicationMessage = "HIDDEN"
    }
    if (this.statusToChange === 'show') {
      this.selectedAdvert.advertStatus = AdvertStatus.Live;
      this.noticicationMessage = "LIVE"
    }
    if (this.statusToChange === 'delete') {
      console.log(this.statusToChange);
      this.selectedAdvert.advertStatus = AdvertStatus.Deleted;
      this.noticicationMessage = "DELETED"
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