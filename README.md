Keyboard Shortcuts for Chrome
=============================

For more information, please visit: [jknavigator.org](http://jknavigator.org)


Currently supported sites:
Google, Facebook, Hackernews, Ebay, Amazon, Craigslist, Youtube, Stackoverflow, Quora, Reddit, Yelp, Linkedin


* `/`: Focus search box
* `Return` or `o`: Load selected result
* `⌘+Return`: Load selected result in new tab/window
* `j`: Select next result
* `k`: Select previous result

Installation
------------
1. Install from the Chrome Webstore: https://chrome.google.com/webstore/detail/chgfodomgimhbcmlfljhkgildehakgif/


2. Manual installation
    1. Clone the git repository
    2. In the Chrome extensions window, select "Load unpacked extension" and select the `jk-navigator` directory.

Contributing
------------

At the moment we store a compiled version of the coffeescript files and the handlebars templates. 
* `coffee --compile *.coffee`
* `handlebars siteitem.handlebars -m -f siteitem.js`


