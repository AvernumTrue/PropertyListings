import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})

export class UserService {
  loggedInUserObservable: Observable<User | undefined>
  loggedInUserObserver: Subscriber<User | undefined>

  private userUrl: string = 'api/users';
  // private userUrl: string = 'api/brokenAPI';  // used for testing broken API 
  constructor(private http: HttpClient) {
    this.loggedInUserObservable = new Observable((observer) => {
      this.loggedInUserObserver = observer;
    })
  };

  getLoggedInUser(): Observable<User> {
    const loggedInId = Number(localStorage.getItem('loggedInId'));
    if (loggedInId != null && !isNaN(loggedInId)) {
      return this.getUser(loggedInId);
    } else {
      return new Observable(observer => observer.error(new Error('No logged in user')));
    }
  }

  login(userEmail: string, userPassword: string): Observable<User> {
    return new Observable(observer => {
      this.getUsers().subscribe({
        next: users => {
          const user = users.find(user => {
            return user.email === userEmail;
          });
          if (user == null) {
            observer.error(new Error('Username incorrect'));
          } else if (user.password !== userPassword) {
            observer.error(new Error('Password incorrect'));
          } else {
            localStorage.setItem('loggedInId', String(user.id));
            this.loggedInUserObserver.next(user);
            observer.next(user);
          }
        },
        error: err => observer.error(err),
      });
    });
  }

  logout() {
    localStorage.removeItem('loggedInId');
    this.loggedInUserObserver.next(undefined);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  editUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`${this.userUrl}`, user, { headers });
  }

  addUser(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    user.id = null as any;
    return this.http.post<User>(`${this.userUrl}`, user, { headers });
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.userUrl}/${id}`);
  }

  getLocalStorage() {
    return localStorage.getItem('loggedInId')
  }

  setLocalStorage(user: User) {
    return localStorage.setItem('loggedInId', String(user.id))
  }
} 