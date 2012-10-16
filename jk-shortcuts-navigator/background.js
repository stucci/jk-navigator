// Generated by CoffeeScript 1.3.3
(function() {
  var withSiteResponse;

  withSiteResponse = function(request, sender, sendResponse, site) {
    if (request.action === 'getOpts') {
      sendResponse(site && site.toJSON());
    }
    if (request.action === 'showPageAction') {
      chrome.pageAction.show(sender.tab.id);
    }
    if (request.action === 'toggleSite') {
      return chrome.tabs.getSelected(function(tab) {
        site = Sites.getSiteByUrl(tab.url);
        if (site) {
          site.set('enabled', request.enabled);
          site.save();
        }
        return chrome.tabs.executeScript(tab.id, {
          code: 'location.reload()'
        }, function() {});
      });
    }
  };

  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var site;
    if (request.url) {
      site = Sites.getSiteByUrl(request.url);
      withSiteResponse(request, sender, sendResponse, site);
    } else {
      chrome.tabs.getSelected(function(tab) {
        site = Sites.getSiteByUrl(tab.url);
        return withSiteResponse(request, sender, sendResponse, site);
      });
    }
    return true;
  });

}).call(this);
