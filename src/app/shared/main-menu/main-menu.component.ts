import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  // TODO change menu display based on localStorage
  authenticatedUser = false;
  administrator = false;
  loading = true;

  constructor(public userService: UserService) {
  }

  logOut(): void {
    this.userService.logout();
  }

  checkUser(user: User | undefined) {
    this.authenticatedUser = user != null;
    this.administrator = user?.isAdmin ?? false;
    this.loading = false;
  }

  ngOnInit(): void {
    this.userService.loggedInUserObservable.pipe(delay(2000)).subscribe({
      next: user => this.checkUser(user),
    });
    this.userService.getLoggedInUser().pipe(delay(2000)).subscribe({
      next: user => this.checkUser(user),
      error: () => this.checkUser(undefined),
    });
  }
}
