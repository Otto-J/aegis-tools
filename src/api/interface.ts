import {config} from './config';
import {normalizeName} from './generate-api';
import {RefObject, resolveRefObject} from './ref';

interface InterfaceProperty {
  description: string;
  name: string;
  type: string;
}

export default class Interface {
  public name: RefObject;
  public properties: InterfaceProperty[];

  constructor() {
    this.name = null;
    this.properties = [];
  }

  get unwrap() {
    return this.name.unwrap;
  }

  public setName(name: string) {
    this.name = resolveRefObject(normalizeName(name));
  }


  get ignore() {
    return this.name.isObjectType || this.name.isArrayType || this.name.isAnyType;
  }

  public toString() {
    if(this.properties.length){
      return `export interface ${this.name.toString()} {
  ${
          this.properties.map(p => {
            return `${p.description ? `/**
   * ${p.description.trim()}
   */
  ` : ''}${this.name.name === 'Account' && p.name === 'id' ? '// @ts-ignore\n  ' : ''}${p.name}?: ${p.type};`;
          }).join('\n  ')
      }
}\n`;
    } else {
      return `export interface ${this.name.toString()} {}\n`
    }
  }
}
