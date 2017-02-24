$(function() {
  var catClicker = new CatClicker();
  catClicker.count();
});

function CatClicker() {
  this.clicker = $('.js-catClicker');

  CatClicker.prototype.count = function () {
    this.clicker.off()
    this.clicker.on('click', function(e) {
      var $target = $(e.currentTarget);
      var $counter = $target.children('.js-catClicker__counter');
      var cnt = parseInt($counter.text()) || 0;
      cnt++;
      $counter.text(cnt);
    });
  }
}
