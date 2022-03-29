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

  paginatedAdverts: any[] = [[]];  //Todo: remove this any. Make a model?
  spinnerStyle = Spinkit;
  adverts: Advert[] = [];
  loading: boolean;
  orderMessage: string;
  headingId: number;
  filteredAdverts: Advert[] = [];
  paginationPage: number;
  selectedPage: number;

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
    this.selectedPage = 0;
  }

  getFilteredAdverts() {
    this.loading = true;
    this.advertService.getFilteredAdverts(this.advertFilter).subscribe({
      next: filteredAdverts => {
        this.filteredAdverts = filteredAdverts;
        this.paginateAdverts()
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

  paginateAdverts() {
    console.log(this.filteredAdverts);
    let index = 0;
    this.paginationPage = 0;
    for (let length = this.filteredAdverts.length; length > 0; length -= 10) {
      this.paginatedAdverts[index] = this.filteredAdverts.slice(this.paginationPage, (this.paginationPage + 10));
      index++;
      this.paginationPage += 10;
    }
  }

  setSelectedPage(pageNumb: number) {
    this.selectedPage = pageNumb;
  }

  incrementSelectedPage(page: string) {
    if (this.selectedPage > 0 && page === 'pageLeft') {
      this.selectedPage--;
    }
    if (this.selectedPage < this.paginatedAdverts.length - 1 && page === 'pageRight') {
      this.selectedPage++;
    }
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