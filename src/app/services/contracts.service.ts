import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import Web3 from 'web3';

import { Web3Service } from './web3.service';
import getWeb3 from '../util/get-web3'

import DonatorContract from '../../../build/contracts/Donator.json';

declare let window: any;

@Injectable()
export class ContractsService {
  public initialized: boolean = false;

  public Donator: any;
  public DonatorInstance: any;

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

    await this.web3Service.artifactsToContract(DonatorContract)
      .then((DonatorContractAbstraction) => this.Donator = DonatorContractAbstraction);
    this.DonatorInstance = await this.Donator.deployed();

    console.log( "Contratos inicializados." );

    callback();
  }

}
