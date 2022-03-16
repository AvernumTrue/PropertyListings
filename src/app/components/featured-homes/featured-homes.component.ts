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
    this.loading = true
    this.advertService.getFeaturedAdverts().subscribe({
      next: featuredAdverts => {
        this.featuredAdverts = featuredAdverts;
        this.loading = false;
      }
    });
  }

} 
