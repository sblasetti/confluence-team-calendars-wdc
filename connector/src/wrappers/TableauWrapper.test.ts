import * as TableauWrapper from "./TableauWrapper";
import * as TestUtils from "../TestUtils";

TestUtils.mockGlobal();

describe("TableauWrapper should call sister methods from global tableau", () => {
    test("makeConnector()", () => {
        // When
        TableauWrapper.makeConnector();

        // Then
        expect(tableau.makeConnector).toHaveBeenCalledTimes(1);
    });

    test("registerConnector()", () => {
        // Given
        const wdc: tableau.WebDataConnector = TestUtils.buildWdcMock();

        // When
        TableauWrapper.registerConnector(wdc);

        // Then
        expect(tableau.registerConnector).toHaveBeenCalledTimes(1);
        expect(tableau.registerConnector).toHaveBeenCalledWith(wdc);
    });

    test("submit()", () => {
        // When
        TableauWrapper.submit();

        // Then
        expect(tableau.submit).toHaveBeenCalledTimes(1);
    });
});