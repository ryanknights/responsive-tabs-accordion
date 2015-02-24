(function (document, window, $)
{
    "use strict"

    function ResponsiveTabs (el, options)
    {   
        this.el  = el;
        this.$el = $(el);

        this.options = $.extend({}, this._defaultOptions, options, this.$el.data());

        this.links  = this.$el.find('> nav a');
        this.panels = this.$el.find('div.content > section'); 

        this._checkType();

        if (this.options.type !== 'tabs')
        {
            this._setupAccordion();
        }

        this._setup();
        this._events();
        this._initialise();
    }

    ResponsiveTabs.prototype._defaultOptions =
    {
        type        : 'responsive',
        breakpoint  : 768,
        speed       : 500,
        initial     : 0,
        collapsible : false,
        keepOpen    : false
    };

    ResponsiveTabs.prototype._setup = function ()
    {
        var _url = this.links.eq(this.options.initial).attr('href'); //store the first links url

        this.panels.hide().eq(this.options.initial).show(); //hide all tab panels

        this._updateActive(_url);
    };

    ResponsiveTabs.prototype._setupAccordion = function ()
    {   
        var self = this;

        this.panels.each(function(i, el){ //for each tab panel

            var _link = self.links.eq(i).attr('href'), //store the links href
                _text = self.links.eq(i).text(); //store the links text/title

           self.panels.eq(i).before('<h3 class="accordion-title"><a href="' + _link + '">' + _text + '</a></h3>'); //add the accordion title
        });

        this.links = this.links.add('h3.accordion-title > a'); //update the links variable after new items have been created
    };

    ResponsiveTabs.prototype._events = function ()
    {   
        var self = this;

        this.links.on('click', function (event) { //on link click

            event.preventDefault(); //prevent default action

            var _this = $(this), //reference the link clicked
                _newPanel = _this.attr('href'); //store the items href

            if (!_this.parent().hasClass('active')) { //if the link is not already active

                (self.$el.hasClass('tabs')) ? self._tabs(_newPanel) : self._accordion(_newPanel); //run change function depending on type

                ($.isFunction(self.options.change)) && self.options.change.call(self.$el, $(_newPanel));
                $(document).trigger('responsive-tabs.change', [self.$el, $(_newPanel)]);                
         
            } else if (self.$el.hasClass('accordion') && _this.parent().hasClass('active')) {

                if (self.options.collapsible === true) {

                    self._accordionCollapse(_newPanel);
                }
            }
            
        });

        if (this.options.type === 'responsive')
        {
            $(window).resize(function(){

                self._checkType(); //check elements type i.e. tabs/accordion
            });
        }
    };

    ResponsiveTabs.prototype._initialise = function ()
    {
        this.$el.addClass('responsive-tabs responsive-tabs-initialized');

        ($.isFunction(this.options.initialised)) && this.options.initialised.call(this.$el);
        $(document).trigger('responsive-tabs.initialised', [this.$el]);
    };

    ResponsiveTabs.prototype._accordion = function (panel)
    {
        if (!this.options.keepOpen) {

            this.panels.stop(true, true).slideUp(this.options.speed);

            this._removeClasses();
        }
        
        $(panel).stop(true, true).slideDown(this.options.speed);

        this._updateActive(panel);        
    };

    ResponsiveTabs.prototype._accordionCollapse = function (panel)
    {
        this.$el.find($('a[href*="' + panel + '"]')).parent().removeClass('active');

        $(panel).stop(true, true).slideUp(this.options.speed);
    };

    ResponsiveTabs.prototype._tabs = function (panel)
    {
        this.panels.hide(); //hide current panel

        this._removeClasses();

        this._updateActive(panel);

        $(panel).show(); //fadein new panel
    };

    ResponsiveTabs.prototype._removeClasses = function ()
    {
        this.links.parent().removeClass('active');
    };

    ResponsiveTabs.prototype._updateActive = function (panel)
    {
        this.$el.find($('a[href*="' + panel + '"]')).parent().addClass('active');
    };

    ResponsiveTabs.prototype._checkType = function ()
    {
        if (this.options.type === 'responsive')
        {
            if ($(window).outerWidth() > this.options.breakpoint) { //if the window is desktop/tablet

                this.$el.removeClass('accordion').addClass('tabs'); //add tabs class

            } else { //window is mobile size

                this.$el.removeClass('tabs').addClass('accordion'); //add accordion class
            }
        }
        else if (this.options.type === 'tabs' || this.options.type === 'accordion')
        {
            (this.options.type === 'tabs') ? this.$el.addClass('tabs') : this.$el.addClass('accordion');
        }
    };

    function Plugin (options)
    {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function ()
        {   
            var _this = $(this),
                _data = _this.data('responsivetabs');

            if (!_data)
            {
                 _this.data('responsivetabs', (_data = new ResponsiveTabs(this, options)));
            }

            if (typeof options === "string" )
            {
                options = options.replace(/^_/, "");

                if (_data[options])
                {
                    _data[options].apply(_data, args);
                }
            }       
        });
    }

    $.fn.responsivetabs = Plugin;

}(document, window, jQuery))