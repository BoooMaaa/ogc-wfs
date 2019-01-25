import { WFSFilter } from './filters/WFSFilter';
/**
 * Main Class
 */
export declare class WFS {
    private version;
    private typeName;
    private outputFormat;
    private maxFeatures;
    private namespaces;
    private extraAttributes;
    constructor(options: WFSOptions);
    /**
     * get xml string
     * @param filter WFSFilter or filter string
     */
    getXML(filter?: string | WFSFilter | Array<string | WFSFilter>): string;
    private getNamespaces;
    private getExtraAttributes;
}
export declare type OutputFormat = 'GML2' | 'GML3' | 'Shapefile' | 'JSON' | 'JSONP' | 'CSV';
export interface WFSOptions {
    version?: string;
    typeName: string;
    outputFormat?: OutputFormat;
    namespaces?: object;
    maxFeatures?: number;
    extraAttributes?: object;
}
