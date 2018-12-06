import { Router } from 'express';
import _ from 'lodash';
import { DataRequestor } from '../requestors/DataRequestor';
import { Utils } from '../requestors/Utils';

const utils = new Utils(_);
const requestor = new DataRequestor(utils, _);

const router = Router();
router.get('/getEvents', (req, res) => requestor.getEvents(req, res));

export const DataController: Router = router;