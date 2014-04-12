var H5P = H5P || {};

H5P.JoubelTip = (function ($) {
  
  /**
   * Creates a new tip
   * 
   * @param {string} text The text to display in the popup
   * @param {object} params Additional parameters
   */
  function JoubelTip(text, params) {
    
    params = $.extend({
      showSpeechBubble: true
    }, params);
    
    var $tip = $('<div/>', {
      'class': 'joubel-tip-container' + (params.showSpeechBubble ? '' : ' be-quiet'),
      click: function () {
        if(params.showSpeechBubble) {
          new H5P.JoubelSpeechBubble($tip, text);
        }
        return false;
      }
    }).append($('<div/>', {
      'class': 'joubel-tip-icon'
    }));
    return $tip;
  }
  
  return JoubelTip;
})(H5P.jQuery);