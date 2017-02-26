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

    changeCat: function(target) {
        var targetId = $(target).data('cat-id');
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
}

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
function CatViewSelector(model, elements) {
    var _this = this;

    this._model = model;
    this._elements = elements;

    this._items = this._model.getItems();

    this.changeCat = new Event(this);
    this._elements.$selectorList.on('click', 'button', function(e) {
        _this.changeCat.notify({ target: e.target });
    });
}
CatViewSelector.prototype = {
    init: function(currentCats) {
        this._currentCats = currentCats;
        this.render();
    },

    render: function() {
        var catsData = this._items.cats;
        var $selectorList = this._elements.$selectorList;

        $selectorList.html('');
        catsData.forEach(function(cat) {
            var $selector = $('<li><button></button></li>');
            $selector.children('button').text(cat.name);
            $selector.children('button').attr('data-cat-id', cat.id);
            $selectorList.append($selector);
        });

    }
};

///////////////////////////////////

function CatViewArea(model, elements) {
    var _this = this;

    this._model = model;
    this._elements = elements;

    this.countTargetClicked = new Event(this);
    this._elements.$areaTarget.on('click', function() {
        _this.countTargetClicked.notify();
    });
}
CatViewArea.prototype = {
    init: function(currentCats) {
        this.render(currentCats);
    },

    render: function(currentCats) {
        this._elements.$areaItem.attr('data-cat-id', currentCats[0].id);
        this._elements.$areaName.text(currentCats[0].name);
        this._elements.$areaTarget.attr('src', currentCats[0].imgSrc);
        this._elements.$areaCounter.text(currentCats[0].clickCount);
    }
};

//=================================
// NOTE: Controller
//=================================
function CatController(model, views) {
    var _this = this;

    this._model = model;
    this._views = views;

    this._views.selector.changeCat.attach(function(sender, args) {
        _this.changeCat(args);
    });
    this._views.area.countTargetClicked.attach(function() {
        _this.incrementCounter();
    });
}
CatController.prototype = {
    init: function() {
        var currentCats = this._model.getCurrentCat();
        this._views.selector.init(currentCats);
        this._views.area.init(currentCats);
    },

    changeCat: function(args) {
        this._views.area.render(this._model.changeCat(args.target));
    },

    incrementCounter: function() {
        this._views.area.render(this._model.incrementCounter());
    }
};

//=================================
// NOTE: App
//=================================
$(function() {
    var items = {
        lastID: 0,
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
    var catViewSelector = new CatViewSelector(catModel, {
        $selectorList: $('.p-catClicker__list'),
    });
    var catViewArea     = new CatViewArea(catModel, {
        $area: $('.p-catClicker__area'),
        $areaItem: $('.p-catClicker__item'),
        $areaTarget: $('.p-catClicker__target'),
        $areaName: $('.p-catClicker__name'),
        $areaCounter: $('.p-catClicker__counter'),
    });
    var catController   = new CatController(catModel, {
        selector: catViewSelector,
        area: catViewArea,
    });

    catController.init();
}());
