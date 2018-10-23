import * as FormatUtils from './FormatUtils';

describe("Test FormatUtils.toNoMilliISOString()", () => {
    const millisDate: Date = new Date("2018-01-02T04:05:06.999Z");
    const noMillisDate: Date = new Date("2018-01-02T04:05:06.000Z");
    // tslint:disable-next-line:prefer-const
    let undefinedDate: Date;
    test("Check date with milliseconds", () => {
        expect(FormatUtils.toNoMilliISOString(millisDate)).toBe("2018-01-02T04:05:06Z");
    });
    test("Check date with no milliseconds", () => {
        expect(FormatUtils.toNoMilliISOString(noMillisDate)).toBe("2018-01-02T04:05:06Z");
    });
    test("Check falsy values", () => {
        expect(FormatUtils.toNoMilliISOString(undefinedDate)).toBe("");
    });
});