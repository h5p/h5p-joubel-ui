var H5P = H5P || {};

/**
 * H5P Joubel UI library.
 * 
 * This is a utility library, which does not implement attach. I.e, it has to bee actively used by
 * other libraries
 */
H5P.JoubelUI = (function ($) {
  
  function JoubelUI() {}
  
  /* Public static functions */
  
  /* Create tip icon */
  JoubelUI.createTip = function (text, params) {
    return new H5P.JoubelTip(text, params);
  };
  
  /* Create message dialog */
  JoubelUI.createMessageDialog = function ($container, message) {
    return new H5P.JoubelMessageDialog($container, message);
  };

  /* Create progress circle */
  JoubelUI.createProgressCircle = function (number, progressColor, backgroundColor) {
    return new H5P.JoubelProgressCircle(number, progressColor, backgroundColor);
  };
  
  /**
   * Create standard Joubel button
   * 
   * @param {object} params
   *  May hold any properties allowed by jQuery. If href is set, an A tag
   *  is used, if not a button tag is used.
   */
  JoubelUI.createButton = function(params) {
    var type = 'button';
    if (params.href) {
      type = 'a';
    }
    else {
      params.type = 'button';
    }
    if (params.class) {
      params.class += ' h5p-joubelui-button';
    }
    else {
      params.class = 'h5p-joubelui-button';
    }
    return $('<' + type + '/>', params);
  };
  
  return JoubelUI;
})(H5P.jQuery);