var H5P = H5P || {};

H5P.SimpleRoundedButton = (function ($) {

  /**
   * Creates a new tip
   */
  function SimpleRoundedButton(text) {

    var $simpleRoundedButton = $('<div/>', {
      'class': 'joubel-simple-rounded-button',
      'html': text,
      'title': text,
      'role': 'button',
      'tabindex': '1'
    }).keydown(function (e) {
      var keyPressed = e.which;
      // 32 - space
      if (keyPressed === 32) {
        $(this).click();
        e.preventDefault();
      }
      $(this).focus();
    });

    return $simpleRoundedButton;
  }

  return SimpleRoundedButton;
}(H5P.jQuery));
