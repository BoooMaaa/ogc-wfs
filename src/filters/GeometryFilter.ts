import { WFSFilter } from './WFSFilter';
import { templateRender } from '../utils/templateRender';
import { GeometryObject } from '../geometry/GeometryObject';
import { GML } from '../geometry/GML';

export class GeometryFilter extends WFSFilter {
    private gml: GML;
    constructor(
        private geometryField: string,
        private operator: GeometryOperator,
        geometry: GeometryObject,
    ) {
        super();
        this.gml = new GML(geometry);
    }

    toString(): string {
        const data = {
            propertyName: this.geometryField,
            operator: this.operator,
            gml: this.gml.toString()
        };
        return templateRender(template, data);
    }
}

const template =
`<ogc:{{ operator }}>
<ogc:PropertyName>{{ propertyName }}</ogc:PropertyName>
{{ gml }}
</ogc:{{ operator }}>`;



export type GeometryOperator = 'BBox' | 'Equals' | 'Disjoint' | 'Touches' | 'Within' | 'Overlaps' | 'Crosses' | 'Intersects' | 'Contains';
