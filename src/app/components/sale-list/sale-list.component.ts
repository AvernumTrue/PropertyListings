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
  headingHovered: boolean;
  headingId: number;

  constructor(
    private advertService: AdvertService,
    private router: Router,) {
  };

  ngOnInit(): void {
    this.getAdverts()
  }

  getAdverts() {
    this.loading = true;
    this.advertService.getAdverts().subscribe({
      next: adverts => {
        this.adverts = adverts;
        this.loading = false;
      }
    });
  }

  lowToHigh() {
    function comparator(a: any, b: any) {
      return parseInt(a.price) - parseInt(b.price);
    }
    this.adverts.sort(comparator);
    this.orderMessage = 'Adverts ordered from low to high.'
  }
  highToLow() {
    function comparator(a: any, b: any) {
      return parseInt(b.price) - parseInt(a.price);
    }
    this.adverts.sort(comparator);
    this.orderMessage = 'Adverts ordered from high to low.'
  }

  onApplyFiltersClicked(advertFilter: any) {
    console.log(advertFilter)
    // console.log('onApplyFiltersClicked')
  }
}
