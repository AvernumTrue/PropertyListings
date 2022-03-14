
import { Injectable } from "@angular/core";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { Advert } from "../models/advert.model";
import { AdvertStatus } from "../models/advert.status.enum";
import { Province } from "../models/province.model";
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
        headline: 'Big Green House',
        province: 'Eastern Cape',
        city: 'Aliwal North',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 10000,
        featured: true,
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Live,
        id: 2,
        headline: 'Small Blue House',
        province: 'Free State',
        city: 'Arlington',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 100000,
        featured: false
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Live,
        id: 3,
        headline: 'Tall Orange House',
        province: 'Gauteng',
        city: 'Alexandra',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 1000000,
        featured: true
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Hidden,
        id: 4,
        headline: 'Wide Yellow House',
        province: 'KwaZulu-Natal',
        city: 'Dannhauser',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 10000000,
        featured: false
      },
      {
        userId: 1,
        advertStatus: AdvertStatus.Deleted,
        id: 5,
        headline: 'Big Green Flat',
        province: 'Eastern Cape',
        city: 'Barkly East',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 100000000,
        featured: true
      },

      {
        userId: 2,
        advertStatus: AdvertStatus.Live,
        id: 6,
        headline: 'Round Orange Flat',
        province: 'Free State',
        city: 'Bethlehem',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 100000000,
        featured: true
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Live,
        id: 7,
        headline: 'Big Blue Flat',
        province: 'Gauteng',
        city: 'Lenasia',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 10000000,
        featured: true
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Live,
        id: 8,
        headline: 'Wide Green Flat',
        province: 'KwaZulu-Natal',
        city: 'Madadeni',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 1000000,
        featured: true
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Hidden,
        id: 9,
        headline: 'Small Yellow Flat',
        province: 'Eastern Cape',
        city: 'Barkly East',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 100000,
        featured: false
      },
      {
        userId: 2,
        advertStatus: AdvertStatus.Deleted,
        id: 10,
        headline: 'Small Yellow House',
        province: 'Free State',
        city: 'Clarens',
        details: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate.',
        price: 10000,
        featured: false
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
          phoneNumber: '123 456 7890',
          favouriteHouses: []
        },
        {
          id: 2,
          forenames: 'Forename 2',
          surname: 'Surname 2',
          email: '2@2.com',
          password: 'password2',
          isAdmin: false,
          favouriteHouses: []
        },
        {
          id: 3,
          forenames: 'Forename 3',
          surname: 'Surname 3',
          email: '3@3.com',
          password: 'password3',
          isAdmin: false,
          phoneNumber: '111 222 3333',
          favouriteHouses: []
        },
        {
          id: 4,
          forenames: 'Forename 4',
          surname: 'Surname 4',
          email: '4@4.com',
          password: 'password4',
          isAdmin: false,
          phoneNumber: '3211231234',
          favouriteHouses: []
        },

        {
          id: 5,
          forenames: 'admin',
          surname: 'admin',
          email: 'admin@admin',
          password: 'asdfasdf',
          phoneNumber: '3211231234',
          favouriteHouses: [],
          isAdmin: true,
        },
      ];
      const provinces: Province[] = [
        {
          province: 'Eastern Cape',
          cities: ['Aliwal North', 'Barkly East', 'Burgersdorp', 'Coffee Bay']
        },
        {
          province: 'Free State',
          cities: ['Arlington', 'Bethlehem', 'Clarens', 'Clocolan']
        },
        {
          province: 'Gauteng',
          cities: ['Alexandra', 'Johannesburg', 'Lenasia', 'Midrand']
        },
        {
          province: 'KwaZulu-Natal',
          cities: ['Dannhauser', 'Hattingspruit', 'Madadeni', 'Newcastle']
        },
        {
          province: 'Limpopo',
          cities: ['Afguns', 'Alldays', 'Bandelierkop', 'Ba-Phalaborwa']
        },
        {
          province: 'Mpumalanga',
          cities: ['Aankoms', 'Acornhoek', 'Amersfoort', 'Amsterdam']
        },
        {
          province: 'Northern Cape',
          cities: ['Barkly West', 'Campbell', 'Delportshoop', 'Douglas']
        },
        {
          province: 'North West',
          cities: ['Amalia', 'Bray', 'Ganyesa', 'Mareetsane']
        },
      ];
      return { adverts, users, provinces };
    }
  }
}