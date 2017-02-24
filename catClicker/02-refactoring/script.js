$(function() {
  var catClicker = new CatClicker();
  catClicker.createDom();
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
    }
  ];
  this.constant = {
    WRAPER: 'p-catClicker',
    NAME: 'p-catClicker__name',
    CLICKER: 'p-catClicker__target',
    COUNTER: 'p-catClicker__counter'
  };

  CatClicker.prototype.createDom = function () {
    this.data.forEach(function(val, idx) {
      var $catClicker = $('<div class="' + this.constant.WRAPER + '"></div>');
      var $image = $('<img src="' +  val.imgSrc + '" class="' + this.constant.CLICKER + '">');
      var $name = $('<p class="' + this.constant.NAME + '">' + val.name + '</p>');
      var $counter = $('<p class="' + this.constant.COUNTER + '">0</p>');

      $catClicker.attr('data-cat-id', val.id);
      $catClicker.append($image);
      $catClicker.append($name);
      $catClicker.append($counter);
      this.content.append($catClicker);
    }.bind(this));
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
}
