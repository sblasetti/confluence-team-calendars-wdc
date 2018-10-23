import * as HtmlUtils from './HtmlUtils';

describe("Test HtmlUtils.getHtmlValue", () => {
    test("An input text with a value", () => {
        // Mocking document body?
        document.body.innerHTML = "<input type='text' id='testid' value='Text123'></input>";
        expect(HtmlUtils.getHtmlValue("testid")).toBe("Text123");
    });

    test("An input text with no value", () => {
        document.body.innerHTML = "<input type='text' id='testid'></input>";
        expect(HtmlUtils.getHtmlValue("testid")).toBe("");
    });

    test("A select with selected value", () => {
        document.body.innerHTML = "<select id='testid'><option value='dog'>Dog</option><option selected value='cat'>Cat</option><option value='hamster'>Hamster</option></select>";
        expect(HtmlUtils.getHtmlValue("testid")).toBe("cat");
    });

    test("A select with no selected value", () => {
        document.body.innerHTML = "<select id='testid'><option value='dog'>Dog</option><option value='cat'>Cat</option><option value='hamster'>Hamster</option></select>";
        // First item by default?
        expect(HtmlUtils.getHtmlValue("testid")).toBe("dog");
    });

    test("An element that does not support value", () => {
        document.body.innerHTML = "<div id='testid'></div>";
        expect(HtmlUtils.getHtmlValue("testid")).toBe(undefined);
    });

    test("The element is missing", () => {
        document.body.innerHTML = "<div>Howdy</div>";
        expect(HtmlUtils.getHtmlValue("testid")).toBe("");
    });
});

describe("Test HtmlUtils.addEvent", () => {
    test("The element is missing", () => {
        const doc: string = "<div>Howdy</div>";
        document.body.innerHTML = doc;
        HtmlUtils.addEvent("testid", "click", () => { alert(1); });
        expect(document.getElementById("testid")).toBeNull();
    });

    test("The click event is added", () => {
        const doc: string = "<div id='testid'>Howdy</div>";
        document.body.innerHTML = doc;
        HtmlUtils.addEvent("testid", "click", () => { alert(1); });
        const elem: any = document.getElementById("testid");
        expect(elem.click).toBeDefined();
    });
});

describe("Test HtmlUtils.toggle", () => {
    test("Toggle an existing element", () => {
        document.body.innerHTML = "<span id='testid'>Hi</span>";
        let elem: any = document.getElementById("testid");
        expect(elem.style.display).toBe("");
        HtmlUtils.toggle("testid", true);
        elem = document.getElementById("testid");
        expect(elem.style.display).toBe("block");
        HtmlUtils.toggle("testid", false);
        elem = document.getElementById("testid");
        expect(elem.style.display).toBe("none");
    });

    test("Toggle a missing element", () => {
        document.body.innerHTML = "<span>Hi</span>";
        HtmlUtils.toggle("testid", true);
        expect(document.getElementById("testid")).toBeNull();
        HtmlUtils.toggle("testid", false);
        expect(document.getElementById("testid")).toBeNull();
    });
});