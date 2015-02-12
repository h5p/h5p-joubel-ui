var H5P = H5P || {};

/**
 * Class responsible for creating a circular progress bar
 */

H5P.JoubelProgressCircle = (function ($) {

  /**
   * Constructor for the Progress Circle
   *
   * @param {Number} number The amount of progress to display
   * @param {string} progressColor Color for the progress meter
   * @param {string} backgroundColor Color behind the progress meter
   */
  function ProgressCircle(number, progressColor, backgroundColor) {
    var progressColor = progressColor || '#096bcb';
    var backgroundColor = backgroundColor || '#e0e0e0';

    //Verify number
    try {
      number = Number(number);
      if (number === '') throw 'is empty';
      if (isNaN(number)) throw 'is not a number';
    } catch (e) {
      console.log('Progress circle input '+ e);
      number = 'err';
    }
    //Draw circle
    if (number > 100) {
      number = 100;
    }

    //Wrapper
    var $wrapper = $('<div/>', {
      'class': "joubel-progress-circle-wrapper"
    });

    //Active border indicates progress
    var $activeBorder = $('<div/>', {
      'class': "joubel-progress-circle-active-border"
    }).appendTo($wrapper);

    //Background circle
    var $circle = $('<div/>', {
      'class': "joubel-progress-circle-circle"
    }).appendTo($activeBorder);

    //Progress text/number
    $('<span/>', {
      'text': number,
      'class': "joubel-progress-circle-percentage"
    }).appendTo($circle);


    var deg = number * 3.6;
    if (deg <= 180) {
      $activeBorder
        .css('background-image',
        'linear-gradient(' + (90 + deg) + 'deg, transparent 50%, ' + backgroundColor + ' 50%),' +
        'linear-gradient(90deg, ' + backgroundColor + ' 50%, transparent 50%)');
    }
    else {
      $activeBorder
        .css('background-image',
        'linear-gradient(' + (deg - 90) + 'deg, transparent 50%, ' + progressColor + ' 50%),' +
        'linear-gradient(90deg, ' + backgroundColor + ' 50%, transparent 50%)');
    }
    return $wrapper;
  }

  return ProgressCircle;

})(H5P.jQuery);
