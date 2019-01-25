import { GeometryObject } from './GeometryObject';
/**
 * format GeometryObject json to gml
 */
export declare class GML {
    private gmlString;
    constructor(geometryObject: GeometryObject);
    toString(): string;
    private createPoint;
    private createMultiPoint;
    private createLineString;
    private createMultiLineString;
    private createPolygon;
    private createMultiPolygon;
}
