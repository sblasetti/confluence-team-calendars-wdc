/**
 * This module's purpose is to encapsulate connector logic that cannot be left 
 * as private methods of the Connector class.
 */
import * as TableauWrapper from './wrappers/TableauWrapper';
import * as UIHelper from './utils/UIHelper';
import * as HtmlUtils from './utils/HtmlUtils';
import * as ConfluenceWrapper from './wrappers/ConfluenceWrapper';

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
    TableauWrapper.setConnectionName("Team Calendars for Confluence");

    // Load data (if available)
    // TODO: get connectiondata and then decide
    UIHelper.populateConnectionDataIfAvailable();

    initCallback();

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

function shutdown(shutdownCallback: tableau.ShutdownCallback): void {
    // TBD
    shutdownCallback();
}

function performAuthentication(): Promise<void> {
    return new Promise((resolve: () => void, reject: (reason: string) => void): void => {
        const uiConnectionData: IConnectionData = UIHelper.getConnectionDataFromUI();
        const uiCredentials: ICredentials = UIHelper.getCredentialsFromUI();
        const options: IValidateCredentialsRequest = {
            Credentials: uiCredentials,
            HostUrl: uiConnectionData.HostUrl
        };
    
        ConfluenceWrapper.validateCredentials(options)
        .then((validateResponse: IValidateCredentialsResponse) => {
            if (validateResponse.valid === true) {
                if (TableauWrapper.canStoreCredentials()) {
                    // If OK store password
                    TableauWrapper.setUsername(uiCredentials.Username); // store host URL here
                    TableauWrapper.setUsernameAlias(uiCredentials.Username);
                    TableauWrapper.setPassword(uiCredentials.Password);
                }

                if (TableauWrapper.canStoreConnectionData()) {
                    // Store connectionData in auth phase too because the host URL 
                    // value is stored there and it is part of the auth UI
                    TableauWrapper.setConnectionData(uiConnectionData);
                }

                resolve();
            }
            else {
                reject('Invalid credentials');
            }
        }).catch((e: Error) => {
            reject(`Error on authentication: ${e}`);
        });
    });
}

function buildWdc(): tableau.WebDataConnector {
    const connector: tableau.WebDataConnector = TableauWrapper.makeConnector();
    connector.init = init;
    connector.getSchema = getSchema;
    connector.getData = getData;
    connector.shutdown = shutdown;
    return connector;
}
    
function finish(): Promise<void> {
    // TODO: input validations

    return Promise.resolve()
        .then(() => !TableauWrapper.isAuthenticated() ? performAuthentication() : Promise.resolve())
        .then(() => TableauWrapper.submit())
        .catch((e: any) => {
            // TODO: proper handling
            HtmlUtils.showModal(e);
        });
}

export default {
    buildWdc,
    finish
};
