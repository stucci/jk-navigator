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
            selectors: ['p.row:nth(*)>a']
        },
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


    var idx = 0;
    var select = function(focus) {
        $(group_selector.replace(':nth(*)', '')).css('background-color', 'inherit');
        var link = $(active_selector(idx));
        link.css('background-color', '#fcc');
        if (focus) {link.focus(); }
        return link;
    };

    var node = null;


    function start() {
        $(site_opts.selectors).each(function(n, selector) {
            if ($(selector.replace(':nth(*)', ':nth(0)')).length) {
                group_selector = selector;
                return false; // break
            }
        });
        if (!group_selector)
            return;
        var newNode = $(active_selector(0));
        if (!node || (node.attr('href') != newNode.attr('href'))) {
            idx = 0;
            select(true);
            node = newNode;
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
        if (idx < $(group_selector.replace(':nth(*)', '')).length-1) {
            idx++;
            select(true);
            }
            ev.stopPropagation();
        });
        key('k', function(ev) {
            if (idx > 0) {
                idx--;
                select(true);
            }
            ev.stopPropagation();
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
    }        
})();


