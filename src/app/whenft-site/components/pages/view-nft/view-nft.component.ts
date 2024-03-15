import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { NFT } from 'src/app/whenft-site/models/whenft/nft';
import { PlayerPipe } from 'src/app/whenft-site/pipes/player.pipe';
import { TeamPipe } from 'src/app/whenft-site/pipes/team.pipe';
import { WhenFTService } from 'src/app/whenft-site/services/whenft.service';
import { NFTComponent } from '../../controls/nft/nft.component';

@Component({
    standalone: true,
    selector: 'view-nft',
    templateUrl: './view-nft.component.html',
    imports: [CommonModule, RouterModule, CardModule, ButtonModule, TeamPipe, PlayerPipe, NFTComponent]
})
export class ViewNftComponent implements OnInit {
  #whenFtService = inject(WhenFTService);
  #router = inject(Router);
  @Input() id!: number;
  nft$ = new Observable<NFT | undefined>();
  // rushYardage$ = new Observable<number | undefined>();
  // rushYardage = 0;

  ngOnInit(): void {
    this.nft$ = this.#whenFtService.watchNFT$(this.id);
    // this.games$ = this.#leagueService.watchGames$().pipe(map(games => games.filter(game => game.awayRoster.find((player) => player.id === this.id) || game.homeRoster.find((player) => player.id === this.id))));
    // this.rushYardage$ = this.games$.pipe((switchMap(games => games!.forEach((game) => {
    //   if (game.homeRoster.find((player) => player.id === this.id)) {
    //     return of(new GameStats(game!).homeTeamStats.playerStats.find((player) => player.id === this.id).rushingYardage);
    //   } else {
    //     return of(new GameStats(game!).awayTeamStats.playerStats.find((player) => player.id === this.id).rushingYardage);
    //   }
    // }))));
  }
}
