builtInSites = {
  'google': {
      selectors: ['h3.r>a:nth(*)'],
      allowSubdomains: false,
      search_selector: '#gbqfq',
      paginator_selector_next: 'a#pnnext.pn',
      paginator_selector_prev: 'a#pnprev.pn',
      liveUpdateElement: '#main'
  },

  'news.ycombinator': {
      selectors: ['td.title a:nth(*)'],
      search_selector: 'center form input'
  },
  'quora': {
      selectors: ['div.pagedlist_item:not(.pagedlist_hidden) a.question_link:nth(*)'],
      search_selector: '.question_box.light',
      infiniteScroll: true,
      liveUpdateElement: '.main .e_col .w4_5 main_col"',
  },
  'reddit': {
      selectors: ['#siteTable div.entry:nth(*) a.title'],
      search_selector: 'form#search input',
      paginator_selector_next: 'p.nextprev a:last-of-type',
      paginator_selector_prev: 'p.nextprev a:first-of-type'
  },
  'amazon': {
      selectors: ['h3.newaps:nth(*)>a', 'div.data:nth(*) h3.title a.title'],
      search_selector: '#twotabsearchtextbox',
      paginator_selector_next: '#pagnNextLink',
      paginator_selector_prev: '#pagnPrevLink'
  },
  'ebay': {
      selectors: ['div.ittl:nth(*) a', 'div.ttl:nth(*) a', 'div.ititle:nth(*) a.vip'],
      search_selector: '#_fsb_nkw',
      paginator_selector_next: 'td.botpg-next a',
      paginator_selector_prev: 'td.botpg-prev a'

  },
  'yelp': {
      selectors: ['div.businessresult:nth(*) h4.itemheading a'],
      search_selector: '#find_desc',
      paginator_selector_next: '#pager_page_next',
      paginator_selector_prev: '#pager_page_prev',
      liveUpdateElement: '#businessresults'
  },
  'craigslist': {
      selectors: ['p.row:nth(*)>a'],
      search_selector: '#query',
      paginator_selector_next: 'h4>span:last-of-type>a',
      paginator_selector_prev: 'h4>span:first-of-type>a'
  },
  'linkedin': {
      selectors: ['li.vcard:nth(*)>div>h2>a'],
      search_selector: '#keywords-search',
      paginator_selector_next: '.paginator-next',
      paginator_selector_prev: '.paginator-prev'
  },
  'facebook': {
      selectors: [['#pagelet_home_stream li.uiStreamStory', '#pagelet_home_stream li.uiStreamStory:nth(*) a:nth(1)']],
      search_selector: 'input#q.inputtext.DOMControl_placeholder',
      liveUpdateElement: '#contentArea',
      infiniteScroll: true
  },
  'youtube': {
      selectors: ['li div div h3 a:nth(*)'],
      search_selector: '#masthead-search-term',
  },
  'stackoverflow': {
      selectors: ['div h3 a.question-hyperlink:nth(*)'],
      search_selector: 'form#search div input.textbox',
  },
  'techcrunch': {
      selectors: ['h2.headline a:nth(*)'],
      paginator_selector_next: '.page-next>a',
      paginator_selector_prev: '.page-prev>a'
  }
}


class SiteModel extends Backbone.Model
  getOpts: () ->
    json = JSON.stringify @get('opts'), undefined, '    '

  submitToJK: () ->
    if @get('onlineId')
      url = "http://http://jknavigator.herokuapp.com/api/v1/site/"+@get('onlineId')
      method = "PUT"
    else
      url = "http://jknavigator.herokuapp.com/api/v1/site/"
      method = "POST"
    json = _.pick(@.attributes, ['site'])
    $.ajax({
      type:method
      url:url
      data:json
    })

class SiteCollection extends Backbone.Collection
  model:SiteModel
  localStorage: new Backbone.LocalStorage("JKSites")
  addDefaults: () ->
    _.each(builtInSites, (value, key) ->
      Sites.create({site:key, opts:value, builtin:true})
    )


  getSiteByDomain: (domain) ->
    parts = domain.split('.')
    copy = parts.splice()

    if parts[0] == 'www'
        parts = parts.splice(1)

    if parts.length > 2 && parts[parts.length-2].length <= 3
        parts.splice(-2)
    else
        parts.splice(-1)

    i = 0
    while parts.length > 0
        main_domain = parts.join('.')

        sites = @where({ site: main_domain })
        if (sites)
          site = sites[0]

        if site && (i == 0 || site.get('opts').allowSubdomains != false)
          return site

        parts = parts.splice(1)
        i++


Sites = new SiteCollection()

$(document).ready(() ->
  # Add builtin sites to localStorage
  Sites.fetch()
  if Sites.models.length == 0
    Sites.addDefaults()
  
)

window.Sites = Sites
window.SiteModel = SiteModel
