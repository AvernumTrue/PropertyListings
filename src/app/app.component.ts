import { Component } from '@angular/core';

@Component({
  selector: 'pl-root',
  template: `<div class="container">
  <div class="row justify-content-md-center">
    <div class="col-md">
    <router-outlet></router-outlet>
    </div>
  </div>
</div>
<footer class="page-footer navbar-brand p-1 bg-primary text-light">
  <div class="text-center">
    <h5 class="text-uppercase">Footer</h5>
  </div>
</footer>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PropertyListings';
}