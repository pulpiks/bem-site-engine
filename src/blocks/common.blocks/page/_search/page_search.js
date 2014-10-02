modules.define('page', ['jquery'], function(provide, $, Page) {
    provide(Page.decl({ modName: 'search', modVal: true }, {
        onSetMod: {
            js: {
                inited: function() {
                    this.__base.apply(this, arguments);

                    var self = this;

                    this.bindToDoc('click keyup', function(e) {
                        var target = $(e.target);

                        self._toggleSearch(e, target);
                    });
                }
            }
        },

        _toggleSearch: function(e, target) {
            var searchButton = this.findBlockInside('search-button'),
                searchPanel = this.findBlockInside('search-panel'),
                contentWrapper = this.findBlockInside('content-wrapper');

            if(e.type === 'keyup' && e.which === 27) {
                searchPanel.delMod('state');

                return false;
            }

            if(searchButton.containsDomElem(target) || searchPanel.containsDomElem(target)) {
                searchPanel.setMod('state', 'open');
            }
            else if(contentWrapper.containsDomElem(target)) {
                searchPanel.delMod('state');
            }
        }
    }));
});
