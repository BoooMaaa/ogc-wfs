/**
 * basic class of filter
 */
export declare abstract class WFSFilter {
    or(...filters: Array<WFSFilter | string>): string;
    and(...filters: Array<WFSFilter | string>): string;
    not(): string;
    abstract toString(): string;
    private logicJoin;
}
