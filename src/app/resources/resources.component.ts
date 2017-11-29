import { Component, Input, OnInit } from '@angular/core';
import BigNumber from 'bignumber.js';

import { Web3Service } from '../services/web3.service';
import { ContractsService } from '../services/contracts.service';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  @Input() account: any;
  @Input() balance: any;

  constructor(private contracts: ContractsService, private web3Service: Web3Service) {}

  ngOnInit(): void {}

  async getLastGameId() {
    console.log('Getting Resources of ' + this.account);

    try {
      const transaction = await this.contracts.MonopolyGameInstance.lastGameId.call({from: this.account});
      console.log( transaction );

    } catch (e) {
      console.log(e);
    }
  }
}
