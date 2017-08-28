import { Injectable } from '@angular/core';

@Injectable()
export class EntityService {
  clone<T>(source: T): T {
    return Object.assign({}, source);
  }

  merge = (target: any, ...sources: any[]) => Object.assign(target, ...sources);

  propertiesDiffer = (entityA: {}, entityB: {}) =>
    Object.keys(entityA).find(key => entityA[key] !== entityB[key])

  //modify to also account for type mismatches
  // removePropertyDelta = (target: {}, source: {}, dateConversion? :(value) => Date) =>
  //   Object.keys(target).forEach((key) => source.hasOwnProperty(key) ? null : delete target[key])
  removePropertyDelta = (target: {}, source: {}) =>
  Object.keys(target).forEach((key) => source.hasOwnProperty(key) ? null : delete target[key])

  patch<T>(target: T, source: {}): T {
    //clone source object as to affect original object
    let clonedSource = this.clone(source);
    //remove object properties that exist in source object but not in target object
    this.removePropertyDelta(clonedSource, target)
    //merge properties from cloned source and target objects
    let result = this.merge({}, target, clonedSource);
    //remove cloned source from memory
    clonedSource = null;
    return result;
  }
}


