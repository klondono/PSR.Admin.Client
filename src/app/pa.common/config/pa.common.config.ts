import { environment } from 'environments/environment'

const baseURL = environment.paCommonBaseURL;

export interface IFilterDictionary {
  key: any,
  value: any
};

export const FOLIO = {
  DefaultValues: {
        realEstateLength: 13,
        personalPropertyLength: 8,
        lengthFormatted: 16
    }
};

export const PACONFIG = {
    Urls: {
    getUserName: `${baseURL}/PA.Services/OData/CurrentUser`,
    folioExists: `${baseURL}/PA.Services/OData/FolioExist`
    }
};

