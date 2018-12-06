import * as FormatUtils from '../utils/FormatUtils';
import 'whatwg-fetch';
import _ from 'lodash';

/**
 * 
 * @param {IGetEventsRequest} options
 */
export function getEvents(options: IGetEventsRequest): Promise<any[]> {
    // TODO: input data
    const startDate: string = FormatUtils.toNoMilliISOString(options.StartDate);
    const endDate: string = FormatUtils.toNoMilliISOString(options.EndDate);
    const eventsUrl: string = 'http://localhost:8008/data/search';
    const eventsOptions: RequestInit = {
        headers: {
            Authorization: buildAuthHeaderValue(options.Credentials)
        }
    };
    return fetch(eventsUrl, eventsOptions)
        .then(handleResponse)
        .then(buildOutput)
        .catch(handleError);

    function handleError(error: any): Promise<never> {
        return Promise.reject(error);
    }
    
    function buildOutput(data: any): Promise<any[]> {
        let events: any[] = [];
        if (data.events)
            events = data.events;
        return Promise.resolve(events);
    }

    function handleResponse(res: Response): Promise<any> {
        // TODO: verify response http code, verify 'success'
        return res.json();
    }
}

/**
 * Retrieve the user profile (if valid).
 * @param {IValidateCredentialsRequest} options Information required to perform the request.
 */
export function validateCredentials(options: IValidateCredentialsRequest): Promise<IValidateCredentialsResponse> {
    const validateCredentialsUrl: string = 'http://localhost:8008/auth/validate';
    const validateCredentialsOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(options)
    };
    return fetch(validateCredentialsUrl, validateCredentialsOptions)
        .then(handleResponse)
        .then(buildOutput)
        .catch(handleError);

    function handleError(error: any): Promise<never> {
        return Promise.reject(error);
    }

    function buildOutput(data: any): Promise<IValidateCredentialsResponse> {
        const obj: any = {
            valid: _.get(data, 'valid', false),
            error: _.get(data, 'error')
        };
        // TODO: add some kind of mapper?
        return Promise.resolve(obj);
    }

    function handleResponse(res: Response): Promise<any> {
        if (_.get(res, 'status') === 200) {
            const newLocal: any = res.json();
            return newLocal;
        }
        throw new Error('An error occurred. Please try again.');
    }
}

function buildAuthHeaderValue(credentials: ICredentials): any {
    return "Basic " + btoa(credentials.Username + ":" + credentials.Password);
}
