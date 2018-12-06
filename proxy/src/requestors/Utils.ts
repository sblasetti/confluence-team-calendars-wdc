import btoa from 'btoa';
import { CoreOptions, get } from 'request';
import { LoDashStatic } from 'lodash';

export interface IUtils {
    parseJson(str: string): any;
    get(url: string, options: CoreOptions): Promise<IGenericResponse>;
    buildAuthHeaderValue(credentials: ICredentials): string;
    toNoMilliISOString(d: Date): string;
}

export class Utils implements IUtils {
    private lodash: LoDashStatic;

    constructor(lodash: LoDashStatic) {
        this.lodash = lodash;
    }
    
    /**
     * 
     * @param {string} str
     * @returns {object} The parsed JSON
     */
    parseJson(str: string): any {
        try {
            return JSON.parse(str)
        } catch (error) {
            // TODO: replace console.log
            console.log(`Error parsing to JSON the following value: ${str}`);
            throw new Error(error);
        }
    }

    /**
     * Performs a GET request
     * @param {string} url 
     * @param {object} options 
     * @returns {object} Promise/A+
     */
    get(url: string, options: CoreOptions = {}): Promise<IGenericResponse> {
        return new Promise((resolve, reject) => {
            const getOptions: CoreOptions = { rejectUnauthorized: false, ...options };
            get(url, getOptions, (error, response, body) => {
                if (error) {
                    reject(error); // TODO: interface?
                }
        
                if (this.lodash.get(response, 'statusCode') !== 200) {
                    reject(this.lodash.get(response, 'statusMessage') || 'Unsuccesful response') // TODO: interface?
                }

                resolve({
                    FullResponse: response,
                    Body: body
                });
            })        
        });
    }

    /**
     * Generates the Basic auth header value
     * @param {ICredentials} credentials 
     * @returns {string} Bsic auth header value
     */
    buildAuthHeaderValue(credentials: ICredentials): string {
        return `Basic ${btoa(credentials.Username + ":" + credentials.Password)}`;
    }

    /**
     * Return the ISO string for a date with no milliseconds
     * @param {Date} d
     */
    toNoMilliISOString(d: Date): string {
        let res: string = "";
        if (d && d instanceof Date) {
            res = d.toISOString().split('.')[0] + "Z";
        }
        return res;
    }
}
