var H5P = H5P || {};

/**
 * Class responsible for creating speech bubbles
 */
H5P.JoubelSpeechBubble = (function ($) {
  
  var $currentSpeechBubble = undefined;
  
  var DEFAULT_MAX_WIDTH = 400;
  
  /**
   * Creates a new speech bubble
   *
   * @param {jQuery object} $container The speaking object 
   * @param {string} text The text to display
   * @param {number} maxWidth The maximum width of the bubble
   */
  function JoubelSpeechBubble($container, text, maxWidth) {
    
    maxWidth = maxWidth || DEFAULT_MAX_WIDTH;
    
    var removeSpeechBubble = function () {
      $('body').off('click.speechBubble');
      $currentSpeechBubble.remove();
      $currentSpeechBubble = undefined;
      // Don't return false here. If the user e.g. clicks a button when the bubble is visible,
      // we want the bubble to disapear AND the button to receive the event
    };
    
    if($currentSpeechBubble !== undefined) {
      removeSpeechBubble();
    }
    
    $parent = $container.parent();
    // Create bubble
    $currentSpeechBubble = $('<div class="joubel-speech-bubble"><div class="joubel-speech-bubble-inner"><div class="joubel-speech-bubble-text">' + text + '</div></div></div>').appendTo($('body'));
  
    // Setting width to 90% of parent
    var width = $parent.width()*0.9;
    
    // If width is more than max width, use max width
    width = width > maxWidth ? maxWidth : width;
    var left = $container.offset().left - width + $container.width() + 7.5;
    
    // If width makes element go outside of body, make it smaller.
    // TODO - This is not ideal, e.g if the $container is far to the left.
    // Improvement: support left- and right-"aligned" bubbles
    if(left < 0) {
      width += left;
      left = 0;
    }
    
    // Need to set font-size, since element is appended to body.
    // Using same font-size as parent. In that way it will grow accordingly
    // when resizing
    var fontSize = 16;//parseFloat($parent.css('font-size'));
    
    // Set max-width:
    $currentSpeechBubble.css({
      width: width + 'px',
      top: ($container.offset().top + $container.outerHeight()) + 'px',
      left: left + 'px',
      fontSize: fontSize + 'px'
    });
    
    // Handle click to close
    $('body').on('click.speechBubble', removeSpeechBubble);
  }
  
  return JoubelSpeechBubble;
})(H5P.jQuery);