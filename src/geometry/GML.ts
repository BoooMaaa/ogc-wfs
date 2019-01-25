import { GeometryObject, Position } from './GeometryObject';
import { templateRender } from '../utils/templateRender';

/**
 * format GeometryObject json to gml
 */
export class GML {
    private gmlString: string;
    constructor(geometryObject: GeometryObject) {
        switch (geometryObject.type) {
            case 'Point':
                this.gmlString = this.createPoint(geometryObject.coordinates);
                break;
            case 'MultiPoint':
                this.gmlString = this.createMultiPoint(geometryObject.coordinates);
                break;
            case 'LineString':
                this.gmlString = this.createLineString(geometryObject.coordinates);
                break;
            case 'MultiLineString':
                this.gmlString = this.createMultiLineString(geometryObject.coordinates);
                break;
            case 'Polygon':
                this.gmlString = this.createPolygon(geometryObject.coordinates);
                break;
            case 'MultiPloygon':
                this.gmlString = this.createMultiPolygon(geometryObject.coordinates);
        }
    }

    toString(): string {
        return this.gmlString;
    }

    private createPoint(coordinates: Position): string {
        const template = templates.Point;
        const coords = coordinates.join(' ');
        return templateRender(template, { coordinates: coords });
    }

    private createMultiPoint(coordinates: Position[]): string {
        const template = templates.MultiPoint;
        const points: string[] = [];
        coordinates.forEach(position => {
            points.push(this.createPoint(position));
        });
        return templateRender(template, { points: points.join('') });
    }

    private createLineString(coordinates: Position[]): string {
        const template = templates.LineString;
        const coords = coordinates.map(coord => `${coord[0]} ${coord[1]}`).join(' ');
        return templateRender(template, { coordinates: coords });
    }

    private createMultiLineString(coordinates: Position[][]): string {
        const template = templates.MultiLineString;
        const lines: string[] = [];
        coordinates.forEach(lineCoords => {
            lines.push(this.createLineString(lineCoords));
        });
        return templateRender(template, { lines: lines.join('') });
    }

    private createPolygon(coordinates: Position[][]): string {
        const template = templates.Polygon;
        const hasHole = coordinates.length > 1;
        const coords = coordinates[0].map(coord => `${coord[0]} ${coord[1]}`).join(' ');
        const data = { coordinates: coords, holes: '' };
        if (hasHole) {
            const holes: string[] = [];
            const holeTemplate = templates.Hole;
            for (let i = 1; i < coordinates.length; i++) {
                const coords = coordinates[i].map(coord => `${coord[0]} ${coord[1]}`).join(' ');
                holes.push(templateRender(holeTemplate, { coordinates: coords }));
            }
            data.holes = holes.join('');
        }
        return templateRender(template, data);
    }

    private createMultiPolygon(coordinates: Position[][][]): string {
        const template = templates.MultiPloygon;
        const polygons: string [] = [];
        coordinates.forEach(polygonCoords => {
            polygons.push(this.createPolygon(polygonCoords));
        });
        return templateRender(template, { polygons: polygons.join('') });
    }
}

const templates = {
    Point:
`<gml:Point>
<gml:posList>{{ coordinates }}</gml:posList>
</gml:Point>`,
    MultiPoint:
`<gml:MultiPoint>
<gml:PointMembers>{{ points }}</gml:PointMemebers>
</gml:MultiPoint>`,
    LineString:
`<gml:LineString>
<gml:posList>{{ coordinates }}</gml:posList>
</gml:LineString>`,
    MultiLineString:
`<gml:MultiString>
<gml:LineStringMembers>{{ lines }}</gml:LineStringMembers>
</gml:MultiString>`,
    Polygon:
`<gml:Polygon>
<gml:exterior>
<gml:LinearRing>
<gml:posList>{{ coordinates }}</gml:posList>
</gml:LinearRing>
</gml:exterior>
{{ holes }}
</gml:Polygon>`,
    Hole:
`<gml:interior>
<gml:LinearRing>
<gml:posList>{{ coordinates }}</gml:posList>
</gml:LinearRing>
</gml:interior>`,
    MultiPloygon:
`<gml:MultiPolygon>
<gml:PolygonMembers>{{ polygons }}</gml:PolygonMembers>
</gml:MultiPolygon>`
};