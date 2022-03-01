import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";
import { CreateAdvertComponent } from "./create-advert.component";


@Injectable({
  providedIn: 'root'
})
export class CreateAdvertGuard implements CanDeactivate<CreateAdvertComponent> {
  canDeactivate(component: CreateAdvertComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.advertForm.dirty) {
      return confirm(`Navigate away and lose all changes to this advert?`);
    }
    return true;
  }
}