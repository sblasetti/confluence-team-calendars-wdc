import fetch from 'jest-fetch-mock';

jest.mock('../utils/FormatUtils', () => {
    return {
        toNoMilliISOString: jest.fn()
    };
});

const mockCredentials: ICredentials = {
    Username: 'test',
    Password: '1234'
};
const mockValidateCredentialsOptions: IValidateCredentialsOptions = {
    Credentials: mockCredentials,
    HostUrl: 'https://www.test.com'
};
import { validateCredentials } from './ConfluenceWrapper';

describe('ConfluenceWrapper should use the Confluence API correctly', () => {
    // beforeEach(() => {
    //     fetch.resetMocks();
    // });

    it('validateCredentials() requests one space from the API', () => {
        // Given
        const { HostUrl } = mockValidateCredentialsOptions;

        // When
        validateCredentials(mockValidateCredentialsOptions);

        // Then
        const calls: any[][] = fetch.mock.calls;
        expect(calls.length).toBe(1); // a single request
        expect(calls[0].length).toBe(2); // with 2 arguments
        const firstArgument: any = calls[0][0];
        const secondArgument: any = calls[0][1];
        expect(typeof firstArgument).toBe('string'); // first argument type
        expect(typeof secondArgument).toBe('object'); // second argument type
        expect(firstArgument).toBe(`${HostUrl}/rest/api/user?username=${mockValidateCredentialsOptions.Credentials.Username}`); // first argument is the URL
        expect(secondArgument).toHaveProperty('headers'); // second argument is the headers
        expect(secondArgument.headers).toHaveProperty('Authorization'); // headers have credentials
    });
});