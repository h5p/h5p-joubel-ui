var H5P = H5P || {};

H5P.JoubelTip = (function ($) {

  /**
   * Creates a new tip
   *
   * @param {string} text The text to display in the popup
   * @param {object} params Additional parameters
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
      click: function () {
        if (speechBubble !== undefined && speechBubble.isCurrent($tip)) {
          speechBubble.remove();
          speechBubble = undefined;
        }
        else if (params.showSpeechBubble) {
          speechBubble = H5P.JoubelSpeechBubble($tip, text);
        }
        return false;
      }
    }).append($('<div/>', {
      'class': 'joubel-tip-icon' + (params.helpIcon ? ' help-icon': '')
    }));
    return $tip;
  }

  return JoubelTip;
})(H5P.jQuery);
