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
  unFilteredfeaturedAdverts: Advert[] = [];

  highToLow() {
    function comparator(a: any, b: any) {
      return parseInt(b.price) - parseInt(a.price);
    }
    for (let advert of this.filteredAdverts) {
      if (advert.featured) {
        this.filteredfeaturedAdverts = this.filteredfeaturedAdverts.concat(advert);
      }
      if (!advert.featured) {
        this.unFilteredfeaturedAdverts = this.unFilteredfeaturedAdverts.concat(advert);
      }
    }
    this.filteredfeaturedAdverts.sort(comparator);
    this.unFilteredfeaturedAdverts.sort(comparator);
    this.filteredAdverts = this.filteredfeaturedAdverts.concat(this.unFilteredfeaturedAdverts);
  }

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
    return new Observable<Advert[]>(observer => {
      this.http.get<Advert[]>(this.advertUrl).pipe(delay(2000)).subscribe({
        next: adverts => {
          try {
            this.advertFilter = advertFilter;
            this.filteredAdverts = this.adverts;

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
            this.highToLow();
            observer.next(this.filteredAdverts);
          } catch (err) {
            observer.error(err);
          }
        },
        error: (err) => observer.error(err),
      });
    });
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