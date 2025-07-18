/**
 * An object that throttles animations for events.
 */
class ThrottledEvent
{
    //#region Initialisation
    
    /**
     Initialise the ThrottledEvent.
     * @param eventName The name of the event for selecting it when adding a listener.
     * @param isPassive Whether the event has a passive listener.
     * @param throttleTimeout The number of milliseconds to throttle the event.
     * By default, this is '0', thus not throttled.
     */
    constructor(eventName, isPassive = true, throttleTimeout = 0)
    {
        /**
         * A flag to determine if the event is currently locked by the throttle timeout.
         * @type {boolean}
         */
        this.locked = false;

        /**
         * A collection of all callbacks to be invoked when the event is invoked.
         * @type {Set<function>}
         */
        this.callbacks = new Set();

        window.addEventListener(eventName, eventData =>
        {
            if (!this.locked)
            {
                this.callbacks.forEach(callback => callback(eventData));

                this.locked = true;

                setTimeout(() => this.locked = false, throttleTimeout);
            }
        }, {passive: isPassive});
    }
    
    //#endregion
    
    //#region Methods

    /**
     * Subscribe a callback to be invoked when the event is invoked.
     * @param callback The callback to subscribe.
     */
    Subscribe(callback)
    {
        this.callbacks.add(callback);
    }

    /**
     * Unsubscribe a callback from being invoked when the event is invoked.
     * @param callback The callback to unsubscribe.
     * @constructor
     */
    Unsubscribe(callback)
    {
        this.callbacks.delete(callback);
    }
    
    //#endregion
}

/**
 * An object that throttles animations for events on an element.
 */
class ElementThrottledEvent
{
    //#region Initialisation

    /**
     Initialise the ThrottledEvent.
     * @param element The element the event invokes on.
     * @param eventName The name of the event for selecting it when adding a listener.
     * @param isPassive Whether the event has a passive listener.
     * @param throttleTimeout The number of milliseconds to throttle the event.
     * By default, this is '0', thus not throttled.
     */
    constructor(element, eventName, isPassive = true, throttleTimeout = 0)
    {
        /**
         * A flag to determine if the event is currently locked by the throttle timeout.
         * @type {boolean}
         */
        this.locked = false;

        /**
         * A collection of all callbacks to be invoked when the event is invoked.
         * @type {Set<function>}
         */
        this.callbacks = new Set();

        element.addEventListener(eventName, eventData =>
        {
            if (!this.locked)
            {
                this.callbacks.forEach(callback => callback(eventData));

                this.locked = true;

                setTimeout(() => this.locked = false, throttleTimeout);
            }
        });
    }

    //#endregion

    //#region Methods

    /**
     * Subscribe a callback to be invoked when the event is invoked.
     * @param callback The callback to subscribe.
     */
    Subscribe(callback)
    {
        this.callbacks.add(callback);
    }

    /**
     * Unsubscribe a callback from being invoked when the event is invoked.
     * @param callback The callback to unsubscribe.
     * @constructor
     */
    Unsubscribe(callback)
    {
        this.callbacks.delete(callback);
    }

    //#endregion
}