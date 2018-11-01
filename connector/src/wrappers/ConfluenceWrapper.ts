import * as FormatUtils from '../utils/FormatUtils';
import 'whatwg-fetch';
import _ from 'lodash';

export function getEvents(options: IEventsOptions): Promise<any[]> {
    // TODO: input data
    const startDate: string = FormatUtils.toNoMilliISOString(options.StartDate);
    const endDate: string = FormatUtils.toNoMilliISOString(options.EndDate);
    const eventsUrl: string = `${options.HostUrl}/rest/calendar-services/1.0/calendar/events.json?subCalendarId=${options.SubCalendarId}&start=${startDate}&end=${endDate}`;
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
 * This method makes a request to retrieve a single space. As the API does always 
 * return HTTP 200 statuses, the way to validate credentials is to check if the 
 * response contains one space.
 * @param options Information required to perform the request.
 * @param onResponseCallback Callback function for a successful response.
 * @param onErrorCallback Callback function for an error.
 */
export function validateCredentials(options: IValidateCredentialsRequest): Promise<IValidateCredentialsResponse> {
    const validateCredentialsUrl: string = 'http://localhost:8008/auth/validate';
    const validateCredentialsOptions: RequestInit = {
        headers: {
            'Authorization': buildAuthHeaderValue(options.Credentials),
            'Accept': 'application/json',
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
        // TODO: add some kind of mapper?
        return Promise.resolve({
            valid: _.get(data, 'valid', false),
            error: _.get(data, 'error')
        });
    }

    function handleResponse<T>(res: Response): Promise<any> {
        if (_.get(res, 'status') === 200) {
            // TODO: handle error
            return res.json<T>();
        }
        throw new Error('An error occurred. Please try again.');
    }
}

function buildAuthHeaderValue(credentials: ICredentials): any {
    return "Basic " + btoa(credentials.Username + ":" + credentials.Password);
}
