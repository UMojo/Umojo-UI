/*
 * jQuery UI List Panel
 *
 * Authors:
 *  Ben Wann (ben.wann[at]gmail[dot]com)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://www.benwann/listpanel/
 *
 *
 * Depends:
 *	ui.core.js
 *	jquery.scrollpane.js
 */


(function($, undefined) {

    $.widget("ui.listpanel", {
        options: {
            searchable: true,
            animated: 'fast',
            show: 'slideDown',
            hide: 'slideUp'
        },
        _create: function() {
            this.id = this.element.attr("id");
            this.element.hide();
            this.container = $('<div class="ui-listpanel ui-helper-clearfix ui-widget"></div>').insertAfter(this.element);
            this.listContainer = $('<div class="available"></div>').appendTo(this.container);
            this.listActions = $('<div class="actions ui-widget-header ui-helper-clearfix search"><input type="text" class="search empty ui-widget-content ui-corner-all"/></div>').appendTo(this.listContainer);
            this.wrapper = $('<div class="scroll-pane"></div>').appendTo(this.listContainer);
            this.list = $('<ul class="available"><li class="ui-helper-hidden-accessible"></li></ul>').appendTo(this.wrapper);
            
            var that = this;

            // set dimensions
            this.container.width(this.element.width()+1);
            this.listContainer.width(this.element.width() - 30);
            
            // init lists
            this._populateLists(this.options.data);

            //set up click events
            this._registerClickEvents(this.listContainer.find('li'));

            // set up livesearch
            if (this.options.searchable) {
                this._registerSearchEvents(this.listContainer.find('input.search'));
            } else {
                $('.search').hide();
            }

            $(function()
            {
                $('.scroll-pane').jScrollPane();
            });
           
        },
        destroy: function() {
            this.element.show();
            this.container.remove();

            $.Widget.prototype.destroy.apply(this, arguments);
        },
        
        _populateLists: function(data) {
            this.list.children('.ui-element').remove();

            var that = this;
            var items = $(data.map(function(i) {
                return that._getListNode(i).appendTo(that.list).show();
            }));
        },
        _getListNode: function(node_data) {
            var node = $('<li class="ui-state-default ui-element" title="'+node_data.title+'">'+node_data.title+'</li>').hide();
            $.data(node[0], 'data', node_data);
            return node;
        },
        // taken from John Resig's liveUpdate script
        _filter: function(list) {
            var input = $(this);
            var rows = list.children('li'),
            cache = rows.map(function(){

                return $(this).text().toLowerCase();
            });

            var term = $.trim(input.val().toLowerCase()), scores = [];

            if (!term) {
                rows.show();
            } else {
                rows.hide();

                cache.each(function(i) {
                    if (this.indexOf(term)>-1) {
                        scores.push(i);
                    }
                });

                $.each(scores, function() {
                    $(rows[this]).show();
                });
            }
        },

        _registerHoverEvents: function(elements) {
            elements.removeClass('ui-state-hover');
            elements.mouseover(function() {
                $(this).addClass('ui-state-hover');
            });
            elements.mouseout(function() {
                $(this).removeClass('ui-state-hover');
            });
        },

        _registerClickEvents: function(elements) {
            var self = this;
        	elements.click(function(){
            	self.publisher(self.notifyMethod, $.data(this, 'data'));
                return false;
            });
        },
        
        _registerSearchEvents: function(input) {
            var that = this;

            input.focus(function() {
                $(this).addClass('ui-state-active');
            })
            .blur(function() {
                $(this).removeClass('ui-state-active');
            })
            .keypress(function(e) {
                if (e.keyCode == 13)
                    return false;
            })
            .keyup(function() {
                that._filter.apply(this, [that.list]);
            });
        }
    });


})(jQuery);
