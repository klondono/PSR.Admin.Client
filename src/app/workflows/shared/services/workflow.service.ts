import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription'

import { IServiceTypeRelationshipDefinition } from '../../../models';

export class EditRelationshipInfo {
  constructor(public RelationshipID : number,
  public DefaultParentID: number){}
}

@Injectable()
export class WorkflowService {

// Observable source
private relationshipIDs$ = new Subject<EditRelationshipInfo>();
private refreshTreeview$ = new Subject<boolean>();

//subscribed to by workflow edit component to detect commands from treeview sibling component
getServiceTypeRelationshipDefinitionID(){
    return this.relationshipIDs$;
}
//values here are set by the treeview component for consumption by workflow edit component
setServiceTypeRelationshipDefinitionID(relationshipID: number, defaultParentID: number) {

    let editRelationshipInfo = new EditRelationshipInfo(relationshipID, defaultParentID);
    this.relationshipIDs$.next(editRelationshipInfo);
}

onWorkflowRelationshipDeletion(){
    return this.refreshTreeview$;
}

triggerWorkflowRelationshipTreeviewRefresh() {
    this.refreshTreeview$.next(true);
}

constructor() {}

}
