// Using global augmentation + declaration merging
export {};
declare global {
    // tslint:disable-next-line:interface-name
    interface HTMLElement {
        value: string;
    }

    // tslint:disable-next-line:class-name interface-name
    interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
        modal(opt: string): void;
    }

    // tslint:disable-next-line:class-name interface-name
    interface Window {
        Promise: PromiseConstructor;
    }
}
