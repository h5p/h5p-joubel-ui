var H5P = H5P || {};

/**
 * Class responsible for creating speech bubbles
 */
H5P.JoubelSpeechBubble = (function ($) {

  var $currentSpeechBubble;
  var $currentContainer;
  var removeSpeechBubbleTimeout;

  var DEFAULT_MAX_WIDTH = 400;

  var iDevice = navigator.userAgent.match(/iPod|iPhone|iPad/g) ? true : false;

  /**
   * Creates a new speech bubble
   *
   * @param {H5P.jQuery} $container The speaking object
   * @param {string} text The text to display
   * @param {number} maxWidth The maximum width of the bubble
   * @return {H5P.JoubelSpeechBubble}
   */
  function JoubelSpeechBubble($container, text, maxWidth) {
    maxWidth = maxWidth || DEFAULT_MAX_WIDTH;
    $currentContainer = $container;

    this.isCurrent = function ($tip) {
      if ($tip === $currentContainer) {return true;}
      else {return false;}
    };

    this.remove = function () {
      remove();
    };

    var fadeOutSpeechBubble = function ($speechBubble) {
      if (!$speechBubble) {
        return;
      }

      // Stop removing bubble
      clearTimeout(removeSpeechBubbleTimeout);

      $speechBubble.removeClass('show');
      setTimeout(function () {
        if ($speechBubble) {
          $speechBubble.remove();
          $speechBubble = undefined;
        }
      }, 500);
    };

    if ($currentSpeechBubble !== undefined) {
      remove();
    }

    var $h5pContainer = $container.closest('.h5p-frame');

    // Check closest h5p frame first, then check for container in case there is no frame.
    if (!$h5pContainer.length) {
      $h5pContainer = $container.closest('.h5p-container');
    }

    // Make sure we fade out old speech bubble
    fadeOutSpeechBubble($currentSpeechBubble);

    // Create bubble
    var $tail = $('<div class="joubel-speech-bubble-tail"></div>');
    var $innerTail = $('<div class="joubel-speech-bubble-inner-tail"></div>');
    var $innerBubble = $(
      '<div class="joubel-speech-bubble-inner">' +
        '<div class="joubel-speech-bubble-text">' + text + '</div>' +
      '</div>'
    ).prepend($innerTail);

    $currentSpeechBubble = $(
      '<div class="joubel-speech-bubble" aria-live="assertive">'
    ).append([$tail, $innerBubble])
      .appendTo($h5pContainer);

    // Show speech bubble with transition
    setTimeout(function () {
      $currentSpeechBubble.addClass('show');
    }, 0);

    var direction = getGrowthDirection($h5pContainer, $container);
    var tipWidth = $h5pContainer.width() * 0.9; // Var needs to be renamed to make sense
    var bubbleWidth = tipWidth > maxWidth ? maxWidth : tipWidth;
    var bubblePosition = getBubblePosition(bubbleWidth, $h5pContainer, $container);
    var tailPosition = getTailPosition(bubbleWidth, bubblePosition, $container);
    // Need to set font-size, since element is appended to body.
    // Using same font-size as parent. In that way it will grow accordingly
    // when resizing
    var fontSize = 16;//parseFloat($parent.css('font-size'));

    // Set width and position of speech bubble
    $currentSpeechBubble.css(bubbleCSS(
      direction,
      bubbleWidth,
      bubblePosition,
      fontSize
    ));

    var preparedTailCSS = tailCSS(direction, tailPosition);
    $tail.css(preparedTailCSS);
    $innerTail.css(preparedTailCSS);

    // Handle click to close
    H5P.$body.on('mousedown.speechBubble', handleOutsideClick);

    // Handle clicks when inside IV which blocks bubbling.
    $container.parents('.h5p-dialog')
      .on('mousedown.speechBubble', handleOutsideClick);

    if (iDevice) {
      H5P.$body.css('cursor', 'pointer');
    }

    return this;
  }

  // Remove speechbubble if it belongs to a dom element that is about to be hidden
  H5P.externalDispatcher.on('domHidden', function (event) {
    if ($currentSpeechBubble !== undefined && event.data.$dom.find($currentContainer).length !== 0) {
      remove();
    }
  });

  /**
   * Static function for removing the speechbubble
   */
  var remove = function() {
    H5P.$body.off('mousedown.speechBubble');
    $currentContainer.parents('.h5p-dialog').off('mousedown.speechBubble');
    if (iDevice) {
      H5P.$body.css('cursor', '');
    }
    if ($currentSpeechBubble !== undefined) {
      // Apply transition, then remove speech bubble
      $currentSpeechBubble.removeClass('show');

      // Make sure we remove any old timeout before reassignment
      clearTimeout(removeSpeechBubbleTimeout);
      removeSpeechBubbleTimeout = setTimeout(function () {
        $currentSpeechBubble.remove();
        $currentSpeechBubble = undefined;
      }, 500);
    }
    // Don't return false here. If the user e.g. clicks a button when the bubble is visible,
    // we want the bubble to disapear AND the button to receive the event
  }

  /**
   * Remove the speech bubble with a fade
   *
   * @param {jQuery} $speechBubble Speech bubble element
   */
  function fadeOutSpeechBubble($speechBubble) {
    if (!$speechBubble) {return;}

    // Stop removing bubble
    clearTimeout(removeSpeechBubbleTimeout);

    $speechBubble.removeClass('show');
    setTimeout(function () {
      if ($speechBubble) {
        $speechBubble.remove();
        $speechBubble = undefined;
      }
    }, 500);
  }

  /**
   * Remove the speech bubble and container reference
   */
  function handleOutsideClick () {
    remove();
    // There is no current container when a container isn't clicked
    $currentContainer = undefined;
  }

  /**
   * Calculate which direction the speech bubble should grow
   *
   * @param {jQuery} $h5pContainer H5P container element
   * @param {jQuery} $container Tip container element
   * @return {string} Return growth direction
   */
  function getGrowthDirection($h5pContainer, $container) {
    if (($h5pContainer.height() / 2) > $container.offset().top) {
      return 'bottom';
    }
    else {
      return 'top';
    }
  }

  /**
   * Calculate position for speech bubble
   *
   * @param {number} bubbleWidth The width of the speech bubble
   * @param {jQuery} $h5pContainer H5P container element
   * @param {jQuery} $container Tip container element
   * @return {object} Return position for the speech bubble
   */
  function getBubblePosition(bubbleWidth, $h5pContainer, $container) {
    var bubblePosition = {};
    var tipOffset = {
      top: $container.offset().top,
      left: $container.offset().left
    };

    var tailOffset = 9;
    var widthOffset = bubbleWidth / 2;
    var h5pContainerWidth = $h5pContainer.width();

    // Calculate top position
    bubblePosition.top = tipOffset.top + $container.outerHeight() - $h5pContainer.offset().top;

    // Calculate bottom position
    bubblePosition.bottom = $h5pContainer.height() - tipOffset.top + tailOffset;

    // Calculate left position
    if (tipOffset.left < widthOffset) {
      bubblePosition.left = 3;
    }
    else if ((tipOffset.left + widthOffset) > h5pContainerWidth) {
      bubblePosition.left = h5pContainerWidth - bubbleWidth - 3;
    }
    else {
      bubblePosition.left = tipOffset.left - widthOffset + ($container.width() / 2);
    }

    return bubblePosition;
  }

  /**
   * Calculate position for speech bubble tail
   *
   * @param {number} bubbleWidth The width of the speech bubble
   * @param {object} bubblePosition Speech bubble position
   * @param {jQuery} $container Tip container element
   * @return {object} Return position for the tail
   */
  function getTailPosition(bubbleWidth, bubblePosition, $container) {
    var tailPosition = {};
    // Magic numbers. Tuned by hand so that the tail fits visually within
    // the bounds of the speech bubble.
    var leftBoundary = 9;
    var rightBoundary = bubbleWidth - 20;

    tailPosition.left = $container.offset().left - bubblePosition.left + 9;

    if (tailPosition.left < leftBoundary) {tailPosition.left = leftBoundary;}
    if (tailPosition.left > rightBoundary) {tailPosition.left = rightBoundary;}

    tailPosition.top = -6;
    tailPosition.bottom = -6;

    return tailPosition;
  }

  /**
   * Return bubble CSS for the desired growth direction
   *
   * @param {string} direction The direction the speech bubble will grow
   * @param {number} width The width of the speech bubble
   * @param {object} position Speech bubble position
   * @param {number} fontSize The size of the bubbles font
   * @return {object} Return CSS
   */
  function bubbleCSS(direction, width, position, fontSize) {
    if (direction === 'top') {
      return {
        width: width + 'px',
        bottom: position.bottom + 'px',
        left: position.left + 'px',
        fontSize: fontSize + 'px'
      };
    }
    else {
      return {
        width: width + 'px',
        top: position.top + 'px',
        left: position.left + 'px',
        fontSize: fontSize + 'px'
      };
    }
  }

  /**
   * Return tail CSS for the desired growth direction
   *
   * @param {string} direction The direction the speech bubble will grow
   * @param {object} position Tail position
   * @return {object} Return CSS
   */
  function tailCSS(direction, position) {
    if (direction === 'top') {
      return {
        bottom: position.bottom + 'px',
        left: position.left + 'px'
      };
    }
    else {
      return {
        top: position.top + 'px',
        left: position.left + 'px'
      };
    }
  }

  return JoubelSpeechBubble;
})(H5P.jQuery);
