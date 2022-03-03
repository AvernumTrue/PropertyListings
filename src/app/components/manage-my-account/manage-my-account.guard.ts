import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";
import { ManageMyAccountComponent } from "./manage-my-account.component";
@Injectable({
  providedIn: 'root'
})
export class ManageMyAccountGuard implements CanDeactivate<ManageMyAccountComponent> {
  canDeactivate(component: ManageMyAccountComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.accountForm.dirty) {
      return confirm(`Navigate away and lose all changes to your account?`);
    }
    return true;
  }
}