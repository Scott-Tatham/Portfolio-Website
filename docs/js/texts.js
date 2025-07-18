window.initialiseRevealTextEffect = (revealTextClass, throttleTimeout) =>
{
    //#region Fields

    //#region Constant Fields

    /**
     * An instance of the 'scroll' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const scrollEvent = new ThrottledEvent('scroll', throttleTimeout);

    const revealTextElements = document.querySelectorAll(`.${revealTextClass}`);

    //#endregion

    let characterTSpans = [];

    revealTextElements.forEach(revealTextElement => {
        let innerHTML = '';
        let characters = revealTextElement.textContent.trim().split('');

        for (let i = 0; i < characters.length; i++) {
            innerHTML += `<tspan>${characters[i]}</tspan>`
        }

        revealTextElement.innerHTML = innerHTML;
    });

    characterTSpans = [...document.querySelectorAll(`.${revealTextClass} tspan`)];

    //#endregion

    //#region Methods

    function UpdateRevealText()
    {
        for (let i = 0; i < characterTSpans.length; i++)
        {
            let {left, top} = characterTSpans[i].getBoundingClientRect();
            top = top - (window.innerHeight * 0.2);
            let colourIndex = 1 - ((top * 0.1) + (left * 0.001)) < 0.1 ? 0.1 : 1 - ((top * 0.01) + (left * 0.001)).toFixed(3);
            colourIndex = colourIndex > 1 ? 1 : colourIndex.toFixed(3);
            colourIndex *= 4.99;
            colourIndex = Math.floor(colourIndex);

            switch (colourIndex)
            {
                case 0:
                    characterTSpans[i].style.fill = '#2D4059';

                    break;

                case 1:
                    characterTSpans[i].style.fill = '#EA5455';

                    break;

                case 2:
                    characterTSpans[i].style.fill = '#F07B3F';

                    break;

                case 3:
                    characterTSpans[i].style.fill = '#FFD460';

                    break;

                case 4:
                    characterTSpans[i].style.fill = '#FFF8EF';

                    break;
            }
        }
    }
    
    //#endregion
    
    //#region Behaviours
    
    scrollEvent.Subscribe(() => requestAnimationFrame(() => UpdateRevealText()));
    
    //#endregion
}

/**
 * Initialise the split text lateral effect.
 * @param centralSplitTextID The ID of the element that is the centre text in the split text.
 * @param topSplitTextClass The class of the elements that are the top text in the split text.
 * @param bottomSplitTextClass The class of the elements that are the bottom text in the split text.
 * @param range The range of the lateral movement.
 * @param throttleTimeout The amount of time, in milliseconds, between updates, to improve performance.
 */
window.initialiseSplitTextLateralEffect = (centralSplitTextID, topSplitTextClass, bottomSplitTextClass, range, throttleTimeout) =>
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
     * A collection of elements that are the top text in the split text.
     * @type {NodeListOf<Element>}
     */
    const topSplitTextElements = document.querySelectorAll(`.${topSplitTextClass}`);

    /**
     * A collection of elements that are the bottom text in the split text.
     * @type {NodeListOf<Element>}
     */
    const bottomSplitTextElements = document.querySelectorAll(`.${bottomSplitTextClass}`);
    
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
     * The 'X' position of the central text element to use as a reference.
     * @type {string}
     */
    let xPosition  = document.querySelector(`#${centralSplitTextID}`).getAttribute("x");

    //#endregion
    
    //#region Methods

    /**
     * Updates the position of the split text elements, laterally, based on the mouse position.
     * @param eventData The event data from a mouse event.
     * This is null when a non-mouse event is invoked.
     * @constructor
     */
    function UpdateSplitTextLaterally(eventData)
    {
        mouseX = eventData == null ? mouseX : eventData.clientX;
        
        topSplitTextElements.forEach((element, index) =>
        {
            // Calculate the offset based on the mouse position and the index of the split text element.
            // The mouse position is first normalised between '-1' and '1'.
            // Then it is multiplied by the range and divided by the number of split text elements.
            // The result is then multiplied by the index of the split text element to spread the element an offset distance from the other split text elements.
            let offsetX = (((((mouseX / window.innerWidth) * 2) - 1) * range) / topSplitTextElements.length) * -(topSplitTextElements.length - index);

            element.setAttribute("x", (xPosition.split("%")[0] - offsetX).toString() + "%");
        });

        bottomSplitTextElements.forEach((element, index) =>
        {
            // Calculate the offset based on the mouse position and the index of the split text element.
            // The mouse position is first normalised between '-1' and '1'.
            // Then it is multiplied by the range and divided by the number of split text elements.
            // The result is then multiplied by the index of the split text element to spread the element an offset distance from the other split text elements.
            let offsetX = (((((mouseX / window.innerWidth) * 2) - 1) * range) / bottomSplitTextElements.length) * (bottomSplitTextElements.length - index);

            element.setAttribute("x", (xPosition.split("%")[0] - offsetX).toString() + "%");
        });
        
        if (!initialReload)
        {
            initialReload = true;

            requestAnimationFrame(() => new UpdateSplitTextLaterally(eventData));
        }
    }
    
    //#endregion

    //#region Behaviour

    resizeEvent.Subscribe(() => requestAnimationFrame(() => new UpdateSplitTextLaterally(null)));
    mouseOverEvent.Subscribe((eventData) => requestAnimationFrame(() => new UpdateSplitTextLaterally(eventData)));
    mouseMoveEvent.Subscribe((eventData) => requestAnimationFrame(() => new UpdateSplitTextLaterally(eventData)));
    scrollEvent.Subscribe(() => requestAnimationFrame(() => new UpdateSplitTextLaterally(null)));

    requestAnimationFrame(() => new UpdateSplitTextLaterally(null));
    
    //#endregion
};

/**
 * Copies the specified text to the clipboard.
 * @param text The text to copy to the clipboard.
 * @param feedbackText The feedback text element.
 * @param feedbackTextAnimationInClass The feedback text animation for revealing.
 * @param feedbackTextAnimationOutClass The feedback text animation for hiding.
 * @param feedbackTextTimeout The amount of time, in milliseconds, to show the feedback text for.
 * @constructor
 */
function CopyTextToClipboard(text, feedbackText, feedbackTextAnimationInClass, feedbackTextAnimationOutClass, feedbackTextTimeout)
{
    // Write the text to the clipboard.
    navigator.clipboard.writeText(text).then(() =>
    {
        // Animate the feeback text.
        new CopyFeedback(feedbackText.querySelectorAll(`.${feedbackTextAnimationInClass}`)[0], feedbackText.querySelectorAll(`.${feedbackTextAnimationOutClass}`)[0], feedbackTextTimeout);
    });
}

/**
 * Toggles the visibility of the feedback text.
 * @param feedbackTextAnimationIn The feedback text animation for revealing.
 * @param feedbackTextAnimationOut The feedback text animation for hiding.
 * @param feedbackTextTimeout The amount of time, in milliseconds, to show the feedback text for.
 * @constructor
 */
function CopyFeedback(feedbackTextAnimationIn, feedbackTextAnimationOut, feedbackTextTimeout)
{
    feedbackTextAnimationIn.beginElement();

    setTimeout(() =>
    {
        feedbackTextAnimationOut.beginElement();
    }, feedbackTextTimeout);
}