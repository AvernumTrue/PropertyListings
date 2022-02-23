import { Component } from '@angular/core';

@Component({
  selector: 'pl-root',
  template: `
<pl-main-menu></pl-main-menu>
<div class="container">
  <div class="row justify-content-md-center">
    <div class="col-md">
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