var H5P = H5P || {};

/**
 * GrepAPI module
 * @class
 * @external {jQuery} $ H5P.jQuery
 */
H5P.GrepAPI = (function ($) {
  var COMPETENCE_AIM_SET = 0;

  var ERROR_CONNECTION = 'Could not connect to the Internet.';

  var standardGrepUrl = 'http://mycurriculum.test.ndla.no/v1/users/ndla/curriculums';

  /**
   * Initialize module.
   * @param {String} targetGrepUrl Url used to get json from
   * @returns {Object} GrepAPI GrepAPI instance
   */
  function GrepAPI(targetGrepUrl) {
    this.$ = $(this);
    this.jsonData = [];
    this.isProcessingGrepCall = false;
    if (this.grepUrl === undefined) {
      this.grepUrl = standardGrepUrl;
    } else {
      this.grepUrl = targetGrepUrl;
    }
  }

  /**
   * Fetches data from url and updates the dialog view of provided grep dialog box
   * @param {H5P.GrepDialogBox} grepDialogBox Grep dialog box
   * @param {Object} selectedItem Selected item object
   * @param {Array} filterIdList Array with ids that data will be filtered on
   * @returns {H5P.GrepAPI}
   */
  GrepAPI.prototype.getGrepData = function (grepDialogBox, selectedItem, filterIdList) {
    var self = this;
    var dataUrl = selectedItem.child;
    if (dataUrl === undefined || dataUrl === '') {
      dataUrl = self.grepUrl;
    }

    // Do not process multiple calls at the same time.
    if (this.isProcessingGrepCall) {
      return this;
    }

    this.isProcessingGrepCall = true;
    this.executeGrepCall(dataUrl, grepDialogBox, selectedItem, filterIdList);

    grepDialogBox.createLoadingScreen(selectedItem);

    return this;
  };

  GrepAPI.prototype.executeGrepCall = function (dataUrl, grepDialogBox, selectedItem, filterIdList) {
    var self = this;

    // Find IE version
    function isIE() {
      var myNav = navigator.userAgent.toLowerCase();
      return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1], 10) : false;
    }

    // is IE version less than 9
    if (isIE() && isIE() <= 9) {
      // Use XDomainRequest
      if (window.XDomainRequest) {
        /*global XDomainRequest */
        var xdr = new XDomainRequest();

        xdr.open("get", dataUrl);

        xdr.onerror = function () {
          //Error Occured
          grepDialogBox.setErrorMessage(ERROR_CONNECTION);
          self.isProcessingGrepCall = false;
        };

        // Success
        xdr.onload = function (xdr) {
          self.jsonString = xdr.target.responseText;
          self.jsonData = JSON.parse(xdr.target.responseText);
          grepDialogBox.updateDialogView(self.getDataList(selectedItem.type, filterIdList), selectedItem.type);
          self.isProcessingGrepCall = false;
        };

        setTimeout(function () {
          xdr.send();
        }, 0);
      }
      return this;
    }

    $.support.cors = true;

    $.ajax({
      url: dataUrl,
      success: function (data) {
        self.jsonString = data;
        self.jsonData = JSON.parse(data);
        grepDialogBox.updateDialogView(self.getDataList(selectedItem.type, filterIdList), selectedItem.type);
        self.isProcessingGrepCall = false;
      },
      error: function () {
        grepDialogBox.setErrorMessage(ERROR_CONNECTION);
        self.isProcessingGrepCall = false;
      }
    });
  };

  /**
   * Get language neutral name
   * @param {Object} names Array of names in different languages
   * @returns {string} languageNeutralName Language neutral name
   */
  GrepAPI.prototype.getLanguageNeutral = function (names) {
    var languageNeutralName = '';
    names.names.forEach(function (nameInstance) {
      if (nameInstance.isLanguageNeutral) {
        // Set curriculum name to language neutral name
        languageNeutralName = nameInstance.name;
      } else if (languageNeutralName === '') {
        // If there is no language neutral name, set curriculum name to available name
        languageNeutralName = nameInstance.name;
      }
    });

    return languageNeutralName;
  };

  /**
   * Gets a list of data from jsonData depending on data type
   * @param {Number} dataType 0 = competence aim sets
   * @param {Array} filterIdList Array of ids to filter on
   * @returns {Array} dataList Proper curriculums or competence aim sets
   */
  GrepAPI.prototype.getDataList = function (dataType, filterIdList) {
    var self = this;
    var dataList = [];

    if (this.jsonData !== undefined && this.jsonData) {
      // get all curriculums
      if (dataType === COMPETENCE_AIM_SET) {
        // get specific competence aim set
        dataList = this.jsonData.curriculum.competenceAimSets[0].competenceAimSets;
      } else if (this.jsonData.curriculums !== undefined) {
        // get all curriculums
        dataList = self.getCurriculumList(filterIdList);
      }
    }

    return dataList;
  };

  /**
   * Get curriculum from jsonData with optional filter
   * @param {Array} filterIdList Array containing curriculum IDs to filter on
   * @returns {Array} dataList Array containing filtered curriculums
   */
  GrepAPI.prototype.getCurriculumList = function (filterIdList) {
    var dataList = this.jsonData.curriculums;

    if (filterIdList !== undefined && filterIdList.length) {
      var filteredDataList = [];
      filterIdList.forEach(function (filterIdInstance) {
        // If ID exists in dataList add id to filtered list
        dataList.some(function (dataListInstance) {
          if (dataListInstance.id === filterIdInstance) {
            filteredDataList.push(dataListInstance);
            return true;
          }
          return false;
        });
      });
      // Use filtered dataList if it was populated
      if (filteredDataList.length) {
        dataList = filteredDataList;
      }
    }

    return dataList;
  };

  return GrepAPI;

}(H5P.jQuery));
