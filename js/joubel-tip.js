var H5P = H5P || {};

H5P.JoubelTip = (function ($) {
  var sticky = false;

  /**
   * Creates a new tip
   *
   * @param {string} text The text to display in the popup
   * @param {object} params Additional parameters
   * @param {string} [params.tipLabel] Tip label
   */
  function JoubelTip(text, params) {
    var speechBubble;

    params = $.extend({
      showSpeechBubble: true,
      helpIcon: false
    }, params);

    var parsedTitle = text;
    if ($.parseHTML($.trim(text)).length) {
      parsedTitle = $.parseHTML($.trim(text))[0].textContent;
    }

    var $tip = $('<div/>', {
      class: 'joubel-tip-container' + (params.showSpeechBubble ? '' : ' be-quiet'),
      title: parsedTitle,
      role: 'button',
      tabindex: 0,
      click: function () {
        // Disable hover and make tip stick for help tip
        if (params.helpIcon) {
          if (sticky) {
            sticky = false;
            return false;
          }
          else {
            sticky = true;
            return false;
          }
        }

        // Unstick the help tip if other tips are clicked
        sticky = false;
        toggleSpeechBubble();

        return false;
      },
      keydown: function (e) {
        // Space
        if (e.which === 32) {
          toggleSpeechBubble();
          e.preventDefault();
        }
        else {
          toggleSpeechBubble(true);
        }
      },
      mouseenter: mouseHandler,
      mouseleave: mouseHandler
    }).append($('<div/>', {
      'class': 'joubel-tip-icon' + (params.helpIcon ? ' help-icon': '')
    }));

    /**
     * Add or remove a speech bubble
     * @private
     * @param {boolean} [close] Forces tip to close or not show
     * @return {boolean}
     */
    function toggleSpeechBubble(close) {
      if (speechBubble !== undefined && speechBubble.isCurrent($tip)) {
        speechBubble.remove();
        speechBubble = undefined;
      }
      else if (!close && params.showSpeechBubble) {
        speechBubble = H5P.JoubelSpeechBubble($tip, text);
      }

      return false;
    }

    /**
     * Toggle a speech bubble on hover
     *
     * @private
     */
    function mouseHandler() {
      // Only help tips should have a hover effect
      if (params.helpIcon && sticky !== true) {
        toggleSpeechBubble();
      }
    }

    return $tip;
  }

  return JoubelTip;
})(H5P.jQuery);
