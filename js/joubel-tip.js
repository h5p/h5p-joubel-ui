var H5P = H5P || {};

H5P.JoubelTip = (function ($) {

  /**
   * Creates a new tip
   *
   * @param {string} text The text to display in the popup
   * @param {object} params Additional parameters
   * @param {string} [params.tipLabel] Tip label
   */
  function JoubelTip(text, params) {
    var speechBubble;
    var parsedTitle = text;
    if ($.parseHTML($.trim(text)).length) {
      parsedTitle = $.parseHTML($.trim(text))[0].textContent;
    }

    params = $.extend({
      showSpeechBubble: true,
      tipLabel: parsedTitle
    }, params);

    /**
     * Toggle tip visibility
     * @param {boolean} [close] Forces tip to close or not show
     * @return {boolean}
     */
    function toggleTip(close) {
      if (speechBubble !== undefined && !speechBubble.isHidden()) {
        speechBubble.remove();
        speechBubble = undefined;
      }
      else if (!close && params.showSpeechBubble) {
        speechBubble = H5P.JoubelSpeechBubble($tip, text);
      }
      return false;
    }

    var $tip = $('<div/>', {
      'class': 'joubel-tip-container' + (params.showSpeechBubble ? '' : ' be-quiet'),
      title: params.tipLabel,
      role: 'button',
      tabIndex: 0,
      click: function () {
        toggleTip();
        return false;
      },
      keydown: function (e) {
        // Space
        if (e.which === 32) {
          toggleTip();
          e.preventDefault();
        }
        else {
          toggleTip(true);
        }
      }
    }).append($('<div/>', {
      'class': 'joubel-tip-icon'
    }));
    return $tip;
  }

  return JoubelTip;
})(H5P.jQuery);
