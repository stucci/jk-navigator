withSiteResponse = (request, sender, sendResponse, site) ->
  if request.action == 'getOpts'
    sendResponse(site && site.toJSON())

  if request.action == 'showPageAction'
    chrome.pageAction.show(sender.tab.id)

  if request.action == 'toggleSite'
    chrome.tabs.getSelected (tab) ->
      site = Sites.getSiteByUrl(tab.url)
      if site
        site.set('enabled', request.enabled)
        site.save()

      chrome.tabs.executeScript(tab.id, { code: 'location.reload()' }, () ->)


chrome.extension.onMessage.addListener (request, sender, sendResponse) ->
  if request.url
    site = Sites.getSiteByUrl(request.url)
    withSiteResponse(request, sender, sendResponse, site)
  else
    chrome.tabs.getSelected (tab) ->
      site = Sites.getSiteByUrl(tab.url)
      withSiteResponse(request, sender, sendResponse, site)
  return true

