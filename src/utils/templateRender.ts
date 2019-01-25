// find '{{ ... }}' string
const regExp = /\{\{((?:.|\r?\n)+?)\}\}/g;

/**
 * compile template
 * @private
 * @param template
 * @param data
 */
export function templateRender(template: string, data: any): string {
    let match;
    let str = template;
    while ((match = regExp.exec(template))) {
        const key = match[1].trim();
        const value = typeof data.hasOwnProperty === 'function' && data.hasOwnProperty(key) ? data[key] : '';
        str = str.replace(match[0], value);
    }
    return str;
}