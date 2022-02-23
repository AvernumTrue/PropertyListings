import { Component, OnInit } from '@angular/core';
import { Advert } from 'src/app/models/advert.model';
import { AdvertService } from 'src/app/services/advert.service';
@Component({
  selector: 'pl-my-adverts',
  templateUrl: './my-adverts.component.html',
  styleUrls: ['./my-adverts.component.css']
})
export class MyAdvertsComponent implements OnInit {

  adverts: Advert[] = [];
  constructor(private advertService: AdvertService) { };

  ngOnInit(): void {
    this.advertService.getAdverts().subscribe({
      next: advert => {
        this.adverts = advert;
        console.log(this.adverts);
      }
    });
  }
}
