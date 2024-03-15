import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { Observable, tap } from 'rxjs';
import { mustBeDifferentValidator } from 'src/app/whenft-site/helpers/custom-validators';
import { ApiResponse } from 'src/app/whenft-site/models/api/api-response';
import { Game } from 'src/app/whenft-site/models/dtos/game';
import { Player } from 'src/app/whenft-site/models/goalpost/player';
import { Status } from 'src/app/whenft-site/models/goalpost/status';
import { Account } from 'src/app/whenft-site/models/whenft/account/account';
import { GamePipe } from 'src/app/whenft-site/pipes/game.pipe';
import { GameService } from 'src/app/whenft-site/services/game.service';
import { WhenFTService } from 'src/app/whenft-site/services/whenft.service';

@Component({
  standalone: true,
  selector: 'edit-account',
  templateUrl: './edit-account.component.html',
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
  ],
})
export class EditAccountComponent {
  #whenFTService = inject(WhenFTService);
  #router = inject(Router);
  @Input() id!: number;
  #fb = inject(FormBuilder);
  form = this.#fb.group(
    {
      id: this.#fb.nonNullable.control(0, [Validators.required]),
      name: this.#fb.nonNullable.control('', [Validators.required]),
      email: this.#fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
    },
  );

  errors = new Array<Message>();
  account$ = new Observable<Account | undefined>();

  ngOnInit(): void {
    this.account$ = this.#whenFTService.watchAccount$(this.id).pipe(
      tap((account) => {
        if (!account) {
          return;
        }
        this.form.controls.id.setValue(account.id);
        this.form.controls.name.setValue(account.name);
        this.form.controls.email.setValue(account.email);
      })
    );
  }

  editAccountClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const account = this.form.value;
    this.errors = [];
    this.#whenFTService
      .editAccount(this.id, {
        id: account.id!,
        name: account.name!,
        email: account.email!,
      })
      .subscribe({
        next: (response) => {
          // if (!response.result) {
          //   this.errors.push(
          //     ...response.errorMessages!.map(
          //       (errorMessage) =>
          //         <Message>{
          //           severity: 'error',
          //           summary: 'Error',
          //           detail: errorMessage,
          //         }
          //     )
          //   );
          //   return;
          // }
          this.#router.navigate(['/', 'accounts', account.id]);
        },
      });
  }

  deleteAccountClicked() {
    this.#whenFTService.deleteAccount(this.id).subscribe({
      next: () => this.#router.navigate(['/']),
    });
  }

  // addPlayerClicked(id: string, homeTeam: boolean) {
  //   this.#leagueService
  //     .addPlayerToRoster(this.id, id, homeTeam, '')
  //     .subscribe();
  // }

  // removePlayerClicked(id: string, homeTeam: boolean) {
  //   this.#leagueService
  //     .removePlayerFromRoster(this.id, id, homeTeam)
  //     .subscribe();
  // }
}
