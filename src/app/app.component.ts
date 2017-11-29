import { Component } from '@angular/core';

import { ContractsService } from './services/contracts.service';
import { Web3Service } from './services/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentAddress: any;
  currentAddressBalance: any;
  currentDonatedAmount: any;
  hasOpenDonationCampaign: boolean;
  withdrawlMinimum: any;
  canWithdrawl: any;

  constructor(private contracts: ContractsService, private web3Service: Web3Service) {}

  ngOnInit(): void {
    this.contracts.initContracts(() => {
      this.initializeCurrentAddress();
    });
  }

  initializeCurrentAddress(){
    this.web3Service.web3.eth.getCoinbase((err, addr) => {
      console.log( 'Current address set to: '+addr );

      this.currentAddress = addr;
      this.initializeCurrentAddressBalance();
      this.refreshCurrentDonationStatus();
    });
  }

  initializeCurrentAddressBalance(){
    this.web3Service.web3.eth.getBalance(this.currentAddress).then((balance)=>{
      console.log( 'Current address balance: '+balance);
      this.currentAddressBalance = balance;
    })
  }

  createDonationCampaing(value){
    this.contracts.DonatorInstance.createNew(value, {from: this.currentAddress});
    this.refreshCurrentDonationStatus();
  }

  refreshCurrentDonationStatus(){
    this.contracts.DonatorInstance.donationStatus({from: this.currentAddress})
      .then((result)=>{
        console.log( 'Estado de la campana de '+this.currentAddress);
        console.log( result );
        this.hasOpenDonationCampaign = result[0];
        this.currentDonatedAmount = result[1].toNumber();
        this.withdrawlMinimum = result[2].toNumber();
        this.canWithdrawl = this.currentDonatedAmount >= this.withdrawlMinimum;
    });
  }

  donateTo(beneficiaryAddress, donatedAmount){
    this.contracts.DonatorInstance
      .donate(beneficiaryAddress, {from: this.currentAddress, value: donatedAmount})
      .then(()=>{
        console.log( 'Donacion exitosa de '+this.currentAddress+' a '+beneficiaryAddress+' por '+donatedAmount );
      }, (err)=>{
        console.log( err );
      })
  }

  completedPercentage(){
    return Math.floor((this.currentDonatedAmount / this.withdrawlMinimum) * 100) + '%';
  }

  withdrawlDonation(){
    this.contracts.DonatorInstance
      .withdrawl({from: this.currentAddress})
      .then((result)=>{
        console.log( result );
      },(err)=>{
        console.log( 'Error al retirar los fondos: '+err );
      });
  }
}
