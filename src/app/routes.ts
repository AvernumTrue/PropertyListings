import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { MyAdvertsComponent } from "./components/my-adverts/my-adverts.component";
import { RegisterComponent } from "./components/register/register.component";
import { SaleListComponent } from "./components/sale-list/sale-list.component";
import { UserManagementComponent } from "./components/user-management/user-management.component";

export default RouterModule.forRoot([
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'register/:userIndex', component: RegisterComponent },
  { path: 'sale-list', component: SaleListComponent },
  { path: 'my-adverts', component: MyAdvertsComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
])