import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { AdvertFilter } from 'src/app/models/advert-filter.model';
import { Advert } from 'src/app/models/advert.model';
import { AdvertService } from 'src/app/services/advert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.css']
})
export class SaleListComponent implements OnInit {

  spinnerStyle = Spinkit;
  adverts: Advert[] = [];
  loading: boolean;
  orderMessage: string;
  headingId: number;
  filteredAdverts: Advert[] = [];

  get advertFilter(): AdvertFilter {
    return this.advertService.advertFilter;
  }
  set advertFilter(value: AdvertFilter) {
    this.advertService.advertFilter = value;
  }

  set returnPage(value: string) {
    this.userService.returnPage = value;
  }

  constructor(
    private advertService: AdvertService,
    private userService: UserService,
    private router: Router,) { };

  ngOnInit(): void {
    this.returnPage = '/sale-list';
    this.getFilteredAdverts();
  }

  getFilteredAdverts() {
    this.loading = true;
    this.advertService.getFilteredAdverts(this.advertFilter).subscribe({
      next: filteredAdverts => {
        this.filteredAdverts = filteredAdverts;
        this.loading = false;
      },
      error: err => {
        console.log('Failed to fetch filtered adverts.');
        console.error(err);
        this.filteredAdverts = [];
        this.loading = false;
      }
    });
  }

  lowToHigh() {
    function comparator(a: any, b: any) {
      return parseInt(a.price) - parseInt(b.price);
    }
    this.filteredAdverts.sort(comparator);
    this.orderMessage = 'Adverts ordered from low to high.';
  }
  highToLow() {
    function comparator(a: any, b: any) {
      return parseInt(b.price) - parseInt(a.price);
    }
    this.filteredAdverts.sort(comparator);
    this.orderMessage = 'Adverts ordered from high to low.';
  }

  onApplyFiltersClicked(filteredAdverts: Advert[]) {
    this.filteredAdverts = filteredAdverts;
    this.orderMessage = undefined;
  }
}