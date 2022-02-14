import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import routes from './routes';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MainMenuComponent } from './shared/main-menu/main-menu.component';
import { RegisterComponent } from './register/register.component';
import { SaleListComponent } from './sale-list/sale-list.component';
import { SubMenuComponent } from './shared/sub-menu/sub-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainMenuComponent,
    RegisterComponent,
    SaleListComponent,
    SubMenuComponent,
    FooterComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    routes,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
