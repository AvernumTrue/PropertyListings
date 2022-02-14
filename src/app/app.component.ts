import { Component } from '@angular/core';

@Component({
  selector: 'pl-root',
  template: `
<div class="container">
  <div class="row justify-content-md-center">
    <div class="col-md">
      <pl-main-menu></pl-main-menu>
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
<pl-footer></pl-footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PropertyListings';
}