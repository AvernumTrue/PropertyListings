
import { Injectable } from "@angular/core";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { Advert } from "../models/advert.model";
import { AdvertStatus } from "../models/advert.status.enum";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})

export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const adverts: Advert[] = [
      {
        userId: 1,
        advertStatus: AdvertStatus.Live,
        id: 1,
        headline: 'Advert 1 Headline',
        province: 'Province 1',
        city: 'City 11',
        details: 'advert details 1',
        price: 10000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Live,
        id: 2,
        headline: 'Advert 2 Headline',
        province: 'Province 2',
        city: 'City 21',
        details: 'advert details 2',
        price: 20000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Live,
        id: 3,
        headline: 'Advert 3 Headline',
        province: 'Province 3',
        city: 'City 31',
        details: 'advert details 3',
        price: 30000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Hidden,
        id: 4,
        headline: 'Advert 4 Headline',
        province: 'Province 4',
        city: 'City 41',
        details: 'advert details 4',
        price: 40000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Deleted,
        id: 5,
        headline: 'Advert 5 Headline',
        province: 'Province 1',
        city: 'City 12',
        details: 'advert details 5',
        price: 50000
      },

      {
        userId: 2,
        advertStatus: AdvertStatus.Live,
        id: 6,
        headline: 'Advert 6 Headline',
        province: 'Province 2',
        city: 'City 22',
        details: 'advert details 6',
        price: 10000
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Live,
        id: 7,
        headline: 'Advert 7 Headline',
        province: 'Province 3',
        city: 'City 33',
        details: 'advert details 7',
        price: 20000
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Live,
        id: 8,
        headline: 'Advert 8 Headline',
        province: 'Province 4',
        city: 'City 44',
        details: 'advert details 8',
        price: 30000
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Hidden,
        id: 9,
        headline: 'Advert 9 Headline',
        province: 'Province 1',
        city: 'City 12',
        details: 'advert details 9',
        price: 40000
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Deleted,
        id: 10,
        headline: 'Advert 10 Headline',
        province: 'Province 2',
        city: 'City 23',
        details: 'advert details 10',
        price: 50000
      },

    ];
    {
      const users: User[] = [
        {
          id: 1,
          forenames: 'Forename 1',
          surname: 'Surname 1',
          email: '1@1.com',
          password: 'password1',
          isAdmin: false,
        },
        {
          id: 2,
          forenames: 'Forename 2',
          surname: 'Surname 2',
          email: '2@2.com',
          password: 'password2',
          isAdmin: false,
        },
        {
          id: 3,
          forenames: 'Forename 3',
          surname: 'Surname 3',
          email: '3@3.com',
          password: 'password3',
          isAdmin: false,
        },
        {
          id: 4,
          forenames: 'Forename 4',
          surname: 'Surname 4',
          email: '4@4.com',
          password: 'password4',
          isAdmin: false,
        },
        {
          id: 5,
          forenames: 'admin',
          surname: 'admin',
          email: 'admin@admin',
          password: 'asdfasdf',
          isAdmin: true,
        },
      ]
      return { adverts, users };
    }
  }
}