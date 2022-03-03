import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";
import { RegisterComponent } from "./register.component";

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanDeactivate<RegisterComponent> {
  canDeactivate(component: RegisterComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.registerForm.dirty) {
      return confirm(`Navigate away and cancel registration?`);
    }
    return true;
  }
}