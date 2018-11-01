import { Router, Request, Response } from 'express';
import btoa from 'btoa';
import * as request from 'request';
import _ from 'lodash';

const router: Router = Router();

router.post('/validate', (req: Request, res: Response) => {

    const options: IValidateCredentialsRequest = _.get(req, 'body');

    const getUserUrl: string = `${options.HostUrl}/rest/api/user?username=${options.Credentials.Username}`;
    const getUserOptions: RequestInit = {
        headers: {
            'Authorization': buildAuthHeaderValue(options.Credentials)
        }
    };
    
    // This promise ends up sending a IValidateCredentialsResponse in any case (success/fail)
    get(getUserUrl, getUserOptions) 
        .then(getUserResponse => {
            const body = parseJson(getUserResponse.Body);

            if (!body) {
                throw Error('Empty body after parsing response.');
            }

            const user = _.get(body, 'username');
            res.send({valid:  user && user === options.Credentials.Username});
        })
        .catch((error) => {
            res.send({
                valid: false,
                error
            });
        })
});

/**
 * 
 * @param {string} str
 * @returns {object} The parsed JSON
 */
function parseJson(str: string): any {
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
function get(url: string, options: request.CoreOptions = {}): Promise<IGenericResponse> {
    return new Promise((resolve, reject) => {
        const getOptions: request.CoreOptions = { rejectUnauthorized: false, ...options };
        request.get(url, getOptions, (error, response, body) => {
            if (error) {
                reject(error); // TODO: interface?
            }
    
            if (_.get(response, 'statusCode') !== 200) {
                reject(_.get(response, 'statusMessage') || 'Unsuccesful response') // TODO: interface?
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
function buildAuthHeaderValue(credentials: ICredentials): string {
    return `Basic ${btoa(credentials.Username + ":" + credentials.Password)}`;
}

export const AuthController: Router = router;