import { templateRender } from './utils/templateRender';
import { WFSFilter } from './filters/WFSFilter';
/**
 * Main Class
 */
export class WFS {
    private version: string = '1.0.0';
    private typeName: string;
    private outputFormat: OutputFormat = 'JSON';
    private maxFeatures: number = 100;
    private namespaces: object;
    private extraAttributes: object;

    constructor(options: WFSOptions) {
        this.typeName = options.typeName;
        if (options.outputFormat) {
            this.outputFormat = options.outputFormat;
        }
        if (typeof options.maxFeatures === 'number') {
            this.maxFeatures = options.maxFeatures;
        }
        this.namespaces = options.namespaces;
        this.extraAttributes = options.extraAttributes;
    }
    /**
     * get xml string
     * @param filter WFSFilter or filter string
     */
    getXML(filter?: string|WFSFilter|Array<string|WFSFilter>): string {
        const data = {
            version: this.version,
            outputFormat: this.outputFormat,
            maxFeatures: this.maxFeatures,
            namespaces: this.getNamespaces(),
            extraAttributes: this.getExtraAttributes(),
            typeName: this.typeName,
            filter: ''
        };
        if (filter) {
            if (filter instanceof Array) {
                filter.forEach(item => {
                    data.filter += item;
                });
            } else {
                data.filter += filter;
            }
        }
        return templateRender(template, data).replace(/\n/g, '');
    }

    private getNamespaces(): string {
        const ns: Array<string> = [];
        const namespaces = Object.assign({}, baseNamespaces, this.namespaces);
        for (const key in namespaces) {
            if (namespaces.hasOwnProperty(key)) {
                ns.push(`xmlns:${key}="${(<any>namespaces)[key]}"`);
            }
        }
        return ns.join(' ');
    }

    private getExtraAttributes(): string {
        if (this.extraAttributes) {
            const ea: Array<string> = [];
            const extraAttributes = this.extraAttributes;
            for (const key in extraAttributes) {
                if (extraAttributes.hasOwnProperty(key)) {
                    ea.push(`${key}="${(<any>extraAttributes)[key]}"`);
                }
            }
        } else {
            return '';
        }
    }
}

const template =
`<wfs:GetFeature service="WFS"
 version="{{ version }}"
 outputFormat="{{ outputFormat }}"
 maxFeatures="{{ maxFeatures }}"
 {{ extraAttributes }}
 {{ namespaces }}
 xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/filter/{{ version }}/filter.xsd">
<wfs:Query typeName="{{ typeName }}">
<ogc:Filter>
{{ filter }}
</ogc:Filter>
</wfs:Query>
</wfs:GetFeature>`;

const baseNamespaces = {
    topp: 'http://www.openplans.org/topp',
    wfs: 'http://www.opengis.net/wfs',
    ogc: 'http://www.opengis.net/ogc',
    gml: 'http://www.opengis.net/gml',
    xsi: 'http://www.w3.org/2001/XMLSchema-instance'
};

export type OutputFormat = 'GML2' | 'GML3' | 'Shapefile' | 'JSON' | 'JSONP' | 'CSV'

export interface WFSOptions {
    version?: string;
    typeName: string;
    outputFormat?: OutputFormat;
    namespaces?: object;
    maxFeatures?: number;
    extraAttributes?: object;
}