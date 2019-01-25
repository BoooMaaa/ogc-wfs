import { WFSFilter } from './WFSFilter';
import { templateRender } from '../utils/templateRender';

export class PropertyFilter extends WFSFilter {
    private comparison: PropertyComparisons;
    private propertyName: string;
    private propertyValue: string|number;
    private secondValue: string|number;

    constructor(options: PropertyFilterOptions) {
        super();
        switch (options.comparison) {
            case 'IsNull':
                break;
            case 'Between':
                this.propertyValue = options.propertyValue;
                this.secondValue = options.secondValue;
                break;
            default:
                this.propertyValue = options.propertyValue;
        }
        this.propertyName = options.propertyName;
        this.comparison = options.comparison;
    }

    toString(): string {
        const comparison = comparisonList[this.comparison];
        const propertyName = this.propertyName;
        const data = {
            comparison,
            propertyName,
            attributes: '',
            value: ''
        };
        switch (this.comparison) {
            case 'IsNull':
                break;
            case 'Between':
                data.value = templateRender(betweenValueTemplate, { value1: this.propertyValue, value2: this.secondValue });
                break;
            case 'Like':
                data.attributes = 'wildCard="*" singleChar="#" escapeChar="!"';
                data.value = templateRender(valueTemplate, { value: this.propertyValue });
                break;
            default:
                data.value = templateRender(valueTemplate, { value: this.propertyValue });
        }
        return templateRender(template, data);
    }
}

const template =
`<ogc:{{ comparison }} {{ attributes }}>
<ogc:PropertyName>{{ propertyName }}</ogc:PropertyName>
{{ value }}
</ogc:{{ comparison }}>`;

const valueTemplate =
`<ogc:Literal>{{ value }}</ogc:Literal>`;

const betweenValueTemplate =
`<ogc:LowerBoundary>{{ value1 }}</ogc:LowerBoundary>
<ogc:UpperBoundary>{{ value2 }}</ogc:UpperBoundary>`;

const comparisonList = {
    EQ: 'PropertyIsEqualTo',
    NotEQ: 'PropertyIsNotEqualTo',
    LT: 'PropertyIsLessThan',
    GT: 'PropertyIsGreaterThan',
    LEQ: 'PropertyIsLessThanOrEqualTo',
    GEQ: 'PropertyIsGreaterThanOrEqualTo',
    Like: 'PropertyIsLike',
    IsNull: 'PropertyIsNull',
    Between: 'PropertyIsBetween'
};

export type PropertyComparisons = 'EQ' | 'NotEQ' | 'LT' | 'GT' | 'LEQ' | 'GEQ' | 'Like' | 'IsNull' | 'Between';

export type PropertyFilterOptions = PropertyFilterOptionsIsNull | PropertyFilterOptionsBetween | PropertyFilterOptionsLike | PropertyFilterOptionsCommon;

export interface PropertyFilterOptionsBase {
    propertyName: string;
    comparison: PropertyComparisons;
}

export interface PropertyFilterOptionsIsNull extends PropertyFilterOptionsBase {
    comparison: 'IsNull';
}

export interface PropertyFilterOptionsBetween extends PropertyFilterOptionsBase {
    comparison: 'Between';
    propertyValue: string|number;
    secondValue: string|number;
}

export interface PropertyFilterOptionsLike extends PropertyFilterOptionsBase {
    comparison: 'Like';
    propertyValue: string;
}

export interface PropertyFilterOptionsCommon extends PropertyFilterOptionsBase {
    comparison: 'EQ'|'NotEQ'|'LT'|'GT'|'LEQ'|'GEQ';
    propertyValue: string|number;
}