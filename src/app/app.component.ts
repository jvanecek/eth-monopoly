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

  constructor(private contracts: ContractsService, private web3Service: Web3Service) {}

  ngOnInit(): void {
    this.contracts.initContracts(() => {
      this.initializeCurrentAddress();
      this.refreshHasOpenDonationCampaign();
      this.refreshCurrentDonatedAmount();
    });
  }

  initializeCurrentAddress(){
    this.web3Service.web3.eth.getCoinbase((err, addr) => {
      console.log( 'Current address: '+addr );

      this.currentAddress = addr;
      this.initializeCurrentAddressBalance();
    });
  }

  initializeCurrentAddressBalance(){
    this.web3Service.web3.eth.getBalance(this.currentAddress).then((balance)=>{
      console.log( 'Current address balance: '+balance);
      this.currentAddressBalance = balance;
    })
  }

  refreshHasOpenDonationCampaign(){
    this.contracts.DonatorInstance.hasOpenDonationCampaign({from: this.currentAddress}).then((result)=>{
      this.hasOpenDonationCampaign = result;
      console.log( this.currentAddress +' has open donation campaign: '+ this.hasOpenDonationCampaign );
    });
  }

  createDonationCampaing(value){
    this.contracts.DonatorInstance.createNew(value, {from: this.currentAddress});
    this.refreshHasOpenDonationCampaign();
    this.refreshCurrentDonatedAmount();
  }

  refreshCurrentDonatedAmount(){
    this.contracts.DonatorInstance.donatedBalance({from: this.currentAddress}).then((result)=>{
      this.currentDonatedAmount = result;
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
}
