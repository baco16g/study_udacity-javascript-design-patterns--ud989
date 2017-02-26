//=================================
// NOTE: Model
//=================================
function CatModel(items) {
    this._items = items;
}
CatModel.prototype = {
    getItems: function() {
        return Object.assign({}, this._items);
    },

    getLastId: function() {
        return this._items.cats.length;
    },

    getCurrentCat: function() {
        var currentCats = this._items.cats.filter(function(cat) {
            return cat.visible;
        });
        return currentCats;
    },

    incrementCounter: function() {
        var currentCats = this.getCurrentCat();
        currentCats[0].clickCount++;
        return currentCats;
    },

    changeCat: function(targetId) {
        if (targetId !== this.getCurrentCat()[0].id) {
            this._items.cats.forEach(function(cat) {
                if (cat.id === targetId) {
                    cat.visible = true;
                } else {
                    cat.visible = false;
                }
            });
        }
        return this.getCurrentCat();
    },

    addCat: function(newCat) {
        this._items.cats.push(newCat);
    },

    showAdmin: function() {
        this._items.adminVisible = true;
    },

    hideAdmin: function() {
        this._items.adminVisible = false;
    }

};

//=================================
// NOTE: EventDispatcher
//=================================
function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}
Event.prototype = {
    attach: function(listener) {
        this._listeners.push(listener);
    },
    notify: function(args) {
        var index;

        for (index = 0; index < this._listeners.length; index += 1) {
            this._listeners[index](this._sender, args);
        }
    }
};

//=================================
// NOTE: View
//=================================
function CatViewSelector(elements) {
    var _this = this;

    this._elements = elements;

    this.listCatClicked = new Event(this);
    this._elements.$selectorList.on('click', 'button', function(e) {
        _this.listCatClicked.notify({ target: e.target });
    });
}
CatViewSelector.prototype = {
    init: function(itemsCopied) {
        this.render(itemsCopied);
    },

    render: function(itemsCopied) {
        var cats = itemsCopied.cats;
        var $selectorList = this._elements.$selectorList;

        $selectorList.html('');
        cats.forEach(function(cat) {
            var $selector = $('<li><button></button></li>');
            $selector.children('button').text(cat.name);
            $selector.children('button').attr('data-cat-id', cat.id);
            $selectorList.append($selector);
        });
    }
};

///////////////////////////////////

function CatViewArea(elements) {
    var _this = this;

    this._elements = elements;

    this.countTargetClicked = new Event(this);
    this._elements.$areaTarget.on('click', function() {
        _this.countTargetClicked.notify();
    });
}
CatViewArea.prototype = {
    init: function(itemsCopied, currentCats) {
        this.render(itemsCopied, currentCats);
    },

    render: function(itemsCopied, currentCats) {
        this._elements.$areaItem.attr('data-cat-id', currentCats[0].id);
        this._elements.$areaName.text(currentCats[0].name);
        this._elements.$areaTarget.attr('src', currentCats[0].imgSrc);
        this._elements.$areaCounter.text(currentCats[0].clickCount);
    }
};

///////////////////////////////////

function CatViewAdmin(elements) {
    var _this = this;

    this._elements = elements;

    this.adminBtnClicked = new Event(this);
    this.submitlBtnClicked = new Event(this);
    this.cancelBtnClicked = new Event(this);

    this._elements.$adminBtn.on('click', function() {
        _this.adminBtnClicked.notify();
    });
    this._elements.$adminSubmitBtn.on('click', function(e) {
        _this.submitlBtnClicked.notify({ target: e.target });
    });
    this._elements.$adminCancelBtn.on('click', function() {
        _this.cancelBtnClicked.notify();
    });
}
CatViewAdmin.prototype = {
    init: function(itemsCopied, currentCats) {
        this.render(itemsCopied, currentCats);
    },

    render: function(itemsCopied, currentCats) {
        if (itemsCopied.adminVisible) {
            this._elements.$adminInputs.show();
        } else {
            this._elements.$adminInputs.hide();
        }
    }
};

//=================================
// NOTE: Controller
//=================================
function CatController(model, views) {
    var _this = this;

    this._model = model;
    this._views = views;

    this._views.selector.listCatClicked.attach(function(sender, args) {
        var targetId = $(args.target).data('cat-id');
        _this.changeCat(targetId);
    });
    this._views.area.countTargetClicked.attach(function() {
        _this.incrementCounter();
    });
    this._views.admin.adminBtnClicked.attach(function() {
        _this.showAdmin();
    });
    this._views.admin.submitlBtnClicked.attach(function(sender, args) {
        _this.addCat(args.target);
        _this.hideAdmin();
    });
    this._views.admin.cancelBtnClicked.attach(function() {
        _this.hideAdmin();
    });
}
CatController.prototype = {
    init: function() {
        var currentCats = this._model.getCurrentCat();
        var itemsCopied = this._model.getItems();
        this._views.selector.init(itemsCopied, currentCats);
        this._views.area.init(itemsCopied, currentCats);
        this._views.admin.init(itemsCopied, currentCats);
    },

    changeCat: function(targetId) {
        this._views.area.render(this._model.getItems(), this._model.changeCat(targetId));
    },

    addCat: function(target) {
        var inputs = $(target).parent().find('input');
        var obj = new Object();
        var lastId = this._model.getLastId();

        inputs.each(function(){
            obj[this.name] = this.value;
        });

        // TODO: VALIDATION
        
        var cat = Object.assign({
            id: lastId,
            visible: false
        }, obj);

        this._model.addCat(cat);
        this.changeCat(cat.id);
        this._views.selector.render(this._model.getItems());
    },

    incrementCounter: function() {
        this._views.area.render(this._model.getItems(), this._model.incrementCounter());
    },

    showAdmin: function() {
        this._model.showAdmin();
        this._views.admin.render(this._model.getItems());
    },

    hideAdmin: function() {
        this._model.hideAdmin();
        this._views.admin.render(this._model.getItems());
    },
};

//=================================
// NOTE: App
//=================================
$(function() {
    var items = {
        lastId: 5,
        adminVisible: false,
        cats: [
            {
              id: 0,
              name: 'Lucy',
              imgSrc: '/catClicker/images/pic_cat-01.jpg',
              clickCount: 0,
              visible: true
            },
            {
              id: 1,
              name: 'Bella',
              imgSrc: '/catClicker/images/pic_cat-02.jpg',
              clickCount: 0,
              visible: false
            },
            {
              id: 2,
              name: 'Luna',
              imgSrc: '/catClicker/images/pic_cat-03.jpg',
              clickCount: 0,
              visible: false
            },
            {
              id: 3,
              name: 'Oliver',
              imgSrc: '/catClicker/images/pic_cat-04.jpg',
              clickCount: 0,
              visible: false
            },
            {
              id: 4,
              name: 'Chloe',
              imgSrc: '/catClicker/images/pic_cat-05.jpg',
              clickCount: 0,
              visible: false
            }
        ]
    };

    var catModel        = new CatModel(items);
    var catViewSelector = new CatViewSelector({
        $selectorList: $('.p-catClicker__list'),
    });
    var catViewArea     = new CatViewArea({
        $area: $('.p-catClicker__area'),
        $areaItem: $('.p-catClicker__item'),
        $areaTarget: $('.p-catClicker__target'),
        $areaName: $('.p-catClicker__name'),
        $areaCounter: $('.p-catClicker__counter'),
    });
    var catViewAdmin     = new CatViewAdmin({
        $admin: $('.p-catClicker__admin'),
        $adminBtn: $('.p-catClicker__adminBtn'),
        $adminInputs: $('.p-catClicker__inputs'),
        $adminSubmitBtn: $('.p-catClicker__inputs__submitBtn'),
        $adminCancelBtn: $('.p-catClicker__inputs__cancelBtn'),
    });
    var catController   = new CatController(catModel, {
        selector: catViewSelector,
        area: catViewArea,
        admin: catViewAdmin,
    });

    catController.init();
}());
