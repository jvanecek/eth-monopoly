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

  constructor(private contracts: ContractsService, private web3Service: Web3Service) {}

  ngOnInit(): void {
    this.contracts.init(() => {
      this.web3Service.web3.eth.getCoinbase((err, addr) => {
        console.log( addr );
        this.currentPlayerAddres = addr;
      });
    });
  }

}
