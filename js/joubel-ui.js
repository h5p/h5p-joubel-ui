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
  
  return JoubelUI;
})(H5P.jQuery);