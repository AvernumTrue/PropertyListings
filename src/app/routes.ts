import { RouterModule } from "@angular/router";
import { AdvertDetailsComponent } from "./components/advert-details/advert-details.component";
import { CreateAdvertComponent } from "./components/create-advert/create-advert.component";
import { CreateAdvertGuard } from "./components/create-advert/create-advert.guard";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { MyAdvertsComponent } from "./components/my-adverts/my-adverts.component";
import { RegisterComponent } from "./components/register/register.component";
import { SaleListComponent } from "./components/sale-list/sale-list.component";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { SellerDetailsComponent } from "./components/seller-details/seller-details.component";
import { ManageMyAccountComponent } from "./components/manage-my-account/manage-my-account.component";

export default RouterModule.forRoot([
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sale-list', component: SaleListComponent },
  { path: 'my-adverts', component: MyAdvertsComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'manage-my-account', component: ManageMyAccountComponent },
  { path: 'seller-details/:userIndex', component: SellerDetailsComponent },//TODO add user id as index like with advertIndex
  { path: 'advert-details/:advertIndex', component: AdvertDetailsComponent },
  { path: 'create-advert/:advertIndex', component: CreateAdvertComponent, canDeactivate: [CreateAdvertGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
])