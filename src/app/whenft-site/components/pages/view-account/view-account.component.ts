import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { ProgressBar, ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/whenft-site/models/api/api-response';
import { Game } from 'src/app/whenft-site/models/dtos/game';
import { Player } from 'src/app/whenft-site/models/goalpost/player';
import { Account } from 'src/app/whenft-site/models/whenft/account/account';
import { NFT } from 'src/app/whenft-site/models/whenft/nft';
import { GamePipe } from 'src/app/whenft-site/pipes/game.pipe';
import { GameService } from 'src/app/whenft-site/services/game.service';
import { WhenFTService } from 'src/app/whenft-site/services/whenft.service';

@Component({
  standalone: true,
  selector: 'view-account',
  templateUrl: './view-account.component.html',
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    MessagesModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    GamePipe,
    ProgressBarModule
  ],
})
export class ViewAccountComponent {
  #whenFTService = inject(WhenFTService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);

  errors = new Array<Message>();
  account$ = new Observable<Account | undefined>();
  nfts$ = new Observable<Array<NFT> | undefined>();

  ngOnInit(): void {
    this.account$ = this.#whenFTService.watchAccount$(this.id);
    this.nfts$ = this.#whenFTService.watchAccountNFTs$(this.id);
  }
}
