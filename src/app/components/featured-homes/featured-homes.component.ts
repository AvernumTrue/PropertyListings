import { Component, OnInit } from '@angular/core';
import { Advert } from 'src/app/models/advert.model';
import { AdvertService } from 'src/app/services/advert.service';

@Component({
  selector: 'pl-featured-homes',
  templateUrl: './featured-homes.component.html',
  styleUrls: ['./featured-homes.component.css']
})
export class FeaturedHomesComponent implements OnInit {

  loading: boolean;
  adverts: Advert[] = [];
  featuredAdverts: Advert[] = [];
  advert: Advert;

  constructor(
    private advertService: AdvertService
  ) { }

  ngOnInit(): void {
    this.getAdverts();
  }

  getAdverts() {
    this.loading = true;
    this.advertService.getAdverts().subscribe({
      next: adverts => {
        this.adverts = adverts;
        this.getFeaturedAdverts();
        console.log(this.adverts)
        this.loading = false;
      },
      error: err => {
        console.log('Failed to fetch adverts');
        console.error(err);
        this.loading = false;
      }
    });
  }

  getFeaturedAdverts() {

    for (let advert of this.adverts) {
      this.advert = advert;
      if (this.advert.featured === true && this.advert.advertStatus === "LIVE") {
        // console.log(this.featuredAdverts.concat(this.advert));
        this.featuredAdverts = this.featuredAdverts.concat(this.advert);
      }
    }
  }

}
