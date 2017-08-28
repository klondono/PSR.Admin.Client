import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { fromEvent } from "rxjs/observable/fromEvent";
import { DbObjectService } from '../../api';
import { IDbObject } from '../../models';

@Injectable()
export class GeneralService {

  private disableButton: boolean = false;
  private saveButtonText: string = 'Save';
  private inputMouseoverSubscription: Subscription;
  private dbObjects: IDbObject[];
  private defaultObject: string;

  constructor(private dbObjectService: DbObjectService) {}

  toggleSaveButtonMode(){
    this.disableButton = !this.disableButton;
    this.saveButtonText = this.saveButtonText === 'Save' ? 'Saving' : 'Save';
  }

  private generateTooltipMessages(elementList: NodeListOf<Element>) {
    elementList = document.querySelectorAll('input, select, textarea');

    let fn: Function = this.generateTooltipMessages.bind(this);

    if(elementList.length == 0) {
        setTimeout(function() { fn(elementList) }, 100)
    }
    else{
        this.getTooltpMessagesForElements(elementList);
    }
  }

  private getTooltpMessagesForElements(inputElements: NodeListOf<Element>){

    this.inputMouseoverSubscription = fromEvent(inputElements, 'mouseover')
    .subscribe(
      (e:MouseEvent) => {
          e.preventDefault();
          let formControlElement = e.srcElement;
          this.getDbObjectByName(formControlElement);
        },
        (err)=> console.log('Error in contextMenuSubscription.'),
        ()=> { console.log('completed contextMenuSubscription.')}
    )
    //// Plain Javascript version
    // for (var i = 0; i < inputElements.length; i++) {

    //   //Leverage closures to ensure the function has it's own lexical environment and access to the element variable
    //   (function(){
    //       var element:any = inputElements[i];
    //       element.addEventListener('contextmenu', function(e: MouseEvent){
    //         e.preventDefault();
    //         console.log(element.getAttribute("formcontrolname"));
    //       });

    //   })();
    // }
  }

  private getDbObjectByName(inputElement : Element) {

    //call database for tooltip messages on elements that don't already have a title aka tooltip message
    if(inputElement.hasAttribute('title')){

      return
    }

    this.dbObjects = [];
    let name = inputElement.getAttribute("formcontrolname");
    let optionalOdataParam = this.defaultObject == ''? `` : `and TableName eq '${this.defaultObject}'`;
    const odataParams: string = `?$filter=(ColumnName eq '${name}'${optionalOdataParam})&$format=application/json;odata.metadata=none`;
    this.dbObjectService.getDbObjects(odataParams)
      .subscribe(data => {
        this.dbObjects = data;
        let toolTip = data.length == 0 ? "Not a database object." : this.dbObjects[0].Tooltip;
        inputElement.setAttribute('title',toolTip);

      }, (err) => {
        console.log('error');
      },
      () => {
        console.log('completed dbObjectService subscription');
      });
  }

  subscribeToTooltipMessages(defaultObjectParam: string = ''){
    this.defaultObject = defaultObjectParam;
    let inputElements: NodeListOf<Element>;
    this.generateTooltipMessages(inputElements);

  }

  unsubscribeFromTooltipMessages(){
    this.inputMouseoverSubscription.unsubscribe();

  }

}
