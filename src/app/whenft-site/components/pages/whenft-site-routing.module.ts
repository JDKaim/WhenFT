import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ViewAccountComponent } from './view-account/view-account.component';
import { ViewNftComponent } from './view-nft/view-nft.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: HomePageComponent },
      { path: 'nfts/:id', component: ViewNftComponent },
      { path: 'accounts/:id', component: ViewAccountComponent },
      { path: 'create-account', component: CreateAccountComponent },
      { path: 'edit-account/:id', component: EditAccountComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class LeagueSiteRoutingModule {}
