/****
 *
 * trga-ga-api
 *
 * API for Debug
 *
 */


(function() {


    window.trga = window.trga || {};
    window.trga.c = window.trga.c || {};
    window.trga.c.DebugClass = DebugClass;

    var domHelper = window.trga.domHelper;

    window.addEventListener("load", function(){

        domHelper = window.trga.domHelper;
        if(!domHelper) {
            console.error('DomHelper class not found! import the desired JS');

        }

    });







    /**
     *
     * Debug Class to activate debug options
     *
     * Such as hilighting Tracked zone and DOM element
     *
     *
     * @constructor
     */



    function DebugClass(config) {

        var config = config;

        var debugClassName = 'trga-hilite';
        var isInitDebugClass = false;
        this.isDebug = false;
        this.isDebugHilite = false;

        this.setDebug = _setDebug;
        this.hiliteDebug = _hiliteDebug;
        // this.showEventsTracked = _showEventsTracked;

        var self = this;



        /**
         *
         * Activate console log debug
         *
         * @param active
         * @private
         */
        function _setDebug(active){

            if (active == undefined) {
                self.isDebug = (self.isDebug) ? false: true;
            } else {

                self.isDebug = (active == undefined) ? true : active;
            }
        }


        /**
         *
         * hilite DOM elements with tracking
         *
         * @param active
         * @private
         */
        function _hiliteDebug(active, eventsTrackingArray) {


            // init once the debug DOM classes
            if (!isInitDebugClass) {
                _initDebugCssClass(eventsTrackingArray);
                isInitDebugClass = true;
            }

            if (active == undefined) {
                self.isDebugHilite = (self.isDebugHilite) ? false: true;
            } else {

                self.isDebugHilite = (active == undefined) ? true : active;
            }


            for (var i = 0; i < eventsTrackingArray.length; i++) {
                var cssClassSelector = eventsTrackingArray[i].cssClass;

                if(self.isDebugHilite) {
                    domHelper.addClassToElementsByClass(cssClassSelector, debugClassName);
                } else {
                    domHelper.removeClassFromElementsByClass(cssClassSelector, debugClassName);
                }
            }

            //  trgaZones add hilite
            if(self.isDebugHilite) {
                domHelper.addClassToElementsByClass(config.categoryCssClass, debugClassName);
            } else {
                domHelper.removeClassFromElementsByClass(config.categoryCssClass, debugClassName);
            }
        }

        /**
         *
         * Generate the css Classes and add to the page
         *
         * @private
         */

        function _initDebugCssClass(eventsTrackingArray) {


            for (var i = 0; i < eventsTrackingArray.length; i++) {
                if (eventsTrackingArray[i].cssClass) {
                    domHelper.addCssClassToDom(eventsTrackingArray[i].cssClass.trim() + '.' + debugClassName,'border: 1px dashed yellow; ');
                    domHelper.addCssClassToDom(eventsTrackingArray[i].cssClass.trim() + '.' + debugClassName + '::after','font-size: smaller; border: 1px dashed black; position: absolute; top: 30px; left: 30px; color: navy; background-color:yellow; content: "' + eventsTrackingArray[i].cssClass + '"');
                }
            }

            domHelper.addCssClassToDom('.' + 'trga-hilite','border: 2px solid blue');
            domHelper.addCssClassToDom(config.categoryCssClass + '.' + debugClassName,'border: 3px solid navy');
        }
    }





})();
