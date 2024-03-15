import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Game } from 'src/app/whenft-site/models/goalpost/game';
import { GameStats } from 'src/app/whenft-site/models/goalpost/game-stats';
import { GameInfoPipe } from 'src/app/whenft-site/pipes/game-info.pipe';
import { GamePipe } from 'src/app/whenft-site/pipes/game.pipe';
import { LeagueService } from 'src/app/whenft-site/services/league.service';
import { WhenFTService } from 'src/app/whenft-site/services/whenft.service';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home-page.component.html',
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, GamePipe, GameInfoPipe],
})
export class HomePageComponent {
  #whenFTService = inject(WhenFTService);
  whenFT$ = this.#whenFTService.watchWhenFt$();
}
