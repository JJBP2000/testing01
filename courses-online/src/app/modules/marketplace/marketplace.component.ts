import { Component } from '@angular/core';
declare var $: any;
declare function HOMEINIT([]): any;
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent {
  constructor(){
    setTimeout(() => {
      HOMEINIT($);
    }, 50);
  }
}
