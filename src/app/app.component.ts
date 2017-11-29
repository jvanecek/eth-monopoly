import { Component } from '@angular/core';

import { ContractsService } from './services/contracts.service';
import { Web3Service } from './services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentPlayerAddres: any;
  lastGameCreated: any;

  constructor(private contracts: ContractsService, private web3Service: Web3Service) {}

  ngOnInit(): void {
    this.contracts.initContracts(() => {
      this.initializeCurrentPlayer();
      this.updateLastGameCreated();
    });
  }

  initializeCurrentPlayer(){
    this.web3Service.web3.eth.getCoinbase((err, addr) => {
      console.log( addr );
      this.currentPlayerAddres = addr;
    });
  }

  createNewGame(){
    console.log( this.contracts.MonopolyGameInstance );
    this.contracts.MonopolyGameInstance.createNew({from: this.currentPlayerAddres});
    this.updateLastGameCreated();
  }

  updateLastGameCreated(){
    this.lastGameCreated = this.contracts.MonopolyGameInstance.lastGameId({from: this.currentPlayerAddres});
  }

  addToGameButton(gameId){
    console.log( 'Add player to'+gameId );
  }
}
