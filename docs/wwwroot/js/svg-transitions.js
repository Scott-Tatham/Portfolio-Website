/**
 * Initialise a transition that invokes SVG animations when the specified element is observed.
 * @param observedElementID The ID of the element being observed.
 * @param observedSVGAnimationClass The class of the SVG animations to invoke when observed.
 * @param unobservedSVGAnimationClass The class of the SVG animations to invoke when unobserved.
 * @param disconnectObserver Whether to disconnect the observer after invoking.
 */
window.initialiseObservationSVGAnimation = (observedElementID, observedSVGAnimationClass, unobservedSVGAnimationClass, disconnectObserver) =>
{
    //#region Fields
    
    //#region Constant Fields
    
    /**
     * The element being observed.
     * @type {HTMLElement}
     */
    const observedElement = document.querySelector(`#${observedElementID}`);

    /**
     * A collection of the SVG animations for when the element is observed.
     * @type {NodeListOf<SVGAnimationElement>}
     */
    const observedSVGAnimationsElements = document.querySelectorAll(`.${observedSVGAnimationClass}`);

    /**
     * A collection of the SVG animations for when the element is unobserved.
     * @type {NodeListOf<SVGAnimationElement>}
     */
    const unobservedSVGAnimationsElements = document.querySelectorAll(`.${unobservedSVGAnimationClass}`);

    /**
     * The observer and the functionality of the observer.
     * Note: There is currently a bug that occurs if observation and unobservation are triggered in quick succession.
     * @type {IntersectionObserver}
     */
    const observer = new IntersectionObserver((entries) =>
    {
        entries.forEach((entry) =>
        {
            if (observedSVGAnimationClass != null && entry.isIntersecting && !observed)
            {
                observedSVGAnimationsElements.forEach(svgAnimationElement =>
                {
                    svgAnimationElement.addEventListener("endEvent", () => observed = true);
                    svgAnimationElement.beginElement();
                });

                if (disconnectObserver)
                {
                    observer.disconnect();
                }
            }
            
            if (unobservedSVGAnimationClass != null && !entry.isIntersecting && observed)
            {
                unobservedSVGAnimationsElements.forEach(svgAnimationElement =>
                {
                    svgAnimationElement.addEventListener("endEvent", () => observed = false);
                    svgAnimationElement.beginElement();
                });

                if (disconnectObserver)
                {
                    observer.disconnect();
                }
            }
        })
    });
    
    //#endregion

    /**
     * A flag to determine if the element is currently being observed.
     * @type {boolean}
     */
    let observed = false;
    
    //#endregion
    
    //#region Behaviours
    
    observer.observe(observedElement);

    //#endregion
}