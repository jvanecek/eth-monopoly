import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import Web3 from 'web3';

import { Web3Service } from './web3.service';
import getWeb3 from '../util/get-web3'

import BankerContract from '../../../build/contracts/Banker.json';
import MonopolyBoardContract from '../../../build/contracts/MonopolyBoard.json';
import MonopolyGameContract from '../../../build/contracts/MonopolyGame.json';

declare let window: any;

@Injectable()
export class ContractsService {
  public initialized: boolean = false;

  public Banker: any;
  public BankerInstance: any;
  public MonopolyBoard: any;
  public MonopolyBoardInstance: any;
  public MonopolyGame: any;
  public MonopolyGameInstance: any;

  constructor(private web3Service: Web3Service) {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then((results: any) => {
      // Initialize contracts once web3 provided.
      this.initContracts(() => {
        this.initialized = true;
      });
    }).catch(() => {
      console.log('Error finding web3.');
    });

  }

  init(callback: any, retries: number = 0) {
    if (retries > 10) {
      return;
    }
    if (this.initialized) {
      return callback();
    }
    setTimeout(() => {
      return this.init(callback, retries++);
    }, 100);
  }

  async initContracts(callback: any) {

    console.log( "Por inicializar los contratos" );

    await this.web3Service.artifactsToContract(BankerContract)
      .then((BankerContractAbstraction) => this.Banker = BankerContractAbstraction);
    this.BankerInstance = await this.Banker.deployed();

    await this.web3Service.artifactsToContract(MonopolyBoardContract)
      .then((MonopolyBoardContractAbstraction) => this.MonopolyBoard = MonopolyBoardContractAbstraction);
    this.MonopolyBoardInstance = await this.MonopolyBoard.deployed();

    await this.web3Service.artifactsToContract(MonopolyGameContract)
      .then((MonopolyGameContractAbstraction) => this.MonopolyGame = MonopolyGameContractAbstraction);
    this.MonopolyGameInstance = await this.MonopolyGame.deployed();

    console.log( "Contratos inicializados." );

    callback();
  }

}
