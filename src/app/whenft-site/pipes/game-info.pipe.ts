import { Pipe, PipeTransform } from '@angular/core';
import { Team } from '../models/goalpost/team';
import { Game } from '../models/goalpost/game';

@Pipe({
  standalone: true,
  name: 'gameinfo'
})
export class GameInfoPipe implements PipeTransform {

  transform(game: Game): string {
    return `@ ${game.location} @ ${new Date(game.startTime)}`;
  }
}
