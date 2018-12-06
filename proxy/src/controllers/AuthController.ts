import { Router, Request, Response } from 'express';
import _ from 'lodash';
import { Utils } from '../requestors/Utils';

const router: Router = Router();

router.post('/validate', (req: Request, res: Response) => {
    
    const utils: Utils = new Utils(_);

    const options: IValidateCredentialsRequest = _.get(req, 'body');

    const getUserUrl: string = `${options.HostUrl}/rest/api/user?username=${options.Credentials.Username}`;
    const getUserOptions: RequestInit = {
        headers: {
            'Authorization': utils.buildAuthHeaderValue(options.Credentials)
        }
    };

    // This promise ends up sending a IValidateCredentialsResponse in any case (success/fail)
    utils.get(getUserUrl, getUserOptions) 
        .then(getUserResponse => {
            const body = utils.parseJson(getUserResponse.Body);

            if (!body) {
                throw Error('Empty body after parsing response.');
            }

            const user = _.get(body, 'username');
            res.send({valid: user && user === options.Credentials.Username});
        })
        .catch((error) => {
            res.send({
                valid: false,
                error
            });
        })
});

export const AuthController: Router = router;