/**
 * Initialise the cursor for the page.
 * @param cursorID The ID of the element that is the SVG cursor.
 * @param toDiamondAnimationID The ID of the element that animates the cursor to a diamond.
 * @param toPentagonAnimationID The ID of the element that animates the cursor to a pentagon.
 * @param pointerTargetClass The class of the elements that are targetable by the cursor.
 * @param throttleTimeout The amount of time, in milliseconds, between updates, to improve performance.
 */
window.initialiseCursor = (cursorID, toDiamondAnimationID, toPentagonAnimationID, pointerTargetClass, throttleTimeout) =>
{
    //#region Fields

    //#region Constant Fields

    /**
     * An instance of the 'resize' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const resizeEvent = new ThrottledEvent('resize', throttleTimeout);

    /**
     * An instance of the 'mouseover' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const mouseOverEvent = new ThrottledEvent('mouseover', throttleTimeout);

    /**
     * An instance of the 'mousemove' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const mouseMoveEvent = new ThrottledEvent('mousemove', throttleTimeout);

    /**
     * An instance of the 'scroll' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const scrollEvent = new ThrottledEvent('scroll', throttleTimeout);

    /**
     * The cursor SVG element.
     * @type {HTMLElement}
     */
    const cursorElement = document.querySelector(`#${cursorID}`);

    /**
     * The element that animates the cursor to a diamond.
     * @type {SVGAnimationElement}
     */
    const toDiamondAnimationElement = document.querySelector(`#${toDiamondAnimationID}`);

    /**
     * The element that animates the cursor to a pentagon.
     * @type {SVGAnimationElement}
     */
    const toPentagonAnimationElement = document.querySelector(`#${toPentagonAnimationID}`);

    /**
     * A collection of elements targetable by the cursor.
     * @type {NodeListOf<Element>}
     */
    const pointerTargetElements = document.querySelectorAll(`.${pointerTargetClass}`);

    //#endregion

    /**
     * A counter for tracking how many times the cursor transform calculations has been invoked initially.
     * This is used in a dirty hack to ensure the cursor is positioned after other factors have been calculated.
     * @type {number}
     */
    let initialReloadCount = 0;

    /**
     * The cached position of the mouse on the 'X' axis.
     */
    let mouseX = 0;

    /**
     * The cached position of the mouse on the 'Y' axis.
     */
    let mouseY = 0;
    
    //#endregion
    
    //#region Methods

    /**
     * Updates the position of the cursor element based on the mouse position.
     * @param eventData The event data from a mouse event.
     * This is null when a non-mouse event is invoked.
     * @constructor
     */
    function UpdateCursorTransform(eventData)
    {
        mouseX = eventData == null ? mouseX : eventData.clientX;
        mouseY = eventData == null ? mouseY : eventData.clientY;
        
        cursorElement.style.left = mouseX + "px";
        cursorElement.style.top = mouseY + "px";

        if (initialReloadCount < throttleTimeout)
        {
            initialReloadCount++;

            requestAnimationFrame(() => new UpdateCursorTransform(eventData));
        }
    }

    /**
     * Reveals the cursor on the first move of the mouse.
     * @constructor
     */
    function RevealCursor()
    {
        cursorElement.classList.remove("hidden");
        mouseMoveEvent.Unsubscribe(RevealCursor);
    }
    
    //#endregion
    
    //#region Behaviours
    
    resizeEvent.Subscribe(() => requestAnimationFrame(() => new UpdateCursorTransform(null)));
    mouseOverEvent.Subscribe((eventData) => requestAnimationFrame(() => new UpdateCursorTransform(eventData)));
    mouseMoveEvent.Subscribe((eventData) => requestAnimationFrame(() => new UpdateCursorTransform(eventData)));
    mouseMoveEvent.Subscribe(RevealCursor);
    scrollEvent.Subscribe(() => requestAnimationFrame(() => new UpdateCursorTransform(null)));
    
    pointerTargetElements.forEach((pointerTargetElement) =>
    {
        new ElementThrottledEvent(pointerTargetElement, "mouseenter", throttleTimeout).Subscribe(() => toDiamondAnimationElement.beginElement());
        new ElementThrottledEvent(pointerTargetElement, "mouseleave", throttleTimeout).Subscribe(() => toPentagonAnimationElement.beginElement());
    });
    
    requestAnimationFrame(() => new UpdateCursorTransform(null));
    
    //#endregion
}