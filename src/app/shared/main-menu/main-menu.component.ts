import { Component, OnInit } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  spinnerStyle = Spinkit;
  authenticatedUser = false;
  administrator = false;
  loading = true;

  constructor(public userService: UserService) {
  }

  logOut(): void {
    this.userService.logout();
    this.authenticatedUser = false;
  }

  checkUser(user: User | undefined) {
    if (this.userService.getLocalStorage()) {
      this.authenticatedUser = true;
      if (!user?.isAdmin) {
        this.administrator = false;
      } else {
        this.administrator = true;
      }
    }
    this.loading = false;
  }

  ngOnInit(): void {
    this.loading = true;
    this.userService.loggedInUserObservable.subscribe({
      next: user => this.checkUser(user)
    });
    this.userService.getLoggedInUser().subscribe({
      next: user => this.checkUser(user),
      error: () => this.checkUser(undefined),
    });
  }
}
