import * as TestUtils from "./TestUtils";
import * as Wdc from "./Wdc";
import * as UIHelper from "./utils/UIHelper";
import * as TableauWrapper from "./wrappers/TableauWrapper";

const mockWdc: tableau.WebDataConnector = TestUtils.buildWdcMock();
let mockIsAuthenticated: boolean = false;
jest.mock("./wrappers/TableauWrapper", () => { 
    return {
        makeConnector: jest.fn(() => mockWdc),
        getPhase: jest.fn().mockReturnValue("auth"),
        registerConnector: jest.fn(),
        isAuthenticated: jest.fn(() => mockIsAuthenticated),
        setConnectionName: jest.fn(),
        setConnectionData: jest.fn(),
        submit: jest.fn()
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
jest.mock("./wrappers/ConfluenceWrapper");

TestUtils.mockGlobal();

describe("Wdc", () => {
    test("finish() on auth phase and user is authenticated", () => {
        // Given
        mockIsAuthenticated = true;
        
        // When
        Wdc.finish();

        // Then
        expect(TableauWrapper.getPhase).toHaveBeenCalledTimes(1);
        expect(UIHelper.getConnectionDataFromUI).toHaveBeenCalledTimes(0);
        expect(TableauWrapper.setConnectionData).toHaveBeenCalledTimes(0);
        expect(TableauWrapper.submit).toHaveBeenCalledTimes(0);
    });

    test('buildWdc() should contain the methods that WDC needs', () => {
        // When
        const wdc: tableau.WebDataConnector = Wdc.buildWdc();

        // Then
        expect(wdc).toHaveProperty('init');
        expect(wdc).toHaveProperty('getData');
        expect(wdc).toHaveProperty('getSchema');
        expect(wdc).toHaveProperty('shutdown');
    });
});