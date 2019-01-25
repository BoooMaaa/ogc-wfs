import { WFSFilter } from './WFSFilter';
export declare class PropertyFilter extends WFSFilter {
    private comparison;
    private propertyName;
    private propertyValue;
    private secondValue;
    constructor(options: PropertyFilterOptions);
    toString(): string;
}
export declare type PropertyComparisons = 'EQ' | 'NotEQ' | 'LT' | 'GT' | 'LEQ' | 'GEQ' | 'Like' | 'IsNull' | 'Between';
export declare type PropertyFilterOptions = PropertyFilterOptionsIsNull | PropertyFilterOptionsBetween | PropertyFilterOptionsLike | PropertyFilterOptionsCommon;
export interface PropertyFilterOptionsBase {
    propertyName: string;
    comparison: PropertyComparisons;
}
export interface PropertyFilterOptionsIsNull extends PropertyFilterOptionsBase {
    comparison: 'IsNull';
}
export interface PropertyFilterOptionsBetween extends PropertyFilterOptionsBase {
    comparison: 'Between';
    propertyValue: string | number;
    secondValue: string | number;
}
export interface PropertyFilterOptionsLike extends PropertyFilterOptionsBase {
    comparison: 'Like';
    propertyValue: string;
}
export interface PropertyFilterOptionsCommon extends PropertyFilterOptionsBase {
    comparison: 'EQ' | 'NotEQ' | 'LT' | 'GT' | 'LEQ' | 'GEQ';
    propertyValue: string | number;
}
