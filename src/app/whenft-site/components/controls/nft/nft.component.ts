import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable } from 'rxjs';
import { NFT } from 'src/app/whenft-site/models/whenft/nft';
import { WhenFTService } from 'src/app/whenft-site/services/whenft.service';

@Component({
  standalone: true,
  selector: 'nft',
  templateUrl: './nft.component.html',
  imports: [CommonModule, ProgressBarModule, SkeletonModule],
})
export class NFTComponent implements OnInit {
  #whenFTService = inject(WhenFTService);
  @Input() nftId!: number;
  nft$ = new Observable<NFT | undefined>();

  ngOnInit(): void {
    this.nft$ = this.#whenFTService.watchNFT$(this.nftId);
  }

  colors = ["blue", "green", "yellow", "cyan", "pink", "indigo", "teal", "orange", "gray", "purple", "red"];
}
