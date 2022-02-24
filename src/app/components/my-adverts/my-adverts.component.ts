import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  disableAction = false;
  displayActions = false;
  selectedAdvert: number;
  dangerMessage = "Are you sure you want to delete this Advert?";
  busyDeleting = false;

  constructor(
    private advertService: AdvertService,
    private router: Router,) {
  };

  ngOnInit(): void {
    this.getUserAdverts()
  }

  getUserAdverts() {
    this.advertService.getAdverts().subscribe({
      next: adverts => {
        this.adverts = adverts.filter(adverts => {
          return adverts.userId === Number(localStorage.getItem('loggedInId'));
        });

        this.adverts = this.adverts.filter(adverts => {
          return adverts.advertStatus !== "DELETED";
        });
      }
    });
    this.disableAction = false;
    this.busyDeleting = false;
  }

  showActions(advertId: number) {
    this.selectedAdvert = advertId
    this.displayActions = true
  };

  hideAdvert(id: number) {
    this.advertService.getAdvert(id).subscribe({
      next: advert => {
        this.advert = advert;
        this.advert.advertStatus = AdvertStatus.Hidden;
        this.advertService.editAdvert(this.advert).subscribe();
        this.getUserAdverts()
      }
    });
  }

  showAdvert(id: number) {
    this.advertService.getAdvert(id).subscribe({
      next: advert => {
        this.advert = advert;
        this.advert.advertStatus = AdvertStatus.Live;
        this.advertService.editAdvert(this.advert).subscribe();
        this.getUserAdverts()
      }
    });
  }

  deleteAdvert() {
    this.busyDeleting = true;
    this.disableAction = true;
  }

  cancel() {
    this.busyDeleting = false;
    this.disableAction = false;
  }

  deleteConfirmed(id: number) {
    this.advertService.getAdvert(id).subscribe({
      next: advert => {
        this.advert = advert;
        this.advert.advertStatus = AdvertStatus.Deleted;
        this.advertService.editAdvert(this.advert).subscribe();
        this.getUserAdverts()
      }
    });
  }
}