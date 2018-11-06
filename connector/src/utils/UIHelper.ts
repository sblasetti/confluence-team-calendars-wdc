/**
 * This module's purpose is to encapsulate connector logic that cannot be left 
 * as private methods of the Connector class.
 */
import * as HtmlUtils from "./HtmlUtils";
import * as TableauWrapper from "../wrappers/TableauWrapper";

export function getConnectionDataFromUI(): IConnectionData {
    return {
        HostUrl: HtmlUtils.getHtmlValue("hostUrl"),
        SubCalendarId: HtmlUtils.getHtmlValue("subCalendarId"),
        StartDate: new Date(HtmlUtils.getHtmlValue("startDate")).getTime(),
        EndDate: new Date(HtmlUtils.getHtmlValue("endDate")).getTime()
    };
}

export function setConnectionDataInUI(data: IConnectionData): void {
    const hostUrl: string = data.HostUrl !== null ? data.HostUrl : "";
    const startDate: number = data.StartDate ? data.StartDate : new Date().getTime();
    const endDate: number = data.EndDate ? data.EndDate : new Date().getTime();
    HtmlUtils.setHtmlValue("hostUrl", hostUrl);
    HtmlUtils.setHtmlValue("startDate", new Date(startDate).toISOString().split("T")[0]);
    HtmlUtils.setHtmlValue("endDate", new Date(endDate).toISOString().split("T")[0]);
}

export function getCredentialsFromUI(): ICredentials {
    return {
        Username: HtmlUtils.getHtmlValue("username"),
        Password: HtmlUtils.getHtmlValue("password")
    };
}

export function populateConnectionDataIfAvailable(): void {
    // TODO: remove this wrapper
    const data: string = TableauWrapper.getConnectionData();
    let isValid: boolean = false;
    let connectionData: any;
    try {
        connectionData = JSON.parse(data);
    }
    catch {
        // Notin'
    }
    isValid = typeof connectionData === 'object';
    let finalConnectionData: IConnectionData;
    if (isValid) {
        // Workaround because JSON.parse returned dates as strings
        // TODO: use reviver option in JSON.parse?
        finalConnectionData = {
            HostUrl: connectionData.HostUrl,
            SubCalendarId: connectionData.SubCalendarId,
            StartDate: new Date(connectionData.StartDate).getTime(),
            EndDate: new Date(connectionData.EndDate).getTime()
        };
    } else {
        // Default values
        finalConnectionData = {
            HostUrl: '',
            SubCalendarId: '',
            StartDate: new Date().getTime(),
            EndDate: new Date().getTime()
        };
    }
    setConnectionDataInUI(finalConnectionData);
}
