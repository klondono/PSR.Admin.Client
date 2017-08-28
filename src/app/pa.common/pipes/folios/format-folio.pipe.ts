import { Pipe, PipeTransform } from '@angular/core';

//Constants
import { FOLIO } from '../../config/pa.common.config'

@Pipe({
  name: 'formatFolio'
})
export class FormatFolioPipe implements PipeTransform {

  transform(folio: string, args?: any): any {
    let result = '';
    //remove non digit characters
    let _folio = folio.replace(/\D/g, '');

    if (_folio.length > 0) {
      if (_folio.length == FOLIO.DefaultValues.realEstateLength) {
        result = _folio.substring(0, 2) + '-' + _folio.substring(2, 6) + '-' + _folio.substring(6, 9) + '-' + _folio.substring(9, FOLIO.DefaultValues.realEstateLength)
      }
      else if (_folio.length == FOLIO.DefaultValues.personalPropertyLength){
        result = _folio.substring(0, 2) + '-' + _folio.substring(2, FOLIO.DefaultValues.personalPropertyLength);
      }
    }
    return result;
  }

}

