import { Pipe, PipeTransform } from '@angular/core';
import { Team } from '../models/goalpost/team';

@Pipe({
  standalone: true,
  name: 'team'
})
export class TeamPipe implements PipeTransform {

  transform(team: Team): string {
    return `${team.id} - ${team.name}`;
  }
}
