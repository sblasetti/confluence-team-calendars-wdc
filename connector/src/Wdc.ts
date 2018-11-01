/**
 * This module's purpose is to encapsulate connector logic that cannot be left 
 * as private methods of the Connector class.
 */
import * as TableauWrapper from './wrappers/TableauWrapper';
import * as UIHelper from './utils/UIHelper';
import * as HtmlUtils from './utils/HtmlUtils';
import * as ConfluenceWrapper from './wrappers/ConfluenceWrapper';

export function buildWdc(): tableau.WebDataConnector {
    return {
        init,
        getSchema,
        getData,
        shutdown
    };
}

function buildEventsRequest(connectionData: IConnectionData): IEventsOptions {
    return {
        Credentials: {
            Username: TableauWrapper.getUsername(),
            Password: TableauWrapper.getPassword()
        },
        SubCalendarId: connectionData.SubCalendarId,
        HostUrl: connectionData.HostUrl,
        StartDate: new Date(connectionData.StartDate),
        EndDate: new Date(connectionData.EndDate),
    };
}

function init(initCallback: tableau.InitCallback): void {
    TableauWrapper.setAuthType(tableau.authTypeEnum.custom);
    initCallback();

    // Load data (if available)
    UIHelper.populateConnectionDataIfAvailable();

    // Show UI depending on phase and auth state
    // TODO: is this the right place?
    HtmlUtils.toggle("auth", !TableauWrapper.isAuthenticated());
    HtmlUtils.toggle("filter", TableauWrapper.getPhase() === tableau.phaseEnum.interactivePhase);
}

function getSchema(schemaCallback: tableau.SchemaCallback): void {
    // TODO: can we get schema dynamically from the API?
    const tableSchema: tableau.TableInfo = {
        id: "events",
        alias: "Events",
        columns: [
            {
                id: "subCalendarId",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "id",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "title",
                dataType: tableau.dataTypeEnum.string
            },
            {
                id: "start",
                dataType: tableau.dataTypeEnum.datetime
            },
            {
                id: "end",
                dataType: tableau.dataTypeEnum.datetime
            }
        ]
    };
    schemaCallback([tableSchema]);
}

function getData(table: tableau.Table, dataDoneCallback: tableau.DataDoneCallback): void {
    const connectionData: IConnectionData = JSON.parse(TableauWrapper.getConnectionData());
    const options: any = buildEventsRequest(connectionData);
    ConfluenceWrapper.getEvents(options)
        .then((data: any[]) => {
            table.appendRows(data);
            dataDoneCallback();
        }).catch((err: any) => {
            // TODO: what's the proper way to handle errors in a WDC?
            TableauWrapper.abortWithError(err.message);
        });
}

function shutdown(): void {
    // TBD
}

export function finish(): void {
    // TODO: input validations
    // Called both in auth and in interactive phases
    switch (TableauWrapper.getPhase()) {
        case tableau.phaseEnum.authPhase:
        case tableau.phaseEnum.interactivePhase:
            // If not authenticated it will try to validate input credentials
            if (!TableauWrapper.isAuthenticated()) {
                // Try to get data from the server
                authenticate();
            }
            break;
        default:
            // Do nothing
            break;
    }
}

function authenticate(): void {
    const connectionData: IConnectionData = UIHelper.getConnectionDataFromUI();
    const credentials: ICredentials = UIHelper.getCredentialsFromUI();
    const options: IValidateCredentialsRequest = {
        Credentials: credentials,
        HostUrl: connectionData.HostUrl
    };
    ConfluenceWrapper.validateCredentials(options)
        .then((validateResponse: IValidateCredentialsResponse) => {
            if (validateResponse.valid) {
                // If OK store password
                UIHelper.saveCredentialsFromUI();
                // Store connectionData in auth phase too because the host URL 
                // value is stored there and it is part of the auth UI
                UIHelper.saveConnectionDataFromUI();
                TableauWrapper.setConnectionName("Confluence Calendars");
                TableauWrapper.setUsername(credentials.Username);
                TableauWrapper.setPassword(credentials.Password);
                TableauWrapper.submit();
            }
            else {
                alert('Invalid credentials');
            }
        }).catch(() => {
            alert('Invalid credentials');
        });
}
