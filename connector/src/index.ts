import * as HtmlUtils from './utils/HtmlUtils';
import { Wdc } from './Wdc';
import * as TableauWrapper from './wrappers/TableauWrapper';
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

// To add to window
if (!window.Promise) {
    window.Promise = Promise;
}

// TODO: what's the right way to initiate a connector?
const wdc: Wdc = new Wdc();
TableauWrapper.registerConnector(wdc.buildWdc());

// Events
HtmlUtils.addEvent("submitButton", "click", (e: any) => {
    e.preventDefault();
    wdc.finish();
});
