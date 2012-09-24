$ ->
  chrome.extension.sendMessage({action: 'getOpts' }, (site) ->
    console.log site
    if site.enabled == undefined or site.enabled
      $('#checkbox_enabled').attr('checked', 'checked')
  )
  
  $('#checkbox_enabled').click ->
    if ($('#checkbox_enabled').is(':checked'))
        chrome.extension.sendMessage({action: 'toggleSite', enabled: true})
    else
        chrome.extension.sendMessage({action: 'toggleSite', enabled: false})
