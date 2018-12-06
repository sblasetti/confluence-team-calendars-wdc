import { Request, Response } from 'express';
import { LoDashStatic } from 'lodash';
import { when } from 'jest-when';
import { DataRequestor } from "./DataRequestor";
import { IUtils } from "./Utils";

// http://jonathancreamer.com/testing-typescript-classes-with-jest-and-jest-mocks/
const mockLoDashGet = jest.fn();
const mockRequest: IGetEventsRequest = {
    Credentials: {
        Username: 'USER',
        Password: 'PASS'
    },
    SubCalendarId: 'ID',
    HostUrl: 'http://HOST',
    StartDate: new Date(2017, 1, 1),
    EndDate: new Date(2018, 1, 1)
};

const mockUtilsGet = jest.fn();
const mockUtilsParseJson = jest.fn();
const MockUtils = jest.fn<IUtils>(() => ({
    buildAuthHeaderValue: jest.fn((c: ICredentials) => "mockAuthHeader"),
    get: mockUtilsGet,
    parseJson: mockUtilsParseJson,
    toNoMilliISOString: jest.fn((d: Date) => "mockDate")
}));
const utils = new MockUtils();

const MockLoDashStatic = jest.fn<LoDashStatic>(() => ({
    get: mockLoDashGet
}));
const lodash = new MockLoDashStatic();

const MockRequest = jest.fn<Request>();
const req = new MockRequest();

const mockResponseSend = jest.fn();
const mockResponseStatus = jest.fn();
const mockResponseImpl = {
    send: mockResponseSend,
    status: mockResponseStatus
};
const MockResponse = jest.fn<Response>(() => (mockResponseImpl));
const res = new MockResponse();
mockResponseStatus.mockReturnValue(mockResponseImpl);

const requestor = new DataRequestor(utils, lodash);

describe('DataRequestor flow', () => {
    beforeEach(() => {
        mockLoDashGet.mockClear();
        mockUtilsGet.mockClear();
        mockUtilsParseJson.mockClear();
        mockResponseSend.mockClear();
        mockResponseStatus.mockClear();
    });

    test('getEvents calls utils.get with the right args', async () => {
        // Given
        when(mockLoDashGet).calledWith(expect.anything(), expect.stringMatching("body")).mockReturnValue(mockRequest);
        when(mockLoDashGet).calledWith(expect.anything(), expect.stringMatching("username")).mockReturnValue("USER");
        mockUtilsGet.mockReturnValue(Promise.resolve({ Body: {} }));
        mockUtilsParseJson.mockReturnValue({ username: 'USER' });

        // When
        await requestor.getEvents(req, res);

        // Then
        expect(mockLoDashGet.mock.calls).toHaveLength(2);
        expect(mockUtilsGet.mock.calls).toHaveLength(1);
        const getArgs = mockUtilsGet.mock.calls[0];
        expect(getArgs).toHaveLength(2);
        expect(getArgs[0]).toBe('http://HOST/rest/calendar-services/1.0/calendar/events.json?subCalendarId=ID&start=mockDate&end=mockDate');
        expect(getArgs[1]).toMatchObject({
            "headers": {
                "Authorization": "mockAuthHeader"
            }
        });
        expect(mockResponseStatus.mock.calls).toHaveLength(0);
        expect(mockResponseSend.mock.calls).toHaveLength(1);
        const sendArgs = mockResponseSend.mock.calls[0];
        expect(sendArgs).toHaveLength(1);
    });

    test('getEvents fails when request body is invalid', async () => {
        // Given
        when(mockLoDashGet).calledWith(expect.anything(), expect.stringMatching("body")).mockReturnValue("some other content");

        // When
        await requestor.getEvents(req, res);

        // Then
        expect(mockLoDashGet.mock.calls).toHaveLength(1);
        expect(mockResponseSend.mock.calls).toHaveLength(1);
        expect(mockUtilsGet.mock.calls).toHaveLength(0);
        expect(mockResponseStatus.mock.calls).toHaveLength(1);
        const statusArgs = mockResponseStatus.mock.calls[0];
        expect(statusArgs).toHaveLength(1);
        expect(statusArgs[0]).toBe(400);
    });

    test.skip('getEvents fails when the request to the API errors out', () => {})
});