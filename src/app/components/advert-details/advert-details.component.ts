import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
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
  user: User;

  primaryMessage: string;
  dangerMessage: string;
  successMessage: string;

  favouritesButton: string;
  alertMessage: string;
  disableButtons: boolean;
  isAddingFavourite: boolean;
  favouritedMessage: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private advertService: AdvertService,
    private userService: UserService) {
    this.advertId = Number(route.snapshot.paramMap.get('advertIndex'));
  }

  // TODO : remove favourite option if user is not logged in.
  // TODO : fix ERROR TypeError: Cannot read properties of undefined (reading 'id')
  ngOnInit(): void {
    this.loading = true;
    this.userService.getUser(Number(localStorage.getItem('loggedInId'))).subscribe({
      next: user => {
        this.user = user;
        const checkFavouriteHouseIdExists = (id: number) => {
          return id === this.advert.id;
        }
        if (!this.user.favouriteHouses.find(checkFavouriteHouseIdExists)) {
          this.favouritesButton = 'Add to favourites'
          this.isAddingFavourite = true;
        } else {
          this.favouritedMessage = true;
          this.favouritesButton = 'Remove from favourites'
          this.isAddingFavourite = false;
        }
      },
      error: () => {
      },
    });
    this.getAdvert();
  }

  selectMessage(message: string) {
    switch (message) {

      case "saveErrorMessage":
        this.primaryMessage = "";
        this.dangerMessage = "There was an error adding the advert to favourites.";
        this.successMessage = "";
        break;
      case "addSuccessMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Advert saved to favourites.";
        break;
      case "removeSuccessMessage":
        this.primaryMessage = "";
        this.dangerMessage = "";
        this.successMessage = "Advert removed from favourites.";
        break;
      case "addingMessage":
        this.primaryMessage = "Saving advert to favourites.";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      case "removingMessage":
        this.primaryMessage = "Removing advert from favourites.";
        this.dangerMessage = "";
        this.successMessage = "";
        break;
      default:
        console.log("No Message");
        break;
    }
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
    this.disableButtons = true;
    const checkFavouriteHouseIdExists = (id: number) => {
      return id === this.advert.id;
    }
    if (!this.user.favouriteHouses.find(checkFavouriteHouseIdExists)) {
      this.selectMessage("addingMessage");
      this.user.favouriteHouses.push(this.advert.id);
      this.favouritesButton = 'Remove from favourites'
      this.isAddingFavourite = true;
    } else {
      this.selectMessage("removingMessage");
      this.favouritesButton = 'Add to favourites'
      this.isAddingFavourite = false;
      const index = this.user.favouriteHouses.indexOf(this.advert.id);
      if (index > -1) {
        this.user.favouriteHouses.splice(index, 1);
      }
    }
    this.disableButtons = true;
    this.updateFavourites();
    console.log(this.user.favouriteHouses);
  }

  updateFavourites() {
    this.userService.editUser(this.user).subscribe({
      next: () => {
        this.disableButtons = false;
        if (this.isAddingFavourite) {
          this.selectMessage("addSuccessMessage");
          this.favouritedMessage = true;
        } else {
          this.selectMessage("removeSuccessMessage");
          this.favouritedMessage = false;
        }
      },
      error: () => {
        this.disableButtons = false;
        this.selectMessage("saveErrorMessage");
      }

    });
  }
}