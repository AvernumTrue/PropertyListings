import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Advert } from 'src/app/models/advert.model';
import { AdvertStatus } from 'src/app/models/advert.status.enum';
import { AdvertService } from 'src/app/services/advert.service';
import { Spinkit } from 'ng-http-loader';
import { delay } from 'rxjs';

@Component({
  selector: 'pl-my-adverts',
  templateUrl: './my-adverts.component.html',
  styleUrls: ['./my-adverts.component.css']
})

export class MyAdvertsComponent implements OnInit {

  spinnerStyle = Spinkit;
  adverts: Advert[] = [];
  advert: Advert;
  disableButtons = false;
  disableAction = false;
  selectedAdvert: number;
  dangerMessage = "Are you sure you want to delete this Advert?";
  busyDeleting = false;
  loading = true;

  constructor(
    private advertService: AdvertService,
    private router: Router,) {
  };

  ngOnInit(): void {
    this.loading = true;
    this.getUserAdverts();
  }

  getUserAdverts() {
    this.advertService.getAdverts().pipe(delay(2000)).subscribe({
      next: adverts => {
        this.adverts = adverts.filter(adverts => {
          return adverts.userId === Number(localStorage.getItem('loggedInId'));
        });
        this.adverts = this.adverts.filter(adverts => {
          this.loading = false;
          return adverts.advertStatus !== "DELETED";
        });
      }
    });
    this.disableAction = false;
    this.busyDeleting = false;
  }

  showActions(advertId: number) {
    this.selectedAdvert = advertId;
  };

  changeAdvertStatus(advert: Advert, change: string) {
    this.loading = true;
    this.advert = advert;
    if (change === 'hide') {
      this.advert.advertStatus = AdvertStatus.Hidden;
    } else {
      this.advert.advertStatus = AdvertStatus.Live;
    }
    this.advertService.editAdvert(this.advert).pipe(delay(2000)).subscribe();
    this.getUserAdverts();
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
    this.loading = true;
    this.advertService.getAdvert(id).pipe(delay(2000)).subscribe({
      next: advert => {
        this.loading = false;
        this.advert = advert;
        this.advert.advertStatus = AdvertStatus.Deleted;
        this.advertService.editAdvert(this.advert).pipe(delay(2000)).subscribe();
        this.loading = false;
        this.getUserAdverts()
      }
    });
  }
}