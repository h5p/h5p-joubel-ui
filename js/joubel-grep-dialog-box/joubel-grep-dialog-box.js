/** @namespace H5P */
var H5P = H5P || {};

/**
 * Grep Dialog Box module
 * @class
 * @external {jQuery} $ H5P.jQuery
 */
H5P.GrepDialogBox = (function ($) {
  var CURRICULUM = 0;
  var COMPETENCE_AIM_SET = 1;
  var COMPETENCE_AIM = 2;

  var isIE9 = function () {
    return (/MSIE 9/i).test(navigator.userAgent);
  };

  /**
   * Initialize module.
   * @param {Object} params Object containing parameters
   * @param {Array} filterIdList Array containing ids to filter on
   * @returns {Object} GrepDialogBox GrepDialogBox instance
   */
  function GrepDialogBox(params, filterIdList) {
    this.$ = $;
    this.isCreated = false;
    this.hasBottomBar = false;
    this.selectedCompetenceAims = [];
    this.filteredIdList = filterIdList;

    // l10n
    this.params = $.extend({}, {
      chooseGoalText: 'Choose goal from list',
      goalsAddedText: 'Number of goals added:',
      grepDialogDone: 'Done',
      filterGoalsPlaceholder: 'Filter on words...'
    }, params);
  }

  /**
   * Creates the dialog box and attaches it to wrapper
   * @param {jQuery} $wrapper
   */
  GrepDialogBox.prototype.attach = function ($wrapper) {
    this.$wrapper = $wrapper;
    if (!this.isCreated) {
      this.createDialogView();
    }

    // Get grep object
    this.grepApi = new H5P.GrepAPI();

    this.createBottomBar();
    this.updateDialogView();

    this.grepApi.getGrepData(this, '', this.filteredIdList);
  };

  /**
   * Creates the dialog
   * @returns {H5P.GoalsPage.GrepDialogBox}
   */
  GrepDialogBox.prototype.createDialogView = function () {
    this.$curriculumDialogContainer = $('<div>', {
      'class': 'h5p-curriculum-popup-container'
    });

    // Create a semi-transparent background for the popup
    $('<div>', {
      'class': 'h5p-curriculum-popup-background'
    }).appendTo(this.$curriculumDialogContainer);

    this.$curriculumDialog = $('<div>', {
      'class': 'h5p-curriculum-popup'
    }).appendTo(this.$curriculumDialogContainer);

    this.createHeader().appendTo(this.$curriculumDialog);
    this.createSearchBox().appendTo(this.$curriculumDialog);

    this.$curriculumView = $('<div>', {
      'class': 'h5p-curriculum-view'
    }).appendTo(this.$curriculumDialog);

    if (isIE9()) {
      this.$curriculumDialogContainer.addClass('ie9');
    }

    this.isCreated = true;

    this.$curriculumDialogContainer.appendTo(this.$wrapper);

    return this;
  };

  /**
   * Creates header
   */
  GrepDialogBox.prototype.createHeader = function () {
    var $header = $('<div>', {
      'class': 'h5p-curriculum-header'
    });

    $('<div>', {
      'class': 'h5p-curriculum-header-text',
      'html': this.params.header
    }).appendTo($header);
    this.createExit().appendTo($header);

    return $header;
  };

  /**
   * Creates an exit button for the dialog box
   */
  GrepDialogBox.prototype.createExit = function () {
    var self = this;
    return $('<div>', {
      'class': 'h5p-curriculum-popup-exit'
    }).click(function () {
      self.removeDialogBox();
    });
  };

  /**
   * Removes the dialog box
   */
  GrepDialogBox.prototype.removeDialogBox = function () {
    this.$curriculumDialogContainer.remove();
  };

  /**
   * Creates a throbber at the curriculum view.
   */
  GrepDialogBox.prototype.createLoadingScreen = function (selectedItem) {
    var self = this;
    if (!this.isCreated) {
      this.createDialogView();
    }

    var $throbberContainer = $('<div>', {
      'class': 'h5p-throbber-container'
    });

    // Append to curriculumView or to parent curriculum
    if (selectedItem !== undefined && selectedItem.type === CURRICULUM) {
      var selectedItemIndex = -1;

      // Find index of selected item
      self.$curriculumView.children().children().each(function (elementIndex) {
        if ($(this).html() === selectedItem.value) {
          selectedItemIndex = elementIndex;
        }
      });

      if (selectedItemIndex > -1 && selectedItemIndex < self.$curriculumView.children().children().length) {
        $throbberContainer.appendTo(self.$curriculumView.children().children().eq(selectedItemIndex));
      }
    } else {
      $throbberContainer.appendTo(self.$curriculumView);
    }

    // Create throbber
    var $throbber = H5P.JoubelUI.createThrobber();
    $throbber.appendTo($throbberContainer);
  };

  /**
   * Updates the dialog box view
   * @param {Array} dataList List of data for updating the dialog box
   * @param {Number} dataListType Data type in dataList, 0 = curriculum, 1 = curriculum aim sets, 2 = competence aim
   * @returns {H5P.GoalsPage.GrepDialogBox}
   */
  GrepDialogBox.prototype.updateDialogView = function (dataList, dataListType) {
    // Create view popup if it does not exist
    if (!this.isCreated) {
      this.createDialogView();
    }

    var curriculumList = [];
    var dataNamesList = [];

    if (dataList !== undefined && dataList.length) {
      curriculumList = dataList;
    } else {
      this.grepApi.getDataList();
    }

    if (dataListType === CURRICULUM) {
      // Append competence aim sets to curriculums
      curriculumList = this.addCompetenceAimSet(dataList);
      dataNamesList = curriculumList;
    } else if (dataListType === COMPETENCE_AIM_SET) {
      curriculumList = this.addCompetenceAimList(dataList);
      dataNamesList = curriculumList;
    } else {
      dataNamesList = this.getDataNames(curriculumList);
    }

    // Extract curriculum instances from curriculums array
    this.curriculumNames = dataNamesList;
    this.updateViewList(this.$curriculumView, dataNamesList, this.$searchInput.val());


    return this;
  };

  /**
   * Gets the names from provided data list
   * @param {Array} dataList Contains names of data
   * @param {Boolean} isCompetenceAimSet Competence aim sets
   * @returns {Array} dataNamesList The provided data list with updated data objects
   */
  GrepDialogBox.prototype.getDataNames = function (dataList, isCompetenceAimSet) {
    var self = this;
    // Clear curriculum names array
    var dataNamesList = [];
    var dataType = isCompetenceAimSet ? COMPETENCE_AIM_SET : CURRICULUM;

    // Populate wrapper
    dataList.forEach(function (data, dataIndex) {
      var dataName = self.grepApi.getLanguageNeutral(data);
      dataNamesList.push({idx: dataIndex, value: dataName, type: dataType, child: data.link, selected: false});
    });

    return dataNamesList;
  };

  /**
   * Adds a bottom bar to the dialog.
   */
  GrepDialogBox.prototype.createBottomBar = function () {
    var self = this;
    if (!this.hasBottomBar) {
      self.$bottomBar = $('<div>', {
        'class': 'h5p-bottom-bar'
      });

      self.$bottomBarText = $('<div>', {
        'class': 'h5p-bottom-bar-text',
        'html': self.params.goalsAddedText + ' 1'
      }).appendTo(self.$bottomBar);

      self.$bottomBarButton = H5P.JoubelUI
        .createSimpleRoundedButton(self.params.grepDialogDone)
        .addClass('h5p-bottom-bar-button')
        .click(function () {
          $(this).trigger('dialogFinished', [self.selectedCompetenceAims]);
          self.removeDialogBox();
        }).appendTo(self.$bottomBar);
    }
  };

  /**
   * Updates bottom bar, either changing the text or remove the bottom bar.
   */
  GrepDialogBox.prototype.updateBottomBar = function () {
    var self = this;

    if (!this.hasBottomBar) {
      self.$bottomBar.appendTo(self.$curriculumDialog);
      this.hasBottomBar = true;
      self.$curriculumView.addClass('has-bottom-bar');
    }

    if (self.selectedCompetenceAims.length <= 0) {
      self.$bottomBarText.html(self.params.goalsAddedText + ' 0');
    } else {
      self.$bottomBarText.html(self.params.goalsAddedText + ' ' + self.selectedCompetenceAims.length);
    }
  };

  /**
   * Clears wrapper and attaches curriculums to it
   * @param {Array} curriculums Array of curriculum names
   * @param {jQuery} $wrapper Wrapper that curriculums will be appended to.
   * @param {String} filterString A filter for which curriculums to display
   * @returns {H5P.GoalsPage.GrepDialogBox}
   */
  GrepDialogBox.prototype.updateViewList = function ($wrapper, curriculums, filterString) {
    // Clear wrapper
    $wrapper.children().remove();
    this.createViewList(curriculums, filterString).appendTo($wrapper);

    return this;
  };

  /**
   * Creates the full list to display in dialog box from provided data
   * @param {Array} dataList Array containing all dialog box list data
   * @param {String} filterString Curriculums will be filtered on this string
   */
  GrepDialogBox.prototype.createViewList = function (dataList, filterString) {
    var self = this;
    if (filterString !== undefined && filterString) {
      dataList = self.filterDataList(filterString);
    }
    var $viewListContainer = $('<div>', {
      'class': 'h5p-view-list-container'
    });

    var prevEntry = null;

    // Populate wrapper
    dataList.forEach(function (curriculumNameInstance) {
      // Do not create children of unselected ancestors
      if (!self.isAncestorSelected(curriculumNameInstance)) {
        return;
      }

      var classString = '';
      switch (curriculumNameInstance.type) {
      case CURRICULUM:
        classString = 'h5p-view-list-entry h5p-curriculum-instance';
        break;
      case COMPETENCE_AIM_SET:
        classString = 'h5p-view-list-entry h5p-competence-aim-set-instance';
        break;
      case COMPETENCE_AIM:
        classString = 'h5p-view-list-entry h5p-competence-aim-instance';

        // Check if first child
        if (prevEntry.type !== COMPETENCE_AIM) {
          classString += ' first';
        }
        break;
      default:
        classString = 'h5p-view-list-entry';
      }

      // Add/remove selected class
      if (curriculumNameInstance.selected) {
        classString += ' selected';
      }

      prevEntry = curriculumNameInstance;

      $('<div>', {
        'class': classString,
        'text': curriculumNameInstance.value
      }).click(function () {
        self.handleListClick(curriculumNameInstance, $(this));
      }).appendTo($viewListContainer);
    });

    return $viewListContainer;
  };

  /**
   * Recursive function that checks if all ancestors of a child is selected
   * @param {Object} child Object checking its' ancestors
   * @returns {boolean} Returns true if all ancestors are selected
   */
  GrepDialogBox.prototype.isAncestorSelected = function (child) {
    // A child with no parents is "selected"
    if (child.parent === undefined) {
      return true;
    }

    // A child with a selected parents must check that parents' ancestor
    if (child.parent !== undefined && child.parent.selected) {
      return this.isAncestorSelected(child.parent);
    }

    // If an ancestor is not selected return false
    return false;
  };

  /**
   * Returns the button for finishing the dialog box
   * @returns {jQuery} this.$bottomBarButton Finish button
   */
  GrepDialogBox.prototype.getFinishedButton = function () {
    return this.$bottomBarButton;
  };

  /**
   * Adds competence aim to list of selected competence aims and updates bottom bar accordingly
   * @param {Object} selectedCompetenceAim Selected competence aim
   * @param {jQuery} selectedElement Selected element corresponding to selected competence aim
   */
  GrepDialogBox.prototype.addCompetenceAim = function (selectedCompetenceAim, selectedElement) {
    var self = this;
    if (self.selectedCompetenceAims.indexOf(selectedCompetenceAim) === -1) {
      self.selectedCompetenceAims.push(selectedCompetenceAim);
      // Add selected class
      selectedElement.addClass('selected');
      selectedCompetenceAim.selected = true;
    } else {
      self.selectedCompetenceAims.splice(self.selectedCompetenceAims.indexOf(selectedCompetenceAim), 1);
      // Remove selected class
      selectedElement.removeClass('selected');
      selectedCompetenceAim.selected = false;
    }

    this.updateBottomBar();
  };

  /**
   * Removes competence aim from selected competence aims list and updates bottom bar
   * @param {Object} selectedCompetenceAim Textual representation of comeptence aim
   */
  GrepDialogBox.prototype.removeCompetenceAim = function (selectedCompetenceAim) {
    if (this.selectedCompetenceAims.indexOf(selectedCompetenceAim) > -1) {
      this.selectedCompetenceAims.splice(this.selectedCompetenceAims.indexOf(selectedCompetenceAim), 1);
    }
    selectedCompetenceAim.selected = false;
    this.updateBottomBar();
  };

  /**
   * Process selected item in dialog box
   * @param {Object} selectedItem Selected item
   * @param {jQuery} selectedElement Selected element corresponding to selected item
   */
  GrepDialogBox.prototype.processSelection = function (selectedItem, selectedElement) {
    // select item
    selectedItem.selected = true;

    // Expand children if they exist
    var parentIndex = this.curriculumNames.indexOf(selectedItem);
    var childIndex = parentIndex + 1;
    if (childIndex < this.curriculumNames.length && this.curriculumNames[childIndex].type > selectedItem.type) {
      // Update view
      this.updateViewList(this.$curriculumView, this.curriculumNames, this.$searchInput.val());
      return;
    }

    // Otherwise get children
    if (selectedItem.type === CURRICULUM) {
      this.grepApi.getGrepData(this, selectedItem);
    } else if (selectedItem.type === COMPETENCE_AIM_SET) {
      this.updateDialogView(selectedItem.competenceAims, selectedItem.type);
    } else if (selectedItem.type === COMPETENCE_AIM) {
      this.addCompetenceAim(selectedItem, selectedElement);
    }
  };

  /**
   * Handles list clicks and chooses action depending on what list element was clicked
   * @param {Object} parent List object
   * @param {jQuery} parentElement List element
   */
  GrepDialogBox.prototype.handleListClick = function (parent, parentElement) {
    var parentIndex = this.curriculumNames.indexOf(parent);
    var parentObject = parent;
    var childIndex = parentIndex + 1;
    var childObject = this.curriculumNames[childIndex];

    if (childObject !== undefined
        && parentObject.selected
        && parentObject.type < childObject.type
        && parentObject.type !== COMPETENCE_AIM) {
      this.collapseListItem(parent);
    } else if (parentObject.type === COMPETENCE_AIM
        && this.selectedCompetenceAims.indexOf(parentObject) > -1) {
      // Remove competence aim from selection
      this.removeCompetenceAim(parentObject);
      parentElement.removeClass('selected');
    } else {
      this.processSelection(parent, parentElement);
    }
  };

  /**
   * Collapses a listitem and its' children
   * @param {Object} parent List item object
   */
  GrepDialogBox.prototype.collapseListItem = function (parent) {
    parent.selected = false;
    this.updateViewList(this.$curriculumView, this.curriculumNames, this.$searchInput.val());
  };


  /**
   * Merges competence aim set into curriculum list
   * @param {Array} competenceAimSet Competence aims added to curriculum list
   * @returns {Array} mergedList Merged list
   */
  GrepDialogBox.prototype.addCompetenceAimSet = function (competenceAimSet) {
    // Appends the data provided to the corresponding parent element existing in the dialog.
    var mergedList = [];
    var self = this;

    // Match link to appropriate parent
    this.curriculumNames.forEach(function (curriculumName) {
      mergedList.push(curriculumName);
      if (curriculumName.child === competenceAimSet[0].links.parent) {
        // Append list under parent
        competenceAimSet.forEach(function (competenceAimSetInstance, instanceIndex) {
          var instanceName = self.grepApi.getLanguageNeutral(competenceAimSetInstance);
          mergedList.push({
            idx: instanceIndex,
            type: curriculumName.type + 1,
            value: instanceName,
            parent: curriculumName,
            competenceAims: competenceAimSetInstance.competenceAims,
            selected: false
          });
        });
      }
    });

    return mergedList;
  };

  GrepDialogBox.prototype.addCompetenceAimList = function (competenceAimList) {
    var mergedList = [];
    var self = this;

    this.curriculumNames.forEach(function (curriculumName) {
      mergedList.push(curriculumName);
      if (curriculumName.competenceAims !== undefined && curriculumName.competenceAims.length) {
        if (curriculumName.competenceAims[0] === competenceAimList[0]) {
          // Append list under parent
          competenceAimList.forEach(function (competenceAimInstance, instanceIndex) {
            var instanceName = self.grepApi.getLanguageNeutral(competenceAimInstance);
            mergedList.push({
              idx: instanceIndex,
              type: curriculumName.type + 1,
              value: instanceName,
              parent: curriculumName,
              curriculum: curriculumName.parent,
              selected: false
            });
          });
        }
      }
    });

    return mergedList;
  };

  /**
   * Filters curriculums on string
   * @param {String} filterString Filter string
   * @returns {Array} filteredCurriculumNames Filtered curriculum names
   */
  GrepDialogBox.prototype.filterDataList = function (filterString) {
    var filteredCurriculumNames = [];
    var prevCurriculum = null;
    this.curriculumNames.forEach(function (curriculumNameInstance) {
      // Only filter curriculums
      if (curriculumNameInstance.type === CURRICULUM) {
        var isMatching = false;

        // Check if filter string is a substring
        if (curriculumNameInstance.value.toLowerCase().indexOf(filterString.toLowerCase()) > -1) {
          filteredCurriculumNames.push(curriculumNameInstance);
          isMatching = true;
        }

        // Set curriculum as previous curriculum
        prevCurriculum = {instance: curriculumNameInstance, isMatching: isMatching};
      } else {
        // Add non curriculum data entry if previous curriculum was matching filter string
        if (prevCurriculum !== null && prevCurriculum.isMatching) {
          filteredCurriculumNames.push(curriculumNameInstance);
        }
      }
    });

    return filteredCurriculumNames;
  };

  /**
   * Creates a search box inside wrapper
   * @returns {jQuery} $searchContainer Search container
   */
  GrepDialogBox.prototype.createSearchBox = function () {
    var self = this;

    var $searchContainer = $('<div>', {
      'class': 'h5p-curriculum-search-container'
    });

    this.$searchInput = $('<input>', {
      'type': 'text',
      'class': 'h5p-curriculum-search-box',
      'placeholder': this.params.filterGoalsPlaceholder
    }).keyup(function () {
      // Filter curriculum names on key up
      var input = $(this).val();
      self.updateViewList(self.$curriculumView, self.curriculumNames, input);
    }).appendTo($searchContainer);

    return $searchContainer;
  };

  /**
   * Sets error message in grep dialog box
   * @param {String} msg String explaining the error
   */
  GrepDialogBox.prototype.setErrorMessage = function (msg) {
    this.$curriculumView.children().remove();
    this.$curriculumView.html(msg);
  };

  return GrepDialogBox;

}(H5P.jQuery));
