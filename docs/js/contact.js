/**
 * Initialises the copying specific text with key presses.
 * @param selectableContactTextClass The class of selectable contact text.
 * @param feedbackAnimationInClass The class of feedback elements.
 * @param feedbackAnimationOutClass The class of feedback elements.
 * @param feedbackTimeout The amount of time, in milliseconds, to show the feedback text for.
 */
window.initialiseKeyCopying = (selectableContactTextClass, feedbackAnimationInClass, feedbackAnimationOutClass, feedbackTimeout) =>
{
    //#region Fields

    //#region Constant Fields

    /**
     * An instance of the 'keydown' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const keydownEvent = new ThrottledEvent("keydown", false, 0);

    /**
     * A collection of selectable contact text.
     * @type {NodeListOf<Element>}
     */
    const selectableContactText = document.querySelectorAll(`.${selectableContactTextClass}`);

    /**
     * A collection of feedback elements.
     * @type {NodeListOf<Element>}
     */
    const feedbackAnimationIn = document.querySelectorAll(`.${feedbackAnimationInClass}`);

    /**
     * A collection of feedback elements.
     * @type {NodeListOf<Element>}
     */
    const feedbackAnimationOut = document.querySelectorAll(`.${feedbackAnimationOutClass}`);

    //#endregion
    
    //#endregion
    
    //#region Methods
    
    /**
     * Copies the selected text to the clipboard based on.
     * @param eventData The event data from a key down event.
     * @constructor
     */
    function KeydownCopy(eventData)
    {
        if (eventData.ctrlKey && eventData.code === "KeyC")
        {
            for (let i = 0; i < selectableContactText.length; i++)
            {
                if (selectableContactText[i].textContent === window.getSelection().toString())
                {
                    new CopyFeedback(feedbackAnimationIn[i], feedbackAnimationOut[i], feedbackTimeout)
                }
            }
        }
    }
    
    //#endregion
    
    //#region Behaviours

    keydownEvent.Subscribe(KeydownCopy);
    
    //#endregion
}

/**
 * Changes from the previously selected contact container to the newly selected container.
 * @param selectedButton The instance of the button that was selected.
 * @param selectedContainer The instance of the container that was selected.
 * @param contactButtonCollection A collection contact buttons instances.
 * @param contactContainerCollection A collection contact containers instances.
 * @constructor
 */
function ChangeContactContainer(selectedButton, selectedContainer, contactButtonCollection, contactContainerCollection)
{
    for (let i = 0; i < contactButtonCollection.length; i++)
    {
        // Remove the active classes from the buttons and containers.
        contactButtonCollection[i].classList.remove("active-contact-button");
        contactContainerCollection[i].classList.remove("active-contact-container");
    }

    // Add the active classes to the selected buttons and containers.
    selectedButton.classList.add("active-contact-button");
    selectedContainer.classList.add("active-contact-container");
}