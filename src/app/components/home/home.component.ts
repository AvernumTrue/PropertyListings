import { Component, OnInit } from '@angular/core';
import { AdvertFilter } from 'src/app/models/advert-filter.model';
import { Advert } from 'src/app/models/advert.model';

@Component({
  selector: 'pl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  filteredAdverts: Advert[];

  constructor() { }

  ngOnInit(): void {
  }

  // onApplyFiltersClicked(advertFilter: AdvertFilter) {
  // }
  onApplyFiltersClicked(filteredAdverts: Advert[]) {
  }

}
