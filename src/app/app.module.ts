import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HomesForSaleComponent } from './homes-for-sale/homes-for-sale.component';
import { HomeComponent } from './home/home.component';
import { SaleListComponent } from './sale-list/sale-list.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HomesForSaleComponent,
    HomeComponent,
    SaleListComponent,
    RegisterComponent,
    LoginComponent,
    MainMenuComponent,
    SubMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
