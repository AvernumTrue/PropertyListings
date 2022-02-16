import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pl-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  unauthenticatedUser = true;
  authenticatedUser = true;
  administrator = true;

  constructor() { }


  logOut(): void {
    localStorage.removeItem('loggedInUser');
  }

  ngOnInit(): void {
  }
}
