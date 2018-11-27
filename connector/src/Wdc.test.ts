import * as TestUtils from "./TestUtils";
import Wdc from "./Wdc";
import * as UIHelper from "./utils/UIHelper";
import * as TableauWrapper from "./wrappers/TableauWrapper";

const mockWdc: tableau.WebDataConnector = TestUtils.buildWdcMock();

// TODO: to avoid declaring all mocked methods, explore https://stackoverflow.com/questions/48759035/mock-dependency-in-jest-with-typescript
let mockIsAuthenticated: boolean = false;
jest.mock("./wrappers/TableauWrapper", () => { 
    return {
        makeConnector: jest.fn(() => mockWdc),
        getPhase: jest.fn(),
        registerConnector: jest.fn(),
        isAuthenticated: jest.fn(() => mockIsAuthenticated),
        setConnectionName: jest.fn(),
        setConnectionData: jest.fn(),
        setUsername: jest.fn(),
        setUsernameAlias: jest.fn(),
        setPassword: jest.fn(),
        submit: jest.fn(),
        log: jest.fn(),
        canStoreCredentials: jest.fn(() => true),
        canStoreConnectionData: jest.fn(() => true)
    };
});

jest.mock("./utils/UIHelper", () => {
    return {
        getConnectionDataFromUI: jest.fn().mockReturnValue({ HostUrl: '' }),
        getCredentialsFromUI: jest.fn().mockReturnValue({ Username: '', Password: '' }),
        saveConnectionDataFromUI: jest.fn()
    };
});
jest.mock("./utils/HtmlUtils");
const mockValidateCredentialsResponse: IValidateCredentialsResponse = { 
    valid: true, 
    error: "" 
};
jest.mock("./wrappers/ConfluenceWrapper", () => {
    return {
        validateCredentials: jest.fn(() => Promise.resolve(mockValidateCredentialsResponse))
    };
});

TestUtils.mockGlobal();

afterEach(() => {
    jest.clearAllMocks();
});

describe("Wdc", () => {
    test("finish() when the user is authenticated", async () => {
        // Given
        mockIsAuthenticated = true;

        // When
        await Wdc.finish();

        // Then
        expect(TableauWrapper.log).toHaveBeenCalledTimes(0); // no errors
        expect(TableauWrapper.isAuthenticated).toHaveBeenCalledTimes(1);
        expect(UIHelper.getConnectionDataFromUI).toHaveBeenCalledTimes(0);
        expect(UIHelper.getCredentialsFromUI).toHaveBeenCalledTimes(0);
        expect(TableauWrapper.setConnectionData).toHaveBeenCalledTimes(0);
        expect(TableauWrapper.submit).toHaveBeenCalledTimes(1);
    });

    test("finish() when the user is NOT authenticated", async () => {
        // Given
        mockIsAuthenticated = false;
        
        // When
        await Wdc.finish();

        // Then
        expect(TableauWrapper.log).toHaveBeenCalledTimes(0); // no errors
        expect(TableauWrapper.isAuthenticated).toHaveBeenCalledTimes(1);
        expect(UIHelper.getConnectionDataFromUI).toHaveBeenCalledTimes(1);
        expect(UIHelper.getCredentialsFromUI).toHaveBeenCalledTimes(1);
        expect(TableauWrapper.setConnectionData).toHaveBeenCalledTimes(1);
        expect(TableauWrapper.submit).toHaveBeenCalledTimes(1);
    });

    test('buildWdc() should contain the methods that WDC needs', () => {
        // When
        const connector: tableau.WebDataConnector = Wdc.buildWdc();

        // Then
        expect(connector).toHaveProperty('init');
        expect(connector).toHaveProperty('getData');
        expect(connector).toHaveProperty('getSchema');
        expect(connector).toHaveProperty('shutdown');
    });
});