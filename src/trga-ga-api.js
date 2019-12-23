/****
 *
 * trga-ga-api
 *
 * API for Google Analytics
 *
 */


(function() {



    window.trga = window.trga || {};
    window.trga.c = window.trga.c || {};

    window.trga.c.GaApi = GaApi;

    function GaApi(config) {

        this.submitGaEvent = _submitGaEvent;
        this.submitGaPageView = _submitGaPageView;


        /**
         *
         * Submit event to GA
         *
         * @param category
         * @param action
         * @param label
         * @param value
         * @param fieldObject
         * @private
         */


        function _submitGaEvent(category, action, label, value, fieldObject) {

            fieldObject = (fieldObject) ? fieldObject: {};
            value = (value)? value: null;
            label = (label) ? label : '';


            if(!window.gtag && !window.ga) {
                console.error(isDebugReportString + 'google analytics is not defined');
                return;
            }

            if(window.gtag) {
                gtag('event', action, {
                    'event_category': category,
                    'event_label': label,
                    'value': value
                });
            }

            if(window.ga) {
                ga('send', 'event', category, action, label, value, fieldObject);
            }



        }

        /**
         *
         * Submit page view to GA - useful in SPA application
         *
         * @param title
         * @param pathname
         * @param gaMeasurementId only in the case of gtag
         * @private
         */

        function _submitGaPageView(title, pathname, gaMeasurementId) {


            pathname = (pathname) ? pathname : location.pathname;
            title = (title) ? title : '--';

            var gtagData = {
                page_path: pathname
            }

            if(title) {
                gtagData['title'] = title;
            }


            if(window.gtag) {

                if(!gaMeasurementId) {
                    console.error('Need to supply gaMeasurementId');
                    return;
                }

                gtag('config', gaMeasurementId, gtagData);
            }

            if(window.ga) {
                ga('send', 'pageview', pathname);
            }
        }

    }
})();
