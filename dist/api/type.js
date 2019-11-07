"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ref_1 = require("./ref");
exports.types = [];
function findTypeByEnum(values) {
    return exports.types.find(t => hasSameItems(t.values, values));
}
exports.findTypeByEnum = findTypeByEnum;
function addType(type) {
    if (!exports.types.some(t => t.name === type.name)
        && !exports.types.some(t => hasSameItems(t.values, type.values))) {
        exports.types.push(type);
    }
}
exports.addType = addType;
function hasSameItems(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    if (a.some(it => !b.includes(it)) || b.some(it => !a.includes(it))) {
        return false;
    }
    return true;
}
class Type {
    constructor() {
        this.name = '';
        this.values = [];
        this.description = '';
        this.type = '';
    }
    toString() {
        return `${this.description ? '/**\n * ' + this.description + '\n */\n'
            : ''}type ${this.name} = ${this.values.map(v => {
            if (this.type === 'number') {
                return `${v}`;
            }
            else {
                return `'${v}'`;
            }
        }).join(' | ')};`;
    }
}
exports.default = Type;
function resolveType(propertyType, propertyDefinition) {
    let type = 'any';
    if (['string', 'boolean', 'number'].includes(propertyType)) {
        type = propertyType;
    }
    else if (['integer', 'number'].includes(propertyType)) {
        type = 'number';
    }
    else if (propertyType === 'array') {
        if (propertyDefinition) {
            if (propertyDefinition.items.genericRef) {
                type = propertyDefinition.items.genericRef.simpleRef + '[]';
            }
            else {
                if (propertyDefinition.items.type === 'array') {
                    return 'any[]';
                }
                type = resolveType(propertyDefinition.items.type, propertyDefinition) + '[]';
            }
        }
    }
    else {
        if (propertyDefinition && propertyDefinition.genericRef) {
            type = propertyDefinition.genericRef.simpleRef;
        }
        else {
            if (propertyType === 'object') {
                type = 'object';
            }
        }
    }
    return type;
}
exports.resolveType = resolveType;
function resolveResponseType(response) {
    if (response.schema) {
        if (response.schema.genericRef || response.schema.$ref) {
            // 将«»替换为<>
            let ref = pure((response.schema.genericRef && response.schema.genericRef.simpleRef) || response.schema.$ref.replace('#/definitions/', ''));
            return ref_1.resolveRef(ref);
        }
        else if (response.schema.items) {
            if (response.schema.items.genericRef && response.schema.items.genericRef.simpleRef) {
                const refObj = ref_1.resolveRefObject(response.schema.items.genericRef.simpleRef);
                refObj.isEnum = true;
                return refObj;
            }
            console.debug('无法识别response类型：');
            console.log(response);
        }
    }
    return undefined;
}
exports.resolveResponseType = resolveResponseType;
function pure(ref) {
    // if (!/^[a-zA-Z0-9<>\[\],]+$/i.test(res)) {
    //   console.log(res);
    // }
    return ref.replace(/«/g, '<').replace(/»/g, '>');
}
exports.pure = pure;
