import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";
import { SellerProfileComponent } from "./seller-profile.component";
@Injectable({
  providedIn: 'root'
})
export class SellerProfileGuard implements CanDeactivate<SellerProfileComponent> {
  canDeactivate(component: SellerProfileComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.sellerProfileForm.dirty) {
      return confirm(`Navigate away and lose all changes to your seller profile?`);
    }
    return true;
  }
}