$(function() {
  var catClicker = new CatClicker();
  catClicker.createDom();
  catClicker.select();
  catClicker.count();
});

function CatClicker() {
  this.content = $('#js-content');
  this.data = [
    {
      id: 0,
      name: 'Lucy',
      imgSrc: '/catClicker/images/pic_cat-01.jpg'
    },
    {
      id: 1,
      name: 'Bella',
      imgSrc: '/catClicker/images/pic_cat-02.jpg'
    },
    {
      id: 2,
      name: 'Luna',
      imgSrc: '/catClicker/images/pic_cat-03.jpg'
    },
    {
      id: 3,
      name: 'Oliver',
      imgSrc: '/catClicker/images/pic_cat-04.jpg'
    },
    {
      id: 4,
      name: 'Chloe',
      imgSrc: '/catClicker/images/pic_cat-05.jpg'
    }
  ];
  this.constant = {
    WRAPPR: 'p-catClicker',
    AREA: 'p-catClicker__area',
    LIST: 'p-catClicker__list',
    ITEM: 'p-catClicker__item',
    NAME: 'p-catClicker__name',
    CLICKER: 'p-catClicker__target',
    COUNTER: 'p-catClicker__counter'
  };

  CatClicker.prototype.createDom = function () {
    var $wrapper = $('<div class="' + this.constant.WRAPPR + '"></div>');
    var $area = $('<div class="' + this.constant.AREA + '"></div>');
    var $list = $('<ul class="' + this.constant.LIST + '"></ul>');

    this.data.forEach(function(val, idx) {
      var $catClicker = $('<div class="' + this.constant.ITEM + '"></div>');
      var $image = $('<img src="' +  val.imgSrc + '" class="' + this.constant.CLICKER + '">');
      var $name = $('<p class="' + this.constant.NAME + '">' + val.name + '</p>');
      var $counter = $('<p class="' + this.constant.COUNTER + '">0</p>');

      $catClicker.attr('data-cat-id', val.id);
      $catClicker.append($image);
      $catClicker.append($name);
      $catClicker.append($counter);
      $area.append($catClicker);

      var $li = $('<li>' + val.name + '</li>');

      $li.attr('data-cat-id', val.id);
      $list.append($li);
    }.bind(this));

    $wrapper.append($area);
    $wrapper.append($list);
    this.content.append($wrapper);
  }

  CatClicker.prototype.count = function () {
    var $clicker = $('.' + this.constant.CLICKER);
    $clicker.each(function(idx, elm) {
      var $counter = $(elm).siblings('.' + this.constant.COUNTER);
      var cnt = 0;
      $(elm).off('click');
      $(elm).on('click', function() {
        cnt++;
        $counter.text(cnt);
      });
    }.bind(this));
  }

  CatClicker.prototype.select = function () {
    var showedId = 0;
    var catItems = $('.' + this.constant.ITEM);
    catItems.hide();
    catItems.eq(showedId).show();

    var $listItem = $('.' + this.constant.LIST + ' > li');
    $listItem.each(function(idx, elm) {
      $(elm).off('click');
      $(elm).on('click', function() {
        var targetId = $(elm).data('cat-id');
        if (targetId === showedId) return;
        catItems.hide();
        catItems.each(function(idx, elm) {
          if (targetId === $(elm).data('cat-id')) $(elm).show();
        });
        showedId = targetId;
      });
    });
  }
}
