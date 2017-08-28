import { environment } from 'environments/environment'

export const APICONFIG = {
  urls: {
    serviceTypes: `${environment.appServiceURL}/ServiceTypes`,
    attachmenTypes: `${environment.appServiceURL}/AttachmentTypes`,
    requestOrigins: `${environment.appServiceURL}/RequestOrigins`,
    requestStatuses: `${environment.appServiceURL}/RequestStatuses`,
    serviceTypeCustomFields: `${environment.appServiceURL}/ServiceTypeCustomFields`,
    serviceTypeOwnerGroups: `${environment.appServiceURL}/ServiceTypeOwnerGroups`,
    serviceTypeRelationshipDefinitions: `${environment.appServiceURL}/ServiceTypeRelationshipDefinitions`,
    serviceTypeRequestActionTypeLinks: `${environment.appServiceURL}/ServiceTypeRequestActionTypeLinks`,
    serviceTypeSearchKeywords: `${environment.appServiceURL}/ServiceTypeSearchKeywords`,
    serviceTypeSearchKeywordLinks: `${environment.appServiceURL}/ServiceTypeSearchKeywordLinks`,
    requestActionTypes: `${environment.appServiceURL}/RequestActionTypes`,
    requestActionTypeCustomFields: `${environment.appServiceURL}/RequestActionTypeCustomFields`,
    customFieldTypes: `${environment.appServiceURL}/CustomFieldTypes`,
    customFieldDataTypes: `${environment.appServiceURL}/CustomFieldDataTypes`,
    dbObjects: `${environment.appServiceURL}/DbObjects`
  }
};