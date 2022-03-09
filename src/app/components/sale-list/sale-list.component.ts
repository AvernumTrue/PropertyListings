import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { AdvertFilter } from 'src/app/models/advert-filter.model';
import { Advert } from 'src/app/models/advert.model';
import { AdvertService } from 'src/app/services/advert.service';

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

  // advertFilter: AdvertFilter;

  get advertFilter(): AdvertFilter {
    return this.advertService.advertFilter;
  }
  set advertFilter(value: AdvertFilter) {
    this.advertService.advertFilter = value;
  }

  constructor(
    private advertService: AdvertService,
    private router: Router,) { };

  ngOnInit(): void {
    this.getFilteredAdverts();
  }

  getFilteredAdverts() {
    this.loading = true;
    this.advertService.getFilteredAdverts(this.advertFilter).subscribe({
      next: filteredAdverts => {
        this.filteredAdverts = filteredAdverts;
        this.highToLow();
        this.loading = false;
      },
      error: err => {
        console.log('Failed to fetch filtered adverts');
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
    this.orderMessage = 'Adverts ordered from low to high.'
  }
  highToLow() {
    function comparator(a: any, b: any) {
      return parseInt(b.price) - parseInt(a.price);
    }
    this.filteredAdverts.sort(comparator);
    this.orderMessage = 'Adverts ordered from high to low.'
  }

  onApplyFiltersClicked(advertFilter: AdvertFilter) {
    this.advertFilter = advertFilter;
    this.getFilteredAdverts();
  }
}

 // ngOnInit(): void {
  //   this.getAdverts()
  // }

  // getAdverts() {
  //   this.loading = true;
  //   this.advertService.getAdverts().subscribe({
  //     next: adverts => {
  //       this.adverts = adverts;
  //       // this.performFilter();
  //       this.highToLow();
  //       this.loading = false;
  //     }
  //   });
  // }

  // TODO : perperformFilter
  // performFilter() {
  //   this.filteredAdverts = this.adverts
  //   if (this.advertFilter) {
  //     const filterByProvince = this.advertFilter.selectedProvince ?? undefined;
  //     const filterByCity = this.advertFilter.selectedCity ?? undefined;
  //     const filterByMaxFilter = this.advertFilter.selectedMaxFilter ?? undefined;
  //     const filterByMinFilter = this.advertFilter.selectedMinFilter ?? undefined;
  //     const filterByKeyWord = this.advertFilter.selectedKeyWords ?? undefined;

  //     if (filterByProvince) {
  //       this.filteredAdverts = this.filteredAdverts.filter((advert) =>
  //         advert.province.includes(filterByProvince.province));
  //     }

  //     if (filterByCity) {
  //       this.filteredAdverts = this.filteredAdverts.filter((advert) =>
  //         advert.city.includes(filterByCity));
  //     }

  //     // TODO : Add warning of impossible filter
  //     if (filterByMaxFilter < filterByMinFilter) {
  //       console.log("Impossible filter message")
  //     }

  //     if (filterByMaxFilter) {
  //       this.filteredAdverts = this.filteredAdverts.filter((advert) =>
  //         advert.price <= (filterByMaxFilter));
  //     }

  //     if (filterByMinFilter) {
  //       this.filteredAdverts = this.filteredAdverts.filter((advert) =>
  //         advert.price >= (filterByMinFilter));
  //     }

  //     if (filterByKeyWord) {
  //       this.filteredAdverts = this.filteredAdverts.filter((advert) =>
  //         advert.headline.toLowerCase().includes(filterByKeyWord.toLowerCase()));
  //     }
  //   }
  // }