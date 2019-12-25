# CSS Driven event tracking by Google Analytics
## Super fast JavaScript to set & track events in Google Analytics by CSS classes
### trga-analytics v1.0.0

![Generic badge](https://img.shields.io/badge/version-1.0.0-<COLOR>.svg)
![Generic badge](https://img.shields.io/badge/Made%20with-JavaScript%20ECMAScript%205-l.svg)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/ShaiYer/trga-analytics/blob/master/LICENSE)
[![Generic badge](https://img.shields.io/badge/npmjs-blue.svg)](https://www.npmjs.com/package/trga-analytics)
[![Generic badge](https://img.shields.io/badge/Demo-blue.svg)](https://shaiyer.github.io/trga-analytics/examples/demo.html)


<p>Light JavaScript framework to set and track events by just adding CSS classes to HTML elements</p>

## How to use CSS Driven Google Analytics? The short version
1. Add Google Analytics code with your ID.
2. Import trga-analytics JavaScript.
3. Add CSS trigger classes to HTML elements.
4. Validate tracked events with Google Analytics, at Realtime -> events


- It is a stand-alone vanilla JS code.
- The code supports both scripts of Google Analytics (ga) and Global Site Tag (gtag.js).
- The code attaches event listeners with a namespacing to avoid interference to the original code.
- Event trigger throttling to avoid event-flooding such as in the cases of scroll/hover - 1 second throttling for each defined event (not interfering with the other events)

Demo Page: https://shaiyer.github.io/trga-analytics/examples/demo.html

### Installation
```
$ npm i --save-dev trga-analytics
```

### Import script
```
// for development / testing - script with debug functionality
<script src="trga-analytics-with-debug.js"></script>

// for production - script without debug functionality
<script src="trga-analytics.js"></script>

// for quick examination you may use the version published on my github pages
<script src="https://shaiyer.github.io/trga-analytics/dist/trga-analytics-with-debug.js"></script>
```

### Set tracking - as easy as it can get
Tracking click event in GA with an action of click and a label of 'read more'. The category of the event is the wrapper zone which is optional to add.
```
<button class="gray trga-trigger-by-click" data-trga-label="read more">Read more</button>
```

** Additional initialization is sometimes needed such as with dynamically added DOM elements - see below


## Quick example


```
<!DOCTYPE html>
<html lang="en">
<head>
    <title>trga-analytics quick example</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- import javescript -->
    <script src="https://shaiyer.github.io/trga-analytics/dist/trga-analytics-with-debug.js"></script>

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <!-- !important: Use your own GA_MEASUREMENT_ID -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
</head>
<body>

    <!-- define zone-->
    <div class="trga-zone" data-trga-zone="test-zone-1">
        <h1>Quick Example - trga-analytics </h1>

        <!--  define event-->
        <button type="button" class="trga-trigger-by-click" onclick="alert('Trigger By click')" data-trga-label="test-click-1">Tracking click event</button>
        <button type="button" class="trga-trigger-by-mouseover"  data-trga-label="test-mouseover-1">Tracking mouseover event</button>
    </div>
</body>
</html>
```

--------
## Manual
--------
### Import the CSS Driven Google Analytics JS library
Import the JS library to your code following the google analytics import script
`<script src="trga-analytics.js"></script>`

### Initializing the events triggering
The tracking tool is initialized on document load. Events are attached to the DOM elements according to the action trigger classes (i.e. '.trga-trigger-by-click').

#### Handle dynamically newly generated DOM elements
In case you are tracking a dynamic application, there is a need to attach events to the newly added DOM elements.
**Initialize a single time by function**
- `trga.init()` Init the FW following the addition of elements to attach the events.
- `trga.initPage()` Init the FW for SPA applications, reset the events counter and attach the analytics events to DOM elements.


**Initialize by ongoing interval**
- `trga.initWithInterval(seconds)` Init the FW with interval which scans only for newly created elements every given number of seconds

**Initialize the page - useful in case of SPA (Single Page App)**
- `trga.initPage()` Reset the count of the events per page if limiting count events is in use



### Define DOM Tracking events - add class to HTML elements
To Define tracking event need to add the an action class `'trga-trigger-by-click'` and the label data attribute: `data-trga-label="label of the event"` -  such as 'home button'
Code example:
```
<menu-item class="gray trga-trigger-by-click" data-trga-label="about us">
  .....
  .....
</menu-item>
```

#### Events available 

|CSS Class                  |JavaScript event|
|---|---|
|trga-trigger-by-click      | click  |
|trga-trigger-by-dblclick  | dblclick  |
|trga-trigger-by-mouseover  | mouseover  |
|trga-trigger-by-hover  | hover  |
|trga-trigger-by-mousedown  | mousedown  |
|trga-trigger-by-mouseup  | mouseup  |
|trga-trigger-by-mouseenter  | mouseenter  |
|trga-trigger-by-mouseleave  | mouseleave  |
|trga-trigger-by-focus  | focus  |
|trga-trigger-by-blur  | blur  |
|trga-trigger-by-keypress  | keypress  |
|trga-trigger-by-keyup  | keyup  |
|trga-trigger-by-focusin  | focusin  |
|trga-trigger-by-focusout  | focusout  |
|trga-trigger-by-select  | select  |
|trga-trigger-by-change  | change  |
|trga-trigger-by-scroll  | scroll  |
|   |   | 


#### Trigger event only once per page
To trigger event only once per page - add `-once` To any CSS event Class. i.e. `trga-trigger-by-click-once`

#### Data attributes for registering the events in Google Analytics
`data-trga-action-name="action_name"` (optional) -  override the action name registered in the analytics instead of mouseover/click.

`data-trga-label="label_name"` (optional) - label name, default value of the label is the text of the DOM element.

`data-trga-value="number"` (optional) - value for google analytics events. Default value is 0.

`data-trga-count-limit="number"` (optional) - limit of the number of events to send to google analytics.



### Define DOM zones - enhance event tracking

Defined zones in DOM wrapping elements will be tracked as Google Analytics Category for each event.
Add the class 'trga-zone' to the wrapping DOM element. Also add the data attribute of its name: data-trga-zone="zone"

Code example:
```
<navbar class="navbar trga-zone" data-trga-zone="zone name, such as 'main navbar'">
  .....
  .....
</navbar>
```


### Debugging and reporting
Use the browser's console panel to debug your setting:
- trga.setDebug(bool) - enable / disable console.log reporting of tracked events
- trga.hiliteDebug(bool) - enable / disable bordering the zones and tracked items
- trga.showEventsTracked() - console.log the JSON of the tracked events


### For working example check the HTML demo
```
<navbar class="navbar trga-zone" data-trga-zone="main navbar">
  <menu-item class="gray trga-trigger-by-click" data-trga-label="contact us">
    Contact Us
    </menu-item>
</navbar>
```
