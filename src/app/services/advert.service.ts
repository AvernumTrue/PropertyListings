import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Advert } from '../models/advert.model';
import { AdvertFilter } from '../models/advert-filter.model';

@Injectable({
  providedIn: 'root'
})

export class AdvertService {

  private advertUrl: string = 'api/adverts';
  // private advertUrl: string = 'api/brokenAPI';  // used for testing broken API 
  constructor(private http: HttpClient) {
  };

  adverts: Advert[] = [];
  advertFilter: AdvertFilter;
  filteredAdverts: Advert[] = [];

  getFilteredAdverts(advertFilter: AdvertFilter) {
    const value = this.http.get<Advert[]>(this.advertUrl).pipe(delay(2000));
    value.subscribe({
      next: adverts => {
        this.adverts = adverts;
        console.log("first")
      }
    });

    this.advertFilter = advertFilter;
    this.filteredAdverts = this.adverts

    if (this.advertFilter) {
      const filterByProvince = this.advertFilter.selectedProvince ?? undefined;
      const filterByCity = this.advertFilter.selectedCity ?? undefined;
      const filterByMaxFilter = this.advertFilter.selectedMaxFilter ?? undefined;
      const filterByMinFilter = this.advertFilter.selectedMinFilter ?? undefined;
      const filterByKeyWord = this.advertFilter.selectedKeyWords ?? undefined;

      if (filterByProvince) {
        this.filteredAdverts = this.filteredAdverts.filter((advert) =>
          advert.province.includes(filterByProvince.province));
      }
      if (filterByCity) {
        this.filteredAdverts = this.filteredAdverts.filter((advert) =>
          advert.city.includes(filterByCity));
      }
      if (filterByMaxFilter < filterByMinFilter) {
        console.log("Impossible filter message")
      }
      if (filterByMaxFilter) {
        this.filteredAdverts = this.filteredAdverts.filter((advert) =>
          advert.price <= (filterByMaxFilter));
      }
      if (filterByMinFilter) {
        this.filteredAdverts = this.filteredAdverts.filter((advert) =>
          advert.price >= (filterByMinFilter));
      }
      if (filterByKeyWord) {
        this.filteredAdverts = this.filteredAdverts.filter((advert) =>
          advert.headline.toLowerCase().includes(filterByKeyWord.toLowerCase()));
      }
    }
    console.log("second")
    return this.filteredAdverts;
  }

  getAdvert(id: number): Observable<Advert> {
    return this.http.get<Advert>(`${this.advertUrl}/${id}`).pipe(delay(2000));
  }

  getAdverts(): Observable<Advert[]> {
    return this.http.get<Advert[]>(this.advertUrl).pipe(delay(2000));
  }

  editAdvert(advert: Advert): Observable<Advert> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Advert>(`${this.advertUrl}`, advert, { headers }).pipe(delay(2000));
  }

  addAdvert(advert: Advert): Observable<Advert> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    advert.id = null as any;
    return this.http.post<Advert>(`${this.advertUrl}`, advert, { headers }).pipe(delay(2000));
  }

  getAdvertsByUserId(userId: number): Observable<Advert[]> {
    return this.http.get<Advert[]>(this.advertUrl).pipe(map(x => x.filter(a => a.userId === userId && a.advertStatus !== "DELETED"))).pipe(delay(2000));
  }

} 