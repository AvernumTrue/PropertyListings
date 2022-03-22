import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { AdvertFilter } from 'src/app/models/advert-filter.model';
import { Advert } from 'src/app/models/advert.model';
import { User } from 'src/app/models/user.model';
import { AdvertService } from 'src/app/services/advert.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'pl-favourite-houses',
  templateUrl: './favourite-houses.component.html',
  styleUrls: ['./favourite-houses.component.css']
})
export class FavouriteHousesComponent implements OnInit {

  spinnerStyle = Spinkit;
  adverts: Advert[] = [];
  loading: boolean;
  orderMessage: string;
  headingId: number;
  filteredAdverts: Advert[] = [];
  filteredFavouriteAdverts: Advert[] = [];
  user: User;
  selectedAdvert: Advert;

  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;

  get advertFilter(): AdvertFilter {
    return this.advertService.advertFilter;
  }
  set advertFilter(value: AdvertFilter) {
    this.advertService.advertFilter = value;
  }

  constructor(
    private advertService: AdvertService,
    private router: Router,
    private userService: UserService) { };

  selectMessage(message: string) {
    switch (message) {

      case "unfavouriteErrorMessage":
        this.primaryMessage = "";
        this.dangerMessage = "There was an error unfavouriting " + this.selectedAdvert.headline;
        this.successMessage = "";
        break;
      case "unfavouriteSuccessMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Unfavourited " + this.selectedAdvert.headline;
        break;
      case "noAdvertsMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Advert removed from favourites.";
        break;
      default:
        console.log("No Message");
        break;
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.getFilteredAdverts();
    this.userService.getUser(Number(localStorage.getItem('loggedInId'))).subscribe({
      next: user => {
        this.user = user;
        this.getFilteredFavouriteAdverts();
      }
    })
  }

  unfavourite(advert: Advert) {
    this.selectedAdvert = advert;
    for (let favouriteHouseId of this.user.favouriteHouses) {
      if (advert.id === favouriteHouseId) {
        for (var i = 0; i < this.user.favouriteHouses.length; i++) {
          if (this.user.favouriteHouses[i] === favouriteHouseId) {
            this.user.favouriteHouses.splice(i, 1);
            for (var i = 0; i < this.filteredFavouriteAdverts.length; i++) {
              if (this.filteredFavouriteAdverts[i].id === favouriteHouseId) {
                this.filteredFavouriteAdverts.splice(i, 1);
              }
            }
          }
        }
        this.loading = true;
        this.userService.editUser(this.user).subscribe({
          next: () => {
            this.loading = false;
            this.selectMessage("unfavouriteSuccessMessage");
          },
          error: () => {
            this.loading = false;
            this.selectMessage("unfavouriteErrorMessage");
          }
        });
      }
    }
  }

  getFilteredAdverts() {
    this.advertService.getFilteredAdverts(this.advertFilter).subscribe({
      next: filteredAdverts => {
        this.filteredAdverts = filteredAdverts;
        this.loading = false;
      },
      error: err => {
        console.log('Failed to fetch filtered adverts.');
        console.error(err);
        this.filteredAdverts = [];
        this.loading = false;
      }
    });
  }

  getFilteredFavouriteAdverts() {
    let index = 0;
    for (let i of this.filteredAdverts) {
      index++
      for (let advert of this.filteredAdverts) {
        if (this.user.favouriteHouses[index] === advert.id) {
          this.filteredFavouriteAdverts = this.filteredFavouriteAdverts.concat(advert);
        }
      }
    }
    this.loading = false;
  }

  lowToHigh() {
    function comparator(a: any, b: any) {
      return parseInt(a.price) - parseInt(b.price);
    }
    this.filteredFavouriteAdverts.sort(comparator);
    this.orderMessage = 'Adverts ordered from low to high.';
  }
  highToLow() {
    function comparator(a: any, b: any) {
      return parseInt(b.price) - parseInt(a.price);
    }
    this.filteredFavouriteAdverts.sort(comparator);
    this.orderMessage = 'Adverts ordered from high to low.';
  }

  onApplyFiltersClicked(filteredAdverts: Advert[]) {
    this.filteredAdverts = filteredAdverts;
    this.orderMessage = undefined;
  }
}