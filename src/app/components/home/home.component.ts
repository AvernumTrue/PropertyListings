import { Component, OnInit } from '@angular/core';
import { AdvertFilter } from 'src/app/models/advert-filter.model';

@Component({
  selector: 'pl-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onApplyFiltersClicked(advertFilter: AdvertFilter) {

    console.log(advertFilter)

  }
}
