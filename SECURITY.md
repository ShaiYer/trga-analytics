# Security Policy

## Vulnerabilities

* The code is developed in vanilla JavaScript and interacts with Google Analytics.
* In the debug addition (dist/trga-analytics-with-debug.js) there are functions to add CSS styles to HTML DOM of tracked events and also reporting system via console.log. To avoid the debug functionality on production - import the js lib which exclude the debug functionality (dist/trga-analytics.js)


In case of (suspected) security vulnerabilities please report  to
**dev (at) trailim.com**
