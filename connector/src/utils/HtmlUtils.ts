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
        // Oh my eyes! (@todo: improve this)
        elem.style.display = visible ? "block" : "none";
    }
}

/**
 * Build and display a modal with the specified content.
 * @todo This is a temporary UI, it will be replaced at some point.
 * @param {string} bodyContent 
 * @param {string} modalId 
 * @returns {void}
 */
export function showModal(bodyContent: string): void {
    $(`<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div class="modal-dialog" role="document"> 
            <div class="modal-content"> 
                <div class="modal-body"> 
                    ${bodyContent}
                </div> 
                <div class="modal-footer"> 
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> 
                </div> 
            </div> 
        </div> 
    </div>`).modal('show');
}
