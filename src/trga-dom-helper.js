/****
 *
 *
 * API for DomHelper
 *
 */


(function() {





    /***
     *
     * Expose trga ga api
     *
     *
     */

    window.trga = window.trga || {};
    window.trga = window.trga || {};

    window.trga.domHelper = new DomHelper();


    /***
     *
     * DomHelper Class
     * Manipulate DOM events and elements
     *
     *
     */

    function DomHelper() {

        /**
         * Predefined DOM actions
         * @type {{REMOVE_CLASS: string, ADD_CLASS: string}}
         */

        var ACTIONS = {
            REMOVE_CLASS: 'removeClass',
            ADD_CLASS: 'addClass',
        };

        /**
         *
         * Add class to elements by class
         * @param classSelector
         * @param classToAdd
         * @private
         */
        this.addClassToElementsByClass = _addClassToElementsByClass;

        /**
         *
         * Remove class from elements by class name
         *
         * @param classSelector
         * @param classToRemove
         * @private
         */

        this.removeClassFromElementsByClass = _removeClassFromElementsByClass;


        /**
         *
         * Add CSS style with class name and properties to the dom
         * @param className
         * @param classStyle
         *
         */
        this.addCssClassToDom = _addCssClassToDom;


        // Extension for events with name spacing

        var eventsExt = {
            on(event, cb, opts){
                if( !this.trgaNamespaces ) // save the namespaces on the DOM element itself
                    this.trgaNamespaces = {};

                this.trgaNamespaces[event] = cb;
                var options = opts || false;

                this.addEventListener(event.split('.')[0], cb, options);
                return this;
            },
            off(event) {
                if(this.trgaNamespaces && this.removeEventListener) {
                    this.removeEventListener(event.split('.')[0], this.trgaNamespaces[event], true);
                    delete this.trgaNamespaces[event];
                    return this;
                }

            }
        }
        window.trgaOn = Element.prototype.trgaOn = eventsExt.on;
        window.trgaOff = Element.prototype.trgaOff = eventsExt.off;


        function _addClassToElementsByClass(classSelector, classToAdd) {
            _alterClassOfElementsByClass(ACTIONS.ADD_CLASS, classSelector, classToAdd);
        }

        function _removeClassFromElementsByClass(classSelector, classToRemove) {
            _alterClassOfElementsByClass(ACTIONS.REMOVE_CLASS, classSelector, classToRemove);
        }

        function _alterClassOfElementsByClass(action, classSelector, classToChange) {

            var elements = document.getElementsByClassName(classSelector);

            for (var i = 0; i < elements.length; i++) {
                if(action == 'addClass') {
                    elements[i].classList.add(classToChange);
                }
                if(action == 'removeClass') {
                    elements[i].classList.remove(classToChange);
                }
            }
        }

        /**
         *
         * @param className
         * @param classStyle
         * @private
         */

        function _addCssClassToDom (className, classStyle) {
            var style = document.createElement('style');
            style.innerHTML =
                '.' + className + ' {' +
                classStyle +
                '}';


            // Get the first script tag
            var ref = document.querySelector('script');

            // Insert our new styles before the first script tag
            ref.parentNode.insertBefore(style, ref);
        }
    }
})();
