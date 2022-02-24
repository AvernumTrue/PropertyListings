
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
        province: 'test Province 1',
        city: 'test city 1',
        details: 'advert details 1',
        price: 10000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Live,
        id: 2,
        headline: 'Advert 2 Headline',
        province: 'test Province 2',
        city: 'test city 2',
        details: 'advert details 2',
        price: 20000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Live,
        id: 3,
        headline: 'Advert 3 Headline',
        province: 'test Province 3',
        city: 'test city 3',
        details: 'advert details 3',
        price: 30000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Hidden,
        id: 4,
        headline: 'Advert 4 Headline',
        province: 'test Province 4',
        city: 'test city 4',
        details: 'advert details 4',
        price: 40000
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Deleted,
        id: 5,
        headline: 'Advert 5 Headline',
        province: 'test Province 5',
        city: 'test city 5',
        details: 'advert details 5',
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
          isAdmin: true,
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
      ]
      return { adverts, users };
    }
  }
}