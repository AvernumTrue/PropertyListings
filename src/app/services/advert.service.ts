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

  advert: Advert;
  adverts: Advert[] = [];
  advertFilter: AdvertFilter = {};
  filteredAdverts: Advert[] = [];
  featuredAdverts: Advert[] = [];

  filteredfeaturedAdverts: Advert[] = [];
  filteredUnfeaturedAdverts: Advert[] = [];

  getFeaturedAdverts() {
    return new Observable<Advert[]>(observer => {
      this.http.get<Advert[]>(this.advertUrl).pipe(delay(2000)).subscribe({
        next: adverts => {
          try {
            this.adverts = adverts;
            for (let advert of this.adverts) {
              this.advert = advert;
              if (this.advert.advertStatus === "LIVE" && this.advert.featured) {
                this.featuredAdverts = this.featuredAdverts.concat(this.advert);
              }
            }
            observer.next(this.featuredAdverts);
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
      });
    });
  }

  getFilteredAdverts(advertFilter: AdvertFilter) {
    this.filteredAdverts = [];
    return new Observable<Advert[]>(observer => {
      this.http.get<Advert[]>(this.advertUrl).pipe(delay(2000)).subscribe({
        next: adverts => {
          try {
            this.advertFilter = advertFilter;
            this.filteredAdverts = this.adverts;
            this.adverts = [];

            for (let advert of adverts) {
              this.advert = advert;
              if (this.advert.advertStatus === "LIVE" && this.advert.featured) {
                this.filteredAdverts = this.filteredAdverts.concat(this.advert);
              }
            }

            for (let advert of adverts) {
              this.advert = advert;
              if (this.advert.advertStatus === "LIVE" && !this.advert.featured) {
                this.filteredAdverts = this.filteredAdverts.concat(this.advert);
              }
            }

            if (this.advertFilter) {
              const filterByProvince = this.advertFilter.selectedProvince;
              const filterByCity = this.advertFilter.selectedCity;
              const filterByMaxFilter = this.advertFilter.selectedMaxFilter;
              const filterByMinFilter = this.advertFilter.selectedMinFilter;
              const filterByKeyWord = this.advertFilter.selectedKeyWords;

              if (filterByProvince) {
                this.filteredAdverts = this.filteredAdverts.filter((advert) =>
                  advert.province.includes(filterByProvince.province));
              }
              if (filterByCity) {
                this.filteredAdverts = this.filteredAdverts.filter((advert) =>
                  advert.city.includes(filterByCity));
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
            this.orderAdverts();
            observer.next(this.filteredAdverts);
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
      });
    });
  }

  orderAdverts() {
    this.filteredUnfeaturedAdverts = [];
    this.filteredfeaturedAdverts = [];
    function comparator(a: any, b: any) {
      return parseInt(b.price) - parseInt(a.price);
    }
    for (let filteredAdvert of this.filteredAdverts) {
      if (filteredAdvert.featured) {
        this.filteredfeaturedAdverts = this.filteredfeaturedAdverts.concat(filteredAdvert);
      }
      if (!filteredAdvert.featured) {
        this.filteredUnfeaturedAdverts = this.filteredUnfeaturedAdverts.concat(filteredAdvert);
      }
    }
    this.filteredfeaturedAdverts.sort(comparator);
    this.filteredUnfeaturedAdverts.sort(comparator);
    this.filteredAdverts = this.filteredfeaturedAdverts.concat(this.filteredUnfeaturedAdverts);
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

  getAllAdvertsByUserId(userId: number): Observable<Advert[]> {
    return this.http.get<Advert[]>(this.advertUrl).pipe(map(x => x.filter(a => a.userId === userId))).pipe(delay(2000));
  }

} 