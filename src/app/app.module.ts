import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import routes from './routes';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MainMenuComponent } from './shared/main-menu/main-menu.component';
import { RegisterComponent } from './components/register/register.component';
import { SaleListComponent } from './components/sale-list/sale-list.component';
import { SubMenuComponent } from './shared/sub-menu/sub-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { MyAdvertsComponent } from './components/my-adverts/my-adverts.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { CreateAdvertComponent } from './components/create-advert/create-advert.component';
import { InMemoryDataService } from './services/api-service-data';
import { AdvertDetailsComponent } from './components/advert-details/advert-details.component';
import { SellerDetailsComponent } from './components/seller-details/seller-details.component';
import { ManageMyAccountComponent } from './components/manage-my-account/manage-my-account.component';
import { SellerProfileComponent } from './components/seller-profile/seller-profile.component';
import { SearchComponent } from './shared/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainMenuComponent,
    RegisterComponent,
    SaleListComponent,
    SubMenuComponent,
    FooterComponent,
    UserManagementComponent,
    MyAdvertsComponent,
    CreateAdvertComponent,
    AdvertDetailsComponent,
    SellerDetailsComponent,
    ManageMyAccountComponent,
    SellerProfileComponent,
    SearchComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    routes,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    NgHttpLoaderModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
