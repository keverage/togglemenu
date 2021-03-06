(function ($) {
    'use strict';

    /**
     * ToggleMenuPush
     *
     * @param {object} toggleMenu
     * @param {object=undefined} options
     *
     * @return {$.ToggleMenuPush}
     */
    $.ToggleMenuPush = function (toggleMenu, options) {
        // Héritage
        this.toggleMenu = toggleMenu;
        $.extend($.ToggleMenuPush.prototype, $.ToggleMenu.prototype);

        // Config
        $.extend(true, this.settings = {}, this.toggleMenu.settings, $.ToggleMenuPush.defaults, options);

        // Éléments
        this.elements = $.extend(true, {body: $('body')}, this.settings.elements);
        delete this.settings.elements;

        // Variables
        this.events = {};
        this.isOpen = false;
        this.level = 0;

        // Init
        if (this.prepareUserOptions()) {
            this.load();
        }

        return this
    };

    $.ToggleMenuPush.defaults = {
        elements: {
            content: {
                menu: undefined
            },
            items: undefined,
            itemLink: function (item) {
                return item.children('a');
            },
            itemContent: function (item) {
                return item.children('ul');
            },
            toggle: undefined,
            page: undefined,
            back: undefined,
            backBtn: function (wrapper) {
                return wrapper.children('button');
            }
        },
        layout: 'accordion',
        slideDuration: 200,
        backLink: false,
        classes: {
            submenuOpen: 'is-{prefix}-submenu-open',
            copy: '{prefix}-copy',
            back: 'item-back'
        },
        beforeLoad: undefined,
        beforeWrap: undefined,
        onAddContent: undefined,
        afterEventsHandler: undefined,
        afterItemHandler: undefined,
        onAddItemContent: undefined,
        onComplete: undefined,
        onToggle: undefined,
        onToggleSubmenu: undefined
    };

    $.ToggleMenuPush.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return {boolean}
         */
        prepareUserOptions: function () {
            // Classes
            this.replacePrefixClass();

            // Éléments
            if (this.getElements().toggle === undefined) {
                this.elements.toggle = $('.' + this.settings.classes.prefix + '-toggle');

                if (this.getElements().toggle.length === 0) {
                    this.setLog('Missing elements.toggle parameter', 'error');
                    return false;
                }
            }

            if (this.getContentElements().menu === undefined) {
                this.setLog('Missing elements.content.menu parameter', 'error');
                return false;
            }

            if (this.getElements().page === undefined) {
                this.elements.page = this.getElements().body.children('div:first');

                if (this.getElements().page.length === 0) {
                    this.setLog('Missing elements.page parameter', 'error');
                    return false;
                }
            }

            return true;
        },

        /**
         * Initialisation
         */
        load: function () {
            // User callback
            if (this.settings.beforeLoad !== undefined) {
                this.settings.beforeLoad.call({
                    toggleMenuPush: this
                });
            }

            // Load
            this.wrap();
            this.addContent();
            this.eventsHandler();
            this.itemsHandler();

            // User callback
            if (this.settings.onComplete !== undefined) {
                this.settings.onComplete.call({
                    toggleMenuPush: this,
                    elements: this.getElements()
                });
            }

            return this;
        },

        /**
         * Destroy
         */
        unload: function () {
            var self = this;

            // Fermeture du menu
            if (self.isOpen) {
                self.toggle();
            }

            // Suppression des éléments
            self.unWrap();

            // Désactivation des events
            $.each(self.events, function (element, event) {
                if (self.getElements()[element] !== undefined) {
                    self.getElements()[element].off(event);
                }
            });
            self.getElements().items.each(function (i, item) {
                item = $(item);

                self.getElements().itemLink(item).off('click.togglemenuPush');

                if (self.getElements().back !== undefined) {
                    self.getElements().backBtn(item).off('click.togglemenuPush');
                }
            });

            // Suppression des classes "copy"
            $.each(self.getContentElements(), function (type, element) {
                if (type !== 'close') {
                    element.removeClass(self.settings.classes.copy);
                }
            });

            return self;
        },

        /**
         * Créer un wrapper
         */
        wrap: function () {
            // Wrapper global
            this.elements.wrapper = $('<nav>', {
                'class': this.settings.classes.prefix + ' ' + this.settings.classes.prefix + '--' + this.toggleMenu.menu.current
            });

            // User callback
            if (this.settings.beforeWrap !== undefined) {
                this.settings.beforeWrap.call({
                    toggleMenuPush: this,
                    wrapper: this.getWrapper()
                });
            }

            // Ajout du wrapper
            this.getWrapper().appendTo(this.getElements().body);

            return this;
        },

        /**
         * Supprime le wrapper
         */
        unWrap: function () {
            this.getWrapper().remove();

            return this;
        },

        /**
         * Ajout des contenus dans le wrapper
         */
        addContent: function () {
            var self = this;

            // Contenu utilisateur
            $.each(self.getContentElements(), function (type, element) {
                var content = null;

                // Copie du contenu
                if (type === 'close') {
                    content = $('<button>', {
                        html: element
                    });
                } else if (typeof element === 'object' && element.length) {
                    content = element.clone();
                    content.removeAttr('id');
                    element.addClass(self.settings.classes.copy);
                }

                // Ajout du contenu
                if (content !== undefined && content !== null) {
                    content.appendTo(self.getWrapper());
                    content.wrap($('<div>', {
                        'class': self.settings.classes.prefix + '-' + type
                    }));

                    // Ajout des éléments
                    if (type === 'close' || type === 'menu') {
                        self.elements[type + 'Content'] = content;
                        self.elements[type] = content.parent();
                    }
                    if (type === 'menu') {
                        if (self.getElements().items === undefined) {
                            self.elements.items = self.getItemsParent(content.find('li'));

                        } else if (typeof self.getElements().items === 'function') {
                            self.elements.items = self.getElements().items(content);
                        }
                    }
                }

                // User callback
                if (self.settings.onAddContent !== undefined) {
                    self.settings.onAddContent.call({
                        toggleMenuPush: self,
                        type: type,
                        element: element,
                        content: content,
                        contentWrapper: self.getElements()[type]
                    });
                }
            });

            return self;
        },

        /**
         * Gestionnaire des événements
         */
        eventsHandler: function () {
            var self = this;

            // Bouton toggle
            self.getElements().toggle.on(self.events.toggle = 'click.togglemenuPush', {self: self}, self.toggle);

            // Bouton close
            if (self.getElements().closeContent !== undefined) {
                self.getElements().closeContent.on(self.events.closeContent = 'click.togglemenuPush', {self: self}, self.toggle);
            }

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    toggleMenuPush: self,
                    elements: self.getElements(),
                    events: self.events
                });
            }

            return self;
        },

        /**
         * Gestionnaire des éléments parent
         */
        itemsHandler: function () {
            var self = this;

            if (self.getElements().items.length) {
                self.getElements().items.each(function (i, item) {
                    item = $(item);

                    // Ajout du layout
                    item.layout = self.getItemLayout(item);
                    item.addClass('l-' + item.layout);
                    item.addClass(self.settings.classes.active);

                    // Ajout de contenu
                    self.addItemContent(item);

                    // Events
                    self.getElements().itemLink(item).on('click.togglemenuPush keydown.togglemenuPush', function (event) {
                        event.preventDefault();

                        if (event.type === 'keydown' && event.key === 'Tab') {
                            var focusItem = item[(event.shiftKey) ? 'prev' : 'next']();

                            if (focusItem.length) {
                                var focusItemLink = self.getElements().itemLink(focusItem);

                                if (focusItemLink.length) {
                                    focusItemLink.focus();
                                }
                            }

                        } else if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')) {
                            self.toggleSubmenu(item);
                        }
                    });

                    // User callback
                    if (self.settings.afterItemHandler !== undefined) {
                        self.settings.afterItemHandler.call({
                            toggleMenuPush: self,
                            elements: self.getElements(),
                            item: item
                        });
                    }
                });

                self.closeSubmenus();
            }

            return self;
        },

        /**
         * Retourne le layout correspondant à l'item
         *
         * @param  {object=undefined} item Élément parent
         *
         * @return {string}
         */
        getItemLayout: function (item) {
            if (this.settings.layout === 'data' && item !== undefined) {
                var layout = item.layout !== undefined ? item.layout : item.attr('data-layout');
                return (layout !== undefined || layout !== '') ? layout : $.ToggleMenuPush.defaults.layout;

            } else {
                return this.settings.layout;
            }
        },

        /**
         * Ajout du contenu pour un item
         *
         * @param {object} item Élément parent
         */
        addItemContent: function (item) {
            var self = this;

            if (item.layout === 'panel') {
                var content = null;

                if (self.getElements().back !== undefined) {
                    content = self.getElements().back;
                } else {
                    // Container
                    content = $('<li>', {
                        'class': self.settings.classes.back
                    });

                    // Bouton
                    $('<button>', {
                        'class': 'item-btn'
                    }).appendTo(content);

                    // Titre
                    var title = $('<span>', {
                        'class': 'item-title',
                        html: self.getElements().itemLink(item).text()
                    }).appendTo(content);

                    // Lien sur le titre
                    if (self.settings.backLink) {
                        title.wrapInner($('<a>', {
                            href: self.getElements().itemLink(item).attr('href')
                        }));
                    }
                }

                if (content !== null) {
                    content.prependTo(self.getElements().itemContent(item));

                    // Event
                    self.getElements().backBtn(content).on('click.togglemenuPush', function () {
                        self.toggleSubmenu(item);
                    });

                    // User callback
                    if (self.settings.onAddItemContent !== undefined) {
                        self.settings.onAddItemContent.call({
                            toggleMenuPush: self,
                            item: item,
                            itemContent: content
                        });
                    }
                }
            }

            return self;
        },

        /**
         * Ouverture/fermeture du menu
         *
         * @param {object=undefined} event
         */
        toggle: function (event) {
            var self = (event !== undefined && event.data !== undefined && event.data.self !== undefined) ? event.data.self : this;

            // Statut
            self.getElements().body.toggleClass(self.settings.classes.open);
            self.isOpen = self.getElements().body.hasClass(self.settings.classes.open);
            if (!self.isOpen) {
                self.level = 0;
            }

            // Événement
            self.onReady(function () {
                if (self.isOpen) {
                    self.getElements().page.on(self.events.page = 'click.togglemenuPush touchstart.togglemenuPush', function (event) {
                        event.preventDefault();

                        if (self.isOpen) {
                            self.getElements().toggle.focus();
                            self.toggle();
                        }
                    });

                    // Focus
                    setTimeout(function () {
                        if (self.getElements().closeContent !== undefined && self.getElements().closeContent.length) {
                            self.getElements().closeContent.focus();
                        } else if (self.getElements().menuContent.length) {
                            self.getElements().menuContent.find('a:first').focus();
                        }
                    }, 100);

                } else {
                    self.getElements().page.off(self.events.page);
                    self.getElements().toggle.focus();
                    self.closeSubmenus();
                }
            });

            // User callback
            if (self.settings.onToggle !== undefined) {
                self.settings.onToggle.call({
                    toggleMenuPush: self,
                    elements: self.getElements(),
                    isOpen: self.isOpen
                });
            }

            return self;
        },

        /**
         * Ouverture/fermeture d'un sous-menu
         *
         * @param {object} item Élément parent
         */
        toggleSubmenu: function (item) {
            // States
            this.closeSubmenus(item);
            item.toggleClass(this.settings.classes.active);
            this.level = item.hasClass(this.settings.classes.active) ? this.level + 1 : this.level - 1;

            // Current
            if (this.level > 0 && this.level === this.getElements().menuContent.find('.' + this.settings.classes.active).length) {
                if (item.hasClass(this.settings.classes.active)) {
                    item.addClass(this.settings.classes.current);
                } else {
                    var parentActiveItem = item.closest('.' + this.settings.classes.active);

                    if (parentActiveItem.length) {
                        parentActiveItem.addClass(this.settings.classes.current);
                    }
                }
            }

            // Accordion
            if (this.getItemLayout(item) === 'accordion') {
                var menuContent = this.getElements().itemContent(item);

                menuContent.slideToggle(this.settings.slideDuration);

                // Focus
                if (menuContent.parent().hasClass(this.settings.classes.active)) {
                    menuContent.find('a:first').focus();
                }
            }

            // Panel
            if (this.getItemLayout(item) === 'panel') {
                this.getWrapper().scrollTop(0);
                this.getElements().body.removeClass(this.settings.classes.submenuOpen);

                if (this.level > 0) {
                    this.getElements().body.addClass(this.settings.classes.submenuOpen);
                }

                // Focus
                if (item.hasClass(this.settings.classes.active)) {
                    // Back btn
                    var backItem = item.find('.' + this.settings.classes.back).eq(0);
                    if (backItem.length) {
                        var backBtn = this.getElements().backBtn(backItem);

                        if (backBtn.length) {
                            backBtn.focus();
                        }
                    }
                } else {
                    this.getElements().itemLink(item).focus();
                }
            }

            // User callback
            if (this.settings.onToggleSubmenu !== undefined) {
                this.settings.onToggleSubmenu.call({
                    toggleMenuPush: this,
                    item: item
                });
            }

            return this;
        },

        /**
         * Fermeture des sous menus
         *
         * @param {object=undefined} item Élément parent
         */
        closeSubmenus: function (item) {
            var self = this;
            var submenus = [];

            if (item !== undefined) {
                var siblings = item.siblings('.' + self.settings.classes.active);
                var children = item.find('.' + self.settings.classes.active);

                if (siblings.length) {
                    submenus.push(siblings[0]);
                }
                if (children.length) {
                    submenus.push(children[0]);
                }

                submenus = $(submenus);

            } else {
                submenus = self.getElements().items;
            }

            submenus.removeClass(self.settings.classes.active);
            self.getElements().items.removeClass(self.settings.classes.current);

            submenus.each(function (i, submenu) {
                submenu = $(submenu);

                if (self.getItemLayout(submenu) === 'accordion') {
                    self.getElements().itemContent(submenu).slideUp(self.settings.slideDuration);
                }
            });

            return self;
        }
    };
})(jQuery);