export function getHtmlValue(elementId: string): string {
    const elem: any = document.getElementById(elementId);
    return elem ? elem.value : "";
}

export function setHtmlValue(elementId: string, value: any): void {
    const elem: any = document.getElementById(elementId);
    if (elem) {
        elem.value = value;
    }
}

export function addEvent(elementId: string, eventName: string, eventHandler: (e: any) => void): void {
    const elem: any = document.getElementById(elementId);
    if (elem) {
        elem.addEventListener(eventName, eventHandler);
    }
}

export function toggle(elementId: string, visible: boolean): void {
    const elem: any = document.getElementById(elementId);
    if (elem) {
        // Oh my eyes! (hackathon only)
        elem.style.display = visible ? "block" : "none";
    }
}
