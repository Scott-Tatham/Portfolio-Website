/**
 * Initialise the line hover effect.
 * When a line is hovered over, all other lines of the same colour are also affected.
 * @param linesContainerClass The class of the line container.
 * @param throttleTimeout The amount of time, in milliseconds, between updates, to improve performance.
 */
window.initialiseLinesHoverEffect = (linesContainerClass, throttleTimeout) =>
{
    //#region Fields
    
    //#region Constant Fields

    /**
     * A collection of elements that are the first line in a line set.
     * @type {NodeListOf<Element>}
     */
    const lineOneElements = document.querySelectorAll(`.${linesContainerClass} > path:nth-child(1)`);

    /**
     * A collection of elements that are the second line in a line set.
     * @type {NodeListOf<Element>}
     */
    const lineTwoElements = document.querySelectorAll(`.${linesContainerClass} > path:nth-child(2)`);

    /**
     * A collection of elements that are the third line in a line set.
     * @type {NodeListOf<Element>}
     */
    const lineThreeElements = document.querySelectorAll(`.${linesContainerClass} > path:nth-child(3)`);

    /**
     * A collection of elements that are the fourth line in a line set.
     * @type {NodeListOf<Element>}
     */
    const lineFourElements = document.querySelectorAll(`.${linesContainerClass} > path:nth-child(4)`);

    /**
     * A collection of elements that are the fifth line in a line set.
     * @type {NodeListOf<Element>}
     */
    const lineFiveElements = document.querySelectorAll(`.${linesContainerClass} > path:nth-child(5)`);
    
    //#endregion
    
    //#endregion
    
    //#region Methods

    /**
     * Initialise the line hover effect.
     * When a line is hovered over, all other lines of the same colour are also affected.
     * @param lineElements The lines to initialise.
     * @constructor
     */
    function InitialiseLinesHover(lineElements)
    {
        // Update all other same colour lines to also receive the hover effect for consistency.
        lineElements.forEach(linkedLine =>
        {
            new ElementThrottledEvent(linkedLine, "mouseenter", throttleTimeout).Subscribe(() => lineElements.forEach(linkedLine =>
            {
                linkedLine.classList.add("line-hovered")
            }));
        });

        // Update all other same colour lines to also remove the hover effect for consistency.
        lineElements.forEach(linkedLine =>
        {
            new ElementThrottledEvent(linkedLine, "mouseleave", throttleTimeout).Subscribe(() => lineElements.forEach(linkedLine =>
            {
                linkedLine.classList.remove("line-hovered")
            }));
        });
    }
    
    //#endregion
    
    //#region Behaviours

    new InitialiseLinesHover(lineOneElements);
    new InitialiseLinesHover(lineTwoElements);
    new InitialiseLinesHover(lineThreeElements);
    new InitialiseLinesHover(lineFourElements);
    new InitialiseLinesHover(lineFiveElements);
    
    //#endregion
};