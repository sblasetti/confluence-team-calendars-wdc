import * as HtmlUtils from './utils/HtmlUtils';
import * as TableauWrapper from './wrappers/TableauWrapper';
import 'whatwg-fetch';
import Promise from 'promise-polyfill';
import Wdc from './Wdc';

// To add to window
if (!window.Promise) {
    window.Promise = Promise;
}

// TODO: what's the right way to initiate a connector?
TableauWrapper.registerConnector(Wdc.buildWdc());

// Events
HtmlUtils.addEvent("submitButton", "click", (e: any) => {
    e.preventDefault();
    Wdc.finish();
});
