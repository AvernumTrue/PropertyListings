import { Component, OnInit } from '@angular/core';
import { Advert } from 'src/app/models/advert.model';
import { AdvertStatus } from 'src/app/models/advert.status.enum';
import { AdvertService } from 'src/app/services/advert.service';
@Component({
  selector: 'pl-my-adverts',
  templateUrl: './my-adverts.component.html',
  styleUrls: ['./my-adverts.component.css']
})
export class MyAdvertsComponent implements OnInit {

  adverts: Advert[] = [];
  advert: Advert;
  disableButtons = false;

  constructor(private advertService: AdvertService) { };

  ngOnInit(): void {
    this.advertService.getAdverts().subscribe({
      next: adverts => {
        console.log(adverts)
        this.adverts = adverts.filter(adverts => {
          return adverts.userId === Number(localStorage.getItem('loggedInId'));
        });

        // shows all adverts, DELETED included
        // this.adverts = adverts;

        this.adverts = this.adverts.filter(adverts => {
          return adverts.advertStatus !== "DELETED";
        });
      }
    });
  }

  // ngOnInit(): void {
  //   this.advertService.getAdverts().subscribe({
  //     next: adverts => {
  //       this.adverts = adverts;
  //     }
  //   });
  // }

  hideAdvert(id: number) {
    this.advertService.getAdvert(id).subscribe({
      next: advert => {
        this.advert = advert;
        this.advert.advertStatus = AdvertStatus.Hidden;
        this.advertService.editAdvert(this.advert).subscribe();
      }
    });
  }

  showAdvert(id: number) {
    this.advertService.getAdvert(id).subscribe({
      next: advert => {
        this.advert = advert;
        this.advert.advertStatus = AdvertStatus.Live;
        this.advertService.editAdvert(this.advert).subscribe();
      }
    });
  }

  deleteAdvert(id: number) {
    this.advertService.getAdvert(id).subscribe({
      next: advert => {
        this.advert = advert;
        this.advert.advertStatus = AdvertStatus.Deleted;
        this.advertService.editAdvert(this.advert).subscribe();
      }
    });
  }
}
