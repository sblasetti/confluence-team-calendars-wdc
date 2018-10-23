export function makeConnector(): tableau.WebDataConnector {
    return tableau.makeConnector();
}

export function registerConnector(wdc: tableau.WebDataConnector): void {
    tableau.registerConnector(wdc);
}

export function submit(): void {
    tableau.submit();
}

export function abortWithError(msg: string): void {
    return tableau.abortWithError(msg);
}

//#region Utility methods
export function isAuthenticated(): boolean {
    return !!getPassword();
}
//#endregion

//#region Properties
export function setConnectionName(value: string): void {
    tableau.connectionName = value;
}
export function getConnectionData(): string {
    return tableau.connectionData;
}
export function setConnectionData(value: IConnectionData): void {
    tableau.connectionData = JSON.stringify(value);
}
export function getUsername(): string {
    return tableau.username;
}
export function setUsername(value: string): void {
    tableau.username = value;
}
export function getPassword(): string {
    return tableau.password;
}
export function setPassword(value: string): void {
    tableau.password = value;
}
export function getAuthType(): tableau.tAuthType {
    return tableau.authType;
}
export function setAuthType(value: tableau.tAuthType): void {
    tableau.authType = value;
}
export function getPhase(): tableau.tPhase {
    return tableau.phase;
}
//#endregion