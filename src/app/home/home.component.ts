import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SpinnerService } from '../infrastructure';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private spinnerService: SpinnerService){

  }



  private welcomeMessage: string = 'Welcome to the PSR Admin Application.'

  ngOnInit(){
    //this.spinnerService.show();
  }
}
