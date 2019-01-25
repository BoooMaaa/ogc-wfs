import { WFSFilter } from './WFSFilter';
import { GeometryObject } from '../geometry/GeometryObject';
export declare class GeometryFilter extends WFSFilter {
    private geometryField;
    private operator;
    private gml;
    constructor(geometryField: string, operator: GeometryOperator, geometry: GeometryObject);
    toString(): string;
}
export declare type GeometryOperator = 'BBox' | 'Equals' | 'Disjoint' | 'Touches' | 'Within' | 'Overlaps' | 'Crosses' | 'Intersects' | 'Contains';
