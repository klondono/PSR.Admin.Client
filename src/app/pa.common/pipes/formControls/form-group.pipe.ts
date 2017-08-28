import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

//model
import { IFilterDictionary } from '../../config/pa.common.config'

@Pipe({
  name: 'formGroupFilter'
})
export class FormGroupPipe implements PipeTransform {

transform(items: FormGroup[], args: IFilterDictionary): any {
        return items.filter(item => item.get(args.key).value === args.value);
    }
}