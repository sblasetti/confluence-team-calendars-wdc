/**
 * This module's purpose is to encapsulate connector logic that cannot be left 
 * as private methods of the Connector class.
 */
import * as TableauWrapper from './wrappers/TableauWrapper';
import * as UIHelper from './utils/UIHelper';
import * as HtmlUtils from './utils/HtmlUtils';
import * as ConfluenceWrapper from './wrappers/ConfluenceWrapper';

export class Wdc {
    buildWdc(): tableau.WebDataConnector {
        const connector: tableau.WebDataConnector = TableauWrapper.makeConnector();
        connector.init = this.init;
        connector.getSchema = this.getSchema;
        connector.getData = this.getData;
        connector.shutdown = this.shutdown;
        return connector;
    }

    finish(): void {
        // TODO: input validations

        Promise.resolve()
            .then(() => !TableauWrapper.isAuthenticated() ? this.performAuthentication() : Promise.resolve())
            .then(() => TableauWrapper.submit())
            .catch((e: any) => {
                // TODO: proper handling
                TableauWrapper.log(`ERROR: ${e}`);
                alert(e);
            });
    }

    private init(initCallback: tableau.InitCallback): void {
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

    private getSchema(schemaCallback: tableau.SchemaCallback): void {
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

    private getData(table: tableau.Table, dataDoneCallback: tableau.DataDoneCallback): void {
        const connectionData: IConnectionData = JSON.parse(TableauWrapper.getConnectionData());
        const options: any = this.buildEventsRequest(connectionData);
        ConfluenceWrapper.getEvents(options)
            .then((data: any[]) => {
                table.appendRows(data);
                dataDoneCallback();
            }).catch((err: any) => {
                // TODO: what's the proper way to handle errors in a WDC?
                TableauWrapper.abortWithError(err.message);
            });
    }

    private shutdown(shutdownCallback: tableau.ShutdownCallback): void {
        // TBD
        shutdownCallback();
    }

    private performAuthentication(): Promise<void> {
        // return new Promise((resolve: () => void, reject: (reason: string) => void): void => {
            const connectionData: IConnectionData = UIHelper.getConnectionDataFromUI();
            const credentials: ICredentials = UIHelper.getCredentialsFromUI();
            const options: IValidateCredentialsRequest = {
                Credentials: credentials,
                HostUrl: connectionData.HostUrl
            };
        
            return ConfluenceWrapper.validateCredentials(options)
            .then((validateResponse: IValidateCredentialsResponse) => {
                if (validateResponse.valid) {
                    if (TableauWrapper.canStoreCredentials()) {
                        // If OK store password
                        const uiCredentials: ICredentials = UIHelper.getCredentialsFromUI();
                        TableauWrapper.setUsername(uiCredentials.Username);
                        TableauWrapper.setUsernameAlias(uiCredentials.Username);
                        TableauWrapper.setPassword(uiCredentials.Password);
                    }

                    if (TableauWrapper.canStoreConnectionData()) {
                        // Store connectionData in auth phase too because the host URL 
                        // value is stored there and it is part of the auth UI
                        const uiConnectionData: IConnectionData = UIHelper.getConnectionDataFromUI();
                        TableauWrapper.setConnectionData(uiConnectionData);
                    }

                    // resolve();
                }
                else {
                    // reject('Invalid credentials');
                }
            }).catch(() => {
                // reject('Error on authentication');
            });
        // });
    }

    private buildEventsRequest(connectionData: IConnectionData): IEventsOptions {
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
}