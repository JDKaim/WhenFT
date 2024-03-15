import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { DEFAULT_API_URL } from './whenft-site/services/data.service';
import { TokenInterceptor } from './whenft-site/interceptors/token-interceptor';
import { ApiResponseInterceptor } from './whenft-site/interceptors/api-response-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        ToastModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, MessageService,
        { provide: DEFAULT_API_URL, useValue: environment.apiUrl },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ApiResponseInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
