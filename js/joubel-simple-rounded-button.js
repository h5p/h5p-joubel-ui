var H5P = H5P || {};

H5P.SimpleRoundedButton = (function ($) {

  /**
   * Creates a new tip
   */
  function SimpleRoundedButton(text) {

    var $simpleRoundedButton = $('<div/>', {
      'class': 'joubel-simple-rounded-button'
    });

    if (text !== undefined && text.length) {
      $simpleRoundedButton.html(text);
    }

    return $simpleRoundedButton;
  }

  return SimpleRoundedButton;
}(H5P.jQuery));
