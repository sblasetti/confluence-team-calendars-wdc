/**
 * Mocks the global tableau object, we don't need it for unit testing
 */
export function mockGlobal(): void {
    (<any>window).tableau = {
        phaseEnum: {
            authPhase: "auth",
            interactivePhase: "interactive",
            gatherDataPhase: "gatherData"
        },
        submit: jest.fn(),
        makeConnector: jest.fn().mockReturnValue(buildWdcMock()),
        registerConnector: jest.fn()
    };
}

/**
 *  Returns a mock of a connector, the output of tableau.makeConnector
 */
export function buildWdcMock(): tableau.WebDataConnector {
    return {
        init: jest.fn(),
        getSchema: jest.fn(),
        getData: jest.fn(),
        shutdown: jest.fn()
    };
}

export function mockTableauWrapper(): any {
    const mockWdc: tableau.WebDataConnector = buildWdcMock();
    return {
        makeConnector: jest.fn(() => mockWdc),
        getPhase: jest.fn().mockReturnValue("auth"),
        registerConnector: jest.fn(),
        isAuthenticated: jest.fn(),
        setConnectionName: jest.fn(),
        submit: jest.fn()
    };
}