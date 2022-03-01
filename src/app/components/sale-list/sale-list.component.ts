import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
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

}
