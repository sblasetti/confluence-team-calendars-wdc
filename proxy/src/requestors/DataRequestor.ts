import { Request, Response } from 'express';
import { LoDashStatic } from 'lodash';
import { IUtils } from './Utils';

export class DataRequestor {
    private lodash: LoDashStatic;
    private utils: IUtils;

    constructor(utils: IUtils, lodash: LoDashStatic) {
        this.utils = utils;
        this.lodash = lodash;
    }

    getEvents(req: Request, res: Response): void {
        const options: IGetEventsRequest = this.lodash.get(req, 'body');

        // TODO: this needs to be improved
        if (!options || !options.Credentials || !options.Credentials.Username || !options.Credentials.Password ||
            !options.HostUrl || !options.SubCalendarId || !options.StartDate || !options.EndDate) {
            res.status(400).send("Invalid body contents.");
            return;
        }

        const startDate: string = this.utils.toNoMilliISOString(options.StartDate);
        const endDate: string = this.utils.toNoMilliISOString(options.EndDate);
        const getUserUrl: string = `${options.HostUrl}/rest/calendar-services/1.0/calendar/events.json?subCalendarId=${options.SubCalendarId}&start=${startDate}&end=${endDate}`;
        const getUserOptions: RequestInit = {
            headers: {
                'Authorization': this.utils.buildAuthHeaderValue(options.Credentials)
            }
        };

        this.utils.get(getUserUrl, getUserOptions)
            .then(getUserResponse => {
                const body = this.utils.parseJson(getUserResponse.Body);
                if (!body) {
                    throw Error('Empty body after parsing response.');
                }
                const user = this.lodash.get(body, 'username');
                res.send({ valid: user && user === options.Credentials.Username });
            })
            .catch((error) => {
                res.status(500).send({
                    valid: false,
                    error
                });
            });
    }
}