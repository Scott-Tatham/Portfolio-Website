/**
 * Initialise a transition that fades in an SVG.
 * @param fadeID The ID of the element to fade.
 * @param fadeInHeightStartPercentage The percentage of the screen to use as the start height of the fade in.
 * @param fadeInHeightEndPercentage The percentage of the screen to use as the end height of the fade in.
 * @param fadeOutHeightStartPercentage The percentage of the screen to use as the start height of the fade out.
 * @param fadeOutHeightEndPercentage The percentage of the screen to use as the end height of the fade out.
 * @param throttleTimeout The amount of time, in milliseconds, between updates, to improve performance.
 */
window.initialiseScrollFadeByID = (fadeID, fadeInHeightStartPercentage, fadeInHeightEndPercentage, fadeOutHeightStartPercentage, fadeOutHeightEndPercentage, throttleTimeout) =>
{
    //#region Fields

    //#region Constant Fields

    /**
     * An instance of the 'scroll' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const scrollEvent = new ThrottledEvent('scroll', throttleTimeout);

    /**
     * The element to fade.
     * @type {Element}
     */
    const fadeElement = document.querySelector(`#${fadeID}`);

    /**
     * The decimal percentage of the screen to use as the start height of the fade in.
     * @type {number}
     */
    const fadeInHeightStartDecimal = fadeInHeightStartPercentage / 100;

    /**
     * The decimal percentage of the screen to use as the end height of the fade in.
     * @type {number}
     */
    const fadeInHeightEndDecimal = fadeInHeightEndPercentage / 100;

    /**
     * The decimal percentage of the screen to use as the start height of the fade out.
     * @type {number}
     */
    const fadeOutHeightStartDecimal = fadeOutHeightStartPercentage / 100;

    /**
     * The decimal percentage of the screen to use as the end height of the fade out.
     * @type {number}
     */
    const fadeOutHeightEndDecimal = fadeOutHeightEndPercentage / 100;

    //#endregion

    //#endregion

    //#region Behaviours

    scrollEvent.Subscribe(() => requestAnimationFrame(() => new UpdateOpacity(fadeElement, fadeInHeightStartDecimal, fadeInHeightEndDecimal, fadeOutHeightStartDecimal, fadeOutHeightEndDecimal)));

    //#endregion
}

/**
 * Initialise a transition that fades in an SVG.
 * @param fadeClass The class of the elements to fade.
 * @param fadeInHeightStartPercentage The percentage of the screen to use as the start height of the fade in.
 * @param fadeInHeightEndPercentage The percentage of the screen to use as the end height of the fade in.
 * @param fadeOutHeightStartPercentage The percentage of the screen to use as the start height of the fade out.
 * @param fadeOutHeightEndPercentage The percentage of the screen to use as the end height of the fade out.
 * @param throttleTimeout The amount of time, in milliseconds, between updates, to improve performance.
 */
window.initialiseScrollFadeByClass = (fadeClass, fadeInHeightStartPercentage, fadeInHeightEndPercentage, fadeOutHeightStartPercentage, fadeOutHeightEndPercentage, throttleTimeout) =>
{
    //#region Fields

    //#region Constant Fields

    /**
     * An instance of the 'scroll' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const scrollEvent = new ThrottledEvent('scroll', throttleTimeout);

    /**
     * A collection of elements to fade.
     * @type {NodeListOf<Element>}
     */
    const fadeElements = document.querySelectorAll(`.${fadeClass}`);

    /**
     * The decimal percentage of the screen to use as the start height of the fade in.
     * @type {number}
     */
    const fadeInHeightStartDecimal = fadeInHeightStartPercentage / 100;

    /**
     * The decimal percentage of the screen to use as the end height of the fade in.
     * @type {number}
     */
    const fadeInHeightEndDecimal = fadeInHeightEndPercentage / 100;

    /**
     * The decimal percentage of the screen to use as the start height of the fade out.
     * @type {number}
     */
    const fadeOutHeightStartDecimal = fadeOutHeightStartPercentage / 100;

    /**
     * The decimal percentage of the screen to use as the end height of the fade out.
     * @type {number}
     */
    const fadeOutHeightEndDecimal = fadeOutHeightEndPercentage / 100;

    //#endregion

    //#endregion
    
    //#region Behaviours
    
    fadeElements.forEach(fadeElement =>
    {
        scrollEvent.Subscribe(() => requestAnimationFrame(() => new UpdateOpacity(fadeElement, fadeInHeightStartDecimal, fadeInHeightEndDecimal, fadeOutHeightStartDecimal, fadeOutHeightEndDecimal)));
    })
    
    //#endregion
}

//#region Scroll Fade Methods

/**
 * Update the opacity of the fading element.
 * @param fadeElement The element being faded.
 * @param fadeInHeightStartDecimal The precalculated decimal percentage of the screen to use as the start height of the fade in.
 * @param fadeInHeightEndDecimal The precalculated decimal percentage of the screen to use as the end height of the fade in.
 * @param fadeOutHeightStartDecimal The precalculated decimal percentage of the screen to use as the start height of the fade out.
 * @param fadeOutHeightEndDecimal The precalculated decimal percentage of the screen to use as the end height of the fade out.
 * @constructor
 */
function UpdateOpacity(fadeElement, fadeInHeightStartDecimal, fadeInHeightEndDecimal, fadeOutHeightStartDecimal, fadeOutHeightEndDecimal)
{
    // Cache the inner screen height.
    const windowHeight = window.innerHeight;

    // Cache the top bounds of the element. 
    const top = fadeElement.getBoundingClientRect().top;

    // Calculate the fade start and end heights.
    const fadeInHeightStart = windowHeight * fadeInHeightStartDecimal;
    const fadeInHeightEnd = windowHeight * fadeInHeightEndDecimal;
    const fadeOutHeightStart = windowHeight * fadeOutHeightStartDecimal;
    const fadeOutHeightEnd = windowHeight * fadeOutHeightEndDecimal;

    // Initialise the opacity at one for both fade directions.
    let fadeInOpacity = 1;
    let fadeOutOpacity = 1;

    // Check if the element is within the fade in zone.
    if (top <= fadeInHeightStart && top >= fadeInHeightEnd)
    {
        fadeInOpacity = 1 - ((top - fadeInHeightEnd) / (fadeInHeightStart - fadeInHeightEnd));
    }

    // Else if the element is before the fade in zone, set it to opacity '0'.
    else if (top > fadeInHeightStart)
    {
        fadeInOpacity = 0;
    }

    // Check if the element is within the fade out zone.
    if (top <= fadeOutHeightStart && top >= fadeOutHeightEnd)
    {
        fadeOutOpacity = (top - fadeOutHeightEnd) / (fadeOutHeightStart - fadeOutHeightEnd);
    }

    // Else if the element is beyond the fade out zone, set it to opacity '0'.
    else if (top < fadeOutHeightEnd)
    {
        fadeOutOpacity = 0;
    }

    // Set the final opacity to the minimum of the two fade values.
    fadeElement.style.opacity = Math.min(fadeInOpacity, fadeOutOpacity).toString();
}

//#endregion