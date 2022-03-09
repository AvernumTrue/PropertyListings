import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { Advert } from '../../models/advert.model';
import { AdvertService } from '../../services/advert.service';

@Component({
  selector: 'pl-advert-details',
  templateUrl: './advert-details.component.html',
  styleUrls: ['./advert-details.component.css']
})
export class AdvertDetailsComponent implements OnInit {

  spinnerStyle = Spinkit;
  loading: boolean;
  advert: Advert;
  advertId: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertService: AdvertService) {
    this.advertId = Number(route.snapshot.paramMap.get('advertIndex'));
  }

  ngOnInit(): void {
    this.loading = true;
    this.getAdvert();
  }

  getAdvert() {
    this.advertService.getAdvert(this.advertId).subscribe({
      next: advert => {
        this.advert = advert;
        this.loading = false;
      }, error: err => {
        console.log(err);
      }
    });
  }

  addToFavourites() {
    console.log('addToFavourites');
  }

}
