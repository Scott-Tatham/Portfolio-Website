//#region Fields

/**
 * A flag to determine if the layout is in horizontal mode.
 * @type {boolean}
 */
let horizontalLayout;

/**
 * A flag to determine if the scroll should be manually throttled.
 * @type {boolean}
 */
let manualThrottle = false;

/**
 * The current element that is targeted for scrolling.
 * @type {number}
 */
let scrollIndex = 0;

/**
 * The current change to be applied to the scrollIndex.
 * @type {number}
 */
let scrollIndexDelta = 0;

/**
 * A collection of the elements to scroll to, across the site.
 * @type {NodeListOf<Element>}
 */
let scrollPointElements;

/**
 * A local reference to the 'skipHorizontalScrollPointClass' argument.
 * @type {string}
 */
let skipHorizontalScrollPointClassLocal;

/**
 * A local reference to the 'skipVerticalScrollPointClass' argument.
 * @type {string}
 */
let skipVerticalScrollPointClassLocal;

/**
 * A local reference to the 'stickyScrollPointClass' argument.
 * @type {string}
 */
let stickyScrollPointClassLocal;

/**
 * A local reference to the 'scrollInAnimationClass' argument.
 * @type {string}
 */
let scrollInAnimationClassLocal

/**
 * A local reference to the 'scrollOutAnimationClass' argument.
 * @type {string}
 */
let scrollOutAnimationClassLocal;

/**
 * A local reference to the 'throttleTimeout' argument.
 * @type {number}
 */
let throttleTimeoutLocal;

//#endregion

/**
 * Initialise the scroll override. This controls the scrolling so that each the site acts somewhat like a slideshow.
 * @param scrollPointClass The class of elements to scroll to throughout the site.
 * @param stickyScrollPointClass The class of elements that require an alternate scrolling method due to sticky positioning.
 * @param skipForwardsScrollPointClass The class of elements to skip scrolling to when going forwards through the site.
 * @param skipBackwardsScrollPointClass The class of elements to skip scrolling to when going backwards through the site.
 * @param skipHorizontalScrollPointClass The class of elements to skip scrolling to when the site is in horizontal mode.
 * @param skipVerticalScrollPointClass The class of elements to skip scrolling to when the site is in vertical mode.
 * @param scrollInAnimationClass The class of elements to activate the animation for when scrolling into the element.
 * @param scrollOutAnimationClass The class of elements to activate the animation for when scrolling out of the element.
 * @param throttleTimeout The amount of time, in milliseconds, between updates, to improve performance.
 */
window.initialiseScrollOverride = (scrollPointClass, stickyScrollPointClass, skipForwardsScrollPointClass, skipBackwardsScrollPointClass, skipHorizontalScrollPointClass, skipVerticalScrollPointClass, scrollInAnimationClass, scrollOutAnimationClass, throttleTimeout) =>
{
    //#region Fields

    //#region Constant Fields

    /**
     * An instance of the 'resize' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const resizeEvent = new ThrottledEvent("resize", false, 0);

    /**
     * An instance of the 'wheel' event.
     * @type {ThrottledEvent}
     */
    const wheelEvent = new ThrottledEvent("wheel", false, 0);

    /**
     * An instance of the 'touchmove' event.
     * @type {ThrottledEvent}
     */
    const touchMoveEvent = new ThrottledEvent("touchmove", false, 0);

    /**
     * An instance of the 'keydown' event.
     * @type {ThrottledEvent}
     */
    const keydownEvent = new ThrottledEvent("keydown", false, 0);

    /**
     * An instance of the 'scroll' event.
     * @type {ThrottledEvent}
     */
    const scrollEvent = new ThrottledEvent("scroll", false, 0);

    /**
     * An instance of the 'mousedown' event that has been throttled.
     * @type {ThrottledEvent}
     */
    const mouseDownEvent = new ThrottledEvent("mousedown", false, 0);

    //#endregion

    //#endregion
    
    //#region Initialisation

    // Initialise the local fields.
    horizontalLayout = IsHorizontal();
    scrollPointElements = document.querySelectorAll(`.${scrollPointClass}`);
    skipHorizontalScrollPointClassLocal = skipHorizontalScrollPointClass;
    skipVerticalScrollPointClassLocal = skipVerticalScrollPointClass;
    stickyScrollPointClassLocal = stickyScrollPointClass;
    scrollInAnimationClassLocal = scrollInAnimationClass;
    scrollOutAnimationClassLocal = scrollOutAnimationClass;
    throttleTimeoutLocal = throttleTimeout;
    
    //#endregion
    
    //#region Methods

    /**
     * Reload the page after resizing to deal with the changes. Pretty nuclear, but it was the best solution at the present.
     * @constructor
     */
    function ResizeReload()
    {
        // This is probably a bad idea.
        //window.location.reload();
    }
    
    /**
     * Handles the rerouting of wheel scrolling.
     * @param eventData The event data from a wheel event.
     * @constructor
     */
    function WheelControl(eventData)
    {
        eventData.preventDefault();

        scrollIndexDelta = eventData.deltaY > 0 ? 1 : -1;

        scrollIndexDelta > 0 ? new NextScrollPoint() : new PreviousScrollPoint();
    }
    
    /**
     * Handles the rerouting of touch-based scrolling.
     * @param eventData The event data from a touch move event.
     * @constructor
     */
    function TouchMoveControl(eventData)
    {
        eventData.preventDefault();

        scrollIndexDelta = eventData.deltaY > 0 ? 1 : -1;

        scrollIndexDelta > 0 ? new NextScrollPoint() : new PreviousScrollPoint();
        
        new NextScrollPoint();
    }
    
    /**
     * Handles the rerouting of key-based scrolling.
     * @param eventData The event data from a key down event.
     * @constructor
     */
    function KeydownControl(eventData)
    {
        switch(eventData.code)
        {
            case "ArrowDown" || "ArrowRight" || "PageDown":
                eventData.preventDefault();

                scrollIndexDelta = 1;

                new NextScrollPoint();
                
                break;
                
            case "ArrowUp" || "ArrowLeft" || "PageUp":
                eventData.preventDefault();

                scrollIndexDelta = -1;

                new PreviousScrollPoint();
                
                break;
                
            case "Home":
                eventData.preventDefault();
                
                scrollIndexDelta = 0;

                new ScrollToElement(scrollPointElements[0]);
            
                break;
                
            case "End":
                eventData.preventDefault();
                
                scrollIndexDelta = 0;
                
                if (IsHorizontal())
                {
                    new ScrollToElement(scrollPointElements[scrollPointElements.length - 2]);

                    break;
                }
                
                new ScrollToElement(scrollPointElements[scrollPointElements.length - 1]);

                break;
        }
    }

    /**
     * Handles the disabling of regular scrolling.
     * @param eventData The event data from a scroll event.
     * @constructor
     */
    function ScrollControl(eventData)
    {
        eventData.preventDefault();
    }

    /**
     * Handles the disabling of middle mouse click scrolling.
     * @param eventData The event data from a scroll event.
     * @constructor
     */
    function MouseDownControl(eventData)
    {
        if (eventData.button === 1)
        {
            eventData.preventDefault();
        }
    }

    /**
     * Scroll automatically to the next scroll point.
     * @constructor
     */
    function NextScrollPoint()
    {
        if (!manualThrottle && scrollIndex !== scrollPointElements.length) 
        {
            for (let i = scrollIndex + 1; i < scrollPointElements.length; i++)
            {
                // Cache the current scroll index its class list.
                const currentScrollPointElement = scrollPointElements[i];
                const currentScrollPointElementClassList = currentScrollPointElement.classList;

                // Determine if the scroll point is in the correct scroll direction.
                if ((IsHorizontal() && !currentScrollPointElementClassList.contains(skipHorizontalScrollPointClass)) || (!IsHorizontal() && !currentScrollPointElementClassList.contains(skipVerticalScrollPointClass)))
                {
                    // Handle the scrolling.
                    currentScrollPointElement.scrollIntoView();

                    // If this is not a skip element, then finish the scrolling.
                    if (!currentScrollPointElementClassList.contains(skipForwardsScrollPointClass))
                    {
                        // Invoke scroll events.
                        new HandleScrollEvents(scrollPointElements[scrollIndex], currentScrollPointElement);
                        
                        // Cache the current scroll index.
                        scrollIndex = i;
                        // Reset the change in scroll index.
                        scrollIndexDelta = 0;

                        manualThrottle = true;

                        setTimeout(() => manualThrottle = false, throttleTimeout);

                        return;
                    }
                }
            }
        }
    }

    /**
     * Scroll automatically to the previous scroll point.
     * @constructor
     */
    function PreviousScrollPoint()
    {
        if (!manualThrottle && scrollIndex !== 0)
        {
            // Tracks the change in horizontal and vertical scroll for sticky elements.
            let stickyHorizontalScrollDelta = 0;
            let stickyVerticalScrollDelta = 0;
            
            for (let i = scrollIndex - 1; i >= 0; i--)
            {
                // Cache the current scroll index and its class list.
                const currentScrollPointElement = scrollPointElements[i];
                const currentScrollPointElementClassList = currentScrollPointElement.classList;

                // Determine if the scroll point is in the correct scroll direction.
                if ((IsHorizontal() && !currentScrollPointElementClassList.contains(skipHorizontalScrollPointClass)) || (!IsHorizontal() && !currentScrollPointElementClassList.contains(skipVerticalScrollPointClass)))
                {
                    // Handle the sticky scrolling.
                    if (currentScrollPointElementClassList.contains(stickyScrollPointClass))
                    {
                        // Increase the change in scroll for sticky elements.
                        const previousScrollPointTargetRect = scrollPointElements[i + 1].getBoundingClientRect();
                        stickyHorizontalScrollDelta -= previousScrollPointTargetRect.width;
                        stickyVerticalScrollDelta -= previousScrollPointTargetRect.height;
                    }

                    // Handle the scrolling.
                    else
                    {
                        // If there is any change in delta for scrolling, based on sticky elements, handle that first.
                        if (stickyHorizontalScrollDelta !== 0 || stickyVerticalScrollDelta !== 0)
                        {
                            currentScrollPointElement.parentElement.scrollBy(stickyHorizontalScrollDelta, stickyVerticalScrollDelta);
                            stickyHorizontalScrollDelta = stickyVerticalScrollDelta = 0;
                        }
                        
                        currentScrollPointElement.scrollIntoView();
                    }

                    // If this is not a skip element, then finish the scrolling.
                    if (!currentScrollPointElementClassList.contains(skipBackwardsScrollPointClass))
                    {
                        // If there is any change in delta for scrolling, based on sticky elements, handle that first.
                        if (stickyHorizontalScrollDelta !== 0 || stickyVerticalScrollDelta !== 0)
                        {
                            currentScrollPointElement.parentElement.scrollBy(stickyHorizontalScrollDelta, stickyVerticalScrollDelta);
                            stickyHorizontalScrollDelta = stickyVerticalScrollDelta = 0;
                        }
                        
                        // Invoke scroll events.
                        new HandleScrollEvents(scrollPointElements[scrollIndex], currentScrollPointElement, true);
                        
                        // Cache the current scroll index.
                        scrollIndex = i;
                        // Reset the change in scroll index.
                        scrollIndexDelta = 0;

                        manualThrottle = true;

                        setTimeout(() => manualThrottle = false, throttleTimeout);

                        return;
                    }
                }
            }
        }
    }
    
    //#endregion
    
    //#region Behaviours
    
    resizeEvent.Subscribe(ResizeReload);
    wheelEvent.Subscribe(WheelControl);
    touchMoveEvent.Subscribe(TouchMoveControl);
    keydownEvent.Subscribe(KeydownControl);
    scrollEvent.Subscribe(ScrollControl);
    mouseDownEvent.Subscribe(MouseDownControl);

    //#endregion
}

/**
 * Scroll to a specific scroll point element.
 * @param scrollPointTarget The instance of the scroll point element to target.
 * @param skipThrottle Determines if the throttle behaviour should be skipped.
 * @param skipOtherLayout Determines if the other layout direction should be scrolled too.
 * @constructor
 */
function ScrollToElement(scrollPointTarget, skipThrottle = false, skipOtherLayout = true)
{
    if (!manualThrottle || skipThrottle)
    {
        // Cache the index of the element
        const targetIndex = [...scrollPointElements].indexOf(scrollPointTarget);

        // Determine if the index of the target scroll point element is higher than the current scroll index.
        if (targetIndex > scrollIndex)
        {
            for (let i = scrollIndex; i <= targetIndex; i++)
            {
                // Cache the current scroll index its class list.
                const currentScrollPointElement = scrollPointElements[i];
                const currentScrollPointElementClassList = currentScrollPointElement.classList;

                // Determine if the scroll point is in the correct scroll direction.
                if (!skipOtherLayout || ((IsHorizontal() && !currentScrollPointElementClassList.contains(skipHorizontalScrollPointClassLocal)) || (!IsHorizontal() && !currentScrollPointElementClassList.contains(skipVerticalScrollPointClassLocal))))
                {
                    // Handle the scrolling.
                    currentScrollPointElement.scrollIntoView();

                    if (i === targetIndex)
                    {
                        // Invoke scroll events.
                        new HandleScrollEvents(scrollPointElements[i - 1], currentScrollPointElement);
                    }
                }
            }
        }

        for (let i = scrollIndex; i >= targetIndex; i--)
        {
            // Cache the current scroll index its class list.
            const currentScrollPointElement = scrollPointElements[i];
            const currentScrollPointElementClassList = currentScrollPointElement.classList;

            // Determine if the scroll point is in the correct scroll direction.
            if (!skipOtherLayout || ((IsHorizontal() && !currentScrollPointElementClassList.contains(skipHorizontalScrollPointClassLocal)) || (!IsHorizontal() && !currentScrollPointElementClassList.contains(skipVerticalScrollPointClassLocal))))
            {
                // Handle the sticky scrolling.
                if (currentScrollPointElementClassList.contains(stickyScrollPointClassLocal))
                {
                    // Scroll back the size of the element.
                    const currentScrollPointTargetRect = currentScrollPointElement.getBoundingClientRect();
                    currentScrollPointElement.parentElement.scrollBy(-currentScrollPointTargetRect.width, -currentScrollPointTargetRect.height)
                }

                // Handle the scrolling.
                else
                {
                    currentScrollPointElement.scrollIntoView();
                }

                if (i === targetIndex)
                {
                    // Invoke scroll events.
                    new HandleScrollEvents(scrollPointElements[i - 1], currentScrollPointElement);
                }
            }
        }

        scrollIndex = targetIndex;

        if (!skipThrottle)
        {
            manualThrottle = true;

            setTimeout(() => manualThrottle = false, throttleTimeoutLocal);
        }
    }
}

/**
 * Invokes events when the scroll point changes.
 * @param previousScrolledElement The instance of the element that was scrolled out of.
 * @param newScrolledElement The instance of the element that was scrolled into.
 * @param isBackwards Whether the scroll direction is backwards.
 * @constructor
 */
function HandleScrollEvents(previousScrolledElement, newScrolledElement, isBackwards = false)
{
    if (newScrolledElement && previousScrolledElement)
    {
        const scrollInAnimationElements = newScrolledElement?.querySelectorAll(`.${scrollInAnimationClassLocal}`);
        const scrollOutAnimationElements = previousScrolledElement?.querySelectorAll(`.${scrollOutAnimationClassLocal}`);

        const previousScrolledElementParent = previousScrolledElement.parentElement;
        const newScrolledElementParent = newScrolledElement.parentElement;

        if (isBackwards && newScrolledElementParent !== previousScrolledElementParent)
        {
            previousScrolledElementParent.addEventListener("scrollend", ScrollInAnimation);
            previousScrolledElementParent.addEventListener("scrollend", ScrollOutAnimation);

            return;
        }

        newScrolledElementParent.addEventListener("scrollend", ScrollInAnimation);
        newScrolledElementParent.addEventListener("scrollend", ScrollOutAnimation);

        /**
         * Handle the animations for scrolling into an element.
         * @constructor
         */
        function ScrollInAnimation()
        {
            scrollInAnimationElements.forEach(scrollInAnimationElement =>
            {
                scrollInAnimationElement.beginElement();
            });

            newScrolledElement?.parentElement.removeEventListener("scrollend", ScrollInAnimation);
        }

        /**
         * Handle the animations for scrolling into an element.
         * @constructor
         */
        function ScrollOutAnimation()
        {
            scrollOutAnimationElements.forEach(scrollOutAnimationElement =>
            {
                scrollOutAnimationElement.beginElement();
            });

            newScrolledElement.parentElement.removeEventListener("scrollend", ScrollOutAnimation);
        }
    }
}