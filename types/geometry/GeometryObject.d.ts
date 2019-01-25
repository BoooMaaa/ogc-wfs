export declare type GeometryType = GeometryObject['type'];
export declare type GeometryObject = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPloygon;
export interface GeometryObjectBase {
    type: GeometryType;
}
export declare type Position = [number, number];
export interface Point extends GeometryObjectBase {
    type: 'Point';
    coordinates: Position;
}
export interface MultiPoint extends GeometryObjectBase {
    type: 'MultiPoint';
    coordinates: Position[];
}
export interface LineString extends GeometryObjectBase {
    type: 'LineString';
    coordinates: Position[];
}
export interface MultiLineString extends GeometryObjectBase {
    type: 'MultiLineString';
    coordinates: Position[][];
}
export interface Polygon extends GeometryObjectBase {
    type: 'Polygon';
    coordinates: Position[][];
}
export interface MultiPloygon extends GeometryObjectBase {
    type: 'MultiPloygon';
    coordinates: Position[][][];
}
