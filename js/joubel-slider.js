var H5P = H5P || {};

H5P.JoubelSlider = (function ($) {

  /**
   * Creates a new Slider
   *
   * @param {object} params Additional parameters
   */
  function JoubelSlider(params) {
    H5P.EventDispatcher.call(this);
    var self = this;

    this.$slider = $('<div>', {
      'class': 'h5p-joubel-ui-slider'
    });
    this.$slides = [];
    this.currentIndex = 0;
    this.numSlides = 0;
  }
  JoubelSlider.prototype = Object.create(H5P.EventDispatcher.prototype);
  JoubelSlider.prototype.constructor = JoubelSlider;

  JoubelSlider.prototype.addSlide = function ($content) {
    $content.addClass('h5p-joubel-ui-slide').css({
      'left': (this.numSlides*100) + '%'
    });
    this.$slider.append($content);
    this.$slides.push($content);

    this.numSlides++;

    if(this.numSlides === 1) {
      $content.addClass('current');
    }
  };

  JoubelSlider.prototype.attach = function ($container) {
    $container.append(this.$slider);
  };

  JoubelSlider.prototype.move = function (index) {
    var self = this;

    if(index === 0) {
      self.trigger('first-slide');
    }
    if(index+1 === self.numSlides) {
      self.trigger('last-slide');
    }
    self.trigger('move');

    var $previousSlide = self.$slides[this.currentIndex];
    this.hideTabs($previousSlide[0]);
    H5P.Transition.onTransitionEnd(this.$slider, function () {
      $previousSlide.removeClass('current');
      self.trigger('moved');
    });
    var $nextSlide = this.$slides[index];
    $nextSlide.addClass('current');
    this.showTabs($nextSlide[0]);

    var translateX = 'translateX(' + (-index*100) + '%)';
    this.$slider.css({
      '-webkit-transform': translateX,
      '-moz-transform': translateX,
      '-ms-transform': translateX,
      'transform': translateX
    });

    this.currentIndex = index;
  };

  JoubelSlider.prototype.remove = function () {
    this.$slider.remove();
  };

  JoubelSlider.prototype.next = function () {
    if(this.currentIndex+1 >= this.numSlides) {
      return;
    }

    this.move(this.currentIndex+1);
  };

  JoubelSlider.prototype.previous = function () {
    this.move(this.currentIndex-1);
  };

  JoubelSlider.prototype.first = function () {
    this.move(0);
  };

  JoubelSlider.prototype.last = function () {
    this.move(this.numSlides-1);
  };

  /**
   * Takes all tabable elements on this slide out of the tab order.
   * @param {Object} slide The old slide.
   */
  JoubelSlider.prototype.hideTabs = function(slide) {
    var nodes = slide.querySelectorAll('[tabindex]');
    for (var i = 0, node; node = nodes[i]; i++) {
      node.setAttribute('tabindex', '-1');
    }
  };

  /**
   * Inserts all tabable elements on this slide into the tab order.
   * @param {Object} slide The new slide.
   */
  JoubelSlider.prototype.showTabs = function(slide) {
    var nodes = slide.querySelectorAll('[tabindex]');
    for (var i = 0, node; node = nodes[i]; i++) {
      node.setAttribute('tabindex', '0');
    }
  };

  return JoubelSlider;
})(H5P.jQuery);
