/****
 *
 * trga-analytics - CSS triggered google analytics events
 * Framework to easily set and monitor events with CSS Google Analytics
 *
 * Version 1.0.0
 * By Shai Yerushalmi
 * Updated: 18.12.2019
 *
 *
 * to define DOM zone - add the class to the zone element 'trga-zone' and data attribute data-trga-zone="zone". Zone is registered as category in the google analytics
 * to track mouse events (click / mouseover) add the class to the element 'trga-trigger-by-click', 'trga-trigger-by-mouseover'
 *
 *
 *
 * Optional Data Attributes
 *
 * data-trga-action-name = "action_name" (optional) -  override the action name registered in the analytics
 *
 * data-trga-label = "label_name" (optional) - default label is the text in the element)
 *
 * data-trga-value = "number" (optional) - value for google analytics events. Default is 0
 *
 *
 * data-trga-count-limit = "number" (optional) - number of time the event will be tracked. Default is infinity
 *
 * data-trga-fields-object-text="text" to add comment to the fields-object
 *
 *
 * Export API window.trga
 * ----------------------
 *
 * window.trga.init() - To initiate the events after refresh of elements
 * window.trga.initPage() - init events and reset the events per page counter to restart the limit
 *
 * initWithInterval(seconds) - In case of dynamic applications, use the interval to add the newly added elements to the analytics events.
 * It will add only the elements that were not initiated before
 *
 * Debug functionality
 * -------------------
 * To view console logs of the events use window.trga.setDebug();
 * To turn off console.logs window.trga.setDebug(false);
 *
 *
 */


(function() {


    // Events type, can be extended
    var eventsTrackingArray = [];
    var eventsTrackedPerPage = {};
    var eventsTracked = {};

    var eventsTrackedLastTimeTriggered = {};

    var Debug = {};
    var trgaGaApi = {};


    window.trga = window.trga || {};
    window.trgaAnalytics = {};

    var initIntervalHolder;
    var intervalCounter = 0;
    var tReady;



    // list of events to attach
    var jsEventsNamesArray = [
        'click', 'dblclick',
        'mouseover', 'hover', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave',
        'focus', 'blur', 'keypress', 'keyup',
        'change', 'focusin', 'focusout', 'select',
        'scroll'
    ];

    /**
     * Configs
     * @type {number}
     */



    var config = {
        categoryCssClass: 'trga-zone',
        categoryCssSelector: '.trga-zone',
        limitLabelStringLength: 100,
        throttleWaitTimeMS: 1000,
        initIntervalMs: 3000,
        debugReportString: '==== trga-analytics - '
    };


    /***
     *
     * Expose trga api
     *
     *
     * use initClickEvents on new page rendered
     */



    var trgaApi = {
        init: _init,
        initPage: _initPage,
        initWithInterval: _initWithInterval,
        submitPageView: function(){},
        submitEvent: function(){}
    };




    /**
     *
     * Add event listener for end of loading
     *
     */
    window.addEventListener("load", function(){
        _initializeOnce();
    });


    /***
     * Initialize once  when the code is loaded
     *
     *
     * @private
     */
    function _initializeOnce() {

        _generateEventsTrackingArrayFromEventsNames(jsEventsNamesArray);
        _generateTrgaApi();


        tReady = performance.now();
        _initPage();
    }

    /**
     *
     * Generate the API
     *
     * @private
     */
    function _generateTrgaApi() {
        // init API
        if (window.trga.c.GaApi) {
            trgaGaApi = new window.trga.c.GaApi();
        }


        if (!trgaGaApi) {
            console.error('trgaGaApi is missing, it handles the events submission to google analytics, please import it');
            return;
        }


        trgaApi['submitPageView'] = trgaGaApi.submitGaEvent;
        trgaApi['submitEvent'] = trgaGaApi.submitGaPageView;


        // keep previous trga methods
        for (var i in trgaApi) {
            if (!window.trga[i]) {
                window.trga[i] = trgaApi[i];
            }
        }

        Debug = (window.trga.c['DebugClass']) ? new window.trga.c.DebugClass(config) : {};

        // add debug functionality if exist
        if (Debug.setDebug) {
            window.trga.setDebug = Debug.setDebug,
                window.trga.hiliteDebug = _hiliteDebug
        }

        //Just to keep backward compatibility
        window.trgaAnalytics = window.trga;

    }

    /**
     *
     * Init page and reset all events counting
     *
     * @private
     */


    function _initPage(){
        eventsTrackedPerPage = {};
        _init();
    }
    /***
     *
     * if seconds are false then interval is cleared
     *
     *
     * @param seconds
     * @private
     */
    function _initWithInterval(seconds) {

        clearInterval(initIntervalHolder);

        // turnoff the interval
        if (seconds === false) {
            if(Debug.isDebug) {
                console.log('stop init interval');
            }
            return;
        }

        if(Debug.isDebug) {
            console.log('init interval counter');
        }

        if (parseInt(seconds)) {
            config.initIntervalMs = seconds * 1000;
        }

        initIntervalHolder = setInterval(function () {
            intervalCounter++;
            _init();

            if (Debug.isDebug) {
                console.log('init interval counter', intervalCounter);
            }

        }, config.initIntervalMs);

    }

    /**
     *
     * Init continuously to catch newly created elements
     * Exposed externally
     *
     *
     * @private
     */
    function _init() {

        if(Debug.isDebug) {
            console.log(config.debugReportString + 'init');
            Debug.setDebug();
        }
        _initEventsHandlers();
        _initZones();

        // reset event tracked per page
    }


    function _initEventsHandlers() {
        for (var i = 0; i < eventsTrackingArray.length; i++) {

            if(eventsTrackingArray[i].jsEventName) {
                var jsEventName = eventsTrackingArray[i].jsEventName;
                var cssClass = eventsTrackingArray[i].cssClass;
                var options = eventsTrackingArray[i].options || {};

                _initEvent(jsEventName, cssClass, eventsTrackingArray[i]);
            }

        }

    }

    function _initZones() {
        var elementsByClass = document.querySelectorAll(config.categoryCssSelector + ":not(" + config.categoryCssSelector + "-initialized)");
        // init not allowed multiple events on item
        // var elementsByClass = document.querySelectorAll(config.categoryCssSelector);
        if(elementsByClass) {
            for(var i = 0; i < elementsByClass.length; i++) {
                var element = elementsByClass[i];
                element.className += " " + config.categoryCssClass + "-initialized";
            }
        }
    }

    function _initEvent(jsEventName, cssClass, eventObject) {
        /**
         *
         * Use JS namespaced events
         *
         * Unbind events from existing elements to avoid multiple triggering
         *
         */

        var jsEventNamespace = jsEventName + '.trga';


        // on js element function

        function _onElementEventFunction(event) {

            var el = this;
            _submitEventElement(el, jsEventName, eventObject);
            return true;

        }



        var elementsByClass = document.querySelectorAll("." + cssClass + ":not(."+ cssClass +"-initialized)");
        // var elementsByClass = document.querySelectorAll("." + cssClass);

        if(Debug.isDebug && elementsByClass.length) {
            console.log('elementsByClass found: ', elementsByClass);
        }


        if(elementsByClass) {
            for(var i = 0; i < elementsByClass.length; i++) {
                var element = elementsByClass[i];

                element.trgaOff(jsEventNamespace);
                element.trgaOn(jsEventNamespace, _onElementEventFunction, {capture: true});

                // addChip class init to element
                if(Debug.isDebug) {
                    console.log('element.className', element.className);
                }

                element.className += " " + cssClass + "-initialized";

            }
        }

    }

    function _generateEventsTrackingArrayFromEventsNames(jsEventsNamesArray) {

        for (var i = 0; i < jsEventsNamesArray.length; i++) {
            jsEventName = jsEventsNamesArray[i];
            var eventJson = {
                cssClass: 'trga-trigger-by-' + jsEventName,
                jsEventName: jsEventName
            }
            _addEventToEventsTrackingArray(eventJson);

            // add once for the event
            var eventJsonOnce = {};
            eventJsonOnce['triggerEventCountLimit'] = 1;
            eventJsonOnce.jsEventName = jsEventName;
            eventJsonOnce.cssClass = eventJson.cssClass + '-once';
            _addEventToEventsTrackingArray(eventJsonOnce);
        }
    }

    function _addEventToEventsTrackingArray(eventJson) {
        if (eventsTrackingArray.indexOf(eventJson) < 0) {
            eventsTrackingArray.push(eventJson);
        }
    }

    /**
     *
     * Generic action submission
     *
     * @param el
     * @param initialAction
     * @private
     */

    function _submitEventElement (el, initialAction, eventObject) {

        var action = _getAction(el, initialAction);

        var zone = _getZone(el);
        var fieldsObject = _getFieldsObject(el);
        var label = _getLabel(el);
        var value = _getValue(el);





        var eventHash = _getEventHash(zone,action,label,value);


        // if throttle is not clear then do not submit the event
        if(!_isEventThrottleClear(eventHash)) {


            return;
        }

        // check if there is a limit for the event counter
        // consider removing the class to save resources


        if (!_isEventCounterClear(eventHash, el, eventObject)) {
            if(Debug.isDebug) {
                console.log('event counter passed its limit');
            }
            return;
        }

        // debug
        if(Debug.isDebug) {
            console.log(config.debugReportString + 'trga-action: ' + action, zone, action, label, value, fieldsObject);
        }

        _increaseEventHashCounter(eventHash);

        trgaGaApi.submitGaEvent(zone, action, label, value, fieldsObject);

    }

    function _getEventHash(zone, action, label, value) {
        var concatString = "_";
        var hash = zone + concatString + action + concatString + label + concatString + value;

        return hash;
    }

    function _getEventHashCounter (eventHash) {


        if(!eventsTrackedPerPage[eventHash]) {
            eventsTrackedPerPage[eventHash] = 1;
            eventsTracked[eventHash] = 1;
        }

        return eventsTrackedPerPage[eventHash];
    }

    function _increaseEventHashCounter (eventHash) {
        eventsTrackedPerPage[eventHash]++;
        eventsTracked[eventHash]++;
    }


    function _isEventThrottleClear (eventHash, waitTime) {

        var isClear = false;

        waitTime = (waitTime) ? waitTime: config.throttleWaitTimeMS;

        var lastTime = _getEventLastTimeTriggered(eventHash);

        if (!lastTime || (lastTime + waitTime - Date.now() < 0)) {
            isClear = true;
            _setEventLastTimeTriggered(eventHash);

        } else {
            isClear = false;
        }

        return isClear;
    }


    function _isEventCounterClear (eventHash, el, eventObject) {

        var isClear = false;

        var eventHashCounter = _getEventHashCounter(eventHash);
        var dataTriggerEventCountLimit = _getTriggerEventCountLimit(el, eventObject);

        if(dataTriggerEventCountLimit > 0 && eventHashCounter > dataTriggerEventCountLimit) {
            if(Debug.isDebug) {
                console.log('event not send to google analytics - tracked x' + dataTriggerEventCountLimit + ' per page');
            }
            isClear = false;
        } else {
            isClear = true;
        }

        return isClear;
    }


    function _getEventLastTimeTriggered (eventHash) {

        var lastTimeMs = false;

        if(eventsTrackedLastTimeTriggered[eventHash]) {
           lastTimeMs =  eventsTrackedLastTimeTriggered[eventHash];
        }

        return lastTimeMs;
    }

    function _setEventLastTimeTriggered (eventHash) {

        eventsTrackedLastTimeTriggered[eventHash] = Date.now();
    }

    /***
     *
     * get action if it is not exist then add default
     *
     *
     */
    function _getAction(el, defaultValue) {

        var action = _getDataAttribute(el, 'trgaActionName') || defaultValue;

        return action;
    }

    /**
     *
     * Get Value of the event
     *
     * default is 0
     *
     * @param el
     * @returns {number}
     * @private
     */

    function _getValue(el) {

        var value = _getDataAttribute(el, 'trgaValue');

        value = (parseInt(value)) || 0;
        return value;
    }

    /***
     *
     * Data attribute overrides the original settings
     *
     * if = -1 then override the original number in event options
     *
     * @param el
     * @param eventObject
     * @returns {number}
     * @private
     */

    function _getTriggerEventCountLimit(el, eventObject) {

        var countLimit = _getDataAttribute(el, 'trgaCountLimit');

        countLimit = (parseInt(countLimit)) || 0;

        // if countLimit not exist in data-attribute then check the options

        if (!countLimit || countLimit !== -1) {
            if(eventObject && eventObject.triggerEventCountLimit > 0) {
                countLimit = eventObject.triggerEventCountLimit;
            }
        }

        return countLimit;
    }

    /**
     *
     * Get the label of the event
     *
     * @param el
     * @returns {string}
     * @private
     */

    function _getLabel(el) {

        var label = _getDataAttribute(el, 'trgaLabel');

        if(!label){
            label = el.textContent
        }

        label = label || 'label N/A';
        label = label.trim();
        if(label.length > config.limitLabelStringLength) {
            label = label.substring(0, config.limitLabelStringLength);
        }

        return label;
    }


    /**
     *
     * Get the DOM zone
     *
     * @param el
     * @returns {*}
     * @private
     */

    function _getZone(el) {

        var zone = _getDataAttribute(el , 'trgaZone');

        if (!zone) {
            var elZone = el.closest(config.categoryCssSelector);
            zone = _getDataAttribute(elZone , 'trgaZone');
        }



        zone = zone || "zone N/A";

        return zone;
    }

    /**
     *
     * Get the data-attribute of an element
     *
     * @param el
     * @param dataAttr
     * @returns {string}
     * @private
     */
    function _getDataAttribute(el, dataAttr) {

        var attr = el.dataset[dataAttr];

        return attr;


    }


    /***
     *
     * Additional data added to the event as json
     *
     *
     * @param el
     * @returns {{}}
     * @private
     */

    function _getFieldsObject(el) {

        var tNow = performance.now();

        var fieldsObject = _getDataAttribute(el,'trgaFieldsObject') || {};


        if(typeof fieldsObject === 'string') {
            try {
                fieldsObject = JSON.parse(fieldsObject);
            } catch (e) {
                console.log(config.debugReportString , e);
                console.log(config.debugReportString + 'problem with parse json, try to use "double quotes" for json keys');
            }
        }

        if (_getDataAttribute(el, 'trgaFieldsObjectText')) {
            fieldsObject.text = _getDataAttribute(el, 'trgaFieldsObjectText');
        }


        fieldsObject.timeReady = Math.round((tNow - tReady) / 1000);

        return fieldsObject;
    }


    /**
     *
     * Api to Debug.hilite
     *
     * @param active
     * @private
     */

    function _hiliteDebug(active) {
        Debug.hiliteDebug(active, eventsTrackingArray)
    }


})( );
