var H5P = H5P || {};

/**
 * H5P Joubel UI library.
 * 
 * This is a utility library, which does not implement attach. I.e, it has to bee actively used by
 * other libraries
 */
H5P.JoubelUI = (function ($) {
  
  function JoubelUI() {};
  
  /* Public static function */
  JoubelUI.createTip = function (text, params) {
    return new H5P.JoubelTip(text, params);
  };
  
  return JoubelUI;
})(H5P.jQuery);