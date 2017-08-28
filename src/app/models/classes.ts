import {IServiceTypeSearchKeywordUpdateModel, IServiceTypeActionTypeLinkUpdateModel} from './interfaces'

export class ServiceTypeSearchKeywordContainerModel {
    ServiceTypeID : number;
    DeletedSearchTermIDs: number[];
    ServiceTypeSearchKeywordUpdateModel: IServiceTypeSearchKeywordUpdateModel[]
}

export class ServiceTypeActionTypeLinkContainerModel {
    ServiceTypeID : number;
    DeletedActionTypeLinkIDs: number[];
    ServiceTypeActionTypeLinkUpdateModel: any
}

export class ServiceTypeRelationshipDefinitionDeletionModel {
        ServiceTypeRelationshipDefinitionID: number
        DeletionTypeCode: number
}

export class WorkflowNode {

    private Expanded: boolean = true;
    //private Checked: boolean = false;
    private HighlightNode: boolean = false;

constructor(
    public ServiceTypeRelationshipDefinitionID: number,
    public ServiceTypeID:number,
    public ParentID: number,
    public ServiceTypeName:string,
    public ServiceTypeStartTrigger: string,
    public ConcurrentCreationOfChildren: string,
    public ClosesWithDependantWorkflows: string,
    public ServiceTypeShowAsStandaloneService: string,
    public WorkflowNodes:Array<WorkflowNode>,
    public Files:Array<string>) {}

    toggle() {
        this.Expanded = !this.Expanded;
    }

    onMouseover(){
        this.HighlightNode = true;
        this.highlightRecursive(this.HighlightNode);
    }

    onMouseout(){
        this.HighlightNode = false;
        this.highlightRecursive(this.HighlightNode);
    }

    highlightRecursive(state: boolean){
        this.WorkflowNodes.forEach(d => {
            d.HighlightNode = state;
            d.highlightRecursive(state);
        });
    }

    // check(){
    //     this.Checked = !this.Checked;
    //     this.checkRecursive(this.Checked);
    // }

    // checkRecursive(state:boolean){
    //     this.WorkflowNodes.forEach(d => {
    //         d.Checked = state;
    //         d.checkRecursive(state);
    //     });
    // }
}