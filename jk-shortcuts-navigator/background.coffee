withSiteResponse = (request, sender, sendResponse, site) ->
  if request.action == 'getOpts'
    sendResponse(site && site.toJSON())

  if request.action == 'showPageAction'
    chrome.pageAction.show(sender.tab.id);

  if request.action == 'toggleSite'
    chrome.tabs.getSelected (tab) ->
      l = document.createElement('a');
      l.href = tab.url;

      site = Sites.getSiteByDomain(l.hostname)
      if site
        site.set('enabled', request.enabled)
        site.save()

      chrome.tabs.executeScript(tab.id, { code: 'location.reload()' }, () ->)


chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
  if request.domain
    site = Sites.getSiteByDomain(request.domain)
    withSiteResponse(request, sender, sendResponse, site) 
  else
    chrome.tabs.getSelected (tab) ->
      l = document.createElement('a');
      l.href = tab.url;

      site = Sites.getSiteByDomain(l.hostname)
      withSiteResponse(request, sender, sendResponse, site) 
  return true

