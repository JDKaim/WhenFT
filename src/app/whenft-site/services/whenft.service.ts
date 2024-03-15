import { Injectable } from '@angular/core';
import {
  Observable,
  ReplaySubject,
  combineLatest,
  map,
  of,
  switchMap,
  take
} from 'rxjs';
import { CreateGame } from '../models/goalpost/create-game';
import { CreatePlay } from '../models/goalpost/create-play';
import { CreatePlayer } from '../models/goalpost/create-player';
import { EditGame } from '../models/goalpost/edit-game';
import { EditPlayer } from '../models/goalpost/edit-player';
import { EditTeam } from '../models/goalpost/edit-team';
import { PlayStats } from '../models/goalpost/play-stats';
import { Player } from '../models/goalpost/player';
import { CreateAccount } from '../models/whenft/account/create-account';
import { Account } from '../models/whenft/account/account';
import { NFT } from '../models/whenft/nft';
import { WhenFTModel } from '../models/whenft/whenft-model';
import { EditAccount } from '../models/whenft/account/edit-account';

// NOTE: This service is overly complicated because of the way it's dealing with local data. If dealing with
// a proper database or backend service this would probablyend up a bit cleaner.

@Injectable({
  providedIn: 'root',
})
export class WhenFTService {
  private static WhenFTStorageKey = 'whenft';

  #subject = new ReplaySubject<WhenFTModel>(1);

  #whenFT: WhenFTModel;

  constructor() {
    this.#whenFT = this.#loadData();
    this.#subject.next(this.#whenFT);
    this.watchWhenFt$().subscribe({ next: (whenFT) => this.#saveData(whenFT) });
  }

  watchWhenFt$() {
    return this.#subject.asObservable();
  }

  // watchPlayStats$(id: string): Observable<Array<PlayStats>> {
  //   return this.watchPlays$(id).pipe(
  //     switchMap((plays) => {
  //       if (!plays?.length) {
  //         return of([]);
  //       }
  //       const playerArray = Array.from(
  //         new Set(
  //           plays
  //             .map((play) => [
  //               play.passer,
  //               play.rusher,
  //               play.receiver,
  //               play.flagPuller,
  //               play.turnoverPlayer,
  //             ])
  //             .flat()
  //             .filter((playerId) => playerId)
  //         ).values()
  //       ).map((playerId) => this.watchPlayer$(playerId!));
  //       const observables = [
  //         this.watchTeam$(plays[0].offensiveTeamId),
  //         this.watchTeam$(plays[0].defensiveTeamId),
  //       ];
  //       return combineLatest([
  //         combineLatest(observables),
  //         combineLatest(playerArray),
  //       ]).pipe(
  //         take(1),
  //         map((responses) => {
  //           const teamMap = new Map(
  //             responses[0].map((team) => [team!.id, team!])
  //           );
  //           const playerMap = new Map(
  //             responses[1].map((player) => [player!.id, player!])
  //           );
  //           return plays.map((play) => {
  //             switch (play.type) {
  //               case 'rushing':
  //               case 'one-point-rush':
  //               case 'two-point-rush':
  //                 return PlayStats.createRush(
  //                   play,
  //                   teamMap.get(play.offensiveTeamId)!,
  //                   teamMap.get(play.defensiveTeamId)!,
  //                   playerMap.get(play.rusher!)!,
  //                   play.flagPuller
  //                     ? playerMap.get(play.flagPuller)
  //                     : undefined,
  //                   play.turnoverPlayer
  //                     ? playerMap.get(play.turnoverPlayer)
  //                     : undefined
  //                 );
  //               case 'passing':
  //               case 'one-point-pass':
  //               case 'two-point-pass':
  //                 return PlayStats.createPass(
  //                   play,
  //                   teamMap.get(play.offensiveTeamId)!,
  //                   teamMap.get(play.defensiveTeamId)!,
  //                   playerMap.get(play.passer!)!,
  //                   playerMap.get(play.receiver!)!,
  //                   play.flagPuller
  //                     ? playerMap.get(play.flagPuller)
  //                     : undefined,
  //                   play.turnoverPlayer
  //                     ? playerMap.get(play.turnoverPlayer)
  //                     : undefined
  //                 );
  //               default:
  //                 throw new Error('Unsupported play type.');
  //             }
  //           });
  //         })
  //       );
  //     })
  //   );
  // }

  watchAccounts$() {
    return this.watchWhenFt$().pipe(map((whenFT) => whenFT.accounts));
  }

  watchAccount$(id: number) {
    return this.watchAccounts$().pipe(
      map((accounts) => accounts.find((account) => account.id === id))
    );
  }

  watchNFTs$() {
    return this.watchWhenFt$().pipe(map((whenFT) => whenFT.nfts));
  }

  watchNFT$(id: number) {
    return this.watchNFTs$().pipe(
      map((nfts) => nfts.find((nft) => nft.id === id))
    );
  }

  watchAccountNFTs$(id: number) {
    return this.watchNFTs$().pipe(
      map((nfts) => nfts.filter((nft) => nft.owner?.id === id))
    );
  }

  watchNFTOwner$(id: number) {
    return this.watchNFT$(id).pipe(switchMap((nft) => {
      if (!nft) {
        return of(undefined);
      }
      return this.watchAccount$(nft.id);
    }));
  }

  #saveData(whenFT: WhenFTModel) {
    localStorage.setItem(
      WhenFTService.WhenFTStorageKey,
      JSON.stringify(whenFT)
    );
  }

  resetLeague() {
    this.#whenFT = {
      accounts: [
        { id: 0, name: 'JD', email: 'jd@when.ft', portfolio: [], coins: 0, lastSpin: 0 },
        { id: 1, name: 'Lucas', email: 'lucas@when.ft', portfolio: [], coins: 0, lastSpin: 0 },
      ],
      nfts: [],
    };
    this.#saveData(this.#whenFT);
  }

  #loadData() {
    const json = localStorage.getItem(WhenFTService.WhenFTStorageKey);
    try {
      this.#whenFT = JSON.parse(json!) as WhenFTModel;
      if (this.#whenFT) {
        return this.#whenFT;
      }
    } catch {}
    this.resetLeague();
    return this.#whenFT;
  }

  createAccount(createAccount: CreateAccount) {
    createAccount.name = createAccount.name.trim();
    if (createAccount.id === 0) {
      throw new Error('Account ID cannot be 0.');
    }
    if (!createAccount.id || !createAccount.name) {
      throw new Error('Account must have ID and name.');
    }
    if (this.#whenFT.accounts.find((curAccount) => curAccount.name === createAccount.name)) {
      throw new Error('Account name already exists.');
    }
    if (this.#whenFT.accounts.find((curAccount) => curAccount.id === createAccount.id)) {
      throw new Error('Account ID already exists.');
    }
    if (this.#whenFT.accounts.find((curAccount) => curAccount.email === createAccount.email)) {
      throw new Error('Account email already exists.');
    }
    const account = { ...createAccount, portfolio: Array<NFT>(), coins: 0, lastSpin: 0 }
    this.#whenFT.accounts.push(account);
    this.#subject.next(this.#whenFT);
    return of(account);
  }

  editAccount(id: number, newAccount: EditAccount) {
    newAccount.name = newAccount.name.trim();
    const account = this.#whenFT.accounts.find((account) => account.id === id);
    if (!account) {
      throw new Error('Account being edited does not exist.');
    }
    if (
      account.name != newAccount.name &&
      this.#whenFT.accounts.some((curAccount) => curAccount.name === newAccount.name)
    ) {
      throw new Error('Account name already exists.');
    }
    if (
      account.id != newAccount.id &&
      this.#whenFT.accounts.some((curAccount) => curAccount.id === newAccount.id)
    ) {
      throw new Error('Account ID already exists.');
    }
    account.id = newAccount.id;
    account.name = newAccount.name;
    this.#subject.next(this.#whenFT);
    return of(account);
  }

  deleteAccount(id: number) {
    this.#whenFT.accounts = this.#whenFT.accounts.filter((account) => account.id != id);
    this.#subject.next(this.#whenFT);
    return of(true);
  }


  
  // createPlayer(player: CreatePlayer) {
  //   player.id = player.id.trim();
  //   player.name = player.name.trim();
  //   if (!player.id || !player.name) {
  //     throw new Error('Player must have ID and name.');
  //   }
  //   if (
  //     this.#league.players.find((curPlayer) => curPlayer.name === player.name)
  //   ) {
  //     throw new Error('Player name already exists.');
  //   }
  //   if (this.#league.players.find((curPlayer) => curPlayer.id === player.id)) {
  //     throw new Error('Player ID already exists.');
  //   }
  //   this.#league.players.push({ ...player });
  //   this.#subject.next(this.#league);
  //   return of(player);
  // }

  // editPlayer(id: string, newPlayer: EditPlayer) {
  //   newPlayer.id = newPlayer.id.trim();
  //   newPlayer.name = newPlayer.name.trim();
  //   const player = this.#league.players.find((player) => player.id === id);
  //   if (!player) {
  //     throw new Error('Player being edited does not exist.');
  //   }
  //   if (
  //     player.name != newPlayer.name &&
  //     this.#league.players.some(
  //       (curPlayer) => curPlayer.name === newPlayer.name
  //     )
  //   ) {
  //     throw new Error('Player name already exists.');
  //   }
  //   player.name = newPlayer.name;
  //   this.#subject.next(this.#league);
  //   return of(player);
  // }

  // deletePlayer(id: string) {
  //   this.#league.players = this.#league.players.filter(
  //     (player) => player.id != id
  //   );
  //   this.#subject.next(this.#league);
  //   return of(true);
  // }

  // createGame(game: CreateGame) {
  //   if (this.#league.games.find((leagueGame) => leagueGame.id === game.id)) {
  //     throw new Error('Game ID already exists.');
  //   }
  //   const homeTeam = this.#league.teams.find(
  //     (team) => team.id === game.homeTeamId
  //   );
  //   if (!homeTeam) {
  //     throw new Error('Home Team in game does not exist.');
  //   }
  //   const awayTeam = this.#league.teams.find(
  //     (team) => team.id === game.awayTeamId
  //   );
  //   if (!awayTeam) {
  //     throw new Error('Away Team in game does not exist.');
  //   }
  //   this.#league.games.push(game);
  //   this.#subject.next(this.#league);
  //   return of(game);
  // }

  // editGame(id: string, editGame: EditGame) {
  //   return this.watchGame$(id).pipe(
  //     take(1),
  //     switchMap((game) => {
  //       if (!game) {
  //         return of(null);
  //       }
  //       game.location = editGame.location;
  //       game.startTime = editGame.startTime;
  //       game.status = editGame.status;
  //       this.#subject.next(this.#league);
  //       return of(game);
  //     })
  //   );
  // }

  // deleteGame(id: string) {
  //   this.#league.games = this.#league.games.filter((game) => game.id != id);
  //   this.#subject.next(this.#league);
  //   return of(true);
  // }

  // addPlayerToRoster(
  //   gameId: string,
  //   playerId: string,
  //   isHomeRoster: boolean,
  //   jersey: string
  // ) {
  //   return this.watchGame$(gameId).pipe(
  //     take(1),
  //     switchMap((game) => {
  //       if (!game) {
  //         return of(false);
  //       }
  //       if (game.awayRoster.find((player) => player.id === playerId)) {
  //         return of(false);
  //       }
  //       if (game.homeRoster.find((player) => player.id === playerId)) {
  //         return of(false);
  //       }
  //       return this.watchPlayer$(playerId).pipe(
  //         take(1),
  //         switchMap((player) => {
  //           if (!player) {
  //             return of(false);
  //           }
  //           if (isHomeRoster) {
  //             game.homeRoster.push({ id: playerId, jersey });
  //           } else {
  //             game.awayRoster.push({ id: playerId, jersey });
  //           }
  //           this.#subject.next(this.#league);
  //           return of(true);
  //         })
  //       );
  //     })
  //   );
  // }

  // removePlayerFromRoster(
  //   gameId: string,
  //   playerId: string,
  //   isHomeRoster: boolean
  // ) {
  //   return this.watchGame$(gameId).pipe(
  //     take(1),
  //     switchMap((game) => {
  //       if (!game) {
  //         return of(false);
  //       }
  //       if (isHomeRoster) {
  //         const player = game.homeRoster.find(
  //           (rosterPlayer) => rosterPlayer.id === playerId
  //         );
  //         if (!player) {
  //           return of(false);
  //         }
  //         game.homeRoster = game.homeRoster.filter(
  //           (rosterPlayer) => rosterPlayer.id != player.id
  //         );
  //         this.#subject.next(this.#league);
  //         return of(true);
  //       }
  //       const player = game.awayRoster.find(
  //         (rosterPlayer) => rosterPlayer.id === playerId
  //       );
  //       if (!player) {
  //         return of(false);
  //       }
  //       game.awayRoster = game.awayRoster.filter(
  //         (rosterPlayer) => rosterPlayer.id != player.id
  //       );
  //       this.#subject.next(this.#league);
  //       return of(true);
  //     })
  //   );
  // }

  // watchRoster$(id: string, homeTeam: boolean) {
  //   return this.watchGame$(id).pipe(
  //     switchMap((game) => {
  //       if (!game) {
  //         return of(new Array<Player>());
  //       }
  //       if (homeTeam) {
  //         return of(
  //           game.homeRoster.map(
  //             (playerGame) =>
  //               this.#league.players.find(
  //                 (player) => player.id === playerGame.id
  //               )!
  //           )
  //         );
  //       }
  //       return of(
  //         game.awayRoster.map(
  //           (playerGame) =>
  //             this.#league.players.find(
  //               (player) => player.id === playerGame.id
  //             )!
  //         )
  //       );
  //     })
  //   );
  // }

  // createPlay(gameId: string, play: CreatePlay) {
  //   return this.watchGame$(gameId).pipe(
  //     take(1),
  //     map((game) => {
  //       if (!game) {
  //         return null;
  //       }
  //       const newPlay = {
  //         ...play,
  //         id: game.plays.length.toString(),
  //         index: game.plays.length,
  //       };
  //       game.plays.push(newPlay);
  //       this.#subject.next(this.#league);
  //       return newPlay;
  //     })
  //   );
  // }
}
