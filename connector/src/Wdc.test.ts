import * as TestUtils from "./TestUtils";
import { Wdc } from "./Wdc";
import * as UIHelper from "./utils/UIHelper";
import * as TableauWrapper from "./wrappers/TableauWrapper";

let wdc: Wdc;
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

beforeEach(() => {
    wdc = new Wdc();
});

describe("Wdc", () => {
    test("finish() on auth phase and user is authenticated", () => {
        // Given
        mockIsAuthenticated = true;
        
        // When
        wdc.finish();

        // Then
        expect(TableauWrapper.getPhase).toHaveBeenCalledTimes(1);
        expect(UIHelper.getConnectionDataFromUI).toHaveBeenCalledTimes(0);
        expect(TableauWrapper.setConnectionData).toHaveBeenCalledTimes(0);
        expect(TableauWrapper.submit).toHaveBeenCalledTimes(0);
    });

    test('buildWdc() should contain the methods that WDC needs', () => {
        // When
        const connector: tableau.WebDataConnector = wdc.buildWdc();

        // Then
        expect(connector).toHaveProperty('init');
        expect(connector).toHaveProperty('getData');
        expect(connector).toHaveProperty('getSchema');
        expect(connector).toHaveProperty('shutdown');
    });
});