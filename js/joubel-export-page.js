/*global Blob, saveAs */
var H5P = H5P || {};

/**
 * Class responsible for creating an export page
 */
H5P.JoubelExportPage = (function ($) {
  /**
   * Display a pop-up containing an exportable text area with action buttons.
   *
   * @param {String} header Header message
   * @param {jQuery} $body The container which message dialog will be appended to
   * @param {String} selectAllTextLabel Select all text button label
   * @param {String} exportTextLabel Export text button label
   */
  function JoubelExportPage(header, $body, selectAllTextLabel, exportTextLabel) {
    var self = this;

    // Standard labels:
    var standardSelectAllTextLabel = 'Select all';
    var standardExportTextLabel = 'Export text';

    if (selectAllTextLabel !== undefined) {
      standardSelectAllTextLabel = selectAllTextLabel;
    }

    if (exportTextLabel !== undefined) {
      standardExportTextLabel = exportTextLabel;
    }

    var exportPageTemplate =
      '<div class="joubel-create-document">' +
      ' <div class="joubel-exportable-header">' +
      '   <div class="joubel-exportable-header-inner">' +
      '     <div class="joubel-exportable-header-text">' +
      '       <span>' + header + '</span>' +
      '     </div>' +
      '     <div class="joubel-export-page-close" title="Exit" role="button" tabindex="0"></div>' +
      '     <div class="joubel-exportable-copy-button" role="button" tabindex="0">' +
      '       <span>' + standardSelectAllTextLabel + '</span>' +
      '     </div>' +
      '     <div class="joubel-exportable-export-button" role="button" tabindex="0">' +
      '       <span>' + standardExportTextLabel + '</span>' +
      '     </div>' +
      '   </div>' +
      ' </div>' +
      ' <div class="joubel-exportable-body">' +
      '   <div class="joubel-exportable-area"></div>' +
      ' </div>' +
      '</div>';

    this.$inner = $(exportPageTemplate);

    // Append body to exportable area
    self.$exportableArea = $('.joubel-exportable-area', self.$inner).append($body);

    // Exit export page event
    $('.joubel-export-page-close', self.$inner).click(function () {
      //Remove export page.
      self.$inner.remove();
    }).keydown(function (e) {
      var keyPressed = e.which;
      // 32 - space
      if (keyPressed === 32) {
        $(this).click();
        e.preventDefault();
      }
      $(this).focus();
    });

    // Select all text button event
    self.$selectAllTextButton = $('.joubel-exportable-copy-button', self.$inner).click(function () {
      self.selectText(self.$exportableArea);
    }).keydown(function (e) {
      var keyPressed = e.which;
      // 32 - space
      if (keyPressed === 32) {
        $(this).click();
        e.preventDefault();
      }
      $(this).focus();
    });

    // Export document button event
    self.$exportButton = $('.joubel-exportable-export-button', self.$inner).click(function () {
      self.saveText(self.$exportableArea.html());
    }).keydown(function (e) {
      var keyPressed = e.which;
      // 32 - space
      if (keyPressed === 32) {
        $(this).click();
        e.preventDefault();
      }
      $(this).focus();
    });

    // Initialize resize listener for responsive design
    this.standarSelectAllTextLabel = standardSelectAllTextLabel;
    this.standardExportTextLabel = standardExportTextLabel;
    this.initResizeFunctionality();

    return this.$inner;
  }

  /**
   * Initializes listener for resize and performs initial resize when rendered
   */
  JoubelExportPage.prototype.initResizeFunctionality = function () {
    var self = this;

    // Listen for window resize
    $(window).resize(function () {
      self.resize();
    });

    // Initialize responsive view when view is rendered
    setTimeout(function () {
      self.resize();
    }, 0);
  };

  /**
   * Select all text in container
   * @param {jQuery} $container Container containing selected text
   */
  JoubelExportPage.prototype.selectText = function ($container) {
    var doc = document;
    var text = $container.get(0);
    var range;
    var selection;

    if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  /**
   * Save html string to file
   * @param {string} html html string
   */
  JoubelExportPage.prototype.saveText = function (html) {
    // Save it as a file:
    var blob = new Blob([this.createDocContent(html)], {
      type: "application/msword;charset=utf-8"
    });
    saveAs(blob, 'exported-text.doc');
  };

  /**
   * Create doc content from html
   * @param {string} html Html content
   * @returns {string} html embedded content
   */
  JoubelExportPage.prototype.createDocContent = function (html) {
    // Create HTML:
    // me + ta and other hacks to avoid that new relic injects script...
    return '<ht' + 'ml><he' + 'ad><me' + 'ta charset="UTF-8"></me' + 'ta></he' + 'ad><bo' + 'dy><p><a href="' + document.URL + '">' + document.URL + '</a></p>' + html + '</bo' + 'dy></ht' + 'ml>';
  };

  /**
   * Responsive resize function
   */
  JoubelExportPage.prototype.resize = function () {
    var self = this;
    // Show responsive design when width relative to font size is less than 34
    var relativeWidthOfContainer = self.$inner.width() / parseInt(self.$inner.css('font-size'), 10);
    if (relativeWidthOfContainer < 34) {
      self.$inner.addClass('responsive');
      // Remove button text
      self.$selectAllTextButton.html('');
      self.$exportButton.html('');
    } else {
      self.$inner.removeClass('responsive');
      // Restore button text
      self.$selectAllTextButton.html(self.standarSelectAllTextLabel);
      self.$exportButton.html(self.standardExportTextLabel);
    }
  };

  return JoubelExportPage;
}(H5P.jQuery));
