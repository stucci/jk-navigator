// note: key library was modified to enable capture in addEventListener

(function() {


    function get_main_domain(domain) {
        console.log(domain);
        var parts = domain.split('.');
        var copy = parts.splice();
        console.log(copy);
        if (parts[0] == 'www') {
            parts = parts.splice(1);
        }
        if (parts.length > 2 && parts[parts.length-2].length <= 3)
            parts.splice(-2);
        else
            parts.splice(-1);

        return parts.join('.');
    }


    var opts = {
        'google': {
            selectors: ['h3.r:nth(*) a']
        },

        'news.ycombinator': {
            selectors: ['td.title a:nth(*)']
        },
        'quora': {
            selectors: ['a.question_link:nth(*)']
        },
        'reddit': {
            selectors: ['#siteTable div.entry:nth(*) a.title']
        },
        'amazon': {
            selectors: ['h3.newaps:nth(*) a', 'div.data:nth(*) h3.title a.title']
        },
        'ebay': {
            selectors: ['div.ittl:nth(*) a']
        },
        'yelp': {
            selectors: ['div.businessresult:nth(*) h4.itemheading a']
        },
        'sfbay.craigslist': {
            selectors: ['p.row:nth(*) a']
        },
    }

    var site_opts = null;
    var group_selector = null;
    var main_domain = get_main_domain(document.domain);
    if (main_domain) 
        site_opts = opts[main_domain];
    
    function active_selector(idx) {
        return group_selector.replace(':nth(*)', ':nth('+idx+')')
    }


    var idx = 0;
    var select = function(focus) {
        $(group_selector.replace(':nth(*)', '')).css('background-color', 'inherit');
        var link = $(active_selector(idx));
        console.log(link);
        link.css('background-color', '#fcc');
        if (focus) {link.focus(); }
        return link;
    };

    var node = null;


    function start() {
        $(site_opts.selectors).each(function(n, selector) {
            if ($(selector.replace(':nth(*)', ':nth(0)')).length) {
                group_selector = selector;
                console.log(selector);
                return false; // break
            }
        });
        if (!group_selector)
            return;
        var newNode = $(active_selector(0));
        console.log('newNode');
        console.log(newNode);
        console.log('node');
        console.log(node)
        if (!node || (node.attr('href') != newNode.attr('href'))) {
            idx = 0;
            select(true);
            node = newNode;
        }
        
    }

    $(function() {
        if (!site_opts) return;
        start();
        //google is special
        document.getElementById('main').addEventListener("DOMSubtreeModified", function () {
            start();
            
        });
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


