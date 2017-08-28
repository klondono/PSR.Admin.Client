    export interface IDbObject {
        ObjectId: number;
        TableSchema: string;
        TableName: string;
        ColumnName: string;
        DataType: string;
        Description: string;
        Tooltip: string;
    }

    export interface IServiceType {
        ServiceTypeID?: number;
        ServiceTypeOwnerGroupID?: string;
        DefaultRequestStatusID?: number;
        EscalationExpectedStatusID?: number;
        ServiceTypeNumber?: number;
        ServiceTypeOwnerGroupOverrideID?: any;
        ServiceTypeOwnerGroupOverrideMonthDayFrom?: any;
        ServiceTypeOwnerGroupOverrideMonthDayTo?: any;
        ServiceTypeName?: string;
        ServiceTypeDescription?: string;
        ServiceTypeDefaultDuration?: number;
        ServiceTypeAssigneeDependantOnPropertyFlag?: boolean;
        ServiceTypeIncludePropertyInfoFlag?: boolean;
        ServiceTypeIncludeFirstActionCommentFlag?: boolean;
        ServiceTypeShowAsStandaloneServiceFlag?: boolean;
        SelectableOnServiceTypeUpdateFlag?: boolean;
        ServiceTypeParentClosesWhenChildrenClosedFlag?: boolean;
        ServiceTypeConcurrentCreationOfChildrenFlag?: boolean;
        ServiceTypeAvailableToActiveDirectoryGroupName?: string;
        ServiceTypeAssigneeDependantOnOriginFlag?: boolean;
        ServiceTypeDependantOriginID?: number;
        ServiceTypeOwnerGroupOverrideOriginBased?: string;
        DefaultRequestFolioTypeID?: number;
        ForceRequestFolioType?: boolean;
        AdmIsActive?: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: string;
        AdmDateAdded?: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
        ServiceTypeOwnerGroup?: IServiceTypeOwnerGroup;
        ServiceTypeOwnerGroupOverride?: IServiceTypeOwnerGroup;
        RequestStatusDefault?: IRequestStatus;
        RequestStatusEscalation?: IRequestStatus;
        ServiceTypeSearchKeywordLinks?: IServiceTypeSearchKeywordLink[];
    }

    export interface IRequestActionTypeCustomField {
        RequestActionTypeCustomFieldID: number;
        RequestActionTypeID: number;
        CustomFieldTypeID: number;
        CustomFieldDataTypeID: number;
        LabelName: string;
        PlaceholderText: string;
        TextAlignment: string;
        Description: string;
        InputSequence: number;
        RequiredFlag: boolean;
        TooltipMessage: string;
        GroupingIdentifier1: string;
        GroupingIdentifier2?: any;
        DisplayFieldValueInCommentsFlag: boolean;
        AdmIsActive: string;
        AdmUserAdded: string;
        AdmUserAddedFullName?: any;
        AdmDateAdded?: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface IRequestOrigin {
        RequestOriginID: number;
        RequestOriginName: string;
        RequestOriginDescription?: any;
        AutoSelectedForActiveDirectoryGroup: string;
        ForceAutoSelectedOriginFlag: boolean;
        DisableProgressNotificationForAutoSelectedGroupFlag: boolean;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName: string;
        AdmDateAdded: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName: string;
        AdmDateModified: Date;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface IServiceTypeOwnerGroup {
        ServiceTypeOwnerGroupID: string;
        ServiceTypeOwnerGroupLocationID?: any;
        ServiceTypeOwnerGroupName: string;
        ServiceTypeOwnerGroupDescription?: any;
        ServiceTypeOwnerAvailableToActiveDirectoryGroupName: string;
        ServiceTypeOwnerActiveDirectoryGroupName: string;
        ServiceTypeOwnerGroupMainEmail: string;
        ServiceTypeOwnerGroupNotificationEmail: string;
        ServiceTypeOwnerGroupEscalationEmail: string;
        ServiceTypeOwnerGroupPhoneNo?: any;
        ServiceTypeOwnerGroupDistrictNo?: any;
        SelectableOnRequestCreationFlag: boolean;
        SelectableOnRequestReassignmentFlag: boolean;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName: string;
        AdmDateAdded: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }
    export interface IRequestStatus {
        RequestStatusID: number;
        RequestStatusName: string;
        RequestStatusDescription?: any;
        RequestStatusColor: string;
        StatusReopensRequestFlag: boolean;
        StatusClosesRequestFlag: boolean;
        SelectableOnRequestStatusChangeListFlag: boolean;
        SystemReservedFlag: boolean;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: any;
        AdmDateAdded: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified: Date;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }
    export interface IRequestFolioType {
        RequestFolioTypeID?: number;
        RequestFolioTypeName: string;
    }
    export interface IServiceTypeSearchKeyword {
        ServiceTypeSearchKeywordID: number;
        ServiceTypeSearchKeywordName: string;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: any;
        AdmDateAdded?: any;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface ICustomFieldType {
        CustomFieldTypeID: number;
        CustomFieldTypeName: string;
        CustomFieldTypeDescription: string;
        AllowEditFlag: boolean;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: any;
        AdmDateAdded?: any;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface ICustomFieldDataType {
        CustomFieldDataTypeID: number;
        CustomFieldDataTypeName: string;
        CustomFieldDataTypeDescription: string;
        RegularExpression: string;
        ErrorMessage: string;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: any;
        AdmDateAdded?: any;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface IServiceTypeSearchKeywordLink {
        ServiceTypeSearchKeywordLinkID: number;
        ServiceTypeID: number;
        ServiceTypeSearchKeywordID: number;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: any;
        AdmDateAdded?: any;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
        ServiceTypeSearchKeyword: IServiceTypeSearchKeyword;
    }

    export interface IServiceTypeCustomField {
        ServiceTypeCustomFieldID: number;
        ServiceTypeID: number;
        CustomFieldTypeID: number;
        CustomFieldDataTypeID: number;
        LabelName: string;
        PlaceholderText: string;
        TextAlignment: string;
        Description: string;
        InputSequence: number;
        RequiredFlag: boolean;
        TooltipMessage?: any;
        GroupingIdentifier1?: any;
        GroupingIdentifier2?: any;
        AdmIsActive: string;
        AdmUserAdded: string;
        AdmUserAddedFullName?: any;
        AdmDateAdded: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface IRequestActionType {
        RequestActionTypeID: number;
        RequestActionTypeName: string;
        RequestActionTypeDescription: string;
        BackgroundColor: string;
        TextColor: string;
        ChangeRequestStatusFlag: boolean;
        ReassignRequestFlag: boolean;
        AllowReplicationFlag: boolean;
        AllowUpdateOfServiceTypeFlag: boolean;
        AllowUpdateOfRequestFolioFlag: boolean;
        ByPassClientSideValidationFlag: boolean;
        DisplayFlag: boolean;
        UploadDocumentFlag: boolean;
        SystemReservedFlag: boolean;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: any;
        AdmDateAdded?: any;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface IServiceTypeRequestActionTypeLink {
        ServiceTypeRequestActionTypeLinkID: number;
        ServiceTypeID: number;
        RequestActionTypeID: number;
        AddActionActiveDirectoryGroupName: string;
        UpdateActionActiveDirectoryGroupName: string;
        DeleteActionActiveDirectoryGroupName: string;
        MaximumAllowedOcurrence?: any;
        ListSequence: number;
        RequestWorkspaceDisplayCode: number;
        PrecedenceConstraintRequestActionTypeIDValue: string;
        PrecedenceConstraintLogicalOperatorIsORFlag: boolean;
        AdmIsActive: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName: string;
        AdmDateAdded: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
    }

    export interface IServiceTypeSearchKeywordViewModel {
        ServiceTypeSearchKeywordLinkID: number;
        ServiceTypeSearchKeywordID: number;
        ServiceTypeSearchKeyword: IServiceTypeSearchKeyword;
    }

    export interface IServiceTypeSearchKeywordUpdateModel {
        ServiceTypeSearchKeywordLinkID: number;
        ServiceTypeSearchKeywordID: number;
        ServiceTypeSearchKeyword: string;
    }

    export interface IServiceTypeActionTypeLinkUpdateModel {
        ServiceTypeSearchKeywordLinkID: number;
        ServiceTypeSearchKeywordID: number;
        ServiceTypeSearchKeyword: string;
    }

    export interface IDisplayCode {
        DisplayCode: number;
        DisplayCodeName: string;
    }

    export interface IDropdownListType {
        BlnValue?: boolean;
        IntValue?: number;
        StrValue?: string;
        Label: string;
    }

    // export interface IAssociatedServiceTypeContainer {
    //     AssociatedServiceTypes: IAssociatedServiceType[];
    //     CustomFields: any[];
    // }

    // export interface IAssociatedServiceType {
    //     ServiceTypeID: number;
    //     ServiceTypeName: string;
    //     ServiceTypeParentID: number;
    //     ServiceTypeParentName: string;
    //     ServiceTypeDescription: string;
    //     ServiceTypeOwnerGroupID: string;
    //     ServiceTypeOwnerGroupName: string;
    //     DefaultRequestStatusID: number;
    //     StatusClosesRequestFlag: boolean;
    //     EscalationExpectedStatusID: number;
    //     ServiceTypeOwnerGroupNotificationEmail: string;
    //     ServiceTypeOwnerGroupEscalationEmail: string;
    //     ServiceTypeAssigneeDependantOnPropertyFlag: boolean;
    //     District?: any;
    //     ServiceTypeIncludePropertyInfoFlag: boolean;
    //     ServiceTypeIncludeFirstActionCommentFlag: boolean;
    //     ServiceTypeShowAsStandaloneServiceFlag: boolean;
    //     ServiceTypeParentClosesWhenChildrenClosedFlag: boolean;
    //     ServiceTypeChildRequiredFlag: boolean;
    //     ServiceTypeChildCheckedByDefaultFlag: boolean;
    //     ServiceTypeConcurrentCreationOfChildrenFlag: boolean;
    //     ServiceTypeChildStartDelay: number;
    //     ServiceTypeChildDuration: number;
    //     ServiceTypeChildStartTriggerID: number;
    //     EffectiveDate: Date;
    //     DueDate: Date;
    //     ServiceTypeAssigneeDependantOnOriginFlag: boolean;
    //     ServiceTypeDependantOriginID?: any;
    //     ServiceTypeOwnerGroupOverrideOriginBased?: any;
    //     DefaultRequestFolioTypeID?: any;
    //     ForceRequestFolioType: boolean;
    //     TreeLevel: number;
    // }

    export interface IServiceTypeRelationshipDefinition {
        ServiceTypeRelationshipDefinitionID?: number;
        ServiceTypeParentID?: number;
        ServiceTypeChildID?: number;
        ServiceTypeChildStartTriggerID?: number;
        ServiceTypeChildStartDelay?: number;
        ServiceTypeChildDuration?: number;
        ServiceTypeChildRequiredFlag?: boolean;
        ServiceTypeChildCheckedByDefaultFlag?: boolean;
        AdmIsActive?: string;
        AdmUserAdded?: any;
        AdmUserAddedFullName?: any;
        AdmDateAdded?: Date;
        AdmUserModified?: any;
        AdmUserModifiedFullName?: any;
        AdmDateModified?: any;
        AdmUserAddedDomainName?: any;
        AdmUserModifiedDomainName?: any;
        ServiceType1?: IServiceType;
    }


