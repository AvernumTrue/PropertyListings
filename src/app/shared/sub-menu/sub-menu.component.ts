import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pl-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {

  constructor() { }

  logOut(): void {
    localStorage.removeItem('loggedInUser');
  }

  ngOnInit(): void {
  }

}
