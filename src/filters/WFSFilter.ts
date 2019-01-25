/**
 * basic class of filter
 */
export abstract class WFSFilter {

    or(...filters: Array<WFSFilter|string>): string {
        return this.logicJoin(filters, 'Or');
    }

    and(...filters: Array<WFSFilter|string>): string {
        return this.logicJoin(filters, 'And');
    }

    not(): string {
        return `<Not>${this.toString()}</Not>`;
    }

    abstract toString(): string;

    private logicJoin(filters: Array<WFSFilter|string>, operator: string): string {
        let str = `<${operator}>${this.toString()}`;
        filters.forEach(filter => {
            str += filter;
        });
        return `${str}</${operator}>`;
    }
}