/**
 * Initialise the trail effect.
 * @param trailClass The class of the elements of the trail.
 * @param range The range of the movement.
 * @param invert Whether to invert the movement for trail elements.
 * @param toMouse Whether the trail goes to the mouse, rather than away from it.
 * @param throttleTimeout The amount of time, in milliseconds, between updates, to improve performance.
 */
window.initialiseTrailEffect = (trailClass, range, invert, toMouse, throttleTimeout) =>
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
     * A collection of elements that are the trail.
     * @type {NodeListOf<HTMLElement>}
     */
    const trailElements = document.querySelectorAll(`.${trailClass}`);
    
    //#endregion
    
    /**
     * A flag to determine if the reload that occurs initially has been invoked.
     * @type {boolean}
     */
    let initialReload;
    
    /**
     * The cached position of the mouse on the 'X' axis.
     * @type {number}
     */
    let mouseX = 0;

    /**
     * The cached position of the mouse on the 'Y' axis.
     * @type {number}
     */
    let mouseY = 0;
    
    //#endregion
    
    //#region Methods

    /**
     * Updates the position of the trail elements based on the mouse position.
     * @param eventData The event data from a mouse event.
     * This is null when a non-mouse event is invoked.
     * @constructor
     */
    function UpdateTrailTransform(eventData)
    {
        mouseX = eventData == null ? mouseX : eventData.clientX;
        mouseY = eventData == null ? mouseY : eventData.clientY;
        
        trailElements.forEach((element, index) =>
        {
            // Calculate the offset based on the mouse position and the index of the trail element.
            // The mouse position is first normalised between '-1' and '1'.
            // Then it is multiplied by the range and divided by the number of trail elements.
            // The result is then multiplied by the index of the trail element to spread the element an offset distance from the other trail elements.
            let offsetX = (((((mouseX / window.innerWidth) * 2) - 1) * range) / trailElements.length) * (invert ? trailElements.length - 1 - index : index);
            let offsetY = (((((mouseY / window.innerHeight) * 2) - 1) * range) / trailElements.length) * (invert ? trailElements.length - 1 - index : index);

            // Set the calculated transform from the CSS animation, manually.
            // If the trail is intended to come towards the mouse, the translation is inverted for the offsets.
            element.style.transform = `translate(${toMouse ? offsetX : -offsetX}%, ${toMouse ? offsetY : -offsetY}%)`;
        });

        if (!initialReload)
        {
            initialReload = true;

            requestAnimationFrame(() => new UpdateTrailTransform(eventData));
        }
    }
    
    //#endregion
    
    //#region Behaviour

    resizeEvent.Subscribe(() => requestAnimationFrame(() => new UpdateTrailTransform(null)));
    mouseOverEvent.Subscribe((eventData) => requestAnimationFrame(() => new UpdateTrailTransform(eventData)));
    mouseMoveEvent.Subscribe((eventData) => requestAnimationFrame(() => new UpdateTrailTransform(eventData)));
    scrollEvent.Subscribe(() => requestAnimationFrame(() => new UpdateTrailTransform(null)));
    
    requestAnimationFrame(() => new UpdateTrailTransform(null));

    //#endregion
};