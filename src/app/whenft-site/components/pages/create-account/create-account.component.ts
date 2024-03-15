import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessagesModule } from 'primeng/messages';
import { TooltipModule } from 'primeng/tooltip';
import { WhenFTService } from 'src/app/whenft-site/services/whenft.service';

@Component({
  standalone: true,
  selector: 'create-account',
  templateUrl: './create-account.component.html',
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
  ],
})
export class CreateAccountComponent {
  #whenFTService = inject(WhenFTService);
  #router = inject(Router);
  #fb = inject(FormBuilder);
  form = this.#fb.group(
    {
      id: this.#fb.nonNullable.control(0, [Validators.required, Validators.minLength(2), Validators.maxLength(4)],),
      name: this.#fb.nonNullable.control('', [Validators.required]),
      email: this.#fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
    }
  );
  
  errors = new Array<Message>();

  createAccountClicked() {
    if (!this.form.valid) {
      throw new Error('Form is not valid.');
    }
    const account = this.form.value;
    this.errors = [];
    try {
      this.#whenFTService
      .createAccount({
        id: account.id!,
        name: account.name!,
        email: account.email!
      })
      .subscribe({
        next: (account) => {
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
    } catch (e: any) {
      this.errors.push( { severity: 'error', summary: 'Error', detail: e.message });
    }
    
  }
}
