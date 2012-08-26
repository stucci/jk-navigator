// note: key library was modified to enable capture in addEventListener

(function() {

    var opts = {
        'google': {
            selectors: ['h3.r:nth(*) a'],
            allowSubdomains: false
        },

        'news.ycombinator': {
            selectors: ['td.title a:nth(*)']
        },
        'quora': {
            selectors: ['div.pagedlist_item:not(.pagedlist_hidden) a.question_link:nth(*)']
        },
        'reddit': {
            selectors: ['#siteTable div.entry:nth(*) a.title']
        },
        'amazon': {
            selectors: ['h3.newaps:nth(*)>a', 'div.data:nth(*) h3.title a.title']
        },
        'ebay': {
            selectors: ['div.ittl:nth(*) a']
        },
        'yelp': {
            selectors: ['div.businessresult:nth(*) h4.itemheading a']
        },
        'craigslist': {
            selectors: ['p.row:nth(*)>a'],
            paginator_selector: 'h4>span:last-of-type>a'
        },
        'linkedin': {
            selectors: ['li.vcard:nth(*)>div>h2>a'],
            paginator_selector: '.paginator-next'
        }
    }

    var group_selector = null;
    var site_opts = null;
    var site = null;

    function set_domain_opts(domain) {
        var parts = domain.split('.');
        var copy = parts.splice();

        if (parts[0] == 'www') {
            parts = parts.splice(1);
        }
        if (parts.length > 2 && parts[parts.length-2].length <= 3)
            parts.splice(-2);
        else
            parts.splice(-1);

        var i = 0;
        while (parts.length > 0) {
            main_domain = parts.join('.');
            if (opts[main_domain] && (i == 0 || opts[main_domain].allowSubdomains !== false))
            {
                site = main_domain;
                site_opts = opts[main_domain];
                return;
            }
            parts = parts.splice(1);
            i++;
        }
    }

    set_domain_opts(document.domain);
    
    function active_selector(idx) {
        return group_selector.replace(':nth(*)', ':nth('+idx+')')
    }

    console.log(localStorage.idx);
    if (!localStorage.idx)
        localStorage.idx = 0;
    var select = function(focus) {
        $(group_selector.replace(':nth(*)', '')).css('background-color', 'inherit');
        var link = $(active_selector(localStorage.idx));
        link.css('background-color', '#fcc');
        if (focus) {link.focus(); }
        return link;
    };

    var node = null;


    function start() {
        $(site_opts.selectors).each(function(n, selector) {
            var result_links_container = $(selector.replace(':nth(*)', ''));
            if (result_links_container.length) {
                group_selector = selector;
                //store the links into the local storage
                result_links = []
                result_links_container.each(function(m, link) {
                    result_links.push($(link).attr('href'));
                });
                localStorage.result_links = JSON.stringify(result_links);
                localStorage.start_page = location.href;
                return false; // break
            }
        });
        if (!group_selector)
            return;
        var newNode = $(active_selector(localStorage.idx));
        console.log('newNode');
        console.log(newNode);
        if (!node || (node.attr('href') != newNode.attr('href'))) {
            if (!localStorage.idx) {
                localStorage.idx = 0;
                select(true);
                node = newNode;
            }
            else {
                select(true);
                node = newNode;
            }
        }
        
    }

    $(function() {
        if (!site_opts) return;
        start();
        if (site == 'google') {
            //google is special
            var main = document.getElementById('main');
            if (main) {
                main.addEventListener("DOMSubtreeModified", function () {
                    start();
                });
            }
        }
    });



    


    if(site_opts)

    {

        key('j', function(ev) {
            if (group_selector) {
                if (localStorage.idx < $(group_selector.replace(':nth(*)', '')).length-1) {
                    localStorage.idx++;
                    select(true);
                }
                else {
                    if ($(site_opts.paginator_selector)) {
                        localStorage.idx = 0; 
                        location.href = $(site_opts.paginator_selector).attr('href');
                    }
                }
                ev.stopPropagation();
                }
            else { 
                result_links = JSON.parse(localStorage.result_links);
                location.href = result_links[++localStorage.idx]
            }
        });
        key('k', function(ev) {
            if (group_selector) {
                if (localStorage.idx > 0) {
                    localStorage.idx--;
                    select(true);
                }
                ev.stopPropagation();
            }
            else {
                result_links = JSON.parse(localStorage.result_links);
                location.href = result_links[--localStorage.idx]
            }
        });
        key('/', function(ev) {
            $('#gbqfq').focus();
            ev.stopPropagation();
            ev.preventDefault();
        });
        key('⌘+return', function(ev) {
            var link = select();
            window.open(link.attr('href'));
            ev.stopPropagation();
            ev.preventDefault();
        });

        function open_link(ev) {
            var link = select();
            location.href = link.attr('href');
            ev.stopPropagation();
            ev.preventDefault();

        }

        key('return', function(ev) {
            open_link(ev);
        });
    
        key('o', function(ev) {
            open_link(ev);
        });
        key('i', function(ev) {
            if (group_selector) {
                if (localStorage.idx > 0) {
                    localStorage.idx=0;
                    select(true);
                }
                ev.stopPropagation();
            }
            else {
                location.href = localStorage.start_page; 
            }
        });
    }        

})();


