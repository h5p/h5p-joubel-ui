var H5P = H5P || {};

/**
 * Class responsible for creating speech bubbles
 */
H5P.JoubelSpeechBubble = (function ($) {
  
  var $currentSpeechBubble;
  
  var DEFAULT_MAX_WIDTH = 400;
  
  var iDevice = navigator.userAgent.match(/iPod|iPhone|iPad/g) ? true : false;
  
  /**
   * Creates a new speech bubble
   *
   * @param {jQuery object} $container The speaking object 
   * @param {string} text The text to display
   * @param {number} maxWidth The maximum width of the bubble
   */
  function JoubelSpeechBubble($container, text, maxWidth) {
    maxWidth = maxWidth || DEFAULT_MAX_WIDTH;
    
    this.remove = function () {
      H5P.$body.off('click.speechBubble');
      if (iDevice) {
        H5P.$body.css('cursor', '');
      }
      if ($currentSpeechBubble !== undefined) {
        $currentSpeechBubble.remove();
        $currentSpeechBubble = undefined;
      }
      // Don't return false here. If the user e.g. clicks a button when the bubble is visible,
      // we want the bubble to disapear AND the button to receive the event
    };
    
    this.isHidden = function () {
      return ($currentSpeechBubble === undefined);
    };
    
    if ($currentSpeechBubble !== undefined) {
      this.remove();
    }
    
    var $h5pContainer = $('.h5p-container');
    // Create bubble
    $currentSpeechBubble = $('<div class="joubel-speech-bubble"><div class="joubel-speech-bubble-inner"><div class="joubel-speech-bubble-text">' + text + '</div></div></div>').appendTo($h5pContainer);
  
    // Setting width to 90% of parent
    var width = $h5pContainer.width()*0.9;
    
    // If width is more than max width, use max width
    width = width > maxWidth ? maxWidth : width;
    var left = $container.offset().left - width + $container.outerWidth() - $h5pContainer.offset().left - ($container.width()/2) + 20;
    
    // If width makes element go outside of body, make it smaller.
    // TODO - This is not ideal, e.g if the $container is far to the left.
    // Improvement: support left- and right-"aligned" bubbles
    if (left < 0) {
      // 3px is hard coded here just to get some margin
      // to the left side
      width += left-3;
      left = 3;
    }
    
    // Need to set font-size, since element is appended to body.
    // Using same font-size as parent. In that way it will grow accordingly
    // when resizing
    var fontSize = 16;//parseFloat($parent.css('font-size'));
    
    // Set max-width:
    $currentSpeechBubble.css({
      width: width + 'px',
      top: ($container.offset().top + $container.outerHeight() - $h5pContainer.offset().top) + 'px',
      left: left + 'px',
      fontSize: fontSize + 'px'
    });
    
    // Handle click to close
    H5P.$body.on('click.speechBubble', this.remove);
    if (iDevice) {
      H5P.$body.css('cursor', 'pointer');
    }

    return this;
  }
  
  return JoubelSpeechBubble;
})(H5P.jQuery);
