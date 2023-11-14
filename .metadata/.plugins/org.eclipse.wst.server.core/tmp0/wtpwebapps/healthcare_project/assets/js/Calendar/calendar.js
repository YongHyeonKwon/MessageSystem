/*! Calendar.js v2.3.4 | (c) Bunoon | GNU AGPLv3 License */
function calendarJs(elementOrId, options, searchOptions) {
  function build(newStartDateTime, fullRebuild, forceRefreshViews) {
    _currentDate = isDefinedDate(newStartDateTime) ? newStartDateTime : new Date();
    _currentDate.setDate(1);
    _currentDate.setHours(0, 0, 0, 0);
    _isDateToday = isDateTodaysMonthAndYear(_currentDate);
    fullRebuild = isDefined(fullRebuild) ? fullRebuild : false;
    forceRefreshViews = isDefined(forceRefreshViews) ? forceRefreshViews : false;
    var firstDay = new Date(_currentDate.getFullYear(), _currentDate.getMonth(), 1);
    var startDay = getStartOfWeekDayNumber(firstDay.getDay() === 0 ? 7 : firstDay.getDay());
    if (isSideMenuOpen()) {
      hideSideMenu();
    }
    hideAllDropDowns();
    buildLayout();
    buildPreviousMonthDays(startDay);
    var lastDayFilled = buildMonthDays(startDay);
    buildNextMonthDays(lastDayFilled);
    buildDayEvents();
    if (fullRebuild) {
      buildDisabledBackground();
      buildEventEditingDialog();
      buildEventEditingColorDialog();
      buildEventEditingRepeatOptionsDialog();
      buildMessageDialog();
      buildExportEventsDialog();
      buildSearchDialog();
      buildConfigurationDialog();
      buildTooltip();
      buildDropDownMenus();
      buildNotificationPopUp();
    }
    if (forceRefreshViews) {
      refreshViews(true, false);
    }
    if (_element_Calendar !== null) {
      setYearDropDownSelectorButtonText();
    }
  }
  function getAllEvents() {
    var events = [];
    getAllEventsFunc(function(eventDetails) {
      events.push(eventDetails);
    });
    return events;
  }
  function getAllEventsFunc(func) {
    var storageDate;
    for (storageDate in _events) {
      if (_events.hasOwnProperty(storageDate)) {
        var storageGuid;
        for (storageGuid in _events[storageDate]) {
          if (_events[storageDate].hasOwnProperty(storageGuid)) {
            var event = getAdjustedAllDayEvent(_events[storageDate][storageGuid]);
            var result = func(event, storageDate, storageGuid);
            if (result) {
              return;
            }
          }
        }
      }
    }
  }
  function getOrderedEvents(events, sortAllDayEvents) {
    sortAllDayEvents = isDefined(sortAllDayEvents) ? sortAllDayEvents : true;
    events = events.sort(function(a, b) {
      return a.from - b.from;
    });
    if (sortAllDayEvents) {
      events = events.sort(function(a, b) {
        return getBooleanAsNumber(b.isAllDay) - getBooleanAsNumber(a.isAllDay);
      });
    }
    return events;
  }
  function removeNonRepeatingEventsOnSpecificDate(date, compareFunc) {
    addNode(_document.body, _element_DisabledBackground);
    var onNoEvent = function() {
      removeNode(_document.body, _element_DisabledBackground);
    };
    var onYesEvent = function() {
      var eventsRemoved = 0;
      onNoEvent();
      getAllEventsFunc(function(eventDetails) {
        var repeatEvery = getNumber(eventDetails.repeatEvery);
        if (repeatEvery === _repeatType.never && compareFunc(eventDetails.from, date)) {
          _this.removeEvent(eventDetails.id, false);
          eventsRemoved++;
        }
      });
      storeEventsInLocalStorage();
      showNotificationPopUp(_options.eventsRemovedText.replace("{0}", eventsRemoved));
      refreshViews();
    };
    showMessageDialog(_options.confirmEventsRemoveTitle, _options.confirmEventsRemoveMessage, onYesEvent, onNoEvent);
  }
  function buildLayout() {
    if (!_initialized) {
      buildContainer();
      if (_element_Calendar !== null) {
        buildSideMenu();
        buildListAllEventsView();
        buildListAllWeekEventsView();
        buildFullDayView();
        buildDateHeader();
        buildDayNamesHeader();
        buildDayRows();
        buildDocumentEvents();
        _initialized = true;
        if (isDefinedArray(_options.events)) {
          _this.addEvents(_options.events, false, false, false);
        }
        loadEventsFromLocalStorage();
        if (!_initializedFirstTime) {
          triggerOptionsEventWithData("onRender", _elementID);
          _initializedFirstTime = true;
        }
      }
    }
  }
  function buildContainer() {
    if (_element_Calendar === null) {
      var element;
      if (!isDefinedDOMElement(_elementID)) {
        element = getElementByID(_elementID);
      } else {
        element = _elementID;
        _elementID = element.id;
        if (!isDefinedString(_elementID)) {
          _elementID = newGuid();
        }
      }
      if (element !== null) {
        if (element.tagName.toLowerCase() === "input" && (element.type === "text" || element.type === "date")) {
          buildDatePickerMode(element);
        } else {
          _element_Calendar = element;
          _element_Calendar.className = "calendar";
          _element_Calendar.innerHTML = _string.empty;
        }
      }
    }
  }
  function buildDateHeader() {
    _element_HeaderDateDisplay_ExportEventsButton = null;
    _element_HeaderDateDisplay_FullScreenButton = null;
    _element_HeaderDateDisplay_SearchButton = null;
    var wasAddedAlready = _element_HeaderDateDisplay !== null;
    if (wasAddedAlready) {
      _element_HeaderDateDisplay.innerHTML = _string.empty;
    }
    if (!wasAddedAlready) {
      _element_HeaderDateDisplay = createElement("div", "header-date");
      _element_Calendar.appendChild(_element_HeaderDateDisplay);
    }
    if (_options.fullScreenModeEnabled) {
      _element_HeaderDateDisplay.ondblclick = headerDoubleClick;
    }
    if (_datePickerModeEnabled) {
      _element_HeaderDateDisplay.onclick = function(e) {
        cancelBubble(e);
        hideAllDropDowns();
      };
    }
    if (!_datePickerModeEnabled && isSideMenuAvailable()) {
      buildToolbarButton(_element_HeaderDateDisplay, "ib-hamburger", _options.showMenuTooltipText, showSideMenu);
      var sideMenuButtonDividerLine = createElement("div", "side-menu-button-divider-line");
      _element_HeaderDateDisplay.appendChild(sideMenuButtonDividerLine);
    }
    buildToolbarButton(_element_HeaderDateDisplay, "ib-arrow-left-full", _options.previousMonthTooltipText, moveBackMonth);
    if (_datePickerModeEnabled && _options.addYearButtonsInDatePickerMode) {
      buildToolbarButton(_element_HeaderDateDisplay, "ib-rewind", _options.previousYearTooltipText, moveBackYear);
    }
    if (_datePickerModeEnabled || _options.showExtraToolbarButtons) {
      buildToolbarButton(_element_HeaderDateDisplay, "ib-pin", _options.currentMonthTooltipText, moveToday);
    }
    if (_options.showExtraToolbarButtons) {
      buildToolbarButton(_element_HeaderDateDisplay, "ib-refresh", _options.refreshTooltipText, function() {
        refreshViews(true, true);
      });
      if (_optionsForSearch.enabled) {
        _element_HeaderDateDisplay_SearchButton = buildToolbarButton(_element_HeaderDateDisplay, "ib-search", _options.searchTooltipText, showSearchDialog);
      }
    }
    buildToolbarButton(_element_HeaderDateDisplay, "ib-arrow-right-full", _options.nextMonthTooltipText, moveForwardMonth);
    if (_datePickerModeEnabled && _options.addYearButtonsInDatePickerMode) {
      buildToolbarButton(_element_HeaderDateDisplay, "ib-forward", _options.nextYearTooltipText, moveForwardYear);
    }
    if (_datePickerModeEnabled) {
      buildToolbarButton(_element_HeaderDateDisplay, "ib-close", _options.closeTooltipText, hideDatePickerMode);
    }
    if (_options.showExtraToolbarButtons) {
      if (_options.manualEditingEnabled) {
        buildToolbarButton(_element_HeaderDateDisplay, "ib-plus", _options.addEventTooltipText, addNewEvent);
      }
      if (_options.exportEventsEnabled) {
        _element_HeaderDateDisplay_ExportEventsButton = buildToolbarButton(_element_HeaderDateDisplay, "ib-arrow-down-full-line", _options.exportEventsTooltipText, function() {
          showExportEventsDialog(_element_Calendar_AllVisibleEvents);
        });
      }
    }
    if (!_datePickerModeEnabled) {
      buildToolbarButton(_element_HeaderDateDisplay, "ib-eye", _options.listAllEventsTooltipText, function() {
        showListAllEventsView(true);
      });
      buildToolbarButton(_element_HeaderDateDisplay, "ib-hamburger-side", _options.listWeekEventsTooltipText, function() {
        showListAllWeekEventsView(null, true);
      });
    }
    if (_options.showExtraToolbarButtons) {
      if (_options.fullScreenModeEnabled) {
        _element_HeaderDateDisplay_FullScreenButton = buildToolbarButton(_element_HeaderDateDisplay, "ib-arrow-expand-left-right", _options.enableFullScreenTooltipText, headerDoubleClick);
      }
    }
    var titleContainer = createElement("div", "title-container");
    _element_HeaderDateDisplay.appendChild(titleContainer);
    buildYearSelectorDropDownButton(titleContainer);
    buildYearSelectorDropDown(titleContainer);
  }
  function buildDayNamesHeader() {
    var wasAddedAlready = _element_DayNamesHeader !== null;
    if (_options.showDayNamesInMainDisplay) {
      var headerNamesLength = _options.dayHeaderNames.length;
      if (wasAddedAlready) {
        _element_DayNamesHeader.innerHTML = _string.empty;
      }
      if (!wasAddedAlready) {
        _element_DayNamesHeader = createElement("div", "row-cells header-days");
        _element_Calendar.appendChild(_element_DayNamesHeader);
      }
      if (_datePickerModeEnabled) {
        _element_DayNamesHeader.onclick = cancelBubble;
      }
      if (_options.startOfWeekDay === _day.saturday || _options.startOfWeekDay === _day.sunday) {
        buildDayNamesHeaderSection(_options.startOfWeekDay, headerNamesLength);
        buildDayNamesHeaderSection(0, _options.startOfWeekDay);
      } else {
        buildDayNamesHeaderSection(0, headerNamesLength);
      }
      if (_options.reverseOrderDaysOfWeek) {
        reverseElementsOrder(_element_DayNamesHeader);
      }
    } else {
      if (wasAddedAlready) {
        _element_Calendar.removeChild(_element_DayNamesHeader);
        _element_DayNamesHeader = null;
      }
    }
  }
  function buildDayNamesHeaderSection(startIndex, endIndex) {
    var headerNameIndex = startIndex;
    for (; headerNameIndex < endIndex; headerNameIndex++) {
      if (_options.visibleDays.indexOf(headerNameIndex) > -1) {
        buildDayNamesHeaderItem(_element_DayNamesHeader, headerNameIndex);
      }
    }
  }
  function buildDayNamesHeaderItem(headerRow, headerNameIndex) {
    var headerName = _options.dayHeaderNames[headerNameIndex];
    var header = createElement("div", getCellName());
    setNodeText(header, headerName);
    headerRow.appendChild(header);
    header.oncontextmenu = function(e) {
      showDayHeaderDropDownMenu(e, headerNameIndex);
    };
    header.ondblclick = function(e) {
      toggleSingleDayView(headerNameIndex);
    };
  }
  function toggleSingleDayView(headerNameIndex) {
    if (!_datePickerModeEnabled) {
      var updateDisplay = false;
      if (_previousDaysVisibleBeforeSingleDayView.length === 0) {
        var visibleDaysLength = _options.visibleDays.length;
        if (visibleDaysLength > 1) {
          var visibleDayIndex = 0;
          for (; visibleDayIndex < visibleDaysLength; visibleDayIndex++) {
            _previousDaysVisibleBeforeSingleDayView.push(_options.visibleDays[visibleDayIndex]);
          }
          _options.visibleDays = [];
          _options.visibleDays.push(headerNameIndex);
          updateDisplay = true;
        }
      } else {
        _options.visibleDays = [];
        var originalVisibleDaysLength = _previousDaysVisibleBeforeSingleDayView.length;
        var previousVisibleDayIndex = 0;
        for (; previousVisibleDayIndex < originalVisibleDaysLength; previousVisibleDayIndex++) {
          _options.visibleDays.push(_previousDaysVisibleBeforeSingleDayView[previousVisibleDayIndex]);
        }
        _previousDaysVisibleBeforeSingleDayView = [];
        updateDisplay = true;
      }
      if (updateDisplay) {
        _initialized = false;
        triggerOptionsEventWithData("onOptionsUpdated", _options);
        build(_currentDate, true);
      }
    }
  }
  function buildDayRows() {
    if (_element_Rows.length > 0) {
      var rowsLength = _element_Rows.length;
      var rowsIndex = 0;
      for (; rowsIndex < rowsLength; rowsIndex++) {
        _element_Calendar.removeChild(_element_Rows[rowsIndex]);
      }
      _element_Rows = [];
    }
    var rowIndex = 0;
    for (; rowIndex < 6; rowIndex++) {
      var rowData = createElement("div", "row-cells days");
      _element_Calendar.appendChild(rowData);
      _element_Rows.push(rowData);
      var columnDataIndex = 0;
      for (; columnDataIndex < 7; columnDataIndex++) {
        var dayNumber = columnDataIndex;
        if (_options.startOfWeekDay === _day.saturday || _options.startOfWeekDay === _day.sunday) {
          dayNumber = _options.startOfWeekDay + columnDataIndex;
          if (dayNumber >= 7) {
            dayNumber = dayNumber - 7;
          }
        }
        if (_options.visibleDays.indexOf(dayNumber) > -1) {
          var columnDataNumber = rowIndex * 7 + (columnDataIndex + 1);
          var columnData = createElement("div", getCellName(_options.allowEventScrollingOnMainDisplay));
          columnData.id = _elementID_DayElement + columnDataNumber;
          rowData.appendChild(columnData);
          if (_options.allowEventScrollingOnMainDisplay) {
            columnData.className += " scrollY";
          }
          if (_options.minimumDayHeight > 0) {
            columnData.style.height = _options.minimumDayHeight + "px";
          }
        }
      }
      if (_options.reverseOrderDaysOfWeek) {
        reverseElementsOrder(rowData);
      }
    }
  }
  function getCellName(addScrollBars) {
    addScrollBars = isDefined(addScrollBars) ? addScrollBars : false;
    var className = "cell cell-" + _options.visibleDays.length;
    if (addScrollBars) {
      className = className + " custom-scroll-bars";
    }
    return className;
  }
  function getAdjustedAllDayEvent(eventDetails) {
    var adjustedEvent = eventDetails;
    if (adjustedEvent.isAllDay) {
      adjustedEvent.from = new Date(adjustedEvent.from.getFullYear(), adjustedEvent.from.getMonth(), adjustedEvent.from.getDate(), 0, 0);
      adjustedEvent.to = new Date(adjustedEvent.from.getFullYear(), adjustedEvent.from.getMonth(), adjustedEvent.from.getDate(), 23, 59);
    }
    return adjustedEvent;
  }
  function headerDoubleClick() {
    if (!_isFullScreenModeActivated) {
      turnOnFullScreenMode();
    } else {
      turnOffFullScreenMode();
    }
  }
  function turnOnFullScreenMode() {
    if (!_isFullScreenModeActivated && _options.fullScreenModeEnabled) {
      forceTurnOnFullScreenMode();
      triggerOptionsEventWithData("onFullScreenModeChanged", true);
    }
  }
  function turnOffFullScreenMode() {
    if (_isFullScreenModeActivated && _options.fullScreenModeEnabled) {
      _isFullScreenModeActivated = false;
      _element_Calendar.className = _element_Calendar.className.replace(" full-screen-view", _string.empty);
      _element_Calendar.style.cssText = _cachedStyles;
      updateExpandButtons("ib-arrow-expand-left-right", _options.enableFullScreenTooltipText);
      refreshOpenedViews();
      triggerOptionsEventWithData("onFullScreenModeChanged", false);
    }
  }
  function forceTurnOnFullScreenMode() {
    _cachedStyles = _element_Calendar.style.cssText;
    _isFullScreenModeActivated = true;
    _element_Calendar.className += " full-screen-view";
    _element_Calendar.removeAttribute("style");
    updateExpandButtons("ib-arrow-contract-left-right", _options.disableFullScreenTooltipText);
    refreshOpenedViews();
  }
  function updateExpandButtons(className, tooltipText) {
    setElementClassName(_element_HeaderDateDisplay_FullScreenButton, className);
    setElementClassName(_element_FullDayView_FullScreenButton, className);
    setElementClassName(_element_ListAllEventsView_FullScreenButton, className);
    setElementClassName(_element_ListAllWeekEventsView_FullScreenButton, className);
    addToolTip(_element_HeaderDateDisplay_FullScreenButton, tooltipText);
    addToolTip(_element_FullDayView_FullScreenButton, tooltipText);
    addToolTip(_element_ListAllEventsView_FullScreenButton, tooltipText);
    addToolTip(_element_ListAllWeekEventsView_FullScreenButton, tooltipText);
  }
  function buildSideMenu() {
    if (!_datePickerModeEnabled && _element_SideMenu === null) {
      buildSideMenuDisabledBackground();
      buildFullSideMenu();
    }
  }
  function buildSideMenuDisabledBackground() {
    _element_SideMenu_DisabledBackground = createElement("div", "side-menu-disabled-background");
    _element_SideMenu_DisabledBackground.onclick = hideSideMenu;
    _element_Calendar.appendChild(_element_SideMenu_DisabledBackground);
  }
  function buildFullSideMenu() {
    _element_SideMenu = createElement("div", "side-menu custom-scroll-bars");
    _element_SideMenu.onclick = cancelBubble;
    _element_Calendar.appendChild(_element_SideMenu);
    var header = createElement("div", "main-header");
    _element_SideMenu.appendChild(header);
    createTextHeaderElement(header, _options.sideMenuHeaderText);
    buildToolbarButton(header, "ib-close", _options.closeTooltipText, hideSideMenu);
    if (_options.configurationDialogEnabled) {
      buildToolbarButton(header, "ib-octagon-hollow", _options.configurationTooltipText, function() {
        hideSideMenu();
        showConfigurationDialog();
      });
    }
    _element_SideMenu_Content = createElement("div", "content");
    _element_SideMenu.appendChild(_element_SideMenu_Content);
  }
  function buildSideMenuContent(openDays) {
    var isDaysOpen = isSideMenuContentOpen(_element_SideMenu_Content_Section_Days_Content) || openDays === true;
    var isEventTypesOpen = isSideMenuContentOpen(_element_SideMenu_Content_Section_EventTypes_Content, true);
    var isGroupsOpen = isSideMenuContentOpen(_element_SideMenu_Content_Section_Groups_Content, true);
    var isWorkingDaysOpen = isSideMenuContentOpen(_element_SideMenu_Content_Section_WorkingDays_Content, true);
    var isWeekendDaysOpen = isSideMenuContentOpen(_element_SideMenu_Content_Section_WeekendDays_Content, true);
    _element_SideMenu_Content.innerHTML = _string.empty;
    _element_SideMenu_Content_Section_Days = null;
    _element_SideMenu_Content_Section_Days_Content = null;
    _element_SideMenu_Content_Section_EventTypes = null;
    _element_SideMenu_Content_Section_EventTypes_Content = null;
    _element_SideMenu_Content_Section_Groups = null;
    _element_SideMenu_Content_Section_Groups_Content = null;
    _element_SideMenu_Content_Section_WorkingDays = null;
    _element_SideMenu_Content_Section_WorkingDays_Content = null;
    _element_SideMenu_Content_Section_WeekendDays = null;
    _element_SideMenu_Content_Section_WeekendDays_Content = null;
    hideSearchDialog();
    if (_options.showSideMenuDays) {
      buildSideMenuDays(isDaysOpen);
    }
    if (_options.showSideMenuEventTypes) {
      buildSideMenuEventTypes(isEventTypesOpen);
    }
    if (_options.showSideMenuGroups) {
      buildSideMenuGroups(isGroupsOpen);
    }
    if (_options.showSideMenuWorkingDays) {
      buildSideMenuWorkingDays(isWorkingDaysOpen);
    }
    if (_options.showSideMenuWeekendDays) {
      buildSideMenuWeekendDays(isWeekendDaysOpen);
    }
  }
  function isSideMenuAvailable() {
    return _options.showSideMenuDays || _options.showSideMenuEventTypes || _options.showSideMenuGroups || _options.showSideMenuWorkingDays || _options.showSideMenuWeekendDays;
  }
  function updateSideMenu() {
    if (isSideMenuOpen()) {
      buildSideMenuContent();
    }
  }
  function showSideMenu(openDays) {
    buildSideMenuContent(isDefined(openDays) ? openDays : false);
    _element_SideMenu_Changed = false;
    _element_SideMenu.className += " side-menu-open";
    _element_SideMenu_DisabledBackground.style.display = "block";
    startTimer(_timerName.sideMenuEvents, function() {
      _document.body.addEventListener("click", hideSideMenu);
    }, 500, false);
  }
  function hideSideMenu() {
    if (_element_SideMenu !== null) {
      _element_SideMenu.className = "side-menu custom-scroll-bars";
      _element_SideMenu_DisabledBackground.style.display = "none";
      saveSideMenuSelections();
      _document.body.removeEventListener("click", hideSideMenu);
    }
  }
  function isSideMenuOpen() {
    return _element_SideMenu !== null && _element_SideMenu.className.indexOf("side-menu-open") > -1;
  }
  function saveSideMenuSelections() {
    if (_element_SideMenu_Changed) {
      var triggerOptionsEvent = false;
      var itemWasChanged = false;
      if (_element_SideMenu_Content_Section_Groups !== null) {
        var visibleGroups = getSideMenuCheckedCheckBoxNames(_element_SideMenu_Content_Section_Groups);
        if (!areArraysTheSame(_configuration.visibleGroups, visibleGroups)) {
          _configuration.visibleGroups = visibleGroups;
          itemWasChanged = true;
          triggerOptionsEventWithData("onVisibleGroupsChanged", _configuration.visibleGroups);
        }
      }
      if (_element_SideMenu_Content_Section_EventTypes !== null) {
        var visibleEventTypes = getSideMenuCheckedCheckBoxNames(_element_SideMenu_Content_Section_EventTypes, true);
        if (!areArraysTheSame(_configuration.visibleEventTypes, visibleEventTypes)) {
          _configuration.visibleEventTypes = visibleEventTypes;
          itemWasChanged = true;
          triggerOptionsEventWithData("onVisibleEventTypesChanged", _configuration.visibleEventTypes);
        }
      }
      if (_element_SideMenu_Content_Section_Days !== null) {
        var visibleDays = getSideMenuCheckedCheckBoxNames(_element_SideMenu_Content_Section_Days, true);
        if (visibleDays.length >= 1 && !areArraysTheSame(_options.visibleDays, visibleDays)) {
          _options.visibleDays = visibleDays;
          _previousDaysVisibleBeforeSingleDayView = [];
          triggerOptionsEvent = true;
          itemWasChanged = true;
        }
      }
      if (_element_SideMenu_Content_Section_WorkingDays !== null) {
        var workingDays = getSideMenuCheckedCheckBoxNames(_element_SideMenu_Content_Section_WorkingDays, true);
        if (!areArraysTheSame(_options.workingDays, workingDays)) {
          _options.workingDays = workingDays;
          triggerOptionsEvent = true;
          itemWasChanged = true;
        }
      }
      if (_element_SideMenu_Content_Section_WeekendDays !== null) {
        var weekendDays = getSideMenuCheckedCheckBoxNames(_element_SideMenu_Content_Section_WeekendDays, true);
        if (!areArraysTheSame(_options.weekendDays, weekendDays)) {
          _options.weekendDays = weekendDays;
          triggerOptionsEvent = true;
          itemWasChanged = true;
        }
      }
      if (itemWasChanged) {
        if (triggerOptionsEvent) {
          triggerOptionsEventWithData("onOptionsUpdated", _options);
        }
        _initialized = false;
        build(_currentDate, true, true);
      }
    }
  }
  function getSideMenuCheckedCheckBoxNames(container, isNumericName) {
    isNumericName = isDefined(isNumericName) ? isNumericName : false;
    var checkboxes = container.getElementsByTagName("input");
    var checkboxesLength = checkboxes.length;
    var names = [];
    if (checkboxesLength > 0) {
      var checkboxIndex = 0;
      for (; checkboxIndex < checkboxesLength; checkboxIndex++) {
        var checkbox = checkboxes[checkboxIndex];
        if (checkbox.checked) {
          if (isNumericName) {
            names.push(parseInt(checkbox.name));
          } else {
            names.push(checkbox.name);
          }
        }
      }
    }
    return names;
  }
  function buildSideMenuWeekendDays(opened) {
    opened = isDefined(opened) ? opened : true;
    _element_SideMenu_Content_Section_WeekendDays = createElement("div", "content-section content-section-opened");
    _element_SideMenu_Content_Section_WeekendDays_Content = createElement("div", "checkbox-container");
    _element_SideMenu_Content.appendChild(_element_SideMenu_Content_Section_WeekendDays);
    var dayIndex = 1;
    var dayEndIndex = 8;
    var processOtherDays = false;
    var checkBoxes = [];
    buildSideMenuHeaderAndContentOpener(_element_SideMenu_Content_Section_WeekendDays, _element_SideMenu_Content_Section_WeekendDays_Content, _options.weekendDaysText, opened, checkBoxes);
    _element_SideMenu_Content_Section_WeekendDays.appendChild(_element_SideMenu_Content_Section_WeekendDays_Content);
    if (_options.startOfWeekDay === _day.saturday || _options.startOfWeekDay === _day.sunday) {
      dayIndex = _options.startOfWeekDay + 1;
      processOtherDays = true;
    }
    for (; dayIndex < dayEndIndex; dayIndex++) {
      var actualDayIndex1 = dayIndex > 6 ? 0 : dayIndex;
      var visible1 = _options.weekendDays.indexOf(actualDayIndex1) > -1;
      checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_WeekendDays_Content, _options.dayNames[dayIndex - 1], sideMenuSelectionsChanged, actualDayIndex1.toString(), visible1, null, cancelBubbleOnly)[0]);
    }
    if (processOtherDays) {
      dayEndIndex = _options.startOfWeekDay + 1;
      dayIndex = 1;
      for (; dayIndex < dayEndIndex; dayIndex++) {
        var actualDayIndex2 = dayIndex > 6 ? 0 : dayIndex;
        var visible2 = _options.weekendDays.indexOf(actualDayIndex2) > -1;
        checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_WeekendDays_Content, _options.dayNames[dayIndex - 1], sideMenuSelectionsChanged, actualDayIndex2.toString(), visible2, null, cancelBubbleOnly)[0]);
      }
    }
    if (_options.reverseOrderDaysOfWeek) {
      reverseElementsOrder(_element_SideMenu_Content_Section_WeekendDays_Content);
    }
  }
  function buildSideMenuWorkingDays(opened) {
    opened = isDefined(opened) ? opened : true;
    _element_SideMenu_Content_Section_WorkingDays = createElement("div", "content-section content-section-opened");
    _element_SideMenu_Content_Section_WorkingDays_Content = createElement("div", "checkbox-container");
    _element_SideMenu_Content.appendChild(_element_SideMenu_Content_Section_WorkingDays);
    var dayIndex = 0;
    var dayEndIndex = 7;
    var processOtherDays = false;
    var checkBoxes = [];
    buildSideMenuHeaderAndContentOpener(_element_SideMenu_Content_Section_WorkingDays, _element_SideMenu_Content_Section_WorkingDays_Content, _options.workingDaysText, opened, checkBoxes);
    _element_SideMenu_Content_Section_WorkingDays.appendChild(_element_SideMenu_Content_Section_WorkingDays_Content);
    if (_options.startOfWeekDay === _day.saturday || _options.startOfWeekDay === _day.sunday) {
      dayIndex = _options.startOfWeekDay;
      processOtherDays = true;
    }
    for (; dayIndex < dayEndIndex; dayIndex++) {
      var visible1 = _options.workingDays.indexOf(dayIndex) > -1;
      checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_WorkingDays_Content, _options.dayNames[dayIndex], sideMenuSelectionsChanged, dayIndex.toString(), visible1, null, cancelBubbleOnly)[0]);
    }
    if (processOtherDays) {
      dayEndIndex = _options.startOfWeekDay;
      dayIndex = 0;
      for (; dayIndex < dayEndIndex; dayIndex++) {
        var visible2 = _options.workingDays.indexOf(dayIndex) > -1;
        checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_WorkingDays_Content, _options.dayNames[dayIndex], sideMenuSelectionsChanged, dayIndex.toString(), visible2, null, cancelBubbleOnly)[0]);
      }
    }
    if (_options.reverseOrderDaysOfWeek) {
      reverseElementsOrder(_element_SideMenu_Content_Section_WorkingDays_Content);
    }
  }
  function buildSideMenuGroups(opened) {
    opened = isDefined(opened) ? opened : true;
    _element_SideMenu_Content_Section_Groups = null;
    _element_SideMenu_Content_Section_Groups_Content = null;
    var groups = getGroups();
    var groupsLength = groups.length;
    if (groupsLength > 0) {
      var checkBoxes = [];
      _element_SideMenu_Content_Section_Groups = createElement("div", "content-section content-section-opened");
      _element_SideMenu_Content_Section_Groups_Content = createElement("div", "checkbox-container");
      _element_SideMenu_Content.appendChild(_element_SideMenu_Content_Section_Groups);
      buildSideMenuHeaderAndContentOpener(_element_SideMenu_Content_Section_Groups, _element_SideMenu_Content_Section_Groups_Content, _options.groupsText, opened, checkBoxes);
      _element_SideMenu_Content_Section_Groups.appendChild(_element_SideMenu_Content_Section_Groups_Content);
      var groupIndex = 0;
      for (; groupIndex < groupsLength; groupIndex++) {
        var groupName = groups[groupIndex];
        var configGroupName = getGroupName(groupName);
        var visible = true;
        if (isDefined(_configuration.visibleGroups)) {
          visible = _configuration.visibleGroups.indexOf(configGroupName) > -1;
        }
        checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_Groups_Content, groupName, sideMenuSelectionsChanged, configGroupName, visible, null, cancelBubbleOnly)[0]);
      }
    }
  }
  function buildSideMenuEventTypes(opened) {
    opened = isDefined(opened) ? opened : true;
    _element_SideMenu_Content_Section_EventTypes = null;
    _element_SideMenu_Content_Section_EventTypes_Content = null;
    var sectionAndHeaderAdded = false;
    var checkBoxes = [];
    var eventType;
    for (eventType in _eventType) {
      if (_eventType.hasOwnProperty(eventType)) {
        if (!sectionAndHeaderAdded) {
          _element_SideMenu_Content_Section_EventTypes = createElement("div", "content-section content-section-opened");
          _element_SideMenu_Content.appendChild(_element_SideMenu_Content_Section_EventTypes);
          _element_SideMenu_Content_Section_EventTypes_Content = createElement("div", "checkbox-container");
          buildSideMenuHeaderAndContentOpener(_element_SideMenu_Content_Section_EventTypes, _element_SideMenu_Content_Section_EventTypes_Content, _options.eventTypesText, opened, checkBoxes);
          _element_SideMenu_Content_Section_EventTypes.appendChild(_element_SideMenu_Content_Section_EventTypes_Content);
          sectionAndHeaderAdded = true;
        }
        var visible = true;
        if (isDefined(_configuration.visibleEventTypes)) {
          visible = _configuration.visibleEventTypes.indexOf(parseInt(eventType)) > -1;
        }
        checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_EventTypes_Content, _eventType[eventType].text, sideMenuSelectionsChanged, eventType, visible, null, cancelBubbleOnly)[0]);
      }
    }
  }
  function buildSideMenuDays(opened) {
    opened = isDefined(opened) ? opened : true;
    _element_SideMenu_Content_Section_Days = createElement("div", "content-section content-section-opened");
    _element_SideMenu_Content_Section_Days_Content = createElement("div", "checkbox-container");
    _element_SideMenu_Content.appendChild(_element_SideMenu_Content_Section_Days);
    var dayIndex = 0;
    var dayEndIndex = 7;
    var processOtherDays = false;
    var checkBoxes = [];
    buildSideMenuHeaderAndContentOpener(_element_SideMenu_Content_Section_Days, _element_SideMenu_Content_Section_Days_Content, _options.sideMenuDaysText, opened, checkBoxes);
    _element_SideMenu_Content_Section_Days.appendChild(_element_SideMenu_Content_Section_Days_Content);
    if (_options.startOfWeekDay === _day.saturday || _options.startOfWeekDay === _day.sunday) {
      dayIndex = _options.startOfWeekDay;
      processOtherDays = true;
    }
    for (; dayIndex < dayEndIndex; dayIndex++) {
      var visible1 = _options.visibleDays.indexOf(dayIndex) > -1;
      checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_Days_Content, _options.dayNames[dayIndex], sideMenuSelectionsChanged, dayIndex.toString(), visible1, null, cancelBubbleOnly)[0]);
    }
    if (processOtherDays) {
      dayEndIndex = _options.startOfWeekDay;
      dayIndex = 0;
      for (; dayIndex < dayEndIndex; dayIndex++) {
        var visible2 = _options.visibleDays.indexOf(dayIndex) > -1;
        checkBoxes.push(buildCheckBox(_element_SideMenu_Content_Section_Days_Content, _options.dayNames[dayIndex], sideMenuSelectionsChanged, dayIndex.toString(), visible2, null, cancelBubbleOnly)[0]);
      }
    }
    if (_options.reverseOrderDaysOfWeek) {
      reverseElementsOrder(_element_SideMenu_Content_Section_Days_Content);
    }
  }
  function buildSideMenuHeaderAndContentOpener(mainContainer, mainContent, text, opened, checkBoxes) {
    var header = createElement("div", "text-header");
    mainContainer.appendChild(header);
    setNodeText(header, text + ":");
    var arrow = createElement("div", "ib-arrow-up-full");
    header.appendChild(arrow);
    var buttonDividerLine = createElement("div", "button-divider-line");
    header.appendChild(buttonDividerLine);
    var selectAll = buildToolbarButton(header, "ib-square", _options.selectAllText, function(e) {
      changeCheckboxesCheckedState(e, checkBoxes, true);
    });
    var selectNone = buildToolbarButton(header, "ib-square-hollow", _options.selectNoneText, function(e) {
      changeCheckboxesCheckedState(e, checkBoxes, false);
    });
    header.onclick = function() {
      var isClosed = mainContent.style.display === "none";
      header.className = isClosed ? "text-header" : "text-header-closed";
      mainContent.style.display = isClosed ? "block" : "none";
      arrow.className = isClosed ? "ib-arrow-up-full" : "ib-arrow-down-full";
      mainContainer.className = isClosed ? "content-section content-section-opened" : "content-section";
      buttonDividerLine.style.display = isClosed ? "block" : "none";
      selectAll.style.display = isClosed ? "block" : "none";
      selectNone.style.display = isClosed ? "block" : "none";
    };
    if (!opened) {
      mainContent.style.display = "none";
      header.className = "text-header-closed";
      arrow.className = "ib-arrow-down-full";
      mainContainer.className = "content-section";
      buttonDividerLine.style.display = "none";
      selectAll.style.display = "none";
      selectNone.style.display = "none";
    }
    return [selectAll, selectNone];
  }
  function changeCheckboxesCheckedState(e, checkBoxes, state) {
    cancelBubble(e);
    var checkBoxesLength = checkBoxes.length;
    var checkBoxStatesChanged = false;
    var checkBoxIndex = 0;
    for (; checkBoxIndex < checkBoxesLength; checkBoxIndex++) {
      if (checkBoxes[checkBoxIndex].checked !== state) {
        checkBoxes[checkBoxIndex].checked = state;
        checkBoxStatesChanged = true;
      }
    }
    _element_SideMenu_Changed = checkBoxStatesChanged;
  }
  function isSideMenuContentOpen(element, closed) {
    return closed && element === null ? false : element === null || element.style.display !== "none";
  }
  function sideMenuSelectionsChanged() {
    _element_SideMenu_Changed = true;
  }
  function setEventTypeInputCheckedStates(selectedEventType) {
    selectedEventType = isDefined(selectedEventType) && _eventType.hasOwnProperty(selectedEventType) ? selectedEventType : 0;
    var eventType;
    for (eventType in _eventType) {
      if (_eventType.hasOwnProperty(eventType) && isDefined(_eventType[eventType].eventEditorInput)) {
        _eventType[eventType].eventEditorInput.checked = false;
      }
    }
    if (isDefined(_eventType[selectedEventType].eventEditorInput)) {
      _eventType[selectedEventType].eventEditorInput.checked = true;
    }
  }
  function setEventTypeInputDisabledStates(disabled) {
    var eventType;
    for (eventType in _eventType) {
      if (_eventType.hasOwnProperty(eventType) && isDefined(_eventType[eventType].eventEditorInput)) {
        _eventType[eventType].eventEditorInput.disabled = disabled;
      }
    }
  }
  function getEventTypeInputChecked() {
    var result = 0;
    var eventType;
    for (eventType in _eventType) {
      if (_eventType.hasOwnProperty(eventType) && isDefined(_eventType[eventType].eventEditorInput) && _eventType[eventType].eventEditorInput.checked) {
        result = parseInt(eventType);
        break;
      }
    }
    return result;
  }
  function buildDatePickerMode(element) {
    _datePickerHiddenInput = element;
    setInputType(_datePickerHiddenInput, "hidden");
    _datePickerInput = createElement("input", "calendar-date-picker-input");
    _datePickerInput.readOnly = true;
    _datePickerInput.placeholder = _options.selectDatePlaceholderText;
    _datePickerModeEnabled = true;
    var parent = element.parentNode;
    parent.removeChild(element);
    var container = createElement("div", "calendar-date-picker");
    parent.appendChild(container);
    container.appendChild(_datePickerHiddenInput);
    container.appendChild(_datePickerInput);
    _element_Calendar = createElement("div", "calendar calendar-hidden");
    _element_Calendar.id = _elementID;
    container.appendChild(_element_Calendar);
    _datePickerInput.onclick = toggleDatePickerModeVisible;
    _datePickerInput.onkeydown = onDatePickerInputKeyDown;
    _document.addEventListener("click", hideDatePickerMode);
    resetOptionsForDatePickerMode();
    getDataPickerInputValueDate();
  }
  function resetOptionsForDatePickerMode() {
    if (_datePickerModeEnabled) {
      _options.exportEventsEnabled = false;
      _options.manualEditingEnabled = false;
      _options.fullScreenModeEnabled = false;
      _options.eventNotificationsEnabled = false;
      _options.showPreviousNextMonthNamesInMainDisplay = false;
      _options.showPreviousNextMonthNamesInMainDisplay = false;
      _options.showExtraToolbarButtons = false;
      _options.holidays = [];
    }
  }
  function toggleDatePickerModeVisible(e) {
    cancelBubble(e);
    closeAnyOtherDatePickers();
    if (!_datePickerVisible) {
      _element_Calendar.className = "calendar calendar-shown";
      build(new Date(_currentDateForDatePicker), !_initialized);
      triggerOptionsEventWithData("onDatePickerOpened", _elementID);
    } else {
      _element_Calendar.className = "calendar calendar-hidden";
      hideAllDropDowns();
      triggerOptionsEventWithData("onDatePickerClosed", _elementID);
    }
    _datePickerVisible = !_datePickerVisible;
  }
  function onDatePickerInputKeyDown(e) {
    if (e.keyCode === _keyCodes.escape && _datePickerVisible) {
      hideDatePickerMode();
    }
  }
  function hideDatePickerMode() {
    if (_datePickerVisible) {
      _element_Calendar.className = "calendar calendar-hidden";
      _datePickerVisible = false;
      hideAllDropDowns();
      triggerOptionsEventWithData("onDatePickerClosed", _elementID);
    }
  }
  function setDatePickerDate(e, date) {
    cancelBubble(e);
    if (!isYearSelectorDropDownVisible()) {
      var newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      hideDatePickerMode();
      updateDatePickerInputValueDisplay(date);
      triggerOptionsEventWithData("onDatePickerDateChanged", newDate);
      _currentDateForDatePicker = newDate;
    } else {
      hideAllDropDowns();
    }
  }
  function updateDatePickerInputValueDisplay(date) {
    _datePickerInput.value = getCustomFormattedDateText(_options.datePickerSelectedDateFormat, date);
    _datePickerHiddenInput.value = padNumber(date.getDate()) + "/" + padNumber(date.getMonth()) + "/" + date.getFullYear();
  }
  function closeAnyOtherDatePickers() {
    var elements = _document.getElementsByClassName("calendar calendar-shown");
    var elementsArray = [].slice.call(elements);
    var elementsArrayLength = elementsArray.length;
    var elementsArrayIndex = 0;
    for (; elementsArrayIndex < elementsArrayLength; elementsArrayIndex++) {
      var element = elementsArray[elementsArrayIndex];
      if (element.id !== _elementID) {
        element.className = "calendar calendar-hidden";
      }
    }
  }
  function getDataPickerInputValueDate() {
    var values = _datePickerHiddenInput.value.split("/");
    var valuesDate = null;
    if (values.length === 3) {
      var newDateFromValues = new Date(parseInt(values[2]), parseInt(values[1]) - 1, parseInt(values[0]));
      if (newDateFromValues instanceof Date && !isNaN(newDateFromValues)) {
        valuesDate = newDateFromValues;
      }
    }
    if (valuesDate === null) {
      valuesDate = new Date();
    } else {
      updateDatePickerInputValueDisplay(valuesDate);
    }
    valuesDate.setHours(0, 0, 0, 0);
    _currentDateForDatePicker = valuesDate;
  }
  function isDateValidForDatePicker(newDate) {
    var newDateAllowed = true;
    if (_options.minimumDatePickerDate !== null) {
      newDateAllowed = isDateSmallerOrEqualToDate(_options.minimumDatePickerDate, newDate);
    }
    if (newDateAllowed && _options.maximumDatePickerDate !== null) {
      newDateAllowed = isDateSmallerOrEqualToDate(newDate, _options.maximumDatePickerDate);
    }
    return newDateAllowed;
  }
  function buildYearSelectorDropDownButton(titleContainer) {
    _element_HeaderDateDisplay_YearSelector_DropDown = createElement("span", "year-dropdown-button");
    _element_HeaderDateDisplay_YearSelector_DropDown.ondblclick = cancelBubble;
    _element_HeaderDateDisplay_YearSelector_DropDown.onclick = showYearSelectorDropDownMenu;
    titleContainer.appendChild(_element_HeaderDateDisplay_YearSelector_DropDown);
    _element_HeaderDateDisplay_YearSelector_DropDown_Text = createElement("span");
    _element_HeaderDateDisplay_YearSelector_DropDown.appendChild(_element_HeaderDateDisplay_YearSelector_DropDown_Text);
    _element_HeaderDateDisplay_YearSelector_DropDown_Arrow = createElement("span", "ib-arrow-down-full-medium");
    _element_HeaderDateDisplay_YearSelector_DropDown.appendChild(_element_HeaderDateDisplay_YearSelector_DropDown_Arrow);
  }
  function buildYearSelectorDropDown(container) {
    var yearDate = new Date(_options.minimumYear, 1, 1);
    var monthContainer = null;
    _element_HeaderDateDisplay_YearSelector = createElement("div", _options.showMonthButtonsInYearDropDownMenu ? "years-drop-down" : "years-drop-down-no-months");
    container.appendChild(_element_HeaderDateDisplay_YearSelector);
    if (_options.showMonthButtonsInYearDropDownMenu) {
      var monthIndex = 0;
      for (; monthIndex < 12; monthIndex++) {
        if (monthIndex % 3 === 0) {
          monthContainer = createElement("div", "months");
          _element_HeaderDateDisplay_YearSelector.appendChild(monthContainer);
        }
        buildMonthNameButton(monthContainer, monthIndex);
      }
    }
    _element_HeaderDateDisplay_YearSelector_Contents = createElement("div", "contents custom-scroll-bars");
    _element_HeaderDateDisplay_YearSelector.appendChild(_element_HeaderDateDisplay_YearSelector_Contents);
    for (; true;) {
      buildYearSelectorDropDownYear(yearDate.getFullYear());
      moveDateForwardYear(yearDate);
      if (yearDate.getFullYear() > _options.maximumYear) {
        break;
      }
    }
  }
  function buildMonthNameButton(container, monthNumber) {
    var button = createElement("div", "month-name");
    var buttonText = _options.monthNamesAbbreviated[monthNumber];
    button.onclick = function(e) {
      cancelBubble(e);
      if (_currentDate.getMonth() !== monthNumber) {
        _currentDate.setMonth(monthNumber);
        build(_currentDate);
        hideYearSelectorDropDown();
      }
    };
    setNodeText(button, buttonText);
    container.appendChild(button);
    _element_HeaderDateDisplay_YearSelector_Contents_Months[monthNumber.toString()] = button;
  }
  function buildYearSelectorDropDownYear(actualYear) {
    var year = createElement("div");
    year.className = "year";
    year.innerText = actualYear.toString();
    year.id = _elementID_YearSelected + actualYear.toString();
    _element_HeaderDateDisplay_YearSelector_Contents.appendChild(year);
    year.ondblclick = cancelBubble;
    year.onclick = function(e) {
      cancelBubble(e);
      if (_currentDate.getFullYear() !== actualYear) {
        _currentDate.setFullYear(actualYear);
        build(_currentDate);
        hideYearSelectorDropDown();
      }
    };
  }
  function setYearDropDownSelectorButtonText() {
    _element_HeaderDateDisplay_YearSelector_DropDown_Text.innerText = getCustomFormattedDateText(_options.monthTitleBarDateFormat, _currentDate);
  }
  function showYearSelectorDropDownMenu(e) {
    cancelBubble(e);
    if (_element_HeaderDateDisplay_YearSelector.style.display !== "block") {
      hideAllDropDowns();
      _element_HeaderDateDisplay_YearSelector.style.display = "block";
      _element_HeaderDateDisplay_YearSelector_DropDown_Arrow.className = "ib-arrow-up-full-medium";
      updateYearSelectorMonthSelected();
      var year = updateYearSelectorDropDownMenuColors();
      if (year !== null) {
        _element_HeaderDateDisplay_YearSelector_Contents.scrollTop = year.offsetTop - _element_HeaderDateDisplay_YearSelector_Contents.offsetTop - _options.spacing;
      } else {
        _element_HeaderDateDisplay_YearSelector_Contents.scrollTop = 0;
      }
    } else {
      hideYearSelectorDropDown();
    }
  }
  function updateYearSelectorMonthSelected() {
    var monthNumber;
    for (monthNumber in _element_HeaderDateDisplay_YearSelector_Contents_Months) {
      if (_element_HeaderDateDisplay_YearSelector_Contents_Months.hasOwnProperty(monthNumber.toString())) {
        _element_HeaderDateDisplay_YearSelector_Contents_Months[monthNumber.toString()].className = "month-name";
      }
    }
    var monthNumberSelected = _currentDate.getMonth().toString();
    var today = new Date();
    if (_currentDate.getFullYear() === today.getFullYear()) {
      var currentMonthNumber = today.getMonth().toString();
      if (_element_HeaderDateDisplay_YearSelector_Contents_Months.hasOwnProperty(currentMonthNumber)) {
        _element_HeaderDateDisplay_YearSelector_Contents_Months[currentMonthNumber].className = "month-name-current-month";
      }
    }
    if (_element_HeaderDateDisplay_YearSelector_Contents_Months.hasOwnProperty(monthNumberSelected)) {
      _element_HeaderDateDisplay_YearSelector_Contents_Months[monthNumberSelected].className = "month-name-selected";
    }
  }
  function updateYearSelectorDropDownMenuColors() {
    var yearSelected = _element_HeaderDateDisplay_YearSelector.getElementsByClassName("year");
    var yearSelectedLength = yearSelected.length;
    if (yearSelectedLength >= 1) {
      var yearsSelectedIndex = 0;
      for (; yearsSelectedIndex < yearSelectedLength; yearsSelectedIndex++) {
        if (yearSelected[yearsSelectedIndex].className !== "year") {
          yearSelected[yearsSelectedIndex].className = "year";
        }
      }
    }
    var year = getElementByID(_elementID_YearSelected + _currentDate.getFullYear());
    if (year !== null) {
      year.className += " year-selected";
    }
    if (!_datePickerModeEnabled) {
      var yearsHandledForEvents = [];
      getAllEventsFunc(function(eventDetails) {
        var fromYear = eventDetails.from.getFullYear();
        if (yearsHandledForEvents.indexOf(fromYear) === -1) {
          var yearEvents = getElementByID(_elementID_YearSelected + fromYear);
          if (yearEvents !== null && yearEvents.className.indexOf(" year-selected") === -1) {
            yearEvents.className += " year-has-events";
          }
          yearsHandledForEvents.push(fromYear);
        }
      });
    }
    return year;
  }
  function hideYearSelectorDropDown() {
    var closed = false;
    if (isYearSelectorDropDownVisible()) {
      _element_HeaderDateDisplay_YearSelector_DropDown_Arrow.className = "ib-arrow-down-full-medium";
      _element_HeaderDateDisplay_YearSelector.style.display = "none";
      closed = true;
    }
    return closed;
  }
  function isYearSelectorDropDownVisible() {
    return _element_HeaderDateDisplay_YearSelector !== null && _element_HeaderDateDisplay_YearSelector.style.display === "block";
  }
  function buildDocumentEvents() {
    if (!_initializedDocumentEvents) {
      handleDocumentEvents();
      _initializedDocumentEvents = true;
    }
  }
  function removeDocumentEvents() {
    if (_initializedDocumentEvents) {
      handleDocumentEvents(false);
    }
  }
  function handleDocumentEvents(addEvents) {
    addEvents = isDefined(addEvents) ? addEvents : true;
    var documentBodyFunc = addEvents ? _document.body.addEventListener : _document.body.removeEventListener;
    var documentFunc = addEvents ? _document.addEventListener : _document.removeEventListener;
    var windowFunc = addEvents ? _window.addEventListener : _window.removeEventListener;
    documentBodyFunc("click", onDocumentClick);
    documentBodyFunc("contextmenu", onEventHideAllDropDowns);
    documentBodyFunc("mousemove", onMoveDocumentMouseMove);
    documentBodyFunc("mouseleave", onMoveDocumentMouseLeave);
    documentFunc("scroll", onEventHideAllDropDowns);
    windowFunc("resize", onEventHideAllDropDowns);
    windowFunc("resize", centerSearchDialog);
    windowFunc("resize", onWindowResizeRefreshViews);
    windowFunc("blur", onWindowFocusOut);
    if (_options.shortcutKeysEnabled) {
      documentFunc("keydown", onWindowKeyDown);
    }
  }
  function onDocumentClick(e) {
    hideAllDropDowns();
    if (!isControlKey(e)) {
      clearSelectedEvents();
    }
  }
  function onWindowFocusOut() {
    hideAllDropDowns();
    hideTooltip();
    if (_datePickerModeEnabled) {
      hideDatePickerMode();
    }
  }
  function onWindowResizeRefreshViews() {
    stopAndResetTimer(_timerName.windowResize);
    startTimer(_timerName.windowResize, function() {
      refreshViews(true, false);
    }, 50, false);
  }
  function onEventHideAllDropDowns() {
    hideAllDropDowns();
  }
  function hideAllDropDowns(hideSearchHistoryDropDown) {
    var itemClosed = false;
    hideSearchHistoryDropDown = isDefined(hideSearchHistoryDropDown) ? hideSearchHistoryDropDown : true;
    if (hideDropDownMenu(_element_DropDownMenu_Day)) {
      itemClosed = true;
    }
    if (hideDropDownMenu(_element_DropDownMenu_Event)) {
      itemClosed = true;
    }
    if (hideDropDownMenu(_element_DropDownMenu_FullDay)) {
      itemClosed = true;
    }
    if (hideDropDownMenu(_element_DropDownMenu_HeaderDay)) {
      itemClosed = true;
    }
    if (hideYearSelectorDropDown()) {
      itemClosed = true;
    }
    hideTooltip();
    if (hideSearchHistoryDropDown) {
      hideSearchHistoryDropDownMenu();
    }
    return itemClosed;
  }
  function onWindowKeyDown(e) {
    if (!_datePickerModeEnabled) {
      if (!isSideMenuOpen()) {
        if (_isFullScreenModeActivated) {
          var isMainDisplayVisible = isOnlyMainDisplayVisible();
          if (isControlKey(e) && e.keyCode === _keyCodes.left && isMainDisplayVisible) {
            e.preventDefault();
            moveBackYear();
          } else if (isControlKey(e) && e.keyCode === _keyCodes.right && isMainDisplayVisible) {
            e.preventDefault();
            moveForwardYear();
          } else if (e.keyCode === _keyCodes.escape) {
            if (!closeActiveDialog() && isMainDisplayVisible && _options.useEscapeKeyToExitFullScreenMode) {
              headerDoubleClick();
            }
          } else if (e.keyCode === _keyCodes.left && isMainDisplayVisible) {
            moveBackMonth();
          } else if (e.keyCode === _keyCodes.right && isMainDisplayVisible) {
            moveForwardMonth();
          } else if (e.keyCode === _keyCodes.down && isMainDisplayVisible) {
            moveToday();
          } else if (e.keyCode === _keyCodes.f5 && isMainDisplayVisible) {
            refreshViews(false, true);
          }
        } else {
          if (e.keyCode === _keyCodes.escape) {
            closeActiveDialog();
          }
        }
        if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.a) {
          e.preventDefault();
          if (_options.manualEditingEnabled) {
            showEventEditingDialog(null, new Date());
          }
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.c) {
          e.preventDefault();
          setCopiedEventsFromKeyDown();
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.e) {
          e.preventDefault();
          if (_options.exportEventsEnabled) {
            showExportDialogFromWindowKeyDown();
          }
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.g) {
          e.preventDefault();
          if (_options.configurationDialogEnabled) {
            showConfigurationDialog();
          }
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.f) {
          e.preventDefault();
          if (_optionsForSearch.enabled && (_element_FullDayView_EventsShown.length > 0 || _element_Calendar_AllVisibleEvents.length > 0 || _element_ListAllEventsView_EventsShown.length > 0 || _element_ListAllWeekEventsView_EventsShown.length > 0)) {
            showSearchDialog();
          }
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.m) {
          e.preventDefault();
          callMinimizeRestoreFunctionsForAllEventView();
          callMinimizeRestoreFunctionsForWeekEventView();
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.o) {
          e.preventDefault();
          if (isSideMenuAvailable()) {
            showSideMenu();
          }
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.v) {
          e.preventDefault();
          pasteCopiedEventsFromKeyDown();
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.x) {
          e.preventDefault();
          setCopiedEventsFromKeyDown(true);
        } else if (isControlKey(e) && isShiftKey(e) && e.keyCode === _keyCodes.f11) {
          e.preventDefault();
          headerDoubleClick();
        }
      } else {
        if (e.keyCode === _keyCodes.escape && isSideMenuOpen()) {
          hideSideMenu();
        }
      }
    } else {
      if (_datePickerVisible) {
        if (isControlKey(e) && e.keyCode === _keyCodes.left) {
          e.preventDefault();
          moveBackYear();
        } else if (isControlKey(e) && e.keyCode === _keyCodes.right) {
          e.preventDefault();
          moveForwardYear();
        } else if (e.keyCode === _keyCodes.left) {
          moveBackMonth();
        } else if (e.keyCode === _keyCodes.right) {
          moveForwardMonth();
        } else if (e.keyCode === _keyCodes.down) {
          moveToday();
        }
      }
    }
  }
  function isShiftKey(e) {
    return e.shiftKey;
  }
  function isControlKey(e) {
    return e.ctrlKey || e.metaKey;
  }
  function closeActiveDialog() {
    var done = hideAllDropDowns(false);
    if (!done) {
      done = hideSearchHistoryDropDownMenu();
    }
    if (!done && _openDialogs.length > 0) {
      var lastFunc = _openDialogs[_openDialogs.length - 1];
      if (isFunction(lastFunc)) {
        _openDialogs.pop();
        lastFunc(false);
      }
      done = true;
    }
    if (!done) {
      done = hideSearchDialog();
    }
    if (!done) {
      done = clearSelectedEvents();
    }
    if (!done && _copiedEventDetails.length > 0) {
      setCopiedEventsClasses();
      _copiedEventDetails = [];
      _copiedEventDetails_Cut = false;
      done = true;
    }
    if (!done && (isOverlayVisible(_element_FullDayView) || isOverlayVisible(_element_ListAllEventsView) || isOverlayVisible(_element_ListAllWeekEventsView))) {
      hideOverlay(_element_FullDayView);
      hideOverlay(_element_ListAllEventsView);
      hideOverlay(_element_ListAllWeekEventsView);
      _element_FullDayView_EventsShown = [];
      _element_FullDayView_EventsShown_Sizes = [];
      _element_ListAllEventsView_EventsShown = [];
      _element_ListAllWeekEventsView_EventsShown = [];
      stopFullDayEventSizeTracking();
      done = true;
    }
    return done;
  }
  function doDatesMatch(date1, date2) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  }
  function doDatesMatchMonthAndYear(date1, date2) {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  }
  function isDateSmallerOrEqualToDate(date1, date2) {
    var newDate1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    newDate1.setHours(0, 0, 0, 0);
    var newDate2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    newDate2.setHours(0, 0, 0, 0);
    return newDate1 <= newDate2;
  }
  function isDateToday(date) {
    var today = new Date();
    return date !== null && date.getDate() === today.getDate() && date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  }
  function isDateTodaysMonthAndYear(date) {
    var today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  }
  function toStorageFormattedDate(date) {
    var day = ("0" + date.getDate()).slice(-2);
    var month = ("0" + date.getMonth()).slice(-2);
    var formatted = day + "/" + month + "/" + date.getFullYear();
    return formatted;
  }
  function toFormattedTime(date) {
    return padNumber(date.getHours()) + ":" + padNumber(date.getMinutes());
  }
  function getWeekdayNumber(date) {
    return date.getDay() - 1 < 0 ? 6 : date.getDay() - 1;
  }
  function getWeekStartEndDates(date) {
    date = isDefined(date) ? date : new Date();
    var day = date.getDay() === 0 ? 7 : date.getDay();
    var firstDayNumber = date.getDate() - day + 1;
    var lastDayNumber = firstDayNumber + 6;
    var weekStartDate = new Date(date);
    var weekEndDate = new Date(date);
    weekStartDate.setDate(firstDayNumber);
    weekStartDate.setHours(0, 0, 0, 0);
    weekEndDate.setDate(lastDayNumber);
    weekEndDate.setHours(23, 59, 59, 99);
    if (_options.startOfWeekDay === _day.saturday || _options.startOfWeekDay === _day.sunday) {
      weekStartDate.setDate(weekStartDate.getDate() - (7 - _options.startOfWeekDay));
      weekEndDate.setDate(weekEndDate.getDate() - (7 - _options.startOfWeekDay));
    }
    return [weekStartDate, weekEndDate];
  }
  function getTotalDaysInMonth(year, month) {
    return (new Date(year, month + 1, 0)).getDate();
  }
  function getDayOrdinal(value) {
    var result = _options.thText;
    if (value === 31 || value === 21 || value === 1) {
      result = _options.stText;
    } else if (value === 22 || value === 2) {
      result = _options.ndText;
    } else if (value === 23 || value === 3) {
      result = _options.rdText;
    }
    return result;
  }
  function getMinutesIntoDay(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return hours * 60 + minutes;
  }
  function getTotalDaysBetweenDates(from, to) {
    var fromDate = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    var toDate = new Date(to.getFullYear(), to.getMonth(), to.getDate());
    var differenceTime = Math.abs(toDate - fromDate);
    var differenceDays = Math.ceil(differenceTime / (1000 * 60 * 60 * 24));
    return differenceDays;
  }
  function getWeekNumber(date) {
    var firstDay = new Date(date.getFullYear(), 0, 1);
    var weekNumber = Math.ceil(((date - firstDay) / 86400000 + firstDay.getDay() + 1) / 7);
    if (firstDay.getDay() > 4) {
      weekNumber--;
    }
    return weekNumber;
  }
  function isWeekendDay(date) {
    return _options.weekendDays.indexOf(date.getDay()) >= 0;
  }
  function isWorkingDay(date) {
    return _options.workingDays.indexOf(getWeekdayNumber(date)) >= 0;
  }
  function moveDateBackOneDay(date) {
    date.setDate(date.getDate() - 1);
  }
  function moveDateBackOneWeek(date) {
    date.setDate(date.getDate() - 7);
  }
  function moveDateForwardDay(date, dayCount) {
    dayCount = isDefinedNumber(dayCount) ? dayCount : 1;
    date.setDate(date.getDate() + dayCount);
  }
  function moveDateForwardWeek(date, weekCount) {
    weekCount = isDefinedNumber(weekCount) ? weekCount : 1;
    date.setDate(date.getDate() + weekCount * 7);
  }
  function moveDateForwardMonth(date, monthCount) {
    monthCount = isDefinedNumber(monthCount) ? monthCount : 1;
    date.setMonth(date.getMonth() + monthCount);
  }
  function moveDateForwardYear(date, yearCount) {
    yearCount = isDefinedNumber(yearCount) ? yearCount : 1;
    date.setFullYear(date.getFullYear() + yearCount);
  }
  function getFriendlyTimeBetweenTwoDate(date1, date2) {
    var text = [];
    var delta = Math.abs(date2 - date1) / 1000;
    var days = Math.floor(delta / 86400);
    delta = delta - days * 86400;
    if (days > 0) {
      text.push(days.toString() + _string.space + (days === 1 ? _options.dayText : _options.daysText));
    }
    var hours = Math.floor(delta / 3600) % 24;
    delta = delta - hours * 3600;
    if (hours > 0) {
      text.push(hours.toString() + _string.space + (hours === 1 ? _options.hourText : _options.hoursText));
    }
    var minutes = Math.floor(delta / 60) % 60;
    if (minutes > 0) {
      text.push(minutes.toString() + _string.space + (minutes === 1 ? _options.minuteText : _options.minutesText));
    }
    return text.join(", ");
  }
  function setSelectedDate(date, input) {
    if (isDefined(date)) {
      var day = ("0" + date.getDate()).slice(-2);
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      if (input.type === "date") {
        input.value = date.getFullYear() + "-" + month + "-" + day;
      } else {
        input.value = day + "/" + month + "/" + date.getFullYear();
      }
    }
  }
  function getSelectedDate(input, defaultValue) {
    var result = isDefinedOnly(defaultValue) ? defaultValue : new Date();
    if (input.value !== _string.empty) {
      if (input.type === "date") {
        result = new Date(input.value + "T00:00:00Z");
      } else {
        var match = input.value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (match) {
          var newDate = new Date(match[3], match[2] - 1, match[1], 0, 0, 0, 0);
          if (newDate instanceof Date && !isNaN(newDate)) {
            result = newDate;
          }
        }
      }
    }
    if (isDefined(result)) {
      result = new Date(result.getTime() + Math.abs(result.getTimezoneOffset() * 60000));
    }
    return result;
  }
  function setMinimumDate(input, date) {
    if (input.type === "date") {
      var day = ("0" + date.getDate()).slice(-2);
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      input.setAttribute("min", date.getFullYear() + "-" + month + "-" + day);
    }
  }
  function setTimeOnDate(date, timeData) {
    var hours = 0;
    var minutes = 0;
    var splitData = timeData.split(":");
    if (splitData.length === 2) {
      var newHours = parseInt(splitData[0]);
      var newMinutes = parseInt(splitData[1]);
      if (!isNaN(newHours) && newHours.toString().length <= 2) {
        hours = newHours;
      }
      if (!isNaN(newMinutes) && newMinutes.toString().length <= 2) {
        minutes = newMinutes;
      }
    }
    date.setHours(hours);
    date.setMinutes(minutes);
  }
  function getHoursAndMinutesFromMinutes(totalMinutes) {
    var hours = totalMinutes / 60;
    var remainingHours = Math.floor(hours);
    var remainingMinutes = Math.round((hours - remainingHours) * 60);
    return [remainingHours, remainingMinutes];
  }
  function addMinutesToDate(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
  function getCustomFormattedDateText(dateFormat, date) {
    var result = dateFormat;
    var weekDayNumber = getWeekdayNumber(date);
    result = result.replace("{dddd}", _options.dayNames[weekDayNumber]);
    result = result.replace("{ddd}", _options.dayNamesAbbreviated[weekDayNumber]);
    result = result.replace("{dd}", padNumber(date.getDate()));
    result = result.replace("{d}", date.getDate());
    result = result.replace("{o}", getDayOrdinal(date.getDate()));
    result = result.replace("{mmmm}", _options.monthNames[date.getMonth()]);
    result = result.replace("{mmm}", _options.monthNamesAbbreviated[date.getMonth()]);
    result = result.replace("{mm}", padNumber(date.getMonth() + 1));
    result = result.replace("{m}", date.getMonth() + 1);
    result = result.replace("{yyyy}", date.getFullYear());
    result = result.replace("{yyy}", date.getFullYear().toString().substring(1));
    result = result.replace("{yy}", date.getFullYear().toString().substring(2));
    result = result.replace("{y}", parseInt(date.getFullYear().toString().substring(2)).toString());
    return result;
  }
  function getStartOfWeekDayNumber(dayNumber) {
    if (_options.startOfWeekDay === _day.saturday || _options.startOfWeekDay === _day.sunday) {
      dayNumber = dayNumber + (7 - _options.startOfWeekDay);
    }
    return dayNumber;
  }
  function buildDayEvents() {
    clearEventsFromDays();
    clearAutoRefreshTimer();
    _isCalendarBusy = false;
    _element_Calendar_AllVisibleEvents = [];
    var orderedEvents = getOrderedEvents(getAllEvents());
    var orderedEventsLength = orderedEvents.length;
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventsLength; orderedEventIndex++) {
      var orderedEvent = orderedEvents[orderedEventIndex];
      buildDayEventAcrossDays(orderedEvent);
      if (isEventVisible(orderedEvent)) {
        _element_Calendar_AllVisibleEvents.push(orderedEvent);
      }
      var repeatEvery = getNumber(orderedEvent.repeatEvery);
      if (repeatEvery > _repeatType.never) {
        if (repeatEvery === _repeatType.everyDay) {
          buildRepeatedDayEvents(orderedEvent, moveDateForwardDay, 1);
        } else if (repeatEvery === _repeatType.everyWeek) {
          buildRepeatedDayEvents(orderedEvent, moveDateForwardWeek, 1);
        } else if (repeatEvery === _repeatType.every2Weeks) {
          buildRepeatedDayEvents(orderedEvent, moveDateForwardWeek, 2);
        } else if (repeatEvery === _repeatType.everyMonth) {
          buildRepeatedDayEvents(orderedEvent, moveDateForwardMonth, 1);
        } else if (repeatEvery === _repeatType.everyYear) {
          buildRepeatedDayEvents(orderedEvent, moveDateForwardYear, 1);
        } else if (repeatEvery === _repeatType.custom) {
          var repeatEveryCustomType = getNumber(orderedEvent.repeatEveryCustomType);
          var repeatEveryCustomValue = getNumber(orderedEvent.repeatEveryCustomValue);
          if (repeatEveryCustomValue > 0) {
            if (repeatEveryCustomType === _repeatCustomType.daily) {
              buildRepeatedDayEvents(orderedEvent, moveDateForwardDay, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.weekly) {
              buildRepeatedDayEvents(orderedEvent, moveDateForwardWeek, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.monthly) {
              buildRepeatedDayEvents(orderedEvent, moveDateForwardMonth, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.yearly) {
              buildRepeatedDayEvents(orderedEvent, moveDateForwardYear, repeatEveryCustomValue);
            }
          }
        }
      }
    }
    updateCalendarsLastBusyState();
    updateMainHeaderButtonsVisibleStates(_element_Calendar_AllVisibleEvents.length);
    startAutoRefreshTimer();
  }
  function buildRepeatedDayEvents(orderedEvent, dateFunc, dateFuncForwardValue) {
    var newFromDate = new Date(orderedEvent.from);
    var excludeDays = getArray(orderedEvent.repeatEveryExcludeDays);
    for (; newFromDate < _largestDateInView;) {
      dateFunc(newFromDate, dateFuncForwardValue);
      var repeatEnded = !(!isDefined(orderedEvent.repeatEnds) || isDateSmallerOrEqualToDate(newFromDate, orderedEvent.repeatEnds));
      if (excludeDays.indexOf(newFromDate.getDay()) === -1 && !repeatEnded) {
        var repeatDayElement = getDayElement(newFromDate);
        if (repeatDayElement !== null) {
          buildDayEvent(newFromDate, orderedEvent);
        }
      }
    }
  }
  function buildDayEventAcrossDays(orderedEvent) {
    buildDayEvent(orderedEvent.from, orderedEvent);
    if (orderedEvent.from.getDate() !== orderedEvent.to.getDate() || orderedEvent.from.getMonth() !== orderedEvent.to.getMonth() || orderedEvent.from.getFullYear() !== orderedEvent.to.getFullYear()) {
      var totalDays = getTotalDaysBetweenDates(orderedEvent.from, orderedEvent.to);
      if (totalDays > 0) {
        var nextDayDate = new Date(orderedEvent.from);
        var dayIndex = 0;
        for (; dayIndex < totalDays; dayIndex++) {
          moveDateForwardDay(nextDayDate);
          var elementNextDay = getDayElement(nextDayDate);
          if (elementNextDay !== null) {
            buildDayEvent(nextDayDate, orderedEvent);
          }
        }
      }
    }
  }
  function buildDayEvent(dayDate, eventDetails) {
    var elementDay = getDayElement(dayDate);
    var seriesIgnoreDates = getArray(eventDetails.seriesIgnoreDates);
    var formattedDayDate = toStorageFormattedDate(dayDate);
    if (elementDay !== null && isEventVisible(eventDetails) && seriesIgnoreDates.indexOf(formattedDayDate) === -1) {
      checkEventForBrowserNotifications(dayDate, eventDetails);
      if (!_datePickerModeEnabled) {
        var events = elementDay.getElementsByClassName("event");
        if (events.length < _options.maximumEventsPerDayDisplay || _options.maximumEventsPerDayDisplay <= 0 || _options.useOnlyDotEventsForMainDisplay) {
          var event = createElement("div", "event");
          var eventTitle = eventDetails.title;
          event.setAttribute("event-type", getNumber(eventDetails.type));
          event.setAttribute("event-id", eventDetails.id);
          if (_options.showTimesInMainCalendarEvents && !eventDetails.isAllDay && eventDetails.from.getDate() === eventDetails.to.getDate()) {
            eventTitle = getTimeToTimeDisplay(eventDetails.from, eventDetails.to) + ": " + eventTitle;
          }
          if (!_options.useOnlyDotEventsForMainDisplay) {
            var repeatEvery = getNumber(eventDetails.repeatEvery);
            if (repeatEvery > _repeatType.never) {
              var icon = createElement("div", "ib-refresh-small ib-no-hover ib-no-active");
              icon.style.borderColor = event.style.color;
              event.appendChild(icon);
            }
            event.innerHTML += stripHTMLTagsFromText(eventTitle);
          } else {
            event.className += " event-circle";
          }
          elementDay.appendChild(event);
          makeEventDraggable(event, eventDetails, dayDate, elementDay);
          setEventClassesAndColors(event, eventDetails, getToTimeWithPassedDate(eventDetails, dayDate), _options.applyCssToEventsNotInCurrentMonth);
          setEventClassesForActions(event, eventDetails);
          if (doDatesMatch(eventDetails.from, dayDate)) {
            event.id = _elementID_Day + eventDetails.id;
          }
          event.onmousemove = function(e) {
            if (_element_Tooltip_EventDetails !== null && _element_Tooltip_EventDetails.id === eventDetails.id) {
              cancelBubble(e);
            } else {
              showTooltip(e, eventDetails);
            }
          };
          event.oncontextmenu = function(e) {
            showEventDropDownMenu(e, eventDetails, formattedDayDate);
          };
          event.addEventListener("click", function(e) {
            storeMultiSelectEvent(e, eventDetails);
          });
          if (isOptionEventSet("onEventClick")) {
            event.addEventListener("click", function() {
              triggerOptionsEventWithData("onEventClick", eventDetails);
            });
          }
          if (_options.manualEditingEnabled) {
            event.ondblclick = function(e) {
              cancelBubble(e);
              showEventEditingDialog(eventDetails);
            };
          } else {
            if (isOptionEventSet("onEventDoubleClick")) {
              event.ondblclick = function() {
                triggerOptionsEventWithData("onEventDoubleClick", eventDetails);
              };
            }
          }
        } else {
          buildDayEventPlusText(elementDay, dayDate);
        }
      }
    }
  }
  function buildDayEventPlusText(elementDay, dayDate) {
    var plusXEvents = elementDay.getElementsByClassName("plus-x-events");
    var plusXEventsText = plusXEvents.length > 0 ? plusXEvents[0] : null;
    if (plusXEventsText === null) {
      var showFullDayDay = new Date(dayDate);
      plusXEventsText = createElement("div", "plus-x-events");
      plusXEventsText.setAttribute("events", "1");
      plusXEventsText.ondblclick = cancelBubble;
      elementDay.appendChild(plusXEventsText);
      if (_options.applyCssToEventsNotInCurrentMonth && dayDate.getMonth() !== _currentDate.getMonth() || dayDate.getFullYear() !== _currentDate.getFullYear()) {
        plusXEventsText.className += " day-muted";
      }
      setNodeText(plusXEventsText, "+1 " + _options.moreText);
      plusXEventsText.onclick = function() {
        showFullDayView(showFullDayDay, true);
      };
    } else {
      var numberOfEvents = parseInt(plusXEventsText.getAttribute("events")) + 1;
      plusXEventsText.setAttribute("events", numberOfEvents.toString());
      setNodeText(plusXEventsText, "+" + numberOfEvents + _string.space + _options.moreText);
    }
  }
  function updateMainHeaderButtonsVisibleStates(orderedEventsLength) {
    if (_options.exportEventsEnabled) {
      updateToolbarButtonVisibleState(_element_HeaderDateDisplay_ExportEventsButton, orderedEventsLength > 0);
    }
    if (_element_HeaderDateDisplay_SearchButton !== null) {
      updateToolbarButtonVisibleState(_element_HeaderDateDisplay_SearchButton, orderedEventsLength > 0);
    }
  }
  function getDayElement(date) {
    var firstDay = new Date(_currentDate.getFullYear(), _currentDate.getMonth(), 1);
    var startDay = -1;
    var nextMonth = new Date(_currentDate);
    var previousMonth = new Date(_currentDate);
    var elementDay = null;
    var elementDayNumber = 0;
    var firstDayNumber = getWeekdayNumber(firstDay);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    if (date.getMonth() === nextMonth.getMonth() && date.getFullYear() === nextMonth.getFullYear()) {
      startDay = firstDayNumber + getTotalDaysInMonth(_currentDate.getFullYear(), _currentDate.getMonth());
      elementDayNumber = getStartOfWeekDayNumber(date.getDate() + startDay);
    } else if (date.getMonth() === previousMonth.getMonth() && date.getFullYear() === previousMonth.getFullYear()) {
      elementDayNumber = getStartOfWeekDayNumber(firstDayNumber - getTotalDaysBetweenDates(date, _currentDate) + 1);
    } else if (date.getMonth() === _currentDate.getMonth() && date.getFullYear() === _currentDate.getFullYear()) {
      startDay = firstDayNumber;
      elementDayNumber = getStartOfWeekDayNumber(date.getDate() + startDay);
    }
    if (elementDayNumber > 0) {
      elementDay = getElementByID(_elementID_DayElement + elementDayNumber);
    }
    return elementDay;
  }
  function clearEventsFromDays() {
    var rowIndex = 0;
    for (; rowIndex < 6; rowIndex++) {
      var columnDataIndex = 0;
      for (; columnDataIndex < 7; columnDataIndex++) {
        var columnDataNumber = rowIndex * 7 + (columnDataIndex + 1);
        var columnDataElement = getElementByID(_elementID_DayElement + columnDataNumber);
        clearEventsFromDay(columnDataElement);
      }
    }
  }
  function clearEventsFromDay(elementDay) {
    if (elementDay !== null) {
      clearElementsByClassName(elementDay, "event");
      clearElementsByClassName(elementDay, "plus-x-events");
    }
  }
  function clearElementsByClassName(container, className) {
    var elements = container.getElementsByClassName(className);
    for (; elements[0];) {
      elements[0].parentNode.removeChild(elements[0]);
    }
  }
  function showElementsByClassName(container, className) {
    var elements = container.getElementsByClassName(className);
    var elementsLength = elements.length;
    var elementIndex = 0;
    for (; elementIndex < elementsLength; elementIndex++) {
      elements[elementIndex].style.display = "block";
    }
  }
  function removeElementsClassName(container, className) {
    var elements = container.getElementsByClassName(className);
    for (; elements[0];) {
      elements[0].className = elements[0].className.replace(className, _string.empty);
    }
  }
  function getToTimeWithPassedDate(eventDetails, date) {
    var repeatEvery = getNumber(eventDetails.repeatEvery);
    var toDate = new Date(eventDetails.to);
    if (repeatEvery > _repeatType.never) {
      var newCurrentDate = new Date(date);
      newCurrentDate.setHours(toDate.getHours(), toDate.getMinutes());
      toDate = newCurrentDate;
    }
    return toDate;
  }
  function updateCalendarsLastBusyState() {
    if (_isCalendarBusy_LastState !== _isCalendarBusy) {
      _isCalendarBusy_LastState = _isCalendarBusy;
      triggerOptionsEventWithData("onBusyStateChange", _isCalendarBusy);
    }
  }
  function buildFullDayView() {
    if (!_datePickerModeEnabled) {
      var wasAddedAlready = _element_FullDayView !== null;
      if (wasAddedAlready) {
        _element_FullDayView.innerHTML = _string.empty;
      }
      if (!wasAddedAlready) {
        _element_FullDayView = createElement("div", "full-day-view");
        _element_Calendar.appendChild(_element_FullDayView);
      }
      var titleBar = createElement("div", "title-bar");
      _element_FullDayView.appendChild(titleBar);
      if (_options.fullScreenModeEnabled) {
        titleBar.ondblclick = headerDoubleClick;
      }
      _element_FullDayView_Title = createElement("div", "title");
      titleBar.appendChild(_element_FullDayView_Title);
      buildToolbarButton(titleBar, "ib-arrow-right-full", _options.nextDayTooltipText, onNextDay);
      buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, hideFullDayView);
      if (_options.manualEditingEnabled && _options.showExtraToolbarButtons) {
        buildToolbarButton(titleBar, "ib-plus", _options.addEventTooltipText, function() {
          if (_options.useTemplateWhenAddingNewEvent) {
            var newBlankTemplateEvent = buildBlankTemplateEvent(_element_FullDayView_DateSelected, _element_FullDayView_DateSelected);
            showEventEditingDialog(newBlankTemplateEvent);
            showEventEditingDialogTitleSelected();
          } else {
            addNewEvent();
          }
        });
      }
      if (!_datePickerModeEnabled && isSideMenuAvailable()) {
        buildToolbarButton(titleBar, "ib-hamburger", _options.showMenuTooltipText, showSideMenu);
        var sideMenuButtonDividerLine = createElement("div", "side-menu-button-divider-line");
        titleBar.appendChild(sideMenuButtonDividerLine);
      }
      buildToolbarButton(titleBar, "ib-arrow-left-full", _options.previousDayTooltipText, onPreviousDay);
      if (_options.exportEventsEnabled && _options.showExtraToolbarButtons) {
        _element_FullDayView_ExportEventsButton = buildToolbarButton(titleBar, "ib-arrow-down-full-line", _options.exportEventsTooltipText, function() {
          showExportEventsDialog(_element_FullDayView_EventsShown);
        });
      }
      if (_options.showExtraToolbarButtons) {
        _element_FullDayView_TodayButton = buildToolbarButton(titleBar, "ib-pin", _options.todayTooltipText, onToday);
        buildToolbarButton(titleBar, "ib-refresh", _options.refreshTooltipText, function() {
          refreshViews(true, true);
        });
        if (_optionsForSearch.enabled) {
          _element_FullDayView_SearchButton = buildToolbarButton(titleBar, "ib-search", _options.searchTooltipText, showSearchDialog);
        }
        if (_options.fullScreenModeEnabled) {
          _element_FullDayView_FullScreenButton = buildToolbarButton(titleBar, "ib-arrow-expand-left-right", _options.enableFullScreenTooltipText, headerDoubleClick);
        }
      }
      _element_FullDayView_Contents = createElement("div", "contents custom-scroll-bars");
      _element_FullDayView.appendChild(_element_FullDayView_Contents);
      _element_FullDayView_Contents.oncontextmenu = function(e) {
        var hoursMinutes = getHourMinutesFromMousePositionClick(e);
        _element_FullDayView_ContextMenu_ClickPositionHourMinutes = padNumber(hoursMinutes[0]) + ":" + padNumber(hoursMinutes[1]);
        showFullDayDropDownMenu(e);
      };
      _element_FullDayView_Contents_AllDayEvents = createElement("div", "content-events-all-day");
      _element_FullDayView_Contents.appendChild(_element_FullDayView_Contents_AllDayEvents);
      var allDayText = createElement("div", "all-day-text");
      setNodeText(allDayText, _options.allDayText);
      _element_FullDayView_Contents_AllDayEvents.appendChild(allDayText);
      _element_FullDayView_Contents_Hours = createElement("div", "contents-events");
      _element_FullDayView_Contents_Hours.ondblclick = fullDayViewDoubleClick;
      _element_FullDayView_Contents.appendChild(_element_FullDayView_Contents_Hours);
      _element_FullDayView_Contents_WorkingHours = createElement("div", "working-hours");
      _element_FullDayView_Contents.appendChild(_element_FullDayView_Contents_WorkingHours);
      if (_options.manualEditingEnabled && _options.dragAndDropForEventsEnabled) {
        _element_FullDayView_Contents_Hours.ondragover = cancelBubble;
        _element_FullDayView_Contents_Hours.ondragenter = cancelBubble;
        _element_FullDayView_Contents_Hours.ondragleave = cancelBubble;
        _element_FullDayView_Contents_Hours.ondrop = onFullDayViewEventDropped;
      }
      var hour = 0;
      for (; hour < 24; hour++) {
        var row = createElement("div", "hour");
        _element_FullDayView_Contents_Hours.appendChild(row);
        var newHour1 = createElement("div", "hour-text");
        newHour1.innerText = padNumber(hour) + ":00";
        row.appendChild(newHour1);
        var newHour2 = createElement("div", "hour-text");
        newHour2.innerText = padNumber(hour) + ":30";
        row.appendChild(newHour2);
      }
      buildFullDayViewTimeArrow();
    }
  }
  function fullDayViewDoubleClick(e) {
    if (_options.manualEditingEnabled) {
      var hoursMinutes = getHourMinutesFromMousePositionClick(e);
      if (_options.useTemplateWhenAddingNewEvent) {
        var newBlankTemplateEventTime = padNumber(hoursMinutes[0]) + ":" + padNumber(hoursMinutes[1]);
        var newBlankTemplateEvent = buildBlankTemplateEvent(_element_FullDayView_DateSelected, _element_FullDayView_DateSelected, newBlankTemplateEventTime, newBlankTemplateEventTime);
        showEventEditingDialog(newBlankTemplateEvent);
        showEventEditingDialogTitleSelected();
      } else {
        showEventEditingDialog(null, _element_FullDayView_DateSelected, hoursMinutes);
      }
    }
  }
  function updateFullDayViewFromEventEdit() {
    if (isOverlayVisible(_element_FullDayView)) {
      showFullDayView(_element_FullDayView_DateSelected);
    }
  }
  function showFullDayView(date, fromOpen) {
    fromOpen = isDefined(fromOpen) ? fromOpen : false;
    var currentDate = new Date();
    var weekDayNumber = getWeekdayNumber(currentDate);
    var isCurrentDateVisible = _options.visibleDays.indexOf(weekDayNumber) > -1;
    _element_FullDayView_Title.innerHTML = _string.empty;
    _element_FullDayView_DateSelected = new Date(date);
    _element_FullDayView_EventsShown = [];
    _element_FullDayView_EventsShown_Sizes = [];
    _element_FullDayView_Contents_AllDayEvents.style.display = "block";
    _element_FullDayView_Contents_WorkingHours.style.display = "none";
    updateToolbarButtonVisibleState(_element_FullDayView_TodayButton, isCurrentDateVisible);
    clearElementsByClassName(_element_FullDayView_Contents, "event");
    showOverlay(_element_FullDayView);
    buildDateTimeDisplay(_element_FullDayView_Title, date, false, true, true);
    if (isWorkingDay(date)) {
      showFullDayWorkingHours();
    }
    var holidayText = getHolidaysText(date);
    var orderedEvents = [];
    if (holidayText !== null) {
      createSpanElement(_element_FullDayView_Title, " (" + holidayText + ")", "light-title-bar-text");
    }
    getAllEventsFunc(function(eventDetails) {
      var totalDays = getTotalDaysBetweenDates(eventDetails.from, eventDetails.to) + 1;
      var nextDate = new Date(eventDetails.from);
      var dayIndex = 0;
      for (; dayIndex < totalDays; dayIndex++) {
        if (doDatesMatch(nextDate, date)) {
          orderedEvents.push(eventDetails);
          break;
        }
        moveDateForwardDay(nextDate);
      }
      var repeatEvery = getNumber(eventDetails.repeatEvery);
      if (repeatEvery > _repeatType.never) {
        if (repeatEvery === _repeatType.everyDay) {
          buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardDay, 1);
        } else if (repeatEvery === _repeatType.everyWeek) {
          buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardWeek, 1);
        } else if (repeatEvery === _repeatType.every2Weeks) {
          buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardWeek, 2);
        } else if (repeatEvery === _repeatType.everyMonth) {
          buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardMonth, 1);
        } else if (repeatEvery === _repeatType.everyYear) {
          buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardYear, 1);
        } else if (repeatEvery === _repeatType.custom) {
          var repeatEveryCustomType = getNumber(eventDetails.repeatEveryCustomType);
          var repeatEveryCustomValue = getNumber(eventDetails.repeatEveryCustomValue);
          if (repeatEveryCustomValue > 0) {
            if (repeatEveryCustomType === _repeatCustomType.daily) {
              buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardDay, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.weekly) {
              buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardWeek, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.monthly) {
              buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardMonth, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.yearly) {
              buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, moveDateForwardYear, repeatEveryCustomValue);
            }
          }
        }
      }
    });
    orderedEvents = getOrderedEvents(orderedEvents);
    var orderedEventsLength = orderedEvents.length;
    var orderedEventsFirstTopPosition = null;
    var timeArrowPosition = updateFullDayViewTimeArrowPosition();
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventsLength; orderedEventIndex++) {
      var newTopPosition = buildFullDayDayEvent(orderedEvents[orderedEventIndex], date);
      if (orderedEventsFirstTopPosition === null) {
        orderedEventsFirstTopPosition = newTopPosition;
      }
    }
    if (fromOpen) {
      if (isFullDayTimeArrowVisible()) {
        _element_FullDayView_Contents.scrollTop = timeArrowPosition;
      } else {
        _element_FullDayView_Contents.scrollTop = orderedEventsFirstTopPosition - _element_FullDayView_Contents.offsetHeight / 2;
      }
    }
    if (_element_FullDayView_Contents_AllDayEvents.offsetHeight <= 1) {
      _element_FullDayView_Contents_AllDayEvents.style.display = "none";
    }
    if (_options.exportEventsEnabled) {
      updateToolbarButtonVisibleState(_element_FullDayView_ExportEventsButton, _element_FullDayView_EventsShown.length > 0);
    }
    updateToolbarButtonVisibleState(_element_FullDayView_SearchButton, _element_FullDayView_EventsShown.length > 0);
    adjustFullDayEventsThatOverlap();
    startFullDayEventSizeTracking();
  }
  function showFullDayWorkingHours() {
    if (_options.workingHoursStart !== null && _options.workingHoursEnd !== null && _options.workingHoursStart !== _options.workingHoursEnd) {
      var pixelsPerMinute = getFullDayPixelsPerMinute();
      var workingHoursStartParts = _options.workingHoursStart.split(":");
      var workingHoursEndParts = _options.workingHoursEnd.split(":");
      var top = (parseInt(workingHoursStartParts[0]) * 60 + parseInt(workingHoursStartParts[1])) * pixelsPerMinute;
      var height = (parseInt(workingHoursEndParts[0]) * 60 + parseInt(workingHoursEndParts[1])) * pixelsPerMinute - top;
      _element_FullDayView_Contents_WorkingHours.style.display = "block";
      _element_FullDayView_Contents_WorkingHours.style.top = top + "px";
      _element_FullDayView_Contents_WorkingHours.style.height = height + "px";
    }
  }
  function hideFullDayView() {
    hideOverlay(_element_FullDayView);
    stopFullDayEventSizeTracking();
    _element_FullDayView_DateSelected = null;
    _element_FullDayView_EventsShown = [];
    _element_FullDayView_EventsShown_Sizes = [];
  }
  function buildFullDayRepeatedDayEvents(eventDetails, orderedEvents, date, dateFunc, dateFuncForwardValue) {
    var newFromDate = new Date(eventDetails.from);
    var excludeDays = getArray(eventDetails.repeatEveryExcludeDays);
    for (; newFromDate < date;) {
      dateFunc(newFromDate, dateFuncForwardValue);
      var repeatEnded = !(!isDefined(eventDetails.repeatEnds) || isDateSmallerOrEqualToDate(newFromDate, eventDetails.repeatEnds));
      if (excludeDays.indexOf(newFromDate.getDay()) === -1 && !repeatEnded) {
        if (doDatesMatch(newFromDate, date)) {
          orderedEvents.push(eventDetails);
          break;
        }
      }
    }
  }
  function buildFullDayDayEvent(eventDetails, displayDate) {
    var scrollTop = 0;
    var seriesIgnoreDates = getArray(eventDetails.seriesIgnoreDates);
    var formattedDate = toStorageFormattedDate(displayDate);
    if (isEventVisible(eventDetails) && seriesIgnoreDates.indexOf(formattedDate) === -1) {
      var event = createElement("div", "event");
      event.ondblclick = cancelBubble;
      event.setAttribute("event-type", getNumber(eventDetails.type));
      event.setAttribute("event-id", eventDetails.id);
      event.onclick = function(e) {
        increaseEventZIndex(e, event);
      };
      if (eventDetails.isAllDay) {
        _element_FullDayView_Contents_AllDayEvents.appendChild(event);
      } else {
        if (_options.manualEditingEnabled && _options.dragAndDropForEventsEnabled) {
          if (doDatesMatch(eventDetails.from, eventDetails.to)) {
            event.className += " resizable";
            event.onmousedown = stopFullDayEventSizeTracking;
            event.onmouseup = startFullDayEventSizeTracking;
          }
          event.ondragstart = function(e) {
            onFullDayViewEventDragStart(e, event, eventDetails);
          };
          event.setAttribute("draggable", true);
        }
        _element_FullDayView_Contents_Hours.appendChild(event);
      }
      event.oncontextmenu = function(e) {
        showEventDropDownMenu(e, eventDetails, formattedDate);
      };
      setEventClassesAndColors(event, eventDetails, getToTimeWithPassedDate(eventDetails, displayDate));
      setEventClassesForActions(event, eventDetails);
      if (doDatesMatch(eventDetails.from, displayDate)) {
        event.id = _elementID_FullDay + eventDetails.id;
      }
      var title = createElement("div", "title");
      var repeatEvery = getNumber(eventDetails.repeatEvery);
      if (repeatEvery > _repeatType.never) {
        var icon = createElement("div", "ib-refresh-medium ib-no-hover ib-no-active");
        icon.style.borderColor = event.style.color;
        title.appendChild(icon);
      }
      title.innerHTML += stripHTMLTagsFromText(eventDetails.title);
      event.appendChild(title);
      if (!eventDetails.isAllDay || _options.showAllDayEventDetailsInFullDayView) {
        var startTime = createElement("div", "date");
        event.appendChild(startTime);
        var duration = createElement("div", "duration");
        event.appendChild(duration);
        if (eventDetails.from.getDate() === eventDetails.to.getDate()) {
          if (eventDetails.isAllDay) {
            setNodeText(startTime, _options.allDayText);
          } else {
            setNodeText(startTime, getTimeToTimeDisplay(eventDetails.from, eventDetails.to));
            setNodeText(duration, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
          }
        } else {
          buildDateTimeToDateTimeDisplay(startTime, eventDetails.from, eventDetails.to);
          setNodeText(duration, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
        }
        if (duration.innerHTML === _string.empty) {
          event.removeChild(duration);
        }
        if (isDefinedNumber(eventDetails.repeatEvery) && eventDetails.repeatEvery > _repeatType.never) {
          var repeats = createElement("div", "repeats");
          setNodeText(repeats, _options.repeatsText.replace(":", _string.empty) + _string.space + getRepeatsText(eventDetails.repeatEvery));
          event.appendChild(repeats);
        }
        if (isDefinedStringAndSet(eventDetails.location)) {
          var location = createElement("div", "location");
          setNodeText(location, eventDetails.location);
          event.appendChild(location);
        }
        if (isDefinedStringAndSet(eventDetails.description)) {
          var description = createElement("div", "description");
          setNodeText(description, eventDetails.description);
          event.appendChild(description);
        }
      }
      event.addEventListener("click", function(e) {
        storeMultiSelectEvent(e, eventDetails);
      });
      if (isOptionEventSet("onEventClick")) {
        event.addEventListener("click", function() {
          triggerOptionsEventWithData("onEventClick", eventDetails);
        });
      }
      if (_options.manualEditingEnabled) {
        event.ondblclick = function(e) {
          cancelBubble(e);
          showEventEditingDialog(eventDetails);
        };
      } else {
        if (isOptionEventSet("onEventDoubleClick")) {
          event.ondblclick = function() {
            triggerOptionsEventWithData("onEventDoubleClick", eventDetails);
          };
        }
      }
      if (!eventDetails.isAllDay) {
        scrollTop = setEventPositionAndGetScrollTop(displayDate, event, eventDetails);
      }
      _element_FullDayView_EventsShown.push(eventDetails);
      if (!eventDetails.isAllDay) {
        _element_FullDayView_EventsShown_Sizes.push({eventDetails:eventDetails, eventElement:event, height:event.offsetHeight});
      }
    }
    return scrollTop;
  }
  function setEventPositionAndGetScrollTop(displayDate, event, eventDetails) {
    var contentHoursHeight = _element_FullDayView_Contents_Hours.offsetHeight;
    var pixelsPerMinute = getFullDayPixelsPerMinute();
    var minutesTop = _options.spacing;
    var minutesHeight = null;
    if (!eventDetails.isAllDay) {
      var repeatEvery = getNumber(eventDetails.repeatEvery);
      if (doDatesMatch(eventDetails.from, displayDate) || repeatEvery > _repeatType.never) {
        minutesTop = pixelsPerMinute * getMinutesIntoDay(eventDetails.from);
      }
      if (doDatesMatch(eventDetails.to, displayDate) || repeatEvery > _repeatType.never) {
        minutesHeight = pixelsPerMinute * getMinutesIntoDay(eventDetails.to) - minutesTop;
      } else {
        minutesHeight = contentHoursHeight;
      }
      minutesHeight = minutesHeight - _options.spacing * 2;
    }
    event.style.top = minutesTop + "px";
    if (minutesHeight !== null) {
      event.style.height = minutesHeight + "px";
    }
    if (event.offsetTop + event.offsetHeight > contentHoursHeight - _options.spacing) {
      event.style.height = contentHoursHeight - event.offsetTop - _options.spacing * 3 + "px";
    }
    var scrollTop = minutesTop + _element_FullDayView_Contents.offsetHeight / 2;
    if (scrollTop <= _element_FullDayView_Contents.offsetHeight) {
      scrollTop = 0;
    }
    return scrollTop;
  }
  function onPreviousDay() {
    moveDateBackOneDay(_element_FullDayView_DateSelected);
    if (_options.visibleDays.length < 7) {
      var weekDayNumber = getWeekdayNumber(_element_FullDayView_DateSelected);
      for (; _options.visibleDays.indexOf(weekDayNumber) === -1;) {
        moveDateBackOneDay(_element_FullDayView_DateSelected);
        weekDayNumber = getWeekdayNumber(_element_FullDayView_DateSelected);
      }
    }
    showFullDayView(_element_FullDayView_DateSelected, true);
  }
  function onNextDay() {
    moveDateForwardDay(_element_FullDayView_DateSelected);
    if (_options.visibleDays.length < 7) {
      var weekDayNumber = getWeekdayNumber(_element_FullDayView_DateSelected);
      for (; _options.visibleDays.indexOf(weekDayNumber) === -1;) {
        moveDateForwardDay(_element_FullDayView_DateSelected);
        weekDayNumber = getWeekdayNumber(_element_FullDayView_DateSelected);
      }
    }
    showFullDayView(_element_FullDayView_DateSelected, true);
  }
  function onToday() {
    _element_FullDayView_DateSelected = new Date();
    showFullDayView(_element_FullDayView_DateSelected, true);
  }
  function getFullDayPixelsPerMinute() {
    var contentHoursHeight = _element_FullDayView_Contents_Hours.offsetHeight;
    var pixelsPerMinute = contentHoursHeight / 1440;
    return pixelsPerMinute;
  }
  function increaseEventZIndex(e, event) {
    cancelBubble(e);
    var zIndex = getStyleValueByName(event, "z-index");
    if (zIndex === null || zIndex === "auto") {
      zIndex = 1;
    } else {
      zIndex = parseInt(zIndex) + 1;
    }
    event.style.zIndex = zIndex.toString();
  }
  function getHourMinutesFromMousePositionClick(e) {
    var contentHoursOffset = getOffset(_element_FullDayView_Contents_Hours);
    var pixelsPerMinute = getFullDayPixelsPerMinute();
    var minutesFromTop = Math.floor((e.pageY - contentHoursOffset.top) / pixelsPerMinute);
    var hoursMinutes = getHoursAndMinutesFromMinutes(minutesFromTop);
    return hoursMinutes;
  }
  function onFullDayViewEventDragStart(e, event, eventDetails) {
    var offset = getOffset(event);
    _element_FullDayView_Event_Dragged = event;
    _element_FullDayView_Event_Dragged_EventDetails = eventDetails;
    _element_FullDayView_Event_Dragged_Offset = offset.top - e.pageY;
  }
  function onFullDayViewEventDropped(e) {
    cancelBubble(e);
    if (_element_FullDayView_Event_Dragged === null) {
      if (e.dataTransfer.files.length === 0) {
        dropEventsFromOtherCalendar(e, _element_FullDayView_DateSelected.getFullYear(), _element_FullDayView_DateSelected.getMonth(), _element_FullDayView_DateSelected.getDate());
      } else {
        dropFileOnDisplay(e);
      }
    } else {
      var pixelsPerMinute = getFullDayPixelsPerMinute();
      var offset = getOffset(_element_FullDayView_Contents_Hours);
      var top = Math.abs(e.pageY) - offset.top + _element_FullDayView_Event_Dragged_Offset;
      var difference = top - _element_FullDayView_Event_Dragged.offsetTop;
      var differenceMinutes = difference / pixelsPerMinute;
      _element_FullDayView_Event_Dragged.style.top = top + "px";
      _element_FullDayView_Event_Dragged_EventDetails.from = addMinutesToDate(_element_FullDayView_Event_Dragged_EventDetails.from, differenceMinutes);
      _element_FullDayView_Event_Dragged_EventDetails.to = addMinutesToDate(_element_FullDayView_Event_Dragged_EventDetails.to, differenceMinutes);
      storeEventsInLocalStorage();
      triggerOptionsEventWithData("onEventUpdated", _element_FullDayView_Event_Dragged_EventDetails);
      showNotificationPopUp(_options.eventUpdatedText.replace("{0}", _element_FullDayView_Event_Dragged_EventDetails.title));
      _element_FullDayView_Event_Dragged = null;
      _element_FullDayView_Event_Dragged_EventDetails = null;
      _element_FullDayView_Event_Dragged_Offset = 0;
      refreshViews();
    }
  }
  function startFullDayEventSizeTracking() {
    stopFullDayEventSizeTracking();
    if (_options.manualEditingEnabled) {
      startTimer(_timerName.fullDayEventSizeTracking, function() {
        var eventsLength = _element_FullDayView_EventsShown_Sizes.length;
        if (eventsLength > 0) {
          var pixelsPerMinute = getFullDayPixelsPerMinute();
          var eventsResized = false;
          var eventIndex = 0;
          for (; eventIndex < eventsLength; eventIndex++) {
            var eventSizeDetails = _element_FullDayView_EventsShown_Sizes[eventIndex];
            if (eventSizeDetails.height != eventSizeDetails.eventElement.offsetHeight) {
              var difference = eventSizeDetails.eventElement.offsetHeight - eventSizeDetails.height;
              var differenceMinutes = difference / pixelsPerMinute;
              eventSizeDetails.height = eventSizeDetails.eventElement.offsetHeight;
              eventSizeDetails.eventDetails.to = addMinutesToDate(eventSizeDetails.eventDetails.to, differenceMinutes);
              eventsResized = true;
              triggerOptionsEventWithData("onEventUpdated", eventSizeDetails.eventDetails);
              showNotificationPopUp(_options.eventUpdatedText.replace("{0}", eventSizeDetails.eventDetails.title));
            }
          }
          if (eventsResized) {
            storeEventsInLocalStorage();
            refreshViews();
          }
        }
      }, 50);
    }
  }
  function stopFullDayEventSizeTracking() {
    if (_options.manualEditingEnabled) {
      stopAndResetTimer(_timerName.fullDayEventSizeTracking);
    }
  }
  function adjustFullDayEventsThatOverlap() {
    var eventsElements = _element_FullDayView_Contents_Hours.getElementsByClassName("event");
    var events = [].slice.call(eventsElements);
    var eventsLength = events.length;
    if (eventsLength > 1) {
      events.sort(sortOverlappingEventElementsByOffsetTop);
      var eventIndex1 = 0;
      for (; eventIndex1 < eventsLength; eventIndex1++) {
        var event1 = events[eventIndex1];
        var eventIndex2 = 0;
        for (; eventIndex2 < eventsLength; eventIndex2++) {
          if (eventIndex2 !== eventIndex1) {
            var event2 = events[eventIndex2];
            var overlaps = doEventElementsOverlap(event1, event2);
            if (overlaps) {
              var event1Position = getString(event1.getAttribute("event-position"));
              var event2Position = getString(event2.getAttribute("event-position"));
              if (event1Position === _string.empty && event2Position === _string.empty) {
                setOverlappingEventWidth(event1);
                setOverlappingEventWidth(event2);
                setOverlappingEventLeft(event2, event1);
                event1.setAttribute("event-position", "left");
                event2.setAttribute("event-position", "right");
              } else if (event1Position === _string.empty && event2Position === "right") {
                setOverlappingEventWidth(event1);
                event1.setAttribute("event-position", "left");
                event2.setAttribute("event-position", "right");
              } else if (event1Position === _string.empty && event2Position === "left") {
                setOverlappingEventLeft(event1, event2);
                setOverlappingEventWidth(event1);
                event1.setAttribute("event-position", "right");
                event2.setAttribute("event-position", "left");
              }
            }
          }
        }
      }
    }
  }
  function setOverlappingEventWidth(event) {
    event.style.width = event.offsetWidth / 2 - (_options.spacing * 3 + _options.spacing / 4) + "px";
  }
  function setOverlappingEventLeft(event1, event2) {
    event1.style.left = event2.offsetLeft + event2.offsetWidth + _options.spacing + "px";
  }
  function sortOverlappingEventElementsByOffsetTop(event1, event2) {
    var result = 0;
    if (event1.offsetTop < event2.offsetTop) {
      result = -1;
    } else if (event1.offsetTop > event2.offsetTop) {
      result = 1;
    }
    return result;
  }
  function doEventElementsOverlap(element1, element2) {
    var result = true;
    var offsetLeft1 = element1.offsetLeft;
    var offsetTop1 = element1.offsetTop;
    var height1 = element1.offsetHeight;
    var width1 = element1.offsetWidth;
    var topPlusHeight1 = offsetTop1 + height1;
    var leftPlusWidth1 = offsetLeft1 + width1;
    var offsetLeft2 = element2.offsetLeft;
    var offsetTop2 = element2.offsetTop;
    var height2 = element2.offsetHeight;
    var width2 = element2.offsetWidth;
    var topPlusHeight2 = offsetTop2 + height2;
    var leftPlusWidth2 = offsetLeft2 + width2;
    if (topPlusHeight1 < offsetTop2 || offsetTop1 > topPlusHeight2 || leftPlusWidth1 < offsetLeft2 || offsetLeft1 > leftPlusWidth2) {
      result = false;
    }
    return result;
  }
  function buildFullDayViewTimeArrow() {
    _element_FullDayView_TimeArrow = createElement("div", "time-arrow");
    _element_FullDayView_Contents_Hours.appendChild(_element_FullDayView_TimeArrow);
    _element_FullDayView_TimeArrow.appendChild(createElement("div", "arrow-left"));
    _element_FullDayView_TimeArrow.appendChild(createElement("div", "line"));
  }
  function updateFullDayViewTimeArrowPosition() {
    var topPosition = 0;
    if (_element_FullDayView_TimeArrow !== null) {
      if (isFullDayTimeArrowVisible()) {
        var pixelsPerMinute = getFullDayPixelsPerMinute();
        var top = pixelsPerMinute * getMinutesIntoDay(new Date());
        _element_FullDayView_TimeArrow.style.display = "block";
        _element_FullDayView_TimeArrow.style.top = top - _element_FullDayView_TimeArrow.offsetHeight / 2 + "px";
        topPosition = top;
      } else {
        _element_FullDayView_TimeArrow.style.display = "none";
      }
    }
    return topPosition;
  }
  function isFullDayTimeArrowVisible() {
    return isDateToday(_element_FullDayView_DateSelected) && isOverlayVisible(_element_FullDayView) && _options.showTimelineArrowOnFullDayView;
  }
  function buildListAllEventsView() {
    if (!_datePickerModeEnabled) {
      var wasAddedAlready = _element_ListAllEventsView !== null;
      if (wasAddedAlready) {
        _element_ListAllEventsView.innerHTML = _string.empty;
      }
      if (!wasAddedAlready) {
        _element_ListAllEventsView = createElement("div", "list-all-events-view");
        _element_Calendar.appendChild(_element_ListAllEventsView);
      }
      var titleBar = createElement("div", "title-bar");
      _element_ListAllEventsView.appendChild(titleBar);
      if (_options.fullScreenModeEnabled) {
        titleBar.ondblclick = headerDoubleClick;
      }
      var title = createElement("div", "title");
      setNodeText(title, _options.allEventsText);
      titleBar.appendChild(title);
      buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, function() {
        _element_ListAllEventsView_EventsShown = [];
        hideOverlay(_element_ListAllEventsView);
      });
      if (_options.showExtraToolbarButtons) {
        if (_options.manualEditingEnabled) {
          buildToolbarButton(titleBar, "ib-plus", _options.addEventTooltipText, addNewEvent);
        }
        if (_options.exportEventsEnabled) {
          _element_ListAllEventsView_ExportEventsButton = buildToolbarButton(titleBar, "ib-arrow-down-full-line", _options.exportEventsTooltipText, function() {
            showExportEventsDialog(_element_ListAllEventsView_EventsShown);
          });
        }
        if (!_datePickerModeEnabled && isSideMenuAvailable()) {
          buildToolbarButton(titleBar, "ib-hamburger", _options.showMenuTooltipText, showSideMenu);
          var sideMenuButtonDividerLine = createElement("div", "side-menu-button-divider-line");
          titleBar.appendChild(sideMenuButtonDividerLine);
        }
        buildToolbarButton(titleBar, "ib-refresh", _options.refreshTooltipText, function() {
          refreshViews(true, true);
        });
        if (_optionsForSearch.enabled) {
          _element_ListAllEventsView_SearchButton = buildToolbarButton(titleBar, "ib-search", _options.searchTooltipText, showSearchDialog);
        }
        if (_options.fullScreenModeEnabled) {
          _element_ListAllEventsView_FullScreenButton = buildToolbarButton(titleBar, "ib-arrow-expand-left-right", _options.enableFullScreenTooltipText, headerDoubleClick);
        }
      }
      _element_ListAllEventsView_Contents = createElement("div", "contents custom-scroll-bars");
      _element_ListAllEventsView.appendChild(_element_ListAllEventsView_Contents);
    }
  }
  function showListAllEventsView(fromOpen) {
    fromOpen = isDefined(fromOpen) ? fromOpen : false;
    showOverlay(_element_ListAllEventsView);
    _element_ListAllEventsView_Contents.innerHTML = _string.empty;
    _element_ListAllEventsView_EventsShown = [];
    _element_ListAllEventsView_MinimizeRestoreFunctions = [];
    if (fromOpen) {
      _element_ListAllEventsView_Contents.scrollTop = 0;
    }
    var orderedEvents = getOrderedEvents(getAllEvents());
    var orderedEventsLength = orderedEvents.length;
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventsLength; orderedEventIndex++) {
      buildListAllEventsEvent(orderedEvents[orderedEventIndex]);
    }
    if (_options.exportEventsEnabled) {
      updateToolbarButtonVisibleState(_element_ListAllEventsView_ExportEventsButton, _element_ListAllEventsView_EventsShown.length > 0);
    }
    updateToolbarButtonVisibleState(_element_ListAllEventsView_SearchButton, _element_ListAllEventsView_EventsShown.length > 0);
    if (_element_ListAllEventsView_EventsShown.length === 0) {
      buildNoEventsAvailableText(_element_ListAllEventsView_Contents, addNewEvent);
    }
  }
  function buildListAllEventsEvent(eventDetails) {
    if (isEventVisible(eventDetails)) {
      var container = buildListAllEventsMonth(eventDetails.from);
      var event = createElement("div", "event");
      container.appendChild(event);
      event.oncontextmenu = function(e) {
        showEventDropDownMenu(e, eventDetails);
      };
      makeEventDraggable(event, eventDetails, eventDetails.from, container);
      setEventClassesAndColors(event, eventDetails);
      setEventClassesForActions(event, eventDetails);
      event.id = _elementID_Month + eventDetails.id;
      event.setAttribute("event-type", getNumber(eventDetails.type));
      event.setAttribute("event-id", eventDetails.id);
      var title = createElement("div", "title");
      var repeatEvery = getNumber(eventDetails.repeatEvery);
      if (repeatEvery > _repeatType.never) {
        var icon = createElement("div", "ib-refresh-medium ib-no-hover ib-no-active");
        icon.style.borderColor = event.style.color;
        title.appendChild(icon);
      }
      title.innerHTML += stripHTMLTagsFromText(eventDetails.title);
      event.appendChild(title);
      var startTime = createElement("div", "date");
      event.appendChild(startTime);
      var duration = createElement("div", "duration");
      event.appendChild(duration);
      if (eventDetails.from.getDate() === eventDetails.to.getDate()) {
        if (eventDetails.isAllDay) {
          buildDayDisplay(startTime, eventDetails.from, null, " - " + _options.allDayText);
        } else {
          buildDayDisplay(startTime, eventDetails.from, null, " - " + getTimeToTimeDisplay(eventDetails.from, eventDetails.to));
          setNodeText(duration, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
        }
      } else {
        buildDateTimeToDateTimeDisplay(startTime, eventDetails.from, eventDetails.to);
        setNodeText(duration, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
      }
      if (duration.innerHTML === _string.empty) {
        event.removeChild(duration);
      }
      if (isDefinedNumber(eventDetails.repeatEvery) && eventDetails.repeatEvery > _repeatType.never) {
        var repeats = createElement("div", "repeats");
        setNodeText(repeats, _options.repeatsText.replace(":", _string.empty) + _string.space + getRepeatsText(eventDetails.repeatEvery));
        event.appendChild(repeats);
      }
      if (isDefinedStringAndSet(eventDetails.location)) {
        var location = createElement("div", "location");
        setNodeText(location, eventDetails.location);
        event.appendChild(location);
      }
      if (isDefinedStringAndSet(eventDetails.description)) {
        var description = createElement("div", "description");
        setNodeText(description, eventDetails.description);
        event.appendChild(description);
      }
      event.addEventListener("click", function(e) {
        storeMultiSelectEvent(e, eventDetails);
      });
      if (isOptionEventSet("onEventClick")) {
        event.addEventListener("click", function() {
          triggerOptionsEventWithData("onEventClick", eventDetails);
        });
      }
      if (_options.manualEditingEnabled) {
        event.ondblclick = function(e) {
          cancelBubble(e);
          showEventEditingDialog(eventDetails);
        };
      } else {
        if (isOptionEventSet("onEventDoubleClick")) {
          event.ondblclick = function() {
            triggerOptionsEventWithData("onEventDoubleClick", eventDetails);
          };
        }
      }
      _element_ListAllEventsView_EventsShown.push(eventDetails);
    }
  }
  function buildListAllEventsMonth(date) {
    var monthContentsID = "month-" + date.getMonth() + "-" + date.getFullYear();
    var monthContents = getElementByID(monthContentsID);
    if (monthContents === null) {
      var expandMonthDate = new Date(date);
      var expandFunction = function() {
        _element_ListAllEventsView_EventsShown = [];
        hideOverlay(_element_ListAllEventsView);
        build(expandMonthDate);
      };
      var month = createElement("div", "month");
      _element_ListAllEventsView_Contents.appendChild(month);
      var header = createElement("div", "header");
      setNodeText(header, _options.monthNames[date.getMonth()] + _string.space + date.getFullYear());
      header.ondblclick = expandFunction;
      month.appendChild(header);
      buildToolbarButton(header, "ib-arrow-expand-left-right", _options.expandMonthTooltipText, expandFunction);
      if (_options.manualEditingEnabled) {
        var addNewEventDate = new Date(date.getFullYear(), date.getMonth(), 1);
        buildToolbarButton(header, "ib-plus", _options.addEventTooltipText, function() {
          if (_options.useTemplateWhenAddingNewEvent) {
            var newBlankTemplateEvent = buildBlankTemplateEvent(addNewEventDate, addNewEventDate);
            showEventEditingDialog(newBlankTemplateEvent);
            showEventEditingDialogTitleSelected();
          } else {
            showEventEditingDialog(null, addNewEventDate);
          }
        });
      }
      if (_options.manualEditingEnabled) {
        buildToolbarButton(header, "ib-close", _options.removeEventsTooltipText, function() {
          removeNonRepeatingEventsOnSpecificDate(expandMonthDate, doDatesMatchMonthAndYear);
        });
      }
      var minimizeRestoreFunction = function() {
        minimizeRestoreAllEventMonth(minimizeButton, monthContents, monthContentsID);
      };
      var minimizeButton = buildToolbarButton(header, "ib-minus", _options.minimizedTooltipText, minimizeRestoreFunction);
      _element_ListAllEventsView_MinimizeRestoreFunctions.push(minimizeRestoreFunction);
      monthContents = createElement("div", "events");
      monthContents.id = monthContentsID;
      month.appendChild(monthContents);
      if (_configuration.visibleAllEventsMonths.hasOwnProperty(monthContentsID) && !_configuration.visibleAllEventsMonths[monthContentsID]) {
        monthContents.style.display = "none";
        minimizeButton.className = "ib-square-hollow";
        addToolTip(minimizeButton, _options.restoreTooltipText);
      }
      makeAreaDroppable(monthContents, date.getFullYear(), date.getMonth(), date.getDate());
    }
    return monthContents;
  }
  function minimizeRestoreAllEventMonth(minimizeButton, monthContents, monthContentsID) {
    if (monthContents.style.display !== "none") {
      monthContents.style.display = "none";
      minimizeButton.className = "ib-square-hollow";
      _configuration.visibleAllEventsMonths[monthContentsID] = false;
      addToolTip(minimizeButton, _options.restoreTooltipText);
    } else {
      monthContents.style.display = "block";
      minimizeButton.className = "ib-minus";
      _configuration.visibleAllEventsMonths[monthContentsID] = true;
      addToolTip(minimizeButton, _options.minimizedTooltipText);
    }
  }
  function updateViewAllEventsViewFromEventEdit() {
    if (isOverlayVisible(_element_ListAllEventsView)) {
      showListAllEventsView();
    }
  }
  function callMinimizeRestoreFunctionsForAllEventView() {
    if (isOverlayVisible(_element_ListAllEventsView)) {
      var functionsLength = _element_ListAllEventsView_MinimizeRestoreFunctions.length;
      var functionIndex = 0;
      for (; functionIndex < functionsLength; functionIndex++) {
        _element_ListAllEventsView_MinimizeRestoreFunctions[functionIndex]();
      }
    }
  }
  function buildListAllWeekEventsView() {
    if (!_datePickerModeEnabled) {
      var wasAddedAlready = _element_ListAllWeekEventsView !== null;
      if (wasAddedAlready) {
        _element_ListAllWeekEventsView.innerHTML = _string.empty;
      }
      if (!wasAddedAlready) {
        _element_ListAllWeekEventsView = createElement("div", "list-all-week-events-view");
        _element_Calendar.appendChild(_element_ListAllWeekEventsView);
      }
      var titleBar = createElement("div", "title-bar");
      _element_ListAllWeekEventsView.appendChild(titleBar);
      if (_options.fullScreenModeEnabled) {
        titleBar.ondblclick = headerDoubleClick;
      }
      _element_ListAllWeekEventsView_Title = createElement("div", "title");
      titleBar.appendChild(_element_ListAllWeekEventsView_Title);
      buildToolbarButton(titleBar, "ib-arrow-right-full", _options.nextWeekTooltipText, onNextWeek);
      buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, function() {
        _element_ListAllWeekEventsView_EventsShown = [];
        hideOverlay(_element_ListAllWeekEventsView);
      });
      if (_options.manualEditingEnabled && _options.showExtraToolbarButtons) {
        buildToolbarButton(titleBar, "ib-plus", _options.addEventTooltipText, addNewEvent);
      }
      if (!_datePickerModeEnabled && isSideMenuAvailable()) {
        buildToolbarButton(titleBar, "ib-hamburger", _options.showMenuTooltipText, showSideMenu);
        var sideMenuButtonDividerLine = createElement("div", "side-menu-button-divider-line");
        titleBar.appendChild(sideMenuButtonDividerLine);
      }
      buildToolbarButton(titleBar, "ib-arrow-left-full", _options.previousWeekTooltipText, onPreviousWeek);
      if (_options.showExtraToolbarButtons) {
        if (_options.exportEventsEnabled) {
          _element_ListAllWeekEventsView_ExportEventsButton = buildToolbarButton(titleBar, "ib-arrow-down-full-line", _options.exportEventsTooltipText, function() {
            showExportEventsDialog(_element_ListAllWeekEventsView_EventsShown);
          });
        }
        buildToolbarButton(titleBar, "ib-pin", _options.thisWeekTooltipText, onThisWeek);
        buildToolbarButton(titleBar, "ib-refresh", _options.refreshTooltipText, function() {
          refreshViews(true, true);
        });
        if (_optionsForSearch.enabled) {
          _element_ListAllWeekEventsView_SearchButton = buildToolbarButton(titleBar, "ib-search", _options.searchTooltipText, showSearchDialog);
        }
        if (_options.fullScreenModeEnabled) {
          _element_ListAllWeekEventsView_FullScreenButton = buildToolbarButton(titleBar, "ib-arrow-expand-left-right", _options.enableFullScreenTooltipText, headerDoubleClick);
        }
      }
      _element_ListAllWeekEventsView_Contents = createElement("div", "contents custom-scroll-bars");
      _element_ListAllWeekEventsView.appendChild(_element_ListAllWeekEventsView_Contents);
    }
  }
  function showListAllWeekEventsView(weekDate, fromOpen) {
    fromOpen = isDefined(fromOpen) ? fromOpen : false;
    showOverlay(_element_ListAllWeekEventsView);
    _element_ListAllWeekEventsView_Contents.innerHTML = _string.empty;
    _element_ListAllWeekEventsView_Contents_FullView = {};
    _element_ListAllWeekEventsView_Contents_FullView_Contents = {};
    _element_ListAllWeekEventsView_Contents_FullView_Events = {};
    _element_ListAllWeekEventsView_Contents_FullView_DateIDs = [];
    _element_ListAllWeekEventsView_EventsShown = [];
    _element_ListAllWeekEventsView_MinimizeRestoreFunctions = [];
    _element_ListAllWeekEventsView_DateSelected = weekDate === null ? new Date() : new Date(weekDate);
    if (fromOpen) {
      _element_ListAllWeekEventsView_Contents.scrollTop = 0;
    }
    var weekStartEndDates = getWeekStartEndDates(weekDate);
    var weekStartDate = weekStartEndDates[0];
    var weekEndDate = weekStartEndDates[1];
    buildAllWeekDays(weekStartDate, weekEndDate);
    setAllWeekEventsViewTitle(weekStartDate, weekEndDate);
    var orderedEvents = getOrderedEvents(getAllEvents());
    var orderedEventsLength = orderedEvents.length;
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventsLength; orderedEventIndex++) {
      var orderedEvent = orderedEvents[orderedEventIndex];
      var totalDays = getTotalDaysBetweenDates(orderedEvent.from, orderedEvent.to) + 1;
      var nextDate = new Date(orderedEvent.from);
      var addedNow = false;
      var dayIndex = 0;
      for (; dayIndex < totalDays; dayIndex++) {
        if (nextDate >= weekStartDate && nextDate <= weekEndDate) {
          var containers = buildListAllEventsDay(nextDate);
          var dayContents = containers[0];
          var dayHeader = containers[1];
          if (dayContents !== null && dayHeader !== null) {
            var added = buildListAllWeekEventsEvent(orderedEvent, dayHeader, dayContents, nextDate);
            if (added) {
              addedNow = true;
            }
          }
        }
        moveDateForwardDay(nextDate);
      }
      if (addedNow) {
        _element_ListAllWeekEventsView_EventsShown.push(orderedEvent);
      }
      var repeatEvery = getNumber(orderedEvent.repeatEvery);
      var repeatAdded = false;
      if (repeatEvery > _repeatType.never) {
        if (repeatEvery === _repeatType.everyDay) {
          repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardDay, 1);
        } else if (repeatEvery === _repeatType.everyWeek) {
          repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardWeek, 1);
        } else if (repeatEvery === _repeatType.every2Weeks) {
          repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardWeek, 2);
        } else if (repeatEvery === _repeatType.everyMonth) {
          repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardMonth, 1);
        } else if (repeatEvery === _repeatType.everyYear) {
          repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardYear, 1);
        } else if (repeatEvery === _repeatType.custom) {
          var repeatEveryCustomType = getNumber(orderedEvent.repeatEveryCustomType);
          var repeatEveryCustomValue = getNumber(orderedEvent.repeatEveryCustomValue);
          if (repeatEveryCustomValue > 0) {
            if (repeatEveryCustomType === _repeatCustomType.daily) {
              repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardDay, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.weekly) {
              repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardWeek, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.monthly) {
              repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardMonth, repeatEveryCustomValue);
            } else if (repeatEveryCustomType === _repeatCustomType.yearly) {
              repeatAdded = buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, moveDateForwardYear, repeatEveryCustomValue);
            }
          }
        }
      }
      if (repeatAdded && !addedNow) {
        _element_ListAllWeekEventsView_EventsShown.push(orderedEvent);
      }
    }
    var dateIDsLength = _element_ListAllWeekEventsView_Contents_FullView_DateIDs.length;
    var dateIDIndex = 0;
    for (; dateIDIndex < dateIDsLength; dateIDIndex++) {
      var dateID = _element_ListAllWeekEventsView_Contents_FullView_DateIDs[dateIDIndex];
      if (_element_ListAllWeekEventsView_Contents_FullView.hasOwnProperty(dateID) && _element_ListAllWeekEventsView_Contents_FullView_Events.hasOwnProperty(dateID)) {
        if (_options.showEmptyDaysInWeekView || _element_ListAllWeekEventsView_Contents_FullView_Events[dateID].length > 0) {
          _element_ListAllWeekEventsView_Contents.appendChild(_element_ListAllWeekEventsView_Contents_FullView[dateID]);
        }
      }
    }
    if (_options.reverseOrderDaysOfWeek) {
      reverseElementsOrder(_element_ListAllWeekEventsView_Contents);
    }
    if (_options.exportEventsEnabled) {
      updateToolbarButtonVisibleState(_element_ListAllWeekEventsView_ExportEventsButton, _element_ListAllWeekEventsView_EventsShown.length > 0);
    }
    updateToolbarButtonVisibleState(_element_ListAllWeekEventsView_SearchButton, _element_ListAllWeekEventsView_EventsShown.length > 0);
    if (_element_ListAllWeekEventsView_EventsShown.length === 0) {
      buildNoEventsAvailableText(_element_ListAllWeekEventsView_Contents, addNewEvent);
    }
  }
  function buildAllWeekRepeatedDayEvents(orderedEvent, weekStartDate, weekEndDate, dateFunc, dateFuncForwardValue) {
    var newFromDate = new Date(orderedEvent.from);
    var excludeDays = getArray(orderedEvent.repeatEveryExcludeDays);
    var added = false;
    for (; newFromDate < weekEndDate;) {
      dateFunc(newFromDate, dateFuncForwardValue);
      var repeatEnded = !(!isDefined(orderedEvent.repeatEnds) || isDateSmallerOrEqualToDate(newFromDate, orderedEvent.repeatEnds));
      if (excludeDays.indexOf(newFromDate.getDay()) === -1 && !repeatEnded) {
        if (newFromDate >= weekStartDate && newFromDate <= weekEndDate) {
          var containers = buildListAllEventsDay(newFromDate);
          var dayContents = containers[0];
          var dayHeader = containers[1];
          if (dayContents !== null && dayHeader !== null) {
            buildListAllWeekEventsEvent(orderedEvent, dayHeader, dayContents, newFromDate);
            added = true;
          }
        }
      }
    }
    return added;
  }
  function setAllWeekEventsViewTitle(weekStartDate, weekEndDate) {
    _element_ListAllWeekEventsView_Title.innerHTML = _string.empty;
    if (_options.showWeekNumbersInTitles) {
      createSpanElement(_element_ListAllWeekEventsView_Title, _options.weekText + _string.space + getWeekNumber(weekStartDate) + ": ");
    }
    if (weekStartDate.getFullYear() === weekEndDate.getFullYear()) {
      buildDateTimeDisplay(_element_ListAllWeekEventsView_Title, weekStartDate, false, false);
      createSpanElement(_element_ListAllWeekEventsView_Title, " - ");
      buildDateTimeDisplay(_element_ListAllWeekEventsView_Title, weekEndDate, false, false);
      createSpanElement(_element_ListAllWeekEventsView_Title, ", " + weekStartDate.getFullYear());
    } else {
      buildDateTimeDisplay(_element_ListAllWeekEventsView_Title, weekStartDate, false, true);
      createSpanElement(_element_ListAllWeekEventsView_Title, " - ");
      buildDateTimeDisplay(_element_ListAllWeekEventsView_Title, weekEndDate, false, true);
    }
  }
  function buildListAllWeekEventsEvent(eventDetails, header, container, displayDate) {
    var added = false;
    var dateID = displayDate.getDate() + displayDate.getMonth() + displayDate.getFullYear();
    var seriesIgnoreDates = getArray(eventDetails.seriesIgnoreDates);
    var formattedDate = toStorageFormattedDate(displayDate);
    if (isEventVisible(eventDetails) && seriesIgnoreDates.indexOf(formattedDate) === -1) {
      clearElementsByClassName(container, "no-events-text");
      showElementsByClassName(header, "ib-close");
      var event = createElement("div", "event");
      event.setAttribute("event-type", getNumber(eventDetails.type));
      event.setAttribute("event-id", eventDetails.id);
      container.appendChild(event);
      _element_ListAllWeekEventsView_Contents_FullView_Events[dateID].push(event);
      event.oncontextmenu = function(e) {
        showEventDropDownMenu(e, eventDetails, formattedDate);
      };
      makeEventDraggable(event, eventDetails, displayDate, container);
      setEventClassesAndColors(event, eventDetails, getToTimeWithPassedDate(eventDetails, displayDate));
      setEventClassesForActions(event, eventDetails);
      if (doDatesMatch(eventDetails.from, displayDate)) {
        event.id = _elementID_WeekDay + eventDetails.id;
      }
      var title = createElement("div", "title");
      var repeatEvery = getNumber(eventDetails.repeatEvery);
      if (repeatEvery > _repeatType.never) {
        var icon = createElement("div", "ib-refresh-medium ib-no-hover ib-no-active");
        icon.style.borderColor = event.style.color;
        title.appendChild(icon);
      }
      title.innerHTML += stripHTMLTagsFromText(eventDetails.title);
      event.appendChild(title);
      var startTime = createElement("div", "date");
      event.appendChild(startTime);
      var duration = createElement("div", "duration");
      event.appendChild(duration);
      if (eventDetails.from.getDate() === eventDetails.to.getDate()) {
        if (eventDetails.isAllDay) {
          setNodeText(startTime, _options.allDayText);
        } else {
          setNodeText(startTime, getTimeToTimeDisplay(eventDetails.from, eventDetails.to));
          setNodeText(duration, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
        }
      } else {
        buildDateTimeToDateTimeDisplay(startTime, eventDetails.from, eventDetails.to);
        setNodeText(duration, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
      }
      if (duration.innerHTML === _string.empty) {
        event.removeChild(duration);
      }
      if (isDefinedNumber(eventDetails.repeatEvery) && eventDetails.repeatEvery > _repeatType.never) {
        var repeats = createElement("div", "repeats");
        setNodeText(repeats, _options.repeatsText.replace(":", _string.empty) + _string.space + getRepeatsText(eventDetails.repeatEvery));
        event.appendChild(repeats);
      }
      if (isDefinedStringAndSet(eventDetails.location)) {
        var location = createElement("div", "location");
        setNodeText(location, eventDetails.location);
        event.appendChild(location);
      }
      if (isDefinedStringAndSet(eventDetails.description)) {
        var description = createElement("div", "description");
        setNodeText(description, eventDetails.description);
        event.appendChild(description);
      }
      event.addEventListener("click", function(e) {
        storeMultiSelectEvent(e, eventDetails);
      });
      if (isOptionEventSet("onEventClick")) {
        event.addEventListener("click", function() {
          triggerOptionsEventWithData("onEventClick", eventDetails);
        });
      }
      if (_options.manualEditingEnabled) {
        event.ondblclick = function(e) {
          cancelBubble(e);
          showEventEditingDialog(eventDetails);
        };
      } else {
        if (isOptionEventSet("onEventDoubleClick")) {
          event.ondblclick = function() {
            triggerOptionsEventWithData("onEventDoubleClick", eventDetails);
          };
        }
      }
      added = true;
    }
    return added;
  }
  function buildAllWeekDays(weekStartDate, weekEndDate) {
    var startOfWeek = new Date(weekStartDate);
    var dayIndex = 1;
    do {
      buildListAllEventsDay(startOfWeek, dayIndex);
      moveDateForwardDay(startOfWeek);
    } while (startOfWeek < weekEndDate);
  }
  function buildListAllEventsDay(date) {
    var weekDayNumber = getWeekdayNumber(date);
    var dateID = date.getDate() + date.getMonth() + date.getFullYear();
    var dayContents = null;
    var dayHeader = null;
    var removeEventsDate = new Date(date);
    if (!_element_ListAllWeekEventsView_Contents_FullView.hasOwnProperty(dateID) && _options.visibleDays.indexOf(weekDayNumber) > -1) {
      var expandDate = new Date(date);
      var expandFunction = function() {
        showFullDayView(expandDate, true);
      };
      var addEventFunction = function() {
        if (_options.useTemplateWhenAddingNewEvent) {
          var newBlankTemplateEvent = buildBlankTemplateEvent(expandDate, expandDate);
          showEventEditingDialog(newBlankTemplateEvent);
          showEventEditingDialogTitleSelected();
        } else {
          showEventEditingDialog(null, expandDate);
        }
      };
      var day = createElement("div", "day");
      _element_ListAllWeekEventsView_Contents_FullView[dateID] = day;
      _element_ListAllWeekEventsView_Contents_FullView_Events[dateID] = [];
      _element_ListAllWeekEventsView_Contents_FullView_DateIDs.push(dateID);
      if (isWeekendDay(date)) {
        day.className += " weekend-day";
      }
      if (isWorkingDay(date)) {
        day.className += " working-day";
      }
      addHolidayColors(day, date);
      dayHeader = createElement("div", "header");
      dayHeader.ondblclick = expandFunction;
      day.appendChild(dayHeader);
      dayHeader.oncontextmenu = function(e) {
        showDayHeaderDropDownMenu(e, weekDayNumber);
      };
      buildDayDisplay(dayHeader, date, _options.dayNames[weekDayNumber] + _string.space);
      var holidayText = getHolidaysText(date);
      if (holidayText !== null) {
        createSpanElement(dayHeader, " (" + holidayText + ")", "light-title-bar-text");
      }
      buildToolbarButton(dayHeader, "ib-arrow-expand-left-right", _options.expandDayTooltipText, expandFunction);
      if (_options.manualEditingEnabled) {
        buildToolbarButton(dayHeader, "ib-plus", _options.addEventTooltipText, addEventFunction);
      }
      if (_options.manualEditingEnabled) {
        buildToolbarButton(dayHeader, "ib-close", _options.removeEventsTooltipText, function() {
          removeNonRepeatingEventsOnSpecificDate(removeEventsDate, doDatesMatch);
        });
      }
      var minimizeRestoreFunction = function() {
        minimizeRestoreWeeklyEventsDay(minimizeButton, dayContents, dateID);
      };
      var minimizeButton = buildToolbarButton(dayHeader, "ib-minus", _options.minimizedTooltipText, minimizeRestoreFunction);
      _element_ListAllWeekEventsView_MinimizeRestoreFunctions.push(minimizeRestoreFunction);
      dayContents = createElement("div", "events");
      day.appendChild(dayContents);
      if (_configuration.visibleWeeklyEventsDay.hasOwnProperty(dateID) && !_configuration.visibleWeeklyEventsDay[dateID]) {
        dayContents.style.display = "none";
        minimizeButton.className = "ib-square-hollow";
        addToolTip(minimizeButton, _options.restoreTooltipText);
      }
      makeAreaDroppable(dayContents, expandDate.getFullYear(), expandDate.getMonth(), expandDate.getDate());
      var noEventsTextContainer = createElement("div", "no-events-text");
      dayContents.appendChild(noEventsTextContainer);
      createSpanElement(noEventsTextContainer, _options.noEventsAvailableText);
      if (_options.manualEditingEnabled) {
        createSpanElement(noEventsTextContainer, _string.space + _options.clickText + _string.space);
        createSpanElement(noEventsTextContainer, _options.hereText, "link", addEventFunction);
        createSpanElement(noEventsTextContainer, _string.space + _options.toAddANewEventText);
      }
      _element_ListAllWeekEventsView_Contents_FullView_Contents[dateID] = [dayContents, dayHeader];
    } else {
      if (_element_ListAllWeekEventsView_Contents_FullView_Contents.hasOwnProperty(dateID)) {
        var existingContents = _element_ListAllWeekEventsView_Contents_FullView_Contents[dateID];
        dayContents = existingContents[0];
        dayHeader = existingContents[1];
      }
    }
    return [dayContents, dayHeader];
  }
  function minimizeRestoreWeeklyEventsDay(minimizeButton, dayContents, dateID) {
    if (dayContents.style.display !== "none") {
      dayContents.style.display = "none";
      minimizeButton.className = "ib-square-hollow";
      _configuration.visibleWeeklyEventsDay[dateID] = false;
      addToolTip(minimizeButton, _options.restoreTooltipText);
    } else {
      dayContents.style.display = "block";
      minimizeButton.className = "ib-minus";
      _configuration.visibleWeeklyEventsDay[dateID] = true;
      addToolTip(minimizeButton, _options.minimizedTooltipText);
    }
  }
  function updateViewAllWeekEventsViewFromEventEdit() {
    if (isOverlayVisible(_element_ListAllWeekEventsView)) {
      showListAllWeekEventsView(_element_ListAllWeekEventsView_DateSelected);
    }
  }
  function onPreviousWeek() {
    moveDateBackOneWeek(_element_ListAllWeekEventsView_DateSelected);
    showListAllWeekEventsView(_element_ListAllWeekEventsView_DateSelected, true);
  }
  function onNextWeek() {
    moveDateForwardWeek(_element_ListAllWeekEventsView_DateSelected);
    showListAllWeekEventsView(_element_ListAllWeekEventsView_DateSelected, true);
  }
  function onThisWeek() {
    _element_ListAllWeekEventsView_DateSelected = new Date();
    showListAllWeekEventsView(_element_ListAllWeekEventsView_DateSelected, true);
  }
  function callMinimizeRestoreFunctionsForWeekEventView() {
    if (isOverlayVisible(_element_ListAllWeekEventsView)) {
      var functionsLength = _element_ListAllWeekEventsView_MinimizeRestoreFunctions.length;
      var functionIndex = 0;
      for (; functionIndex < functionsLength; functionIndex++) {
        _element_ListAllWeekEventsView_MinimizeRestoreFunctions[functionIndex]();
      }
    }
  }
  function getTimeToTimeDisplay(fromDate, toDate) {
    return getTimeForDisplay(fromDate) + _string.space + _options.toTimeText + _string.space + getTimeForDisplay(toDate);
  }
  function getTimeForDisplay(date) {
    return padNumber(date.getHours()) + ":" + padNumber(date.getMinutes());
  }
  function buildDateTimeToDateTimeDisplay(container, fromDate, toDate) {
    container.innerHTML = _string.empty;
    buildDateTimeDisplay(container, fromDate);
    createSpanElement(container, _string.space + _options.toTimeText + _string.space);
    buildDateTimeDisplay(container, toDate);
  }
  function buildDateTimeDisplay(container, date, addTime, addYear, addDayName) {
    addTime = !isDefined(addTime) ? true : addTime;
    addYear = !isDefined(addYear) ? true : addYear;
    addDayName = !isDefined(addDayName) ? false : addDayName;
    if (addDayName) {
      createSpanElement(container, _options.dayNames[getWeekdayNumber(date)] + ", ");
    }
    buildDayDisplay(container, date);
    createSpanElement(container, _string.space + _options.monthNames[date.getMonth()]);
    if (addYear) {
      createSpanElement(container, _string.space + date.getFullYear());
    }
    if (addTime) {
      createSpanElement(container, _string.space + getTimeForDisplay(date));
    }
  }
  function buildDayDisplay(container, date, beforeText, afterText) {
    if (isDefined(beforeText)) {
      createSpanElement(container, beforeText);
    }
    createSpanElement(container, date.getDate());
    if (_options.showDayNumberOrdinals) {
      var sup = createElement("sup");
      sup.innerText = getDayOrdinal(date.getDate());
      container.appendChild(sup);
    }
    if (isDefined(afterText)) {
      createSpanElement(container, afterText);
    }
  }
  function buildPreviousMonthDays(startDay) {
    if (startDay > 1) {
      var previousMonth = new Date(_currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      var totalDaysInMonth = getTotalDaysInMonth(previousMonth.getFullYear(), previousMonth.getMonth());
      var elementDayNumber = 1;
      var dayStart = totalDaysInMonth - startDay + 1;
      var day = dayStart;
      for (; day < totalDaysInMonth; day++) {
        var addMonthName = day === totalDaysInMonth - 1;
        buildDay(day + 1, elementDayNumber, previousMonth.getMonth(), previousMonth.getFullYear(), true, addMonthName);
        elementDayNumber++;
      }
    }
  }
  function buildMonthDays(startDay) {
    var elementDayNumber = 0;
    var totalDaysInMonth = getTotalDaysInMonth(_currentDate.getFullYear(), _currentDate.getMonth());
    var day = 0;
    for (; day < totalDaysInMonth; day++) {
      elementDayNumber = startDay + day;
      buildDay(day + 1, elementDayNumber, _currentDate.getMonth(), _currentDate.getFullYear(), false);
    }
    return elementDayNumber;
  }
  function buildNextMonthDays(lastDayFilled) {
    if (lastDayFilled < 42) {
      var actualDay = 1;
      var nextMonth = new Date(_currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      var elementDayNumber = lastDayFilled + 1;
      for (; elementDayNumber < 43; elementDayNumber++) {
        var addMonthName = actualDay === 1;
        buildDay(actualDay, elementDayNumber, nextMonth.getMonth(), nextMonth.getFullYear(), true, addMonthName);
        actualDay++;
      }
      var nextDay = getTotalDaysInMonth(nextMonth.getFullYear(), nextMonth.getMonth());
      nextDay = Math.round(nextDay / 2);
      _largestDateInView = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextDay);
    } else {
      _largestDateInView = null;
    }
  }
  function buildDay(actualDay, elementDayNumber, month, year, isMuted, includeMonthName) {
    var dayElement = getElementByID(_elementID_DayElement + elementDayNumber);
    if (dayElement !== null) {
      var today = new Date();
      var dayIsToday = actualDay === today.getDate() && year === today.getFullYear() && month === today.getMonth();
      var dayText = createElement("span");
      var dayDate = new Date(year, month, actualDay);
      var dayMutedClass = isMuted ? " day-muted" : _string.empty;
      var allowDatePickerHoverAndSelect = true;
      includeMonthName = isDefined(includeMonthName) ? includeMonthName : false;
      dayElement.innerHTML = _string.empty;
      dayElement.className = dayElement.className.replace(" cell-today", _string.empty).replace(" cell-selected", _string.empty).replace(" cell-no-click", _string.empty);
      if (_datePickerModeEnabled && dayIsToday) {
        dayElement.className += " cell-today";
      }
      if (_datePickerModeEnabled && !dayIsToday && _currentDateForDatePicker !== null && doDatesMatch(dayDate, _currentDateForDatePicker)) {
        dayElement.className += " cell-selected";
      }
      if (_datePickerModeEnabled) {
        allowDatePickerHoverAndSelect = isDateValidForDatePicker(dayDate);
        if (!allowDatePickerHoverAndSelect) {
          dayElement.className += " cell-no-click";
          dayText.className = "no-click";
        }
      } else {
        dayText.className = _string.empty;
      }
      dayText.className += dayMutedClass;
      dayText.className += dayIsToday && !_datePickerModeEnabled ? " today" : _string.empty;
      dayText.innerText = actualDay;
      if (actualDay === 1 && !_datePickerModeEnabled) {
        dayText.className += " first-day";
      }
      if (isWeekendDay(dayDate) && dayElement.className.indexOf("weekend-day") === -1) {
        dayElement.className += " weekend-day";
      }
      if (isWorkingDay(dayDate) && dayElement.className.indexOf("working-day") === -1) {
        dayElement.className += " working-day";
      }
      dayElement.oncontextmenu = function(e) {
        showDayDropDownMenu(e, dayDate);
      };
      if (_options.showDayNumberOrdinals) {
        var sup = createElement("sup");
        sup.innerText = getDayOrdinal(actualDay);
        dayText.appendChild(sup);
      }
      dayElement.appendChild(dayText);
      dayElement.appendChild(createElement("span", "blank"));
      var expandDayButton = createElement("div", "ib-arrow-expand-left-right-icon");
      dayElement.appendChild(expandDayButton);
      addToolTip(expandDayButton, _options.expandDayTooltipText);
      expandDayButton.onclick = function() {
        showFullDayView(dayDate, true);
      };
      if (includeMonthName && _options.showPreviousNextMonthNamesInMainDisplay) {
        createSpanElement(dayElement, _options.monthNames[month], "month-name" + dayMutedClass, function() {
          if (actualDay === 1) {
            moveForwardMonth();
          } else {
            moveBackMonth();
          }
        }, true, true);
      }
      addHolidays(dayDate, dayMutedClass, dayElement);
      if (_options.manualEditingEnabled) {
        dayElement.ondblclick = function() {
          if (_options.useTemplateWhenAddingNewEvent) {
            var newBlankTemplateEvent = buildBlankTemplateEvent(dayDate, dayDate);
            showEventEditingDialog(newBlankTemplateEvent);
            showEventEditingDialogTitleSelected();
          } else {
            showEventEditingDialog(null, dayDate);
          }
        };
        makeAreaDroppable(dayElement, year, month, actualDay);
      }
      if (_datePickerModeEnabled) {
        if (allowDatePickerHoverAndSelect) {
          dayElement.onclick = function(e) {
            setDatePickerDate(e, dayDate);
          };
        } else {
          dayElement.onclick = cancelBubble;
        }
      }
      if (_options.useOnlyDotEventsForMainDisplay) {
        dayElement.appendChild(createElement("div", "dots-separator"));
      }
    }
  }
  function getHolidaysText(date) {
    var result = null;
    if (_options.showHolidays) {
      var holidayTextItems = [];
      var holidayTextItemsAnyCase = [];
      var holidaysLength = _options.holidays.length;
      var holidayIndex = 0;
      for (; holidayIndex < holidaysLength; holidayIndex++) {
        var holiday = _options.holidays[holidayIndex];
        var holidayText = getString(holiday.title, _string.empty);
        if (isHolidayDateValidForDate(holiday, date) && holidayText !== _string.empty && holidayTextItemsAnyCase.indexOf(holidayText.toLowerCase())) {
          holidayTextItems.push(holidayText);
          holidayTextItemsAnyCase.push(holidayText.toLowerCase());
        }
      }
      if (holidayTextItems.length > 0) {
        result = holidayTextItems.join(", ");
      }
    }
    return result;
  }
  function addHolidays(date, dayMutedClass, dayElement) {
    if (_options.showHolidays) {
      var holidayTextItemsAnyCase = [];
      var holidaysLength = _options.holidays.length;
      var holidayIndex = 0;
      for (; holidayIndex < holidaysLength; holidayIndex++) {
        var holiday = _options.holidays[holidayIndex];
        var holidayText = getString(holiday.title, _string.empty);
        var holidayBackgroundColor = getString(holiday.backgroundColor, _string.empty);
        var holidayTextColor = getString(holiday.textColor, _string.empty);
        if (isHolidayDateValidForDate(holiday, date) && holidayText !== _string.empty && holidayTextItemsAnyCase.indexOf(holidayText.toLowerCase())) {
          addHolidayText(holiday, dayElement, holidayText, dayMutedClass);
          if (holidayBackgroundColor !== _string.empty) {
            dayElement.style.setProperty("background-color", holidayBackgroundColor, "important");
          }
          if (holidayTextColor !== _string.empty) {
            dayElement.style.setProperty("color", holidayTextColor, "important");
          }
          holidayTextItemsAnyCase.push(holidayText.toLowerCase());
        }
      }
    }
  }
  function addHolidayText(holiday, dayElement, holidayText, dayMutedClass) {
    var className = isDefinedFunction(holiday.onClick) || isDefinedString(holiday.onClickUrl) ? "holiday-link" : "holiday";
    var onClickEvent = holiday.onClick;
    if (isDefinedString(holiday.onClickUrl)) {
      onClickEvent = function() {
        _window.open(holiday.onClickUrl, _options.urlWindowTarget);
      };
    }
    createSpanElement(dayElement, holidayText, className + dayMutedClass, onClickEvent, true, true);
  }
  function isHolidayDateValidForDate(holiday, date) {
    var day = getNumber(holiday.day);
    var month = getNumber(holiday.month);
    var year = getNumber(holiday.year);
    var valid = false;
    if (year === 0 && day === date.getDate() && month === date.getMonth() + 1) {
      valid = true;
    } else if (year > 0 && day === date.getDate() && month === date.getMonth() + 1 && year === date.getFullYear()) {
      valid = true;
    }
    return valid;
  }
  function addHolidayColors(container, date) {
    if (_options.showHolidays) {
      var holidaysLength = _options.holidays.length;
      var holidayIndex = 0;
      for (; holidayIndex < holidaysLength; holidayIndex++) {
        var holiday = _options.holidays[holidayIndex];
        var holidayText = getString(holiday.title, _string.empty);
        var holidayBackgroundColor = getString(holiday.backgroundColor, _string.empty);
        var holidayTextColor = getString(holiday.textColor, _string.empty);
        if (isHolidayDateValidForDate(holiday, date) && holidayText !== _string.empty) {
          if (holidayBackgroundColor !== _string.empty) {
            container.style.setProperty("background-color", holidayBackgroundColor, "important");
          }
          if (holidayTextColor !== _string.empty) {
            container.style.setProperty("color", holidayTextColor, "important");
          }
        }
      }
    }
  }
  function makeEventDraggable(event, eventDetails, dragFromDate, container) {
    if (!isEventLocked(eventDetails) && _options.dragAndDropForEventsEnabled && _options.manualEditingEnabled) {
      var draggedFromDate = new Date(dragFromDate);
      var isDateWeekendDay = isWeekendDay(draggedFromDate);
      var dragDisabledClass = !isDateWeekendDay ? " drag-not-allowed" : " drag-not-allowed-weekend-day";
      event.setAttribute("draggable", true);
      event.ondragstart = function(e) {
        triggerOptionsEventWithData("onEventDragStart", eventDetails);
        e.dataTransfer.setData("event_details", JSON.stringify(eventDetails));
        _eventDetails_Dragged_DateFrom = draggedFromDate;
        _eventDetails_Dragged = eventDetails;
        if (isDefined(container)) {
          container.className += dragDisabledClass;
          makeAreaNonDroppable(container);
        }
        updateContainerClassChildren("cell", function(element) {
          element.className += " prevent-pointer-events";
        }, event);
        updateContainerClassChildren("events", function(element) {
          element.className += " prevent-pointer-events";
        }, event);
      };
      event.ondragend = function() {
        triggerOptionsEventWithData("onEventDragStop", _eventDetails_Dragged);
        _eventDetails_Dragged_DateFrom = null;
        _eventDetails_Dragged = null;
        if (isDefined(container)) {
          container.className = container.className.replace(dragDisabledClass, _string.empty);
          makeAreaDroppable(container, draggedFromDate.getFullYear(), draggedFromDate.getMonth(), draggedFromDate.getDate());
        }
        updateContainerClassChildren("cell", function(element) {
          element.className = element.className.replace(" prevent-pointer-events", _string.empty);
        }, event);
        updateContainerClassChildren("events", function(element) {
          element.className = element.className.replace(" prevent-pointer-events", _string.empty);
        }, event);
      };
    }
  }
  function makeAreaDroppable(element, year, month, actualDay) {
    if (_options.dragAndDropForEventsEnabled && _options.manualEditingEnabled) {
      var areaDate = new Date(year, month, actualDay);
      element.ondragover = function(e) {
        showDraggingEffect(e, element, areaDate);
      };
      element.ondragenter = function(e) {
        showDraggingEffect(e, element, areaDate);
      };
      element.ondragleave = function(e) {
        hideDraggingEffect(e, element, areaDate);
      };
      element.ondrop = function(e) {
        cancelBubble(e);
        hideDraggingEffect(e, element, areaDate);
        if (e.dataTransfer.files.length === 0) {
          dropEventOnDay(e, year, month, actualDay);
        } else {
          dropFileOnDisplay(e);
        }
      };
    }
  }
  function makeAreaNonDroppable(element) {
    if (_options.dragAndDropForEventsEnabled && _options.manualEditingEnabled) {
      element.ondragover = null;
      element.ondragenter = null;
      element.ondragleave = null;
      element.ondrop = null;
    }
  }
  function showDraggingEffect(e, dayElement, areaDate) {
    cancelBubble(e);
    if (_eventDetails_Dragged !== null && dayElement.className.indexOf(" drag-over") === -1 && !doDatesMatch(_eventDetails_Dragged_DateFrom, areaDate)) {
      dayElement.className += " drag-over";
    }
  }
  function hideDraggingEffect(e, dayElement, areaDate) {
    cancelBubble(e);
    if (_eventDetails_Dragged !== null && dayElement.className.indexOf(" drag-over") > -1 && !doDatesMatch(_eventDetails_Dragged_DateFrom, areaDate)) {
      dayElement.className = dayElement.className.replace(" drag-over", _string.empty);
    }
  }
  function dropEventOnDay(e, year, month, day) {
    var dropDate = new Date(year, month, day);
    if (_eventDetails_Dragged !== null && !doDatesMatch(_eventDetails_Dragged_DateFrom, dropDate)) {
      triggerOptionsEventWithMultipleData("onEventDragDrop", _eventDetails_Dragged, dropDate);
      if (!isDefined(day)) {
        var totalDaysInMonth = getTotalDaysInMonth(year, month);
        day = _eventDetails_Dragged.from.getDate();
        if (day > totalDaysInMonth) {
          day = totalDaysInMonth;
        }
      }
      var daysBetweenDraggedFromAndFrom = getTotalDaysBetweenDates(_eventDetails_Dragged.from, _eventDetails_Dragged_DateFrom);
      var daysBetweenFromAndTo = getTotalDaysBetweenDates(_eventDetails_Dragged.from, _eventDetails_Dragged.to);
      var fromDate = new Date(year, month, day, _eventDetails_Dragged.from.getHours(), _eventDetails_Dragged.from.getMinutes());
      var toDate = new Date(year, month, day, _eventDetails_Dragged.to.getHours(), _eventDetails_Dragged.to.getMinutes());
      var repeatEndsDate = _eventDetails_Dragged.repeatEnds;
      if (daysBetweenDraggedFromAndFrom > 0) {
        fromDate.setDate(fromDate.getDate() - daysBetweenDraggedFromAndFrom);
        toDate.setDate(toDate.getDate() - daysBetweenDraggedFromAndFrom);
      }
      if (isDefined(repeatEndsDate)) {
        var newFromDaysDifference = getTotalDaysBetweenDates(fromDate, _eventDetails_Dragged.from);
        if (fromDate > _eventDetails_Dragged.from) {
          repeatEndsDate.setDate(repeatEndsDate.getDate() + newFromDaysDifference);
        } else {
          repeatEndsDate.setDate(repeatEndsDate.getDate() - newFromDaysDifference);
        }
      }
      if (daysBetweenFromAndTo > 0) {
        toDate.setDate(toDate.getDate() + daysBetweenFromAndTo);
      }
      _this.updateEventDateTimes(_eventDetails_Dragged.id, fromDate, toDate, repeatEndsDate);
      showNotificationPopUp(_options.eventUpdatedText.replace("{0}", _eventDetails_Dragged.title));
      refreshViews();
    } else {
      if (_eventDetails_Dragged === null) {
        dropEventsFromOtherCalendar(e, year, month, day);
      }
    }
  }
  function dropEventsFromOtherCalendar(e, year, month, day) {
    var eventDetails = getObjectFromString(e.dataTransfer.getData("event_details"));
    if (eventDetails !== null) {
      var sourceFromDate = new Date(eventDetails.from);
      var sourceToDate = new Date(eventDetails.to);
      eventDetails.from = new Date(year, month, day, sourceFromDate.getHours(), sourceFromDate.getMinutes(), 0, 0);
      eventDetails.to = new Date(year, month, day, sourceToDate.getHours(), sourceToDate.getMinutes(), 0, 0);
      _this.addEvent(eventDetails);
      showNotificationPopUp(_options.eventAddedText.replace("{0}", eventDetails.title));
    }
  }
  function dropFileOnDisplay(e) {
    if (isDefined(_window.FileReader)) {
      var reader = new FileReader();
      reader.onload = function(event) {
        _this.addEventsFromJson(event.target.result);
      };
      reader.readAsText(e.dataTransfer.files[0]);
    }
  }
  function getObjectFromString(objectString) {
    var result;
    try {
      result = JSON.parse(objectString);
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
      } catch (e2) {
        console.error("Errors in object: " + e1.message + ", " + e2.message);
        result = null;
      }
    }
    return result;
  }
  function buildDropDownMenus() {
    if (!_datePickerModeEnabled) {
      buildDayDropDownMenu();
      buildEventDropDownMenu();
      buildFullDayViewDropDownMenu();
      buildDayHeaderDropDownMenu();
    }
  }
  function buildDayDropDownMenu() {
    if (_element_DropDownMenu_Day !== null) {
      removeNode(_document.body, _element_DropDownMenu_Day);
      _element_DropDownMenu_Day_Paste_Separator = null;
      _element_DropDownMenu_Day_Paste = null;
    }
    _element_DropDownMenu_Day = createElement("div", "calendar-drop-down-menu");
    _document.body.appendChild(_element_DropDownMenu_Day);
    if (_options.manualEditingEnabled) {
      buildMenuItemWithIcon(_element_DropDownMenu_Day, "ib-plus-icon", _options.addEventTitle + "...", function() {
        if (_options.useTemplateWhenAddingNewEvent) {
          var newBlankTemplateEvent = buildBlankTemplateEvent(_element_DropDownMenu_Day_DateSelected, _element_DropDownMenu_Day_DateSelected);
          showEventEditingDialog(newBlankTemplateEvent);
          showEventEditingDialogTitleSelected();
        } else {
          showEventEditingDialog(null, _element_DropDownMenu_Day_DateSelected);
        }
      }, true);
      buildMenuSeparator(_element_DropDownMenu_Day);
    }
    buildMenuItemWithIcon(_element_DropDownMenu_Day, "ib-arrow-expand-left-right-icon", _options.expandDayTooltipText, function() {
      showFullDayView(_element_DropDownMenu_Day_DateSelected, true);
    });
    buildMenuSeparator(_element_DropDownMenu_Day);
    buildMenuItemWithIcon(_element_DropDownMenu_Day, "ib-hamburger-side-icon", _options.viewWeekEventsText, function() {
      showListAllWeekEventsView(_element_DropDownMenu_Day_DateSelected, true);
    });
    if (_options.manualEditingEnabled) {
      _element_DropDownMenu_Day_Paste_Separator = buildMenuSeparator(_element_DropDownMenu_Day);
      _element_DropDownMenu_Day_Paste = buildMenuItemWithIcon(_element_DropDownMenu_Day, "ib-circle-icon", _options.pasteText, function() {
        pasteEventsToDate(_element_DropDownMenu_Day_DateSelected, _copiedEventDetails_Cut);
      });
    }
  }
  function buildEventDropDownMenu() {
    if (_element_DropDownMenu_Event !== null) {
      removeNode(_document.body, _element_DropDownMenu_Event);
      _element_DropDownMenu_Event = null;
      _element_DropDownMenu_Event_OpenUrlSeparator = null;
      _element_DropDownMenu_Event_DuplicateSeparator = null;
      _element_DropDownMenu_Event_Duplicate = null;
      _element_DropDownMenu_Event_CutSeparator = null;
      _element_DropDownMenu_Event_Cut = null;
      _element_DropDownMenu_Event_CopySeparator = null;
      _element_DropDownMenu_Event_Copy = null;
      _element_DropDownMenu_Event_EditEvent = null;
      _element_DropDownMenu_Event_RemoveSeparator = null;
      _element_DropDownMenu_Event_Remove = null;
      _element_DropDownMenu_Event_ExportEventsSeparator = null;
      _element_DropDownMenu_Event_ExportEvents = null;
    }
    _element_DropDownMenu_Event = createElement("div", "calendar-drop-down-menu");
    _document.body.appendChild(_element_DropDownMenu_Event);
    if (_options.manualEditingEnabled) {
      _element_DropDownMenu_Event_EditEvent = buildMenuItemWithIcon(_element_DropDownMenu_Event, "ib-plus-icon", _options.editEventTitle + "...", function() {
        showEventEditingDialog(_element_DropDownMenu_Event_EventDetails);
      }, true);
      _element_DropDownMenu_Event_CutSeparator = buildMenuSeparator(_element_DropDownMenu_Event);
      _element_DropDownMenu_Event_Cut = buildMenuItemWithIcon(_element_DropDownMenu_Event, "ib-pipe-icon", _options.cutText, function() {
        setCopiedEventsClasses();
        _copiedEventDetails_Cut = true;
        setCopiedEvents(_element_DropDownMenu_Event_EventDetails);
        setCopiedEventsClasses(false);
      });
      _element_DropDownMenu_Event_CopySeparator = buildMenuSeparator(_element_DropDownMenu_Event);
      _element_DropDownMenu_Event_Copy = buildMenuItemWithIcon(_element_DropDownMenu_Event, "ib-circle-hollow-icon", _options.copyText, function() {
        setCopiedEventsClasses();
        _copiedEventDetails_Cut = false;
        setCopiedEvents(_element_DropDownMenu_Event_EventDetails);
        setCopiedEventsClasses(false);
      });
      _element_DropDownMenu_Event_DuplicateSeparator = buildMenuSeparator(_element_DropDownMenu_Event);
      _element_DropDownMenu_Event_Duplicate = buildMenuItemWithIcon(_element_DropDownMenu_Event, "ib-equals-icon", _options.duplicateText + "...", function() {
        showEventEditingDialog(_element_DropDownMenu_Event_EventDetails);
        setEventEditingDialogInDuplicateMode();
      });
      _element_DropDownMenu_Event_RemoveSeparator = buildMenuSeparator(_element_DropDownMenu_Event);
      _element_DropDownMenu_Event_Remove = buildMenuItemWithIcon(_element_DropDownMenu_Event, "ib-close-icon", _options.removeEventText, function() {
        addNode(_document.body, _element_DisabledBackground);
        var onNoEvent = function() {
          removeNode(_document.body, _element_DisabledBackground);
        };
        var onYesEvent = function() {
          onNoEvent();
          if (isDefined(_element_DropDownMenu_Event_EventDetails.id)) {
            if (!_element_MessageDialog_RemoveAllEvents.checked && _element_DropDownMenu_Event_FormattedDateSelected !== null) {
              if (isDefinedArray(_element_DropDownMenu_Event_EventDetails.seriesIgnoreDates)) {
                _element_DropDownMenu_Event_EventDetails.seriesIgnoreDates.push(_element_DropDownMenu_Event_FormattedDateSelected);
              } else {
                _element_DropDownMenu_Event_EventDetails.seriesIgnoreDates = [_element_DropDownMenu_Event_FormattedDateSelected];
              }
              buildDayEvents();
            } else {
              _this.removeEvent(_element_DropDownMenu_Event_EventDetails.id, true);
              showNotificationPopUp(_options.eventRemovedText.replace("{0}", _element_DropDownMenu_Event_EventDetails.title));
            }
            refreshOpenedViews();
          }
        };
        var repeatEvery = getNumber(_element_DropDownMenu_Event_EventDetails.repeatEvery);
        var showCheckBox = repeatEvery > _repeatType.never && _element_DropDownMenu_Event_FormattedDateSelected !== null;
        showMessageDialog(_options.confirmEventRemoveTitle, _options.confirmEventRemoveMessage, onYesEvent, onNoEvent, showCheckBox);
      });
      _element_DropDownMenu_Event_OpenUrlSeparator = buildMenuSeparator(_element_DropDownMenu_Event);
    }
    _element_DropDownMenu_Event_OpenUrl = buildMenuItemWithIcon(_element_DropDownMenu_Event, "ib-arrow-top-right-icon", _options.openUrlText, function() {
      openEventUrl(_element_DropDownMenu_Event_EventDetails.url);
    });
    if (_options.exportEventsEnabled) {
      _element_DropDownMenu_Event_ExportEventsSeparator = buildMenuSeparator(_element_DropDownMenu_Event);
      _element_DropDownMenu_Event_ExportEvents = buildMenuItemWithIcon(_element_DropDownMenu_Event, "ib-arrow-down-full-line-icon", _options.exportEventsTooltipText + "...", function() {
        showExportEventsDialog(_eventsSelected);
      });
    }
  }
  function buildFullDayViewDropDownMenu() {
    if (_element_DropDownMenu_FullDay !== null) {
      removeNode(_document.body, _element_DropDownMenu_FullDay);
      _element_DropDownMenu_FullDay = null;
      _element_DropDownMenu_FullDay_RemoveEvents_Separator = null;
      _element_DropDownMenu_FullDay_RemoveEvents = null;
      _element_DropDownMenu_FullDay_Paste_Separator = null;
      _element_DropDownMenu_FullDay_Paste = null;
    }
    if (_options.manualEditingEnabled) {
      _element_DropDownMenu_FullDay = createElement("div", "calendar-drop-down-menu");
      _document.body.appendChild(_element_DropDownMenu_FullDay);
      buildMenuItemWithIcon(_element_DropDownMenu_FullDay, "ib-plus-icon", _options.addEventTitle + "...", function() {
        if (_options.useTemplateWhenAddingNewEvent) {
          var newBlankTemplateEvent = buildBlankTemplateEvent(_element_FullDayView_DateSelected, _element_FullDayView_DateSelected, _element_FullDayView_ContextMenu_ClickPositionHourMinutes, _element_FullDayView_ContextMenu_ClickPositionHourMinutes);
          showEventEditingDialog(newBlankTemplateEvent);
          showEventEditingDialogTitleSelected();
        } else {
          showEventEditingDialog(null, _element_FullDayView_DateSelected, _element_FullDayView_ContextMenu_ClickPositionHourMinutes);
        }
      }, true);
      _element_DropDownMenu_FullDay_RemoveEvents_Separator = buildMenuSeparator(_element_DropDownMenu_FullDay);
      _element_DropDownMenu_FullDay_RemoveEvents = buildMenuItemWithIcon(_element_DropDownMenu_FullDay, "ib-close-icon", _options.removeEventsTooltipText, function() {
        removeNonRepeatingEventsOnSpecificDate(_element_FullDayView_DateSelected, doDatesMatch);
      });
      _element_DropDownMenu_FullDay_Paste_Separator = buildMenuSeparator(_element_DropDownMenu_FullDay);
      _element_DropDownMenu_FullDay_Paste = buildMenuItemWithIcon(_element_DropDownMenu_FullDay, "ib-circle-icon", _options.pasteText, function() {
        pasteEventsToDate(_element_FullDayView_DateSelected, _copiedEventDetails_Cut);
      });
    }
  }
  function buildDayHeaderDropDownMenu() {
    if (_element_DropDownMenu_HeaderDay === null) {
      _element_DropDownMenu_HeaderDay = createElement("div", "calendar-drop-down-menu");
      _document.body.appendChild(_element_DropDownMenu_HeaderDay);
      _element_DropDownMenu_HeaderDay_HideDay = buildMenuItemWithIcon(_element_DropDownMenu_HeaderDay, "ib-close-icon", _options.hideDayText, function() {
        _options.visibleDays.splice(_options.visibleDays.indexOf(_element_DropDownMenu_HeaderDay_SelectedDay), 1);
        _initialized = false;
        triggerOptionsEventWithData("onOptionsUpdated", _options);
        build(_currentDate, true, true);
      }, true);
      _element_DropDownMenu_HeaderDay_HideDay_Separator = buildMenuSeparator(_element_DropDownMenu_HeaderDay);
      _element_DropDownMenu_HeaderDay_ShowOnlyWorkingDays = buildMenuItemWithIcon(_element_DropDownMenu_HeaderDay, "ib-rhombus-hollow-icon", _options.showOnlyWorkingDaysText, function() {
        if (_options.workingDays.length >= 1) {
          _options.visibleDays = [].slice.call(_options.workingDays);
          _initialized = false;
          triggerOptionsEventWithData("onOptionsUpdated", _options);
          build(_currentDate, true, true);
        }
      });
      _element_DropDownMenu_HeaderDay_ShowOnlyWorkingDays_Separator = buildMenuSeparator(_element_DropDownMenu_HeaderDay);
      buildMenuItemWithIcon(_element_DropDownMenu_HeaderDay, "ib-octagon-hollow-icon", _options.visibleDaysText + "...", function() {
        showSideMenu(true);
      });
    }
  }
  function buildMenuItemWithIcon(container, iconCSS, text, onClickEvent, isBold) {
    isBold = isDefined(isBold) ? isBold : false;
    var menuItem = createElement("div", "item");
    container.appendChild(menuItem);
    menuItem.appendChild(createElement("div", iconCSS));
    var menuText = createElement("div", "menu-text");
    setNodeText(menuText, text);
    menuItem.appendChild(menuText);
    if (isBold) {
      menuText.className += " bold";
    }
    menuItem.onclick = function() {
      onClickEvent();
    };
    return menuItem;
  }
  function buildMenuSeparator(container) {
    var separator = createElement("div", "separator");
    container.appendChild(separator);
    return separator;
  }
  function showDayDropDownMenu(e, date) {
    if (!_datePickerModeEnabled && _element_DropDownMenu_Day !== null) {
      if (!isControlKey(e)) {
        clearSelectedEvents();
      }
      _element_DropDownMenu_Day_DateSelected = new Date(date);
      if (_element_DropDownMenu_Day_Paste !== null) {
        var display = _copiedEventDetails.length > 0 ? "block" : "none";
        _element_DropDownMenu_Day_Paste_Separator.style.display = display;
        _element_DropDownMenu_Day_Paste.style.display = display;
      }
      hideAllDropDowns();
      cancelBubble(e);
      showElementAtMousePosition(e, _element_DropDownMenu_Day);
    }
  }
  function showEventDropDownMenu(e, eventDetails, selectedDate) {
    if (_element_DropDownMenu_Event !== null) {
      var url = getString(eventDetails.url);
      var locked = isEventLocked(eventDetails);
      if (!isControlKey(e)) {
        clearSelectedEvents();
      }
      _element_DropDownMenu_Event_EventDetails = eventDetails;
      _element_DropDownMenu_Event_FormattedDateSelected = isDefined(selectedDate) ? selectedDate : null;
      if (_eventsSelected.length > 1) {
        if (_options.manualEditingEnabled) {
          _element_DropDownMenu_Event_EditEvent.style.display = "none";
          _element_DropDownMenu_Event_CutSeparator.style.display = "none";
          _element_DropDownMenu_Event_Cut.style.display = "block";
          _element_DropDownMenu_Event_CopySeparator.style.display = "block";
          _element_DropDownMenu_Event_Copy.style.display = "block";
          _element_DropDownMenu_Event_DuplicateSeparator.style.display = "none";
          _element_DropDownMenu_Event_Duplicate.style.display = "none";
          _element_DropDownMenu_Event_RemoveSeparator.style.display = "none";
          _element_DropDownMenu_Event_Remove.style.display = "none";
        }
        _element_DropDownMenu_Event_OpenUrlSeparator.style.display = "none";
        _element_DropDownMenu_Event_OpenUrl.style.display = "none";
        if (_options.exportEventsEnabled) {
          _element_DropDownMenu_Event_ExportEventsSeparator.style.display = "block";
          _element_DropDownMenu_Event_ExportEvents.style.display = "block";
        }
      } else if (locked) {
        if (_options.manualEditingEnabled) {
          _element_DropDownMenu_Event_EditEvent.style.display = "block";
          _element_DropDownMenu_Event_CutSeparator.style.display = "none";
          _element_DropDownMenu_Event_Cut.style.display = "none";
          _element_DropDownMenu_Event_CopySeparator.style.display = "none";
          _element_DropDownMenu_Event_Copy.style.display = "none";
          _element_DropDownMenu_Event_DuplicateSeparator.style.display = "none";
          _element_DropDownMenu_Event_Duplicate.style.display = "none";
          _element_DropDownMenu_Event_RemoveSeparator.style.display = "block";
          _element_DropDownMenu_Event_Remove.style.display = "block";
          if (url !== _string.empty) {
            _element_DropDownMenu_Event_OpenUrlSeparator.style.display = "block";
          } else {
            _element_DropDownMenu_Event_OpenUrlSeparator.style.display = "none";
          }
        }
        if (url !== _string.empty) {
          _element_DropDownMenu_Event_OpenUrl.style.display = "block";
        } else {
          _element_DropDownMenu_Event_OpenUrl.style.display = "none";
        }
        if (_options.exportEventsEnabled) {
          _element_DropDownMenu_Event_ExportEventsSeparator.style.display = "none";
          _element_DropDownMenu_Event_ExportEvents.style.display = "none";
        }
      } else {
        if (_options.manualEditingEnabled) {
          _element_DropDownMenu_Event_EditEvent.style.display = "block";
          _element_DropDownMenu_Event_CutSeparator.style.display = "block";
          _element_DropDownMenu_Event_Cut.style.display = "block";
          _element_DropDownMenu_Event_CopySeparator.style.display = "block";
          _element_DropDownMenu_Event_Copy.style.display = "block";
          _element_DropDownMenu_Event_DuplicateSeparator.style.display = "block";
          _element_DropDownMenu_Event_Duplicate.style.display = "block";
          _element_DropDownMenu_Event_RemoveSeparator.style.display = "block";
          _element_DropDownMenu_Event_Remove.style.display = "block";
          if (url !== _string.empty) {
            _element_DropDownMenu_Event_OpenUrlSeparator.style.display = "block";
          } else {
            _element_DropDownMenu_Event_OpenUrlSeparator.style.display = "none";
          }
        }
        if (url !== _string.empty) {
          _element_DropDownMenu_Event_OpenUrl.style.display = "block";
        } else {
          _element_DropDownMenu_Event_OpenUrl.style.display = "none";
        }
        if (_options.exportEventsEnabled) {
          _element_DropDownMenu_Event_ExportEventsSeparator.style.display = "none";
          _element_DropDownMenu_Event_ExportEvents.style.display = "none";
        }
      }
      if (url !== _string.empty || _element_DropDownMenu_Event.childElementCount > 1) {
        hideAllDropDowns();
        cancelBubble(e);
        showElementAtMousePosition(e, _element_DropDownMenu_Event);
      }
    }
  }
  function showFullDayDropDownMenu(e) {
    if (_element_DropDownMenu_FullDay !== null) {
      if (!isControlKey(e)) {
        clearSelectedEvents();
      }
      if (_element_DropDownMenu_FullDay_Paste !== null) {
        var pasteDisplay = _copiedEventDetails.length > 0 ? "block" : "none";
        _element_DropDownMenu_FullDay_Paste_Separator.style.display = pasteDisplay;
        _element_DropDownMenu_FullDay_Paste.style.display = pasteDisplay;
      }
      if (_element_FullDayView_EventsShown !== null) {
        var removeEventsDisplay = _element_FullDayView_EventsShown.length > 0 ? "block" : "none";
        _element_DropDownMenu_FullDay_RemoveEvents_Separator.style.display = removeEventsDisplay;
        _element_DropDownMenu_FullDay_RemoveEvents.style.display = removeEventsDisplay;
      }
      hideAllDropDowns();
      cancelBubble(e);
      showElementAtMousePosition(e, _element_DropDownMenu_FullDay);
    }
  }
  function showDayHeaderDropDownMenu(e, selectedDay) {
    if (!_datePickerModeEnabled) {
      if (!isControlKey(e)) {
        clearSelectedEvents();
      }
      hideAllDropDowns();
      if (_options.showSideMenuDays) {
        _element_DropDownMenu_HeaderDay_SelectedDay = selectedDay;
        var hideDayDisplay = _options.visibleDays.length > 1 ? "block" : "none";
        var showOnlyWorkingDaysDisplay = _options.workingDays.length >= 1 && !areArraysTheSame(_options.workingDays, _options.visibleDays) ? "block" : "none";
        _element_DropDownMenu_HeaderDay_HideDay.style.display = hideDayDisplay;
        _element_DropDownMenu_HeaderDay_HideDay_Separator.style.display = hideDayDisplay;
        _element_DropDownMenu_HeaderDay_ShowOnlyWorkingDays.style.display = showOnlyWorkingDaysDisplay;
        _element_DropDownMenu_HeaderDay_ShowOnlyWorkingDays_Separator.style.display = showOnlyWorkingDaysDisplay;
        cancelBubble(e);
        showElementAtMousePosition(e, _element_DropDownMenu_HeaderDay);
      }
    }
  }
  function hideDropDownMenu(element) {
    var closed = false;
    if (isDropDownMenuVisible(element)) {
      element.style.display = "none";
      closed = true;
    }
    return closed;
  }
  function isDropDownMenuVisible(element) {
    return element !== null && element.style.display === "block";
  }
  function areDropDownMenusVisible() {
    return isDropDownMenuVisible(_element_DropDownMenu_Day) || isDropDownMenuVisible(_element_DropDownMenu_Event) || isDropDownMenuVisible(_element_DropDownMenu_FullDay) || isDropDownMenuVisible(_element_DropDownMenu_HeaderDay) || isDropDownMenuVisible(_element_SearchDialog_History_DropDown);
  }
  function buildDisabledBackground() {
    if (_element_DisabledBackground === null && !_datePickerModeEnabled) {
      _element_DisabledBackground = createElement("div", "disabled-background");
    }
  }
  function isDisabledBackgroundDisplayed() {
    return _document.body.contains(_element_DisabledBackground);
  }
  function buildEventEditingDialog() {
    if (!_datePickerModeEnabled && _element_EventEditorDialog === null) {
      _element_EventEditorDialog = createElement("div", "calendar-dialog event-editor");
      _document.body.appendChild(_element_EventEditorDialog);
      var view = createElement("div", "view");
      _element_EventEditorDialog.appendChild(view);
      _element_EventEditorDialog_DisabledArea = createElement("div", "disabled-area");
      view.appendChild(_element_EventEditorDialog_DisabledArea);
      _element_EventEditorDialog_TitleBar = createElement("div", "title-bar");
      view.appendChild(_element_EventEditorDialog_TitleBar);
      makeDialogMovable(_element_EventEditorDialog_TitleBar, _element_EventEditorDialog, null);
      var contents = createElement("div", "contents");
      view.appendChild(contents);
      var tabsContainer = buildTabContainer(contents);
      buildTab(tabsContainer, _options.eventText, function(tab) {
        showTabContents(tab, _element_EventEditorDialog_Tab_Event, _element_EventEditorDialog);
      }, true);
      buildTab(tabsContainer, _options.typeText.replace(":", _string.empty), function(tab) {
        showTabContents(tab, _element_EventEditorDialog_Tab_Type, _element_EventEditorDialog);
      });
      buildTab(tabsContainer, _options.repeatsText.replace(":", _string.empty), function(tab) {
        showTabContents(tab, _element_EventEditorDialog_Tab_Repeats, _element_EventEditorDialog);
      });
      buildTab(tabsContainer, _options.optionalText, function(tab) {
        showTabContents(tab, _element_EventEditorDialog_Tab_Extra, _element_EventEditorDialog);
      });
      _element_EventEditorDialog_Tab_Event = buildTabContents(contents, true, false);
      _element_EventEditorDialog_Tab_Type = buildTabContents(contents, false, false);
      _element_EventEditorDialog_Tab_Repeats = buildTabContents(contents, false, false);
      _element_EventEditorDialog_Tab_Extra = buildTabContents(contents, false, false);
      buildEventEditorEventTabContent();
      buildEventEditorRepeatsTabContent();
      buildEventEditorExtraTabContent();
      var buttonsContainer = createElement("div", "buttons-container");
      contents.appendChild(buttonsContainer);
      _element_EventEditorDialog_RemoveButton = createButtonElement(buttonsContainer, _options.removeEventText, "remove", eventDialogEvent_Remove);
      _element_EventEditorDialog_AddUpdateButton = createButtonElement(buttonsContainer, _options.addText, "add-update", eventDialogEvent_OK);
      createButtonElement(buttonsContainer, _options.cancelText, "cancel", eventDialogEvent_Cancel);
    }
  }
  function buildEventEditorEventTabContent() {
    createTextHeaderElement(_element_EventEditorDialog_Tab_Event, _options.titleText);
    var inputTitleContainer = createElement("div", "input-title-container");
    _element_EventEditorDialog_Tab_Event.appendChild(inputTitleContainer);
    _element_EventEditorDialog_Title = createElement("input", null, "text");
    inputTitleContainer.appendChild(_element_EventEditorDialog_Title);
    _element_EventEditorDialog_Title.onkeydown = function(e) {
      if (e.keyCode === _keyCodes.enter) {
        eventDialogEvent_OK();
      }
    };
    if (_options.maximumEventTitleLength > 0) {
      _element_EventEditorDialog_Title.maxLength = _options.maximumEventTitleLength;
    }
    var isAllDayChangedEvent = function() {
      isAllDayChanged(null);
    };
    _element_EventEditorDialog_SelectColors = createButtonElement(inputTitleContainer, "...", "select-colors", showEventEditorColorsDialog, _options.selectColorsText);
    createTextHeaderElement(_element_EventEditorDialog_Tab_Event, _options.fromText.replace(":", _string.empty) + "/" + _options.toText);
    var fromSplitContainer = createElement("div", "split");
    _element_EventEditorDialog_Tab_Event.appendChild(fromSplitContainer);
    _element_EventEditorDialog_DateFrom = createElement("input");
    _element_EventEditorDialog_DateFrom.onchange = isAllDayChangedEvent;
    fromSplitContainer.appendChild(_element_EventEditorDialog_DateFrom);
    setInputType(_element_EventEditorDialog_DateFrom, "date");
    _element_EventEditorDialog_TimeFrom = createElement("input");
    fromSplitContainer.appendChild(_element_EventEditorDialog_TimeFrom);
    setInputType(_element_EventEditorDialog_TimeFrom, "time");
    var toSplitContainer = createElement("div", "split");
    _element_EventEditorDialog_Tab_Event.appendChild(toSplitContainer);
    _element_EventEditorDialog_DateTo = createElement("input");
    _element_EventEditorDialog_DateTo.onchange = isAllDayChangedEvent;
    toSplitContainer.appendChild(_element_EventEditorDialog_DateTo);
    setInputType(_element_EventEditorDialog_DateTo, "date");
    _element_EventEditorDialog_TimeTo = createElement("input");
    toSplitContainer.appendChild(_element_EventEditorDialog_TimeTo);
    setInputType(_element_EventEditorDialog_TimeTo, "time");
    _element_EventEditorDialog_IsAllDay = buildCheckBox(_element_EventEditorDialog_Tab_Event, _options.isAllDayText, isAllDayChangedEvent)[0];
    _element_EventEditorDialog_ShowAlerts = buildCheckBox(_element_EventEditorDialog_Tab_Event, _options.showAlertsText)[0];
    _element_EventEditorDialog_ShowAsBusy = buildCheckBox(_element_EventEditorDialog_Tab_Event, _options.showAsBusyText)[0];
  }
  function buildEventEditorTypeTabContent() {
    _element_EventEditorDialog_Tab_Type.innerHTML = _string.empty;
    var radioButtonsTypesContainer = createElement("div", "radio-buttons-container");
    _element_EventEditorDialog_Tab_Type.appendChild(radioButtonsTypesContainer);
    var eventType;
    for (eventType in _eventType) {
      if (_eventType.hasOwnProperty(eventType)) {
        _eventType[eventType].eventEditorInput = buildRadioButton(radioButtonsTypesContainer, _eventType[eventType].text, "Type");
      }
    }
  }
  function buildEventEditorRepeatsTabContent() {
    var radioButtonsRepeatsContainer = createElement("div", "radio-buttons-container");
    _element_EventEditorDialog_Tab_Repeats.appendChild(radioButtonsRepeatsContainer);
    _element_EventEditorDialog_RepeatEvery_Never = buildRadioButton(radioButtonsRepeatsContainer, _options.repeatsNever, "RepeatType", repeatEveryEvent);
    _element_EventEditorDialog_RepeatEvery_EveryDay = buildRadioButton(radioButtonsRepeatsContainer, _options.repeatsEveryDayText, "RepeatType", repeatEveryEvent);
    _element_EventEditorDialog_RepeatEvery_EveryWeek = buildRadioButton(radioButtonsRepeatsContainer, _options.repeatsEveryWeekText, "RepeatType", repeatEveryEvent);
    _element_EventEditorDialog_RepeatEvery_Every2Weeks = buildRadioButton(radioButtonsRepeatsContainer, _options.repeatsEvery2WeeksText, "RepeatType", repeatEveryEvent);
    _element_EventEditorDialog_RepeatEvery_EveryMonth = buildRadioButton(radioButtonsRepeatsContainer, _options.repeatsEveryMonthText, "RepeatType", repeatEveryEvent);
    _element_EventEditorDialog_RepeatEvery_EveryYear = buildRadioButton(radioButtonsRepeatsContainer, _options.repeatsEveryYearText, "RepeatType", repeatEveryEvent);
    _element_EventEditorDialog_RepeatEvery_Custom = buildRadioButton(radioButtonsRepeatsContainer, _options.repeatsCustomText, "RepeatType", repeatEveryEvent);
    _element_EventEditorDialog_RepeatEvery_RepeatOptionsButton = createButtonElement(radioButtonsRepeatsContainer, "...", "repeat-options", showEventEditorRepeatOptionsDialog, _options.repeatOptionsTitle);
    var toSplitContainer = createElement("div", "split split-margin");
    _element_EventEditorDialog_Tab_Repeats.appendChild(toSplitContainer);
    _element_EventEditorDialog_RepeatEvery_Custom_Value = createElement("input", null, "number");
    _element_EventEditorDialog_RepeatEvery_Custom_Value.setAttribute("min", "1");
    toSplitContainer.appendChild(_element_EventEditorDialog_RepeatEvery_Custom_Value);
    var radioButtonsCustomRepeatsContainer = createElement("div", "radio-buttons-container split-contents");
    toSplitContainer.appendChild(radioButtonsCustomRepeatsContainer);
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Daily = buildRadioButton(radioButtonsCustomRepeatsContainer, _options.dailyText, "RepeatCustomType");
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Weekly = buildRadioButton(radioButtonsCustomRepeatsContainer, _options.weeklyText, "RepeatCustomType");
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Monthly = buildRadioButton(radioButtonsCustomRepeatsContainer, _options.monthlyText, "RepeatCustomType");
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Yearly = buildRadioButton(radioButtonsCustomRepeatsContainer, _options.yearlyText, "RepeatCustomType");
  }
  function buildEventEditorExtraTabContent() {
    var inputFields1TextSplitContainer = createElement("div", "split");
    _element_EventEditorDialog_Tab_Extra.appendChild(inputFields1TextSplitContainer);
    createTextHeaderElement(inputFields1TextSplitContainer, _options.locationText);
    createTextHeaderElement(inputFields1TextSplitContainer, _options.groupText);
    var inputFields1SplitContainer = createElement("div", "split");
    _element_EventEditorDialog_Tab_Extra.appendChild(inputFields1SplitContainer);
    _element_EventEditorDialog_Location = createElement("input", null, "text");
    inputFields1SplitContainer.appendChild(_element_EventEditorDialog_Location);
    if (_options.maximumEventLocationLength > 0) {
      _element_EventEditorDialog_Location.maxLength = _options.maximumEventLocationLength;
    }
    _element_EventEditorDialog_Group = createElement("input", null, "text");
    inputFields1SplitContainer.appendChild(_element_EventEditorDialog_Group);
    if (_options.maximumEventGroupLength > 0) {
      _element_EventEditorDialog_Group.maxLength = _options.maximumEventGroupLength;
    }
    createTextHeaderElement(_element_EventEditorDialog_Tab_Extra, _options.descriptionText);
    _element_EventEditorDialog_Description = createElement("textarea", "custom-scroll-bars");
    _element_EventEditorDialog_Tab_Extra.appendChild(_element_EventEditorDialog_Description);
    if (_options.maximumEventDescriptionLength > 0) {
      _element_EventEditorDialog_Description.maxLength = _options.maximumEventDescriptionLength;
    }
    createTextHeaderElement(_element_EventEditorDialog_Tab_Extra, _options.urlText);
    _element_EventEditorDialog_Url = createElement("input", null, "url");
    _element_EventEditorDialog_Tab_Extra.appendChild(_element_EventEditorDialog_Url);
  }
  function addNewEvent() {
    showEventEditingDialog(null, _element_FullDayView_DateSelected);
  }
  function repeatEveryEvent() {
    _element_EventEditorDialog_RepeatEvery_RepeatOptionsButton.disabled = _element_EventEditorDialog_RepeatEvery_Never.checked;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Yearly.disabled = !_element_EventEditorDialog_RepeatEvery_Custom.checked;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Daily.disabled = !_element_EventEditorDialog_RepeatEvery_Custom.checked;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Weekly.disabled = !_element_EventEditorDialog_RepeatEvery_Custom.checked;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Monthly.disabled = !_element_EventEditorDialog_RepeatEvery_Custom.checked;
    _element_EventEditorDialog_RepeatEvery_Custom_Value.disabled = !_element_EventEditorDialog_RepeatEvery_Custom.checked;
  }
  function isAllDayChanged(eventDetails) {
    eventDetails = isDefined(eventDetails) ? eventDetails : _element_EventEditorDialog_EventDetails;
    var disabled = false;
    var locked = isDefined(eventDetails) && isDefinedBoolean(eventDetails.locked) ? eventDetails.locked : false;
    if (locked) {
      disabled = true;
    } else {
      if (_element_EventEditorDialog_IsAllDay.checked) {
        _element_EventEditorDialog_DateTo.value = _element_EventEditorDialog_DateFrom.value;
        _element_EventEditorDialog_TimeFrom.value = "00:00";
        _element_EventEditorDialog_TimeTo.value = "23:59";
        disabled = true;
      }
    }
    _element_EventEditorDialog_DateTo.disabled = disabled;
    _element_EventEditorDialog_TimeFrom.disabled = disabled;
    _element_EventEditorDialog_TimeTo.disabled = disabled;
    var fromDate = getSelectedDate(_element_EventEditorDialog_DateFrom);
    var toDate = getSelectedDate(_element_EventEditorDialog_DateTo);
    setMinimumDate(_element_EventEditorDialog_DateTo, fromDate);
    setMinimumDate(_element_EventEditorRepeatOptionsDialog_RepeatEnds, toDate);
    if (fromDate > toDate) {
      setSelectedDate(fromDate, _element_EventEditorDialog_DateTo);
    }
    if (!locked) {
      if (toDate > fromDate || toDate < fromDate) {
        disabled = true;
        _element_EventEditorDialog_RepeatEvery_Never.checked = true;
      } else {
        disabled = false;
      }
    }
    _element_EventEditorDialog_RepeatEvery_Never.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_EveryDay.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_EveryWeek.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_Every2Weeks.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_EveryMonth.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_EveryYear.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_Custom.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_RepeatOptionsButton.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_Custom_Value.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Daily.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Weekly.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Monthly.disabled = disabled;
    _element_EventEditorDialog_RepeatEvery_Custom_Type_Yearly.disabled = disabled;
    if (!locked) {
      repeatEveryEvent();
    }
  }
  function showEventEditingDialog(eventDetails, overrideTodayDate, overrideTimeValues) {
    if (isFunction(_options.onBeforeEventAddEdit)) {
      triggerOptionsEventWithData("onBeforeEventAddEdit", eventDetails);
    } else {
      addNode(_document.body, _element_DisabledBackground);
      selectTab(_element_EventEditorDialog);
      buildEventEditorTypeTabContent();
      if (isDefined(eventDetails)) {
        setNodeText(_element_EventEditorDialog_TitleBar, _options.editEventTitle);
        setEventTypeInputCheckedStates(eventDetails.type);
        _element_EventEditorDialog_AddUpdateButton.value = _options.updateText;
        _element_EventEditorDialog_RemoveButton.style.display = "inline-block";
        _element_EventEditorDialog_EventDetails = eventDetails;
        _element_EventEditorDialog_TimeFrom.value = toFormattedTime(eventDetails.from);
        _element_EventEditorDialog_TimeTo.value = toFormattedTime(eventDetails.to);
        _element_EventEditorDialog_IsAllDay.checked = getBoolean(eventDetails.isAllDay);
        _element_EventEditorDialog_ShowAlerts.checked = getBoolean(eventDetails.showAlerts, true);
        _element_EventEditorDialog_ShowAsBusy.checked = getBoolean(eventDetails.showAsBusy, true);
        _element_EventEditorDialog_Title.value = getString(eventDetails.title);
        _element_EventEditorDialog_Description.value = getString(eventDetails.description);
        _element_EventEditorDialog_Location.value = getString(eventDetails.location);
        _element_EventEditorDialog_Group.value = getString(eventDetails.group);
        _element_EventEditorDialog_Url.value = getString(eventDetails.url);
        _element_EventEditorColorsDialog_Color.value = getString(eventDetails.color, _options.defaultEventBackgroundColor);
        _element_EventEditorColorsDialog_ColorText.value = getString(eventDetails.colorText, _options.defaultEventTextColor);
        _element_EventEditorColorsDialog_ColorBorder.value = getString(eventDetails.colorBorder, _options.defaultEventBorderColor);
        _element_EventEditorDialog_RepeatEvery_Custom_Value.value = getNumber(eventDetails.repeatEveryCustomValue, 1);
        setSelectedDate(eventDetails.from, _element_EventEditorDialog_DateFrom);
        setSelectedDate(eventDetails.to, _element_EventEditorDialog_DateTo);
        var repeatEvery = getNumber(eventDetails.repeatEvery);
        if (repeatEvery === _repeatType.never) {
          _element_EventEditorDialog_RepeatEvery_Never.checked = true;
        } else if (repeatEvery === _repeatType.everyDay) {
          _element_EventEditorDialog_RepeatEvery_EveryDay.checked = true;
        } else if (repeatEvery === _repeatType.everyWeek) {
          _element_EventEditorDialog_RepeatEvery_EveryWeek.checked = true;
        } else if (repeatEvery === _repeatType.every2Weeks) {
          _element_EventEditorDialog_RepeatEvery_Every2Weeks.checked = true;
        } else if (repeatEvery === _repeatType.everyMonth) {
          _element_EventEditorDialog_RepeatEvery_EveryMonth.checked = true;
        } else if (repeatEvery === _repeatType.everyYear) {
          _element_EventEditorDialog_RepeatEvery_EveryYear.checked = true;
        } else if (repeatEvery === _repeatType.custom) {
          _element_EventEditorDialog_RepeatEvery_Custom.checked = true;
        }
        var repeatEveryCustomType = getNumber(eventDetails.repeatEveryCustomType);
        if (repeatEveryCustomType === _repeatCustomType.daily) {
          _element_EventEditorDialog_RepeatEvery_Custom_Type_Daily.checked = true;
        } else if (repeatEveryCustomType === _repeatCustomType.weekly) {
          _element_EventEditorDialog_RepeatEvery_Custom_Type_Weekly.checked = true;
        } else if (repeatEveryCustomType === _repeatCustomType.monthly) {
          _element_EventEditorDialog_RepeatEvery_Custom_Type_Monthly.checked = true;
        } else if (repeatEveryCustomType === _repeatCustomType.yearly) {
          _element_EventEditorDialog_RepeatEvery_Custom_Type_Yearly.checked = true;
        }
        var excludeDays = getArray(eventDetails.repeatEveryExcludeDays);
        _element_EventEditorRepeatOptionsDialog_Mon.checked = excludeDays.indexOf(1) > -1;
        _element_EventEditorRepeatOptionsDialog_Tue.checked = excludeDays.indexOf(2) > -1;
        _element_EventEditorRepeatOptionsDialog_Wed.checked = excludeDays.indexOf(3) > -1;
        _element_EventEditorRepeatOptionsDialog_Thu.checked = excludeDays.indexOf(4) > -1;
        _element_EventEditorRepeatOptionsDialog_Fri.checked = excludeDays.indexOf(5) > -1;
        _element_EventEditorRepeatOptionsDialog_Sat.checked = excludeDays.indexOf(6) > -1;
        _element_EventEditorRepeatOptionsDialog_Sun.checked = excludeDays.indexOf(0) > -1;
        setSelectedDate(eventDetails.repeatEnds, _element_EventEditorRepeatOptionsDialog_RepeatEnds);
      } else {
        var date = new Date();
        var fromDate = !isDefined(overrideTodayDate) ? date : overrideTodayDate;
        var toDate = null;
        if (isDateToday(fromDate)) {
          fromDate.setHours(date.getHours());
          fromDate.setMinutes(date.getMinutes());
        }
        toDate = addMinutesToDate(fromDate, _options.defaultEventDuration);
        setNodeText(_element_EventEditorDialog_TitleBar, _options.addEventTitle);
        setEventTypeInputCheckedStates();
        _element_EventEditorDialog_AddUpdateButton.value = _options.addText;
        _element_EventEditorDialog_RemoveButton.style.display = "none";
        _element_EventEditorDialog_EventDetails = {};
        _element_EventEditorDialog_IsAllDay.checked = false;
        _element_EventEditorDialog_ShowAlerts.checked = true;
        _element_EventEditorDialog_ShowAsBusy.checked = true;
        _element_EventEditorDialog_Title.value = _string.empty;
        _element_EventEditorDialog_Description.value = _string.empty;
        _element_EventEditorDialog_Location.value = _string.empty;
        _element_EventEditorDialog_Group.value = _string.empty;
        _element_EventEditorDialog_Url.value = _string.empty;
        _element_EventEditorColorsDialog_Color.value = _options.defaultEventBackgroundColor;
        _element_EventEditorColorsDialog_ColorText.value = _options.defaultEventTextColor;
        _element_EventEditorColorsDialog_ColorBorder.value = _options.defaultEventBorderColor;
        _element_EventEditorDialog_RepeatEvery_Never.checked = true;
        _element_EventEditorRepeatOptionsDialog_Mon.checked = false;
        _element_EventEditorRepeatOptionsDialog_Tue.checked = false;
        _element_EventEditorRepeatOptionsDialog_Wed.checked = false;
        _element_EventEditorRepeatOptionsDialog_Thu.checked = false;
        _element_EventEditorRepeatOptionsDialog_Fri.checked = false;
        _element_EventEditorRepeatOptionsDialog_Sat.checked = false;
        _element_EventEditorRepeatOptionsDialog_Sun.checked = false;
        _element_EventEditorRepeatOptionsDialog_RepeatEnds.value = null;
        _element_EventEditorDialog_RepeatEvery_Custom_Value.value = "1";
        _element_EventEditorDialog_RepeatEvery_Custom_Type_Daily.checked = true;
        if (isDefinedArray(overrideTimeValues)) {
          fromDate.setHours(overrideTimeValues[0]);
          fromDate.setMinutes(overrideTimeValues[1]);
          toDate.setHours(overrideTimeValues[0]);
          toDate.setMinutes(overrideTimeValues[1]);
          toDate = addMinutesToDate(toDate, _options.defaultEventDuration);
        }
        _element_EventEditorDialog_TimeFrom.value = toFormattedTime(fromDate);
        _element_EventEditorDialog_TimeTo.value = toFormattedTime(toDate);
        setSelectedDate(fromDate, _element_EventEditorDialog_DateFrom);
        setSelectedDate(toDate, _element_EventEditorDialog_DateTo);
      }
      buildToolbarButton(_element_EventEditorDialog_TitleBar, "ib-close", _options.closeTooltipText, eventDialogEvent_Cancel, true);
      setLockedStatusForEventEditingDialog(eventDetails);
      isAllDayChanged();
      _openDialogs.push(eventDialogEvent_Cancel);
      _element_EventEditorDialog.style.display = "block";
      _element_EventEditorDialog_Title.focus();
    }
  }
  function showEventEditingDialogTitleSelected() {
    _element_EventEditorDialog_Title.focus();
    _element_EventEditorDialog_Title.select();
  }
  function setLockedStatusForEventEditingDialog(eventDetails) {
    var locked = isEventLocked(eventDetails);
    setEventTypeInputDisabledStates(locked);
    _element_EventEditorDialog_AddUpdateButton.disabled = locked;
    _element_EventEditorDialog_DateFrom.disabled = locked;
    _element_EventEditorDialog_DateTo.disabled = locked;
    _element_EventEditorDialog_TimeFrom.disabled = locked;
    _element_EventEditorDialog_TimeTo.disabled = locked;
    _element_EventEditorDialog_IsAllDay.disabled = locked;
    _element_EventEditorDialog_ShowAlerts.disabled = locked;
    _element_EventEditorDialog_ShowAsBusy.disabled = locked;
    _element_EventEditorDialog_Title.disabled = locked;
    _element_EventEditorDialog_SelectColors.disabled = locked;
    _element_EventEditorDialog_Description.disabled = locked;
    _element_EventEditorDialog_Location.disabled = locked;
    _element_EventEditorDialog_Group.disabled = locked;
    _element_EventEditorDialog_Url.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_Never.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_EveryDay.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_EveryWeek.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_Every2Weeks.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_EveryMonth.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_EveryYear.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_Custom.disabled = locked;
    _element_EventEditorDialog_RepeatEvery_RepeatOptionsButton.disabled = locked;
  }
  function setEventEditingDialogInDuplicateMode() {
    setNodeText(_element_EventEditorDialog_TitleBar, _options.addEventTitle);
    _element_EventEditorDialog_AddUpdateButton.value = _options.addText;
    _element_EventEditorDialog_RemoveButton.style.display = "none";
    _element_EventEditorDialog_EventDetails = cloneEventDetails(_element_EventEditorDialog_EventDetails);
    buildToolbarButton(_element_EventEditorDialog_TitleBar, "ib-close", _options.closeTooltipText, eventDialogEvent_Cancel, true);
  }
  function eventDialogEvent_OK() {
    var fromTime = _element_EventEditorDialog_TimeFrom.value.split(":");
    var toTime = _element_EventEditorDialog_TimeTo.value.split(":");
    var title = trimString(_element_EventEditorDialog_Title.value);
    var url = trimString(_element_EventEditorDialog_Url.value);
    if (fromTime.length < 2) {
      showEventEditorErrorMessage(_options.fromTimeErrorMessage);
    } else if (toTime.length < 2) {
      showEventEditorErrorMessage(_options.toTimeErrorMessage);
    } else if (title === _string.empty) {
      showEventEditorErrorMessage(_options.titleErrorMessage);
    } else if (url.length > 0 && !isValidUrl(url)) {
      showEventEditorErrorMessage(_options.urlErrorMessage);
    } else {
      var fromDate = getSelectedDate(_element_EventEditorDialog_DateFrom);
      var toDate = getSelectedDate(_element_EventEditorDialog_DateTo);
      var description = trimString(_element_EventEditorDialog_Description.value);
      var location = trimString(_element_EventEditorDialog_Location.value);
      var group = trimString(_element_EventEditorDialog_Group.value);
      var repeatEnds = getSelectedDate(_element_EventEditorRepeatOptionsDialog_RepeatEnds, null);
      var repeatEveryCustomValue = parseInt(_element_EventEditorDialog_RepeatEvery_Custom_Value.value);
      var type = getEventTypeInputChecked();
      setTimeOnDate(fromDate, _element_EventEditorDialog_TimeFrom.value);
      setTimeOnDate(toDate, _element_EventEditorDialog_TimeTo.value);
      if (isNaN(repeatEveryCustomValue)) {
        repeatEveryCustomValue = 0;
        _element_EventEditorDialog_RepeatEvery_Never.checked = true;
        _element_EventEditorDialog_RepeatEvery_Custom_Type_Daily.checked = true;
      }
      if (toDate < fromDate) {
        showEventEditorErrorMessage(_options.toSmallerThanFromErrorMessage);
      } else {
        eventDialogEvent_Cancel();
        var isExistingEvent = isDefined(_element_EventEditorDialog_EventDetails.id);
        var newEvent = {from:fromDate, to:toDate, title:title, description:description, location:location, group:group, isAllDay:_element_EventEditorDialog_IsAllDay.checked, showAlerts:_element_EventEditorDialog_ShowAlerts.checked, showAsBusy:_element_EventEditorDialog_ShowAsBusy.checked, color:_element_EventEditorDialog_EventDetails.color, colorText:_element_EventEditorDialog_EventDetails.colorText, colorBorder:_element_EventEditorDialog_EventDetails.colorBorder, repeatEveryExcludeDays:_element_EventEditorDialog_EventDetails.repeatEveryExcludeDays, 
        repeatEnds:repeatEnds, url:url, repeatEveryCustomValue:repeatEveryCustomValue, type:type, customTags:_element_EventEditorDialog_EventDetails.customTags};
        if (_element_EventEditorDialog_RepeatEvery_Never.checked) {
          newEvent.repeatEvery = _repeatType.never;
        } else if (_element_EventEditorDialog_RepeatEvery_EveryDay.checked) {
          newEvent.repeatEvery = _repeatType.everyDay;
        } else if (_element_EventEditorDialog_RepeatEvery_EveryWeek.checked) {
          newEvent.repeatEvery = _repeatType.everyWeek;
        } else if (_element_EventEditorDialog_RepeatEvery_Every2Weeks.checked) {
          newEvent.repeatEvery = _repeatType.every2Weeks;
        } else if (_element_EventEditorDialog_RepeatEvery_EveryMonth.checked) {
          newEvent.repeatEvery = _repeatType.everyMonth;
        } else if (_element_EventEditorDialog_RepeatEvery_EveryYear.checked) {
          newEvent.repeatEvery = _repeatType.everyYear;
        } else if (_element_EventEditorDialog_RepeatEvery_Custom.checked) {
          newEvent.repeatEvery = _repeatType.custom;
        }
        if (_element_EventEditorDialog_RepeatEvery_Custom_Type_Daily.checked) {
          newEvent.repeatEveryCustomType = _repeatCustomType.daily;
        } else if (_element_EventEditorDialog_RepeatEvery_Custom_Type_Weekly.checked) {
          newEvent.repeatEveryCustomType = _repeatCustomType.weekly;
        } else if (_element_EventEditorDialog_RepeatEvery_Custom_Type_Monthly.checked) {
          newEvent.repeatEveryCustomType = _repeatCustomType.monthly;
        } else if (_element_EventEditorDialog_RepeatEvery_Custom_Type_Yearly.checked) {
          newEvent.repeatEveryCustomType = _repeatCustomType.yearly;
        }
        if (!isExistingEvent) {
          newEvent.organizerName = _options.organizerName;
          newEvent.organizerEmailAddress = _options.organizerEmailAddress;
        } else {
          newEvent.id = _element_EventEditorDialog_EventDetails.id;
        }
        if (isExistingEvent) {
          _this.updateEvent(_element_EventEditorDialog_EventDetails.id, newEvent, false);
          showNotificationPopUp(_options.eventUpdatedText.replace("{0}", _element_EventEditorDialog_EventDetails.title));
        } else {
          _this.addEvent(newEvent, false);
          showNotificationPopUp(_options.eventAddedText.replace("{0}", _element_EventEditorDialog_EventDetails.title));
        }
        buildDayEvents();
        refreshOpenedViews();
      }
    }
  }
  function eventDialogEvent_Cancel(popCloseWindowEvent) {
    removeLastCloseWindowEvent(popCloseWindowEvent);
    removeNode(_document.body, _element_DisabledBackground);
    _element_EventEditorDialog.style.display = "none";
  }
  function eventDialogEvent_Remove() {
    showEventEditorDisabledArea();
    var onNoEvent = function() {
      hideEventEditorDisabledArea();
    };
    var onYesEvent = function() {
      onNoEvent();
      eventDialogEvent_Cancel();
      if (isDefined(_element_EventEditorDialog_EventDetails.id)) {
        _this.removeEvent(_element_EventEditorDialog_EventDetails.id, true);
        showNotificationPopUp(_options.eventRemovedText.replace("{0}", _element_EventEditorDialog_EventDetails.title));
        refreshOpenedViews();
      }
    };
    showMessageDialog(_options.confirmEventRemoveTitle, _options.confirmEventRemoveMessage, onYesEvent, onNoEvent);
  }
  function refreshOpenedViews() {
    updateFullDayViewFromEventEdit();
    updateViewAllEventsViewFromEventEdit();
    updateViewAllWeekEventsViewFromEventEdit();
  }
  function buildBlankTemplateEvent(fromDate, toDate, fromTime, toTime) {
    fromTime = isDefined(fromTime) ? fromTime : "09:00";
    toTime = isDefined(toTime) ? fromTime : "09:00";
    setTimeOnDate(fromDate, fromTime);
    setTimeOnDate(toDate, toTime);
    toDate = addMinutesToDate(toDate, _options.defaultEventDuration);
    var newEvent = {from:fromDate, to:toDate, title:_options.newEventDefaultTitle, description:_string.empty, location:_string.empty, group:_string.empty, isAllDay:false, showAlerts:true, showAsBusy:true, color:_options.defaultEventBackgroundColor, colorText:_options.defaultEventTextColor, colorBorder:_options.defaultEventBorderColor, repeatEveryExcludeDays:[], repeatEnds:null, url:_string.empty, repeatEveryCustomValue:_string.empty, repeatEvery:_repeatType.never, repeatEveryCustomType:_repeatCustomType.daily, 
    organizerName:_string.empty, organizerEmailAddress:_string.empty, type:0, locked:false, customTags:null};
    _this.addEvent(newEvent, false);
    showNotificationPopUp(_options.eventAddedText.replace("{0}", newEvent.title));
    buildDayEvents();
    refreshOpenedViews();
    storeEventsInLocalStorage();
    return newEvent;
  }
  function isEventLocked(eventDetails) {
    return isDefined(eventDetails) && isDefinedBoolean(eventDetails.locked) ? eventDetails.locked : false;
  }
  function showEventEditorErrorMessage(message) {
    showMessageDialog(_options.errorText, message, hideEventEditorDisabledArea, null, false, false);
    showEventEditorDisabledArea();
  }
  function showEventEditorDisabledArea() {
    _element_EventEditorDialog_DisabledArea.style.display = "block";
  }
  function hideEventEditorDisabledArea() {
    _element_EventEditorDialog_DisabledArea.style.display = "none";
  }
  function buildEventEditingColorDialog() {
    if (!_datePickerModeEnabled && _element_EventEditorColorsDialog === null) {
      _element_EventEditorColorsDialog = createElement("div", "calendar-dialog event-editor-colors");
      _document.body.appendChild(_element_EventEditorColorsDialog);
      var titleBar = createElement("div", "title-bar");
      setNodeText(titleBar, _options.selectColorsText);
      _element_EventEditorColorsDialog.appendChild(titleBar);
      makeDialogMovable(titleBar, _element_EventEditorColorsDialog, null);
      buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, eventColorsDialogEvent_Cancel, true);
      var contents = createElement("div", "contents");
      _element_EventEditorColorsDialog.appendChild(contents);
      var section1 = createElement("div", "section");
      contents.appendChild(section1);
      createTextHeaderElement(section1, _options.backgroundColorText, "text-header");
      _element_EventEditorColorsDialog_Color = createElement("input");
      section1.appendChild(_element_EventEditorColorsDialog_Color);
      setInputType(_element_EventEditorColorsDialog_Color, "color");
      var section2 = createElement("div", "section");
      contents.appendChild(section2);
      createTextHeaderElement(section2, _options.textColorText, "text-header");
      _element_EventEditorColorsDialog_ColorText = createElement("input");
      section2.appendChild(_element_EventEditorColorsDialog_ColorText);
      setInputType(_element_EventEditorColorsDialog_ColorText, "color");
      var section3 = createElement("div", "section");
      contents.appendChild(section3);
      createTextHeaderElement(section3, _options.borderColorText, "text-header");
      _element_EventEditorColorsDialog_ColorBorder = createElement("input");
      section3.appendChild(_element_EventEditorColorsDialog_ColorBorder);
      setInputType(_element_EventEditorColorsDialog_ColorBorder, "color");
      var buttonsContainer = createElement("div", "buttons-container");
      contents.appendChild(buttonsContainer);
      createButtonElement(buttonsContainer, _options.updateText, "update", eventColorsDialogEvent_OK);
      createButtonElement(buttonsContainer, _options.cancelText, "cancel", eventColorsDialogEvent_Cancel);
    }
  }
  function eventColorsDialogEvent_OK() {
    eventColorsDialogEvent_Cancel();
    _element_EventEditorDialog_EventDetails.color = _element_EventEditorColorsDialog_Color.value;
    _element_EventEditorDialog_EventDetails.colorText = _element_EventEditorColorsDialog_ColorText.value;
    _element_EventEditorDialog_EventDetails.colorBorder = _element_EventEditorColorsDialog_ColorBorder.value;
  }
  function eventColorsDialogEvent_Cancel(popCloseWindowEvent) {
    removeLastCloseWindowEvent(popCloseWindowEvent);
    hideEventEditorDisabledArea();
    _element_EventEditorColorsDialog.style.display = "none";
  }
  function showEventEditorColorsDialog() {
    _openDialogs.push(eventColorsDialogEvent_Cancel);
    _element_EventEditorColorsDialog.style.display = "block";
    showEventEditorDisabledArea();
  }
  function buildEventEditingRepeatOptionsDialog() {
    if (!_datePickerModeEnabled && _element_EventEditorRepeatOptionsDialog === null) {
      _element_EventEditorRepeatOptionsDialog = createElement("div", "calendar-dialog event-editor-repeat-options");
      _document.body.appendChild(_element_EventEditorRepeatOptionsDialog);
      var titleBar = createElement("div", "title-bar");
      setNodeText(titleBar, _options.repeatOptionsTitle);
      _element_EventEditorRepeatOptionsDialog.appendChild(titleBar);
      makeDialogMovable(titleBar, _element_EventEditorRepeatOptionsDialog, null);
      buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, eventRepeatOptionsDialogEvent_Cancel, true);
      var contents = createElement("div", "contents");
      _element_EventEditorRepeatOptionsDialog.appendChild(contents);
      var section1 = createElement("div", "section");
      contents.appendChild(section1);
      createTextHeaderElement(section1, _options.daysToExcludeText, "text-header");
      _element_EventEditorRepeatOptionsDialog_Mon = buildCheckBox(section1, _options.dayNames[0])[0];
      _element_EventEditorRepeatOptionsDialog_Tue = buildCheckBox(section1, _options.dayNames[1])[0];
      _element_EventEditorRepeatOptionsDialog_Wed = buildCheckBox(section1, _options.dayNames[2])[0];
      _element_EventEditorRepeatOptionsDialog_Thu = buildCheckBox(section1, _options.dayNames[3])[0];
      _element_EventEditorRepeatOptionsDialog_Fri = buildCheckBox(section1, _options.dayNames[4])[0];
      _element_EventEditorRepeatOptionsDialog_Sat = buildCheckBox(section1, _options.dayNames[5])[0];
      _element_EventEditorRepeatOptionsDialog_Sun = buildCheckBox(section1, _options.dayNames[6])[0];
      var section2 = createElement("div", "section");
      contents.appendChild(section2);
      createTextHeaderElement(section2, _options.repeatEndsText, "text-header");
      _element_EventEditorRepeatOptionsDialog_RepeatEnds = createElement("input");
      section2.appendChild(_element_EventEditorRepeatOptionsDialog_RepeatEnds);
      setInputType(_element_EventEditorRepeatOptionsDialog_RepeatEnds, "date");
      var buttonsContainer = createElement("div", "buttons-container");
      contents.appendChild(buttonsContainer);
      createButtonElement(buttonsContainer, _options.updateText, "update", eventRepeatOptionsDialogEvent_OK);
      createButtonElement(buttonsContainer, _options.cancelText, "cancel", eventRepeatOptionsDialogEvent_Cancel);
    }
  }
  function eventRepeatOptionsDialogEvent_OK() {
    eventRepeatOptionsDialogEvent_Cancel();
    var repeatEveryExcludeDays = [];
    if (_element_EventEditorRepeatOptionsDialog_Mon.checked) {
      repeatEveryExcludeDays.push(1);
    }
    if (_element_EventEditorRepeatOptionsDialog_Tue.checked) {
      repeatEveryExcludeDays.push(2);
    }
    if (_element_EventEditorRepeatOptionsDialog_Wed.checked) {
      repeatEveryExcludeDays.push(3);
    }
    if (_element_EventEditorRepeatOptionsDialog_Thu.checked) {
      repeatEveryExcludeDays.push(4);
    }
    if (_element_EventEditorRepeatOptionsDialog_Fri.checked) {
      repeatEveryExcludeDays.push(5);
    }
    if (_element_EventEditorRepeatOptionsDialog_Sat.checked) {
      repeatEveryExcludeDays.push(6);
    }
    if (_element_EventEditorRepeatOptionsDialog_Sun.checked) {
      repeatEveryExcludeDays.push(0);
    }
    _element_EventEditorDialog_EventDetails.repeatEveryExcludeDays = repeatEveryExcludeDays;
  }
  function eventRepeatOptionsDialogEvent_Cancel(popCloseWindowEvent) {
    removeLastCloseWindowEvent(popCloseWindowEvent);
    hideEventEditorDisabledArea();
    _element_EventEditorRepeatOptionsDialog.style.display = "none";
  }
  function showEventEditorRepeatOptionsDialog() {
    _openDialogs.push(eventRepeatOptionsDialogEvent_Cancel);
    _element_EventEditorRepeatOptionsDialog.style.display = "block";
    showEventEditorDisabledArea();
  }
  function buildMessageDialog() {
    if (!_datePickerModeEnabled && _element_MessageDialog === null) {
      _element_MessageDialog = createElement("div", "calendar-dialog message");
      _document.body.appendChild(_element_MessageDialog);
      _element_MessageDialog_TitleBar = createElement("div", "title-bar");
      _element_MessageDialog.appendChild(_element_MessageDialog_TitleBar);
      var contents = createElement("div", "contents");
      _element_MessageDialog.appendChild(contents);
      _element_MessageDialog_Message = createElement("div", "text");
      contents.appendChild(_element_MessageDialog_Message);
      var checkbox = buildCheckBox(contents, _options.removeAllEventsInSeriesText);
      _element_MessageDialog_RemoveAllEvents = checkbox[0];
      _element_MessageDialog_RemoveAllEvents_Label = checkbox[1];
      var buttonsContainer = createElement("div", "buttons-container");
      contents.appendChild(buttonsContainer);
      _element_MessageDialog_YesButton = createElement("input", "yes-ok", "button");
      _element_MessageDialog_YesButton.value = _options.yesText;
      buttonsContainer.appendChild(_element_MessageDialog_YesButton);
      _element_MessageDialog_NoButton = createElement("input", "no", "button");
      _element_MessageDialog_NoButton.value = _options.noText;
      buttonsContainer.appendChild(_element_MessageDialog_NoButton);
    }
  }
  function showMessageDialog(title, message, onYesEvent, onNoEvent, showRemoveAllEventsCheckBox, showNoButton) {
    showRemoveAllEventsCheckBox = isDefined(showRemoveAllEventsCheckBox) ? showRemoveAllEventsCheckBox : false;
    showNoButton = isDefined(showNoButton) ? showNoButton : true;
    _openDialogs.push(false);
    _element_MessageDialog.style.display = "block";
    setNodeText(_element_MessageDialog_TitleBar, title);
    setNodeText(_element_MessageDialog_Message, message);
    _element_MessageDialog_YesButton.onclick = hideMessageDialog;
    _element_MessageDialog_YesButton.addEventListener("click", onYesEvent);
    _element_MessageDialog_NoButton.onclick = hideMessageDialog;
    if (showNoButton) {
      _element_MessageDialog_NoButton.style.display = "inline-block";
      _element_MessageDialog_YesButton.value = _options.yesText;
    } else {
      _element_MessageDialog_NoButton.style.display = "none";
      _element_MessageDialog_YesButton.value = _options.okText;
    }
    if (showRemoveAllEventsCheckBox) {
      _element_MessageDialog_RemoveAllEvents_Label.style.display = "block";
      _element_MessageDialog_RemoveAllEvents.checked = false;
    } else {
      _element_MessageDialog_RemoveAllEvents_Label.style.display = "none";
      _element_MessageDialog_RemoveAllEvents.checked = true;
    }
    if (isDefinedFunction(onNoEvent)) {
      _element_MessageDialog_NoButton.addEventListener("click", onNoEvent);
    }
  }
  function hideMessageDialog() {
    _openDialogs.pop();
    _element_MessageDialog.style.display = "none";
  }
  function buildExportEventsDialog() {
    if (!_datePickerModeEnabled && _element_ExportEventsDialog === null) {
      _element_ExportEventsDialog = createElement("div", "calendar-dialog export-events");
      _document.body.appendChild(_element_ExportEventsDialog);
      var titleBar = createElement("div", "title-bar");
      setNodeText(titleBar, _options.exportEventsTitle);
      _element_ExportEventsDialog.appendChild(titleBar);
      makeDialogMovable(titleBar, _element_ExportEventsDialog, null);
      buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, hideExportEventsDialog, true);
      var contents = createElement("div", "contents");
      _element_ExportEventsDialog.appendChild(contents);
      _element_ExportEventsDialog_Filename = createElement("input", null, "text");
      _element_ExportEventsDialog_Filename.placeholder = _options.exportFilenamePlaceholderText;
      contents.appendChild(_element_ExportEventsDialog_Filename);
      _element_ExportEventsDialog_Filename.onkeydown = function(e) {
        if (e.keyCode === _keyCodes.enter) {
          exportEventsFromOptionSelected();
        }
      };
      _element_ExportEventsDialog_Option_ExportEventsToClipboard = buildCheckBox(contents, _options.copyToClipboardOnlyText, showExportEventsDialogOptions)[0];
      _element_ExportEventsDialog_Options = createElement("div", "split options");
      contents.appendChild(_element_ExportEventsDialog_Options);
      var radioButtonsContainer1 = createElement("div", "radio-buttons-container split-contents");
      _element_ExportEventsDialog_Options.appendChild(radioButtonsContainer1);
      var radioButtonsContainer2 = createElement("div", "radio-buttons-container split-contents");
      _element_ExportEventsDialog_Options.appendChild(radioButtonsContainer2);
      _element_ExportEventsDialog_Option_CSV = buildRadioButton(radioButtonsContainer1, "CSV", "ExportType");
      _element_ExportEventsDialog_Option_XML = buildRadioButton(radioButtonsContainer1, "XML", "ExportType");
      _element_ExportEventsDialog_Option_JSON = buildRadioButton(radioButtonsContainer1, "JSON", "ExportType");
      _element_ExportEventsDialog_Option_TEXT = buildRadioButton(radioButtonsContainer1, "TXT", "ExportType");
      _element_ExportEventsDialog_Option_iCAL = buildRadioButton(radioButtonsContainer2, "iCAL", "ExportType");
      _element_ExportEventsDialog_Option_MD = buildRadioButton(radioButtonsContainer2, "MD", "ExportType");
      _element_ExportEventsDialog_Option_HTML = buildRadioButton(radioButtonsContainer2, "HTML", "ExportType");
      _element_ExportEventsDialog_Option_TSV = buildRadioButton(radioButtonsContainer2, "TSV", "ExportType");
      var buttonsContainer = createElement("div", "buttons-container");
      contents.appendChild(buttonsContainer);
      createButtonElement(buttonsContainer, _options.exportText, "export", exportEventsFromOptionSelected);
      createButtonElement(buttonsContainer, _options.cancelText, "cancel", hideExportEventsDialog);
    }
  }
  function showExportEventsDialogOptions() {
    _element_ExportEventsDialog_Filename.disabled = _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked;
  }
  function showExportEventsDialog(events) {
    addNode(_document.body, _element_DisabledBackground);
    _openDialogs.push(hideExportEventsDialog);
    _element_ExportEventsDialog.style.display = "block";
    _element_ExportEventsDialog_ExportEvents = events;
    _element_ExportEventsDialog_Option_CSV.checked = true;
    _element_ExportEventsDialog_Filename.value = _string.empty;
    _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked = false;
    showExportEventsDialogOptions();
    _element_ExportEventsDialog_Filename.focus();
  }
  function hideExportEventsDialog(popCloseWindowEvent) {
    removeLastCloseWindowEvent(popCloseWindowEvent);
    removeNode(_document.body, _element_DisabledBackground);
    _element_ExportEventsDialog.style.display = "none";
  }
  function exportEventsFromOptionSelected() {
    hideExportEventsDialog();
    if (_element_ExportEventsDialog_Option_CSV.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "csv", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    } else if (_element_ExportEventsDialog_Option_XML.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "xml", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    } else if (_element_ExportEventsDialog_Option_JSON.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "json", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    } else if (_element_ExportEventsDialog_Option_TEXT.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "text", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    } else if (_element_ExportEventsDialog_Option_iCAL.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "ical", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    } else if (_element_ExportEventsDialog_Option_MD.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "md", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    } else if (_element_ExportEventsDialog_Option_HTML.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "html", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    } else if (_element_ExportEventsDialog_Option_TSV.checked) {
      exportEvents(_element_ExportEventsDialog_ExportEvents, "tsv", _element_ExportEventsDialog_Filename.value, _element_ExportEventsDialog_Option_ExportEventsToClipboard.checked);
    }
  }
  function showExportDialogFromWindowKeyDown() {
    var isFullDayViewVisible = isOverlayVisible(_element_FullDayView);
    var isAllEventsViewVisible = isOverlayVisible(_element_ListAllEventsView);
    var isAllWeekEventsViewVisible = isOverlayVisible(_element_ListAllWeekEventsView);
    var events = [];
    if (isFullDayViewVisible) {
      events = _element_FullDayView_EventsShown;
    } else if (isAllEventsViewVisible) {
      events = _element_ListAllEventsView_EventsShown;
    } else if (isAllWeekEventsViewVisible) {
      events = _element_ListAllWeekEventsView_EventsShown;
    } else {
      events = _element_Calendar_AllVisibleEvents;
    }
    if (events.length > 0) {
      showExportEventsDialog(events);
    }
  }
  function buildSearchDialog() {
    if (!_datePickerModeEnabled && _element_SearchDialog === null) {
      _element_SearchDialog = createElement("div", "calendar-dialog search");
      _document.body.appendChild(_element_SearchDialog);
      var titleBar = createElement("div", "title-bar");
      setNodeText(titleBar, _options.searchEventsTitle);
      _element_SearchDialog.appendChild(titleBar);
      makeDialogMovable(titleBar, _element_SearchDialog, function() {
        _element_SearchDialog_Moved = true;
        storeSearchOptions();
      });
      titleBar.ondblclick = minimizeRestoreDialog;
      var closeButton = buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, hideSearchDialog);
      closeButton.onmousedown = cancelBubble;
      closeButton.onmouseup = cancelBubble;
      _element_SearchDialog_MinimizedRestoreButton = buildToolbarButton(titleBar, "ib-minus", _options.minimizedTooltipText, minimizeRestoreDialog);
      _element_SearchDialog_MinimizedRestoreButton.onmousedown = cancelBubble;
      _element_SearchDialog_MinimizedRestoreButton.onmouseup = cancelBubble;
      _element_SearchDialog_Contents = createElement("div", "contents");
      _element_SearchDialog.appendChild(_element_SearchDialog_Contents);
      var historyContainer = createElement("div", "history-container");
      _element_SearchDialog_Contents.appendChild(historyContainer);
      _element_SearchDialog_For = createElement("input", null, "text");
      _element_SearchDialog_For.placeholder = _options.searchTextBoxPlaceholder;
      _element_SearchDialog_For.oninput = searchForTextChanged;
      _element_SearchDialog_For.onpropertychange = searchForTextChanged;
      _element_SearchDialog_For.onkeypress = searchOnEnter;
      historyContainer.appendChild(_element_SearchDialog_For);
      _element_SearchDialog_History_DropDown_Button = createElement("div", "ib-arrow-down-full");
      _element_SearchDialog_History_DropDown_Button.style.display = "none";
      _element_SearchDialog_History_DropDown_Button.onclick = showFullSearchHistory;
      historyContainer.appendChild(_element_SearchDialog_History_DropDown_Button);
      _element_SearchDialog_History_DropDown = createElement("div", "history-dropdown custom-scroll-bars");
      historyContainer.appendChild(_element_SearchDialog_History_DropDown);
      var checkboxOptionsContainer = createElement("div", "checkbox-container");
      _element_SearchDialog_Contents.appendChild(checkboxOptionsContainer);
      _element_SearchDialog_Not = buildCheckBox(checkboxOptionsContainer, _options.notSearchText, searchOptionsChanged)[0];
      _element_SearchDialog_MatchCase = buildCheckBox(checkboxOptionsContainer, _options.matchCaseText, searchOptionsChanged)[0];
      _element_SearchDialog_Advanced = buildCheckBox(checkboxOptionsContainer, _options.advancedText + ":", searchAdvancedChecked)[0];
      _element_SearchDialog_Advanced.checked = true;
      _element_SearchDialog_Advanced_Container = createElement("div", "advanced");
      _element_SearchDialog_Contents.appendChild(_element_SearchDialog_Advanced_Container);
      var optionsSplitContainer = createElement("div", "split");
      _element_SearchDialog_Advanced_Container.appendChild(optionsSplitContainer);
      var splitContents1 = createElement("div", "split-contents");
      optionsSplitContainer.appendChild(splitContents1);
      var splitContents2 = createElement("div", "split-contents");
      optionsSplitContainer.appendChild(splitContents2);
      createTextHeaderElement(splitContents1, _options.includeText, "text-header");
      var checkboxContainer = createElement("div", "checkbox-container");
      splitContents1.appendChild(checkboxContainer);
      _element_SearchDialog_Include_Title = buildCheckBox(checkboxContainer, _options.titleText.replace(":", _string.empty), searchOptionsChanged)[0];
      _element_SearchDialog_Include_Location = buildCheckBox(checkboxContainer, _options.locationText.replace(":", _string.empty), searchOptionsChanged)[0];
      _element_SearchDialog_Include_Description = buildCheckBox(checkboxContainer, _options.descriptionText.replace(":", _string.empty), searchOptionsChanged)[0];
      _element_SearchDialog_Include_Group = buildCheckBox(checkboxContainer, _options.groupText.replace(":", _string.empty), searchOptionsChanged)[0];
      _element_SearchDialog_Include_Url = buildCheckBox(checkboxContainer, _options.urlText.replace(":", _string.empty), searchOptionsChanged)[0];
      _element_SearchDialog_Include_Title.checked = true;
      createTextHeaderElement(splitContents2, _options.optionsText, "text-header");
      var radioButtonsContainer = createElement("div", "radio-buttons-container");
      splitContents2.appendChild(radioButtonsContainer);
      _element_SearchDialog_Option_StartsWith = buildRadioButton(radioButtonsContainer, _options.startsWithText, "SearchOptionType", searchOptionsChanged);
      _element_SearchDialog_Option_EndsWith = buildRadioButton(radioButtonsContainer, _options.endsWithText, "SearchOptionType", searchOptionsChanged);
      _element_SearchDialog_Option_Contains = buildRadioButton(radioButtonsContainer, _options.containsText, "SearchOptionType", searchOptionsChanged);
      _element_SearchDialog_Option_Contains.checked = true;
      var buttonsContainer = createElement("div", "buttons-container");
      _element_SearchDialog_Contents.appendChild(buttonsContainer);
      _element_SearchDialog_Previous = createButtonElement(buttonsContainer, _options.previousText, "previous", searchOnPrevious);
      _element_SearchDialog_Next = createButtonElement(buttonsContainer, _options.nextText, "next", searchOnNext);
    }
  }
  function searchAdvancedChecked() {
    if (_element_SearchDialog_Advanced.checked) {
      _element_SearchDialog_Advanced_Container.style.display = "block";
    } else {
      _element_SearchDialog_Advanced_Container.style.display = "none";
    }
    centerSearchDialog();
    storeSearchOptions();
  }
  function searchOptionsChanged() {
    storeSearchOptions();
    searchForTextChanged(false);
  }
  function searchForTextChanged(showHistoryDropDown) {
    showHistoryDropDown = isDefined(showHistoryDropDown) ? showHistoryDropDown : true;
    if (_element_SearchDialog_SearchResults.length > 0) {
      removeElementsClassName(_element_Calendar, " focused-event");
    }
    _element_SearchDialog_Previous.disabled = true;
    _element_SearchDialog_Next.disabled = _element_SearchDialog_For.value === _string.empty;
    _element_SearchDialog_SearchResults = [];
    _element_SearchDialog_SearchIndex = 0;
    _element_SearchDialog_FocusedEventID = null;
    if (showHistoryDropDown) {
      showSearchHistoryDropDownForSearch();
    }
    storeSearchOptions();
  }
  function showSearchDialog() {
    if (_element_SearchDialog.style.display !== "block") {
      _element_SearchDialog_SearchResults = [];
      _element_SearchDialog.style.display = "block";
      searchForTextChanged(false);
      setupSearchOptions();
      centerSearchDialog();
    }
    if (!isSearchDialogContentVisible()) {
      minimizeRestoreDialog();
    }
    _element_SearchDialog_For.focus();
    _element_SearchDialog_For.select();
    if (_optionsForSearch.history.length > 0) {
      _element_SearchDialog_History_DropDown_Button.style.display = "block";
    }
  }
  function centerSearchDialog() {
    if (!_element_SearchDialog_Moved && !_datePickerModeEnabled) {
      if (isDefinedNumber(_optionsForSearch.left)) {
        _element_SearchDialog.style.left = _optionsForSearch.left + "px";
      } else {
        _element_SearchDialog.style.left = _window.innerWidth / 2 - _element_SearchDialog.offsetWidth / 2 + "px";
      }
      if (isDefinedNumber(_optionsForSearch.top)) {
        _element_SearchDialog.style.top = _optionsForSearch.top + "px";
      } else {
        _element_SearchDialog.style.top = _window.innerHeight / 2 - _element_SearchDialog.offsetHeight / 2 + "px";
      }
    }
  }
  function hideSearchDialog() {
    var result = false;
    if (_element_SearchDialog.style.display === "block") {
      _element_SearchDialog.style.display = "none";
      searchForTextChanged();
      result = true;
    }
    return result;
  }
  function minimizeRestoreDialog() {
    if (isSearchDialogContentVisible()) {
      _element_SearchDialog_Contents.style.display = "none";
      _element_SearchDialog_MinimizedRestoreButton.className = "ib-square-hollow";
      addToolTip(_element_SearchDialog_MinimizedRestoreButton, _options.restoreTooltipText);
    } else {
      _element_SearchDialog_Contents.style.display = "block";
      _element_SearchDialog_MinimizedRestoreButton.className = "ib-minus";
      addToolTip(_element_SearchDialog_MinimizedRestoreButton, _options.minimizedTooltipText);
    }
  }
  function isSearchDialogContentVisible() {
    return _element_SearchDialog_Contents.style.display === "block";
  }
  function searchOnPrevious() {
    if (_element_SearchDialog_SearchIndex > 0) {
      _element_SearchDialog_SearchIndex--;
      var eventDetails = _element_SearchDialog_SearchResults[_element_SearchDialog_SearchIndex];
      updateSearchButtons();
      build(eventDetails.from);
      updatedFocusedElementAfterSearch(eventDetails);
    }
  }
  function searchOnEnter(e) {
    if (e.keyCode === _keyCodes.enter && isControlKey(e) && !_element_SearchDialog_Previous.disabled) {
      searchOnPrevious();
    } else if (e.keyCode === _keyCodes.enter && !_element_SearchDialog_Next.disabled) {
      searchOnNext();
    } else {
      showSearchHistoryDropDownForSearch();
    }
  }
  function searchOnNext() {
    if (_element_SearchDialog_SearchResults.length === 0) {
      var startingID = _elementID_Day;
      var not = _element_SearchDialog_Not.checked;
      var matchCase = _element_SearchDialog_MatchCase.checked;
      var search = !matchCase ? _element_SearchDialog_For.value.toLowerCase() : _element_SearchDialog_For.value;
      var monthYearsFound = {};
      var orderedEvents = getOrderedEvents(getAllEvents());
      var orderedEventsLength = orderedEvents.length;
      var isFullDayViewVisible = isOverlayVisible(_element_FullDayView);
      var isAllEventsViewVisible = isOverlayVisible(_element_ListAllEventsView);
      var isAllWeekEventsViewVisible = isOverlayVisible(_element_ListAllWeekEventsView);
      if (isFullDayViewVisible) {
        startingID = _elementID_FullDay;
      } else if (isAllEventsViewVisible) {
        startingID = _elementID_Month;
      } else if (isAllWeekEventsViewVisible) {
        startingID = _elementID_WeekDay;
      }
      storeSearchOptions(true);
      var orderedEventIndex = 0;
      for (; orderedEventIndex < orderedEventsLength; orderedEventIndex++) {
        var eventDetails = orderedEvents[orderedEventIndex];
        if (isEventVisible(eventDetails)) {
          var title = getString(eventDetails.title);
          var location = getString(eventDetails.location);
          var description = getString(eventDetails.description);
          var group = getString(eventDetails.group);
          var url = getString(eventDetails.url);
          var found = false;
          if (!matchCase) {
            title = title.toLowerCase();
            description = description.toLowerCase();
            location = location.toLowerCase();
            group = group.toLowerCase();
            url = url.toLowerCase();
          }
          if (_element_SearchDialog_Include_Title.checked && isSearchTextAvailable(title, search)) {
            found = true;
          } else if (_element_SearchDialog_Include_Location.checked && isSearchTextAvailable(location, search)) {
            found = true;
          } else if (_element_SearchDialog_Include_Description.checked && isSearchTextAvailable(description, search)) {
            found = true;
          } else if (_element_SearchDialog_Include_Group.checked && isSearchTextAvailable(group, search)) {
            found = true;
          } else if (_element_SearchDialog_Include_Url.checked && isSearchTextAvailable(url, search)) {
            found = true;
          }
          if (not) {
            found = !found;
          }
          if (found) {
            var eventElement = getElementByID(startingID + eventDetails.id);
            if (eventElement !== null || !isFullDayViewVisible && !isAllEventsViewVisible && !isAllWeekEventsViewVisible) {
              if (isFullDayViewVisible || isAllEventsViewVisible || isAllWeekEventsViewVisible) {
                _element_SearchDialog_SearchResults.push(cloneEventDetails(eventDetails, false));
              } else {
                var monthYear = eventDetails.from.getMonth() + "-" + eventDetails.from.getFullYear();
                if (!monthYearsFound.hasOwnProperty(monthYear)) {
                  _element_SearchDialog_SearchResults.push(cloneEventDetails(eventDetails, false));
                  monthYearsFound[monthYear] = true;
                }
              }
            }
          }
        }
      }
    } else {
      _element_SearchDialog_SearchIndex++;
    }
    updateSearchButtons();
    if (_element_SearchDialog_SearchResults.length > 0) {
      var eventDetailsSearchResult = _element_SearchDialog_SearchResults[_element_SearchDialog_SearchIndex];
      var dateFrom = new Date(eventDetailsSearchResult.from);
      build(dateFrom);
      updatedFocusedElementAfterSearch(eventDetailsSearchResult);
    }
  }
  function updatedFocusedElementAfterSearch(eventDetails) {
    var startingID = _elementID_Day;
    var isFullDayViewVisible = isOverlayVisible(_element_FullDayView);
    var isAllEventsViewVisible = isOverlayVisible(_element_ListAllEventsView);
    var isAllWeekEventsViewVisible = isOverlayVisible(_element_ListAllWeekEventsView);
    removeElementsClassName(_element_Calendar, " focused-event");
    if (isFullDayViewVisible) {
      startingID = _elementID_FullDay;
    } else if (isAllEventsViewVisible) {
      startingID = _elementID_Month;
    } else if (isAllWeekEventsViewVisible) {
      startingID = _elementID_WeekDay;
    }
    var event = getElementByID(startingID + eventDetails.id);
    if (event !== null) {
      event.className += " focused-event";
      _element_SearchDialog_FocusedEventID = eventDetails.id;
      if (isFullDayViewVisible || isAllEventsViewVisible || isAllWeekEventsViewVisible) {
        event.scrollIntoView();
      }
    }
  }
  function updateSearchButtons() {
    _element_SearchDialog_Previous.disabled = _element_SearchDialog_SearchIndex === 0;
    _element_SearchDialog_Next.disabled = _element_SearchDialog_SearchIndex === _element_SearchDialog_SearchResults.length - 1 || _element_SearchDialog_SearchResults.length === 0;
  }
  function isSearchTextAvailable(data, searchText) {
    var found = false;
    if (_element_SearchDialog_Option_StartsWith.checked) {
      found = startsWith(data, searchText);
    } else if (_element_SearchDialog_Option_EndsWith.checked) {
      found = endsWith(data, searchText);
    } else {
      found = data.indexOf(searchText) > -1;
    }
    return found;
  }
  function storeSearchOptions(storeSearchHistory) {
    storeSearchHistory = isDefined(storeSearchHistory) ? storeSearchHistory : false;
    stopAndResetTimer(_timerName.searchOptionsChanged);
    var searchForText = trimString(_element_SearchDialog_For.value);
    if (storeSearchHistory) {
      _element_SearchDialog_History_DropDown_Button.style.display = "block";
    }
    startTimer(_timerName.searchOptionsChanged, function() {
      var searchForTextAddedToHistory = true;
      var historyLength = _optionsForSearch.history.length;
      if (storeSearchHistory) {
        searchForTextAddedToHistory = false;
        var historyIndex = 0;
        for (; historyIndex < historyLength; historyIndex++) {
          var historyText = _optionsForSearch.history[historyIndex];
          if (historyText === searchForText) {
            searchForTextAddedToHistory = true;
            break;
          }
        }
        if (!searchForTextAddedToHistory) {
          _optionsForSearch.history.push(searchForText);
        }
      }
      if (!storeSearchHistory || searchForTextAddedToHistory) {
        _optionsForSearch.lastSearchText = searchForText;
        _optionsForSearch.not = _element_SearchDialog_Not.checked;
        _optionsForSearch.matchCase = _element_SearchDialog_MatchCase.checked;
        _optionsForSearch.showAdvanced = _element_SearchDialog_Advanced.checked;
        _optionsForSearch.searchTitle = _element_SearchDialog_Include_Title.checked;
        _optionsForSearch.searchLocation = _element_SearchDialog_Include_Location.checked;
        _optionsForSearch.searchDescription = _element_SearchDialog_Include_Description.checked;
        _optionsForSearch.searchGroup = _element_SearchDialog_Include_Group.checked;
        _optionsForSearch.searchUrl = _element_SearchDialog_Include_Url.checked;
        _optionsForSearch.startsWith = _element_SearchDialog_Option_StartsWith.checked;
        _optionsForSearch.endsWith = _element_SearchDialog_Option_EndsWith.checked;
        _optionsForSearch.contains = _element_SearchDialog_Option_Contains.checked;
        if (_element_SearchDialog_Moved) {
          _optionsForSearch.left = _element_SearchDialog.offsetLeft;
          _optionsForSearch.top = _element_SearchDialog.offsetTop;
        }
        triggerOptionsEventWithData("onSearchOptionsUpdated", _optionsForSearch);
      }
    }, 2000, false);
  }
  function setupSearchOptions() {
    _element_SearchDialog_For.value = _optionsForSearch.lastSearchText;
    _element_SearchDialog_Not.checked = _optionsForSearch.not;
    _element_SearchDialog_MatchCase.checked = _optionsForSearch.matchCase;
    _element_SearchDialog_Advanced.checked = _optionsForSearch.showAdvanced;
    _element_SearchDialog_Include_Title.checked = _optionsForSearch.searchTitle;
    _element_SearchDialog_Include_Location.checked = _optionsForSearch.searchLocation;
    _element_SearchDialog_Include_Description.checked = _optionsForSearch.searchDescription;
    _element_SearchDialog_Include_Group.checked = _optionsForSearch.searchGroup;
    _element_SearchDialog_Include_Url.checked = _optionsForSearch.searchUrl;
    _element_SearchDialog_Option_StartsWith.checked = _optionsForSearch.startsWith;
    _element_SearchDialog_Option_EndsWith.checked = _optionsForSearch.endsWith;
    _element_SearchDialog_Option_Contains.checked = _optionsForSearch.contains;
    if (_element_SearchDialog_Advanced.checked) {
      _element_SearchDialog_Advanced_Container.style.display = "block";
    } else {
      _element_SearchDialog_Advanced_Container.style.display = "none";
    }
  }
  function showSearchHistoryDropDownForSearch() {
    var historyLength = _optionsForSearch.history.length;
    if (historyLength > 0) {
      _element_SearchDialog_History_DropDown_Button.style.display = "block";
      stopAndResetTimer(_timerName.searchEventsHistoryDropDown);
      startTimer(_timerName.searchEventsHistoryDropDown, function() {
        var lookupText = _element_SearchDialog_For.value;
        var lookupTextFound = false;
        if (trimString(lookupText) !== _string.empty) {
          sortSearchHistory();
          _element_SearchDialog_History_DropDown.innerHTML = _string.empty;
          var historyIndex = 0;
          for (; historyIndex < historyLength; historyIndex++) {
            var historyText = _optionsForSearch.history[historyIndex];
            if (startsWithAnyCase(historyText, lookupText) && historyText.toLowerCase() !== lookupText.toLowerCase()) {
              addSearchHistoryDropDownItem(_optionsForSearch.history[historyIndex], lookupText.length);
              lookupTextFound = true;
            }
          }
        }
        if (lookupTextFound) {
          showSearchHistoryDropDownMenu();
        } else {
          hideSearchHistoryDropDownMenu();
        }
      }, 150, false);
    } else {
      _element_SearchDialog_History_DropDown_Button.style.display = "none";
    }
  }
  function sortSearchHistory() {
    _optionsForSearch.history.sort(function(value1, value2) {
      var result = 0;
      var value1AnyCase = value1.toLowerCase();
      var value2AnyCase = value2.toLowerCase();
      if (value1AnyCase < value2AnyCase) {
        result = -1;
      } else if (value1AnyCase > value2AnyCase) {
        result = 1;
      }
      return result;
    });
  }
  function showFullSearchHistory(e) {
    cancelBubble(e);
    if (_element_SearchDialog_History_DropDown.style.display !== "block") {
      sortSearchHistory();
      var historyLength = _optionsForSearch.history.length;
      _element_SearchDialog_History_DropDown.innerHTML = _string.empty;
      _element_SearchDialog_For.focus();
      var historyIndex = 0;
      for (; historyIndex < historyLength; historyIndex++) {
        addSearchHistoryDropDownItem(_optionsForSearch.history[historyIndex], 0);
      }
      showSearchHistoryDropDownMenu();
    } else {
      hideSearchHistoryDropDownMenu();
    }
  }
  function addSearchHistoryDropDownItem(historyText, startBoldLength) {
    var historyDropDownItem = createElement("div", "history-dropdown-item");
    _element_SearchDialog_History_DropDown.appendChild(historyDropDownItem);
    var boldText = createElement("span", "search-search");
    setNodeText(boldText, historyText.substring(0, startBoldLength));
    historyDropDownItem.appendChild(boldText);
    var remainingText = createElement("span");
    setNodeText(remainingText, historyText.substring(startBoldLength));
    historyDropDownItem.appendChild(remainingText);
    historyDropDownItem.onclick = function(e) {
      cancelBubble(e);
      hideSearchHistoryDropDownMenu();
      _element_SearchDialog_For.value = historyText;
      _element_SearchDialog_For.selectionStart = _element_SearchDialog_For.selectionEnd = _element_SearchDialog_For.value.length;
      _element_SearchDialog_For.focus();
      searchForTextChanged(false);
    };
  }
  function hideSearchHistoryDropDownMenu() {
    var closed = false;
    if (_element_SearchDialog_History_DropDown !== null && _element_SearchDialog_History_DropDown_Button.className == "ib-arrow-up-full") {
      _element_SearchDialog_History_DropDown.style.display = "none";
      _element_SearchDialog_History_DropDown_Button.className = "ib-arrow-down-full";
      closed = true;
    }
    return closed;
  }
  function showSearchHistoryDropDownMenu() {
    if (_element_SearchDialog_History_DropDown !== null && _element_SearchDialog_History_DropDown_Button.className == "ib-arrow-down-full") {
      _element_SearchDialog_History_DropDown.style.display = "block";
      _element_SearchDialog_History_DropDown_Button.className = "ib-arrow-up-full";
    }
  }
  function buildConfigurationDialog() {
    if (!_datePickerModeEnabled && _element_ConfigurationDialog === null) {
      _element_ConfigurationDialog = createElement("div", "calendar-dialog configuration");
      _document.body.appendChild(_element_ConfigurationDialog);
      var titleBar = createElement("div", "title-bar");
      setNodeText(titleBar, _options.configurationTitleText);
      _element_ConfigurationDialog.appendChild(titleBar);
      makeDialogMovable(titleBar, _element_ConfigurationDialog, null);
      buildToolbarButton(titleBar, "ib-close", _options.closeTooltipText, configurationDialogEvent_Cancel, true);
      var contents = createElement("div", "contents");
      _element_ConfigurationDialog.appendChild(contents);
      var tabsContainer = buildTabContainer(contents);
      buildTab(tabsContainer, _options.displayTabText, function(tab) {
        showTabContents(tab, _element_ConfigurationDialog_Display, _element_ConfigurationDialog);
      }, true);
      buildTab(tabsContainer, _options.organizerTabText, function(tab) {
        showTabContents(tab, _element_ConfigurationDialog_Organizer, _element_ConfigurationDialog);
      });
      _element_ConfigurationDialog_Display = buildTabContents(contents, true, false);
      _element_ConfigurationDialog_Organizer = buildTabContents(contents, false, false);
      _element_ConfigurationDialog_Display_EnableAutoRefresh = buildCheckBox(_element_ConfigurationDialog_Display, _options.enableAutoRefreshForEventsText)[0];
      _element_ConfigurationDialog_Display_EnableBrowserNotifications = buildCheckBox(_element_ConfigurationDialog_Display, _options.enableBrowserNotificationsText, null, null, null, "checkbox-tabbed-in")[0];
      _element_ConfigurationDialog_Display_EnableTooltips = buildCheckBox(_element_ConfigurationDialog_Display, _options.enableTooltipsText, null, null, null, "checkbox-tabbed-down")[0];
      _element_ConfigurationDialog_Display_EnableDragAndDropForEvents = buildCheckBox(_element_ConfigurationDialog_Display, _options.enableDragAndDropForEventText)[0];
      _element_ConfigurationDialog_Display_EnableDayNamesInMainDisplay = buildCheckBox(_element_ConfigurationDialog_Display, _options.enableDayNameHeadersInMainDisplayText)[0];
      _element_ConfigurationDialog_Display_ShowEmptyDaysInWeekView = buildCheckBox(_element_ConfigurationDialog_Display, _options.showEmptyDaysInWeekViewText)[0];
      _element_ConfigurationDialog_Display_ShowHolidaysInTheDisplays = buildCheckBox(_element_ConfigurationDialog_Display, _options.showHolidaysInTheDisplaysText)[0];
      createTextHeaderElement(_element_ConfigurationDialog_Organizer, _options.organizerNameText);
      _element_ConfigurationDialog_Organizer_Name = createElement("input", null, "text");
      _element_ConfigurationDialog_Organizer.appendChild(_element_ConfigurationDialog_Organizer_Name);
      createTextHeaderElement(_element_ConfigurationDialog_Organizer, _options.organizerEmailAddressText);
      _element_ConfigurationDialog_Organizer_Email = createElement("input", null, "email");
      _element_ConfigurationDialog_Organizer.appendChild(_element_ConfigurationDialog_Organizer_Email);
      var buttonsContainer = createElement("div", "buttons-container");
      contents.appendChild(buttonsContainer);
      createButtonElement(buttonsContainer, _options.updateText, "update", configurationDialogEvent_OK);
      createButtonElement(buttonsContainer, _options.cancelText, "cancel", configurationDialogEvent_Cancel);
    }
  }
  function configurationDialogEvent_OK() {
    if (_element_ConfigurationDialog_Display_EnableAutoRefresh.checked) {
      _this.startTheAutoRefreshTimer();
    } else {
      _this.stopTheAutoRefreshTimer();
    }
    _options.eventNotificationsEnabled = _element_ConfigurationDialog_Display_EnableBrowserNotifications.checked;
    _options.tooltipsEnabled = _element_ConfigurationDialog_Display_EnableTooltips.checked;
    _options.dragAndDropForEventsEnabled = _element_ConfigurationDialog_Display_EnableDragAndDropForEvents.checked;
    _options.showDayNamesInMainDisplay = _element_ConfigurationDialog_Display_EnableDayNamesInMainDisplay.checked;
    _options.showEmptyDaysInWeekView = _element_ConfigurationDialog_Display_ShowEmptyDaysInWeekView.checked;
    _options.showHolidays = _element_ConfigurationDialog_Display_ShowHolidaysInTheDisplays.checked;
    _options.organizerName = _element_ConfigurationDialog_Organizer_Name.value;
    _options.organizerEmailAddress = _element_ConfigurationDialog_Organizer_Email.value;
    _initialized = false;
    triggerOptionsEventWithData("onOptionsUpdated", _options);
    checkForBrowserNotificationsPermission();
    hideConfigurationDialog();
    build(_currentDate, true, true);
    showNotificationPopUp(_options.configurationUpdatedText);
  }
  function configurationDialogEvent_Cancel() {
    hideConfigurationDialog();
  }
  function showConfigurationDialog() {
    addNode(_document.body, _element_DisabledBackground);
    _element_ConfigurationDialog_Display_EnableAutoRefresh.checked = _timer_RefreshMainDisplay_Enabled;
    _element_ConfigurationDialog_Display_EnableBrowserNotifications.checked = _options.eventNotificationsEnabled;
    _element_ConfigurationDialog_Display_EnableTooltips.checked = _options.tooltipsEnabled;
    _element_ConfigurationDialog_Display_EnableDragAndDropForEvents.checked = _options.dragAndDropForEventsEnabled;
    _element_ConfigurationDialog_Display_EnableDayNamesInMainDisplay.checked = _options.showDayNamesInMainDisplay;
    _element_ConfigurationDialog_Display_ShowEmptyDaysInWeekView.checked = _options.showEmptyDaysInWeekView;
    _element_ConfigurationDialog_Display_ShowHolidaysInTheDisplays.checked = _options.showHolidays;
    _element_ConfigurationDialog_Organizer_Name.value = _options.organizerName;
    _element_ConfigurationDialog_Organizer_Email.value = _options.organizerEmailAddress;
    _openDialogs.push(hideConfigurationDialog);
    _element_ConfigurationDialog.style.display = "block";
  }
  function hideConfigurationDialog(popCloseWindowEvent) {
    removeLastCloseWindowEvent(popCloseWindowEvent);
    removeNode(_document.body, _element_DisabledBackground);
    _element_ConfigurationDialog.style.display = "none";
  }
  function isEventVisible(eventDetails) {
    var group = getString(eventDetails.group);
    var configGroup = getGroupName(group);
    var type = getNumber(eventDetails.type);
    var visible = true;
    if (group !== _string.empty) {
      if (isDefined(_configuration.visibleGroups)) {
        visible = _configuration.visibleGroups.indexOf(configGroup) > -1;
      }
    } else {
      visible = !_options.hideEventsWithoutGroupAssigned;
    }
    if (visible && isDefined(_configuration.visibleEventTypes) && _eventType.hasOwnProperty(type)) {
      visible = _configuration.visibleEventTypes.indexOf(type) > -1;
    }
    return visible;
  }
  function buildTooltip() {
    if (_element_Tooltip === null) {
      _element_Tooltip = createElement("div", "calendar-tooltip");
      _document.body.appendChild(_element_Tooltip);
      _element_Tooltip_TitleButtons_CloseButton = createElement("div", "ib-close");
      _element_Tooltip_TitleButtons_EditButton = createElement("div", "ib-plus");
      _element_Tooltip_TitleButtons = createElement("div", "title-buttons");
      _element_Tooltip_TitleButtons.appendChild(_element_Tooltip_TitleButtons_CloseButton);
      _element_Tooltip_TitleButtons.appendChild(_element_Tooltip_TitleButtons_EditButton);
      _element_Tooltip_Title = createElement("div", "title");
      _element_Tooltip_Date = createElement("div", "date");
      _element_Tooltip_TotalTime = createElement("div", "duration");
      _element_Tooltip_Repeats = createElement("div", "repeats");
      _element_Tooltip_Description = createElement("div", "description");
      _element_Tooltip_Location = createElement("div", "location");
      _element_Tooltip_Url = createElement("div", "url");
      _element_Tooltip_TitleButtons_CloseButton.onclick = hideTooltip;
      _element_Tooltip_TitleButtons_EditButton.onclick = function() {
        showEventEditingDialog(_element_Tooltip_EventDetails);
      };
      document.body.addEventListener("mousemove", hideTooltip);
    }
  }
  function showTooltip(e, eventDetails, text, overrideShow) {
    cancelBubble(e);
    stopAndResetTimer(_timerName.showToolTip);
    hideTooltip();
    overrideShow = isDefined(overrideShow) ? overrideShow : false;
    if (_element_Tooltip.style.display !== "block" && _options.tooltipsEnabled) {
      startTimer(_timerName.showToolTip, function() {
        if (overrideShow || !isDisabledBackgroundDisplayed() && !isYearSelectorDropDownVisible() && !areDropDownMenusVisible() && _eventDetails_Dragged === null) {
          text = isDefined(text) ? text : _string.empty;
          _element_Tooltip.className = text === _string.empty ? "calendar-tooltip-event" : "calendar-tooltip";
          if (text !== _string.empty) {
            setNodeText(_element_Tooltip, text);
          } else {
            _element_Tooltip.onmousemove = cancelBubble;
            _element_Tooltip_EventDetails = eventDetails;
            _element_Tooltip.innerHTML = _string.empty;
            _element_Tooltip_Title.innerHTML = _string.empty;
            _element_Tooltip_TotalTime.innerHTML = _string.empty;
            _element_Tooltip.appendChild(_element_Tooltip_TitleButtons);
            _element_Tooltip.appendChild(_element_Tooltip_Title);
            _element_Tooltip.appendChild(_element_Tooltip_Date);
            _element_Tooltip.appendChild(_element_Tooltip_TotalTime);
            updateToolbarButtonVisibleState(_element_Tooltip_TitleButtons_EditButton, _options.manualEditingEnabled);
            if (isDefinedStringAndSet(eventDetails.url)) {
              setNodeText(_element_Tooltip_Url, getShortUrlString(eventDetails.url));
              addNode(_element_Tooltip, _element_Tooltip_Url);
              _element_Tooltip_Url.onclick = function(e) {
                cancelBubble(e);
                openEventUrl(eventDetails.url);
                hideTooltip();
              };
            } else {
              _element_Tooltip_Url.innerHTML = _string.empty;
              _element_Tooltip_Url.onclick = null;
              removeNode(_element_Tooltip, _element_Tooltip_Url);
            }
            var repeatEvery = getNumber(eventDetails.repeatEvery);
            if (repeatEvery > _repeatType.never) {
              var icon = createElement("div", "ib-refresh-medium ib-no-hover ib-no-active");
              icon.style.borderColor = _element_Tooltip_Title.style.color;
              _element_Tooltip_Title.appendChild(icon);
            }
            _element_Tooltip_Title.innerHTML += stripHTMLTagsFromText(eventDetails.title);
            if (isDefinedNumber(eventDetails.repeatEvery) && eventDetails.repeatEvery > _repeatType.never) {
              setNodeText(_element_Tooltip_Repeats, _options.repeatsText.replace(":", _string.empty) + _string.space + getRepeatsText(eventDetails.repeatEvery));
              addNode(_element_Tooltip, _element_Tooltip_Repeats);
            } else {
              _element_Tooltip_Repeats.innerHTML = _string.empty;
              removeNode(_element_Tooltip, _element_Tooltip_Repeats);
            }
            if (isDefinedStringAndSet(eventDetails.location)) {
              setNodeText(_element_Tooltip_Location, eventDetails.location);
              addNode(_element_Tooltip, _element_Tooltip_Location);
            } else {
              _element_Tooltip_Location.innerHTML = _string.empty;
              removeNode(_element_Tooltip, _element_Tooltip_Location);
            }
            if (isDefinedStringAndSet(eventDetails.description)) {
              setNodeText(_element_Tooltip_Description, eventDetails.description);
              addNode(_element_Tooltip, _element_Tooltip_Description);
            } else {
              _element_Tooltip_Description.innerHTML = _string.empty;
              removeNode(_element_Tooltip, _element_Tooltip_Description);
            }
            if (eventDetails.from.getDate() === eventDetails.to.getDate()) {
              if (eventDetails.isAllDay) {
                setNodeText(_element_Tooltip_Date, _options.allDayText);
              } else {
                setNodeText(_element_Tooltip_Date, getTimeToTimeDisplay(eventDetails.from, eventDetails.to));
                setNodeText(_element_Tooltip_TotalTime, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
              }
            } else {
              buildDateTimeToDateTimeDisplay(_element_Tooltip_Date, eventDetails.from, eventDetails.to);
              setNodeText(_element_Tooltip_TotalTime, getFriendlyTimeBetweenTwoDate(eventDetails.from, eventDetails.to));
            }
            if (_element_Tooltip_TotalTime.innerHTML === _string.empty) {
              _element_Tooltip.removeChild(_element_Tooltip_TotalTime);
            }
          }
          showElementAtMousePosition(e, _element_Tooltip);
        }
      }, _options.eventTooltipDelay, false);
    }
  }
  function hideTooltip() {
    stopAndResetTimer(_timerName.showToolTip);
    if (isTooltipVisible()) {
      _element_Tooltip.style.display = "none";
      _element_Tooltip_EventDetails = null;
      _element_Tooltip.onmousemove = null;
    }
  }
  function isTooltipVisible() {
    return doesTimerExist(_timerName.showToolTip) || _element_Tooltip !== null && _element_Tooltip.style.display === "block";
  }
  function addToolTip(element, text, overrideShow) {
    if (element !== null) {
      element.onmousemove = function(e) {
        showTooltip(e, null, text, overrideShow);
      };
    }
  }
  function buildNotificationPopUp() {
    if (_element_Notification === null && !_datePickerModeEnabled) {
      _element_Notification = createElement("div", "calendar-notification");
      _document.body.appendChild(_element_Notification);
    }
  }
  function showNotificationPopUp(text, success) {
    if (_options.popUpNotificationsEnabled) {
      success = isDefined(success) ? success : true;
      stopAndResetTimer(_timerName.hideNotification);
      _element_Notification.innerHTML = _string.empty;
      var message = createElement("div", success ? "success" : "error");
      _element_Notification.appendChild(message);
      _element_Notification.style.display = "block";
      setNodeText(message, text);
      buildToolbarButton(message, "ib-close-icon", _options.closeTooltipText, hideNotificationPopUp);
      startTimer(_timerName.hideNotification, function() {
        hideNotificationPopUp();
      }, 5000, false);
    }
  }
  function hideNotificationPopUp() {
    _element_Notification.style.display = "none";
  }
  function makeDialogMovable(titleBar, dialog, mouseUpFunc) {
    titleBar.onmousedown = function(e) {
      onMoveTitleBarMouseDown(e, dialog);
    };
    titleBar.onmouseup = function() {
      onMoveTitleBarMouseUp(mouseUpFunc);
    };
    titleBar.oncontextmenu = function() {
      onMoveTitleBarMouseUp(null);
    };
  }
  function onMoveTitleBarMouseDown(e, dialog) {
    if (!_element_MoveDialog_IsMoving) {
      hideAllDropDowns();
      _element_MoveDialog = dialog;
      _element_MoveDialog_IsMoving = true;
      _element_MoveDialog_X = e.pageX - _element_MoveDialog.offsetLeft;
      _element_MoveDialog_Y = e.pageY - _element_MoveDialog.offsetTop;
      _element_MoveDialog_Original_X = _element_MoveDialog.offsetLeft;
      _element_MoveDialog_Original_Y = _element_MoveDialog.offsetTop;
    }
  }
  function onMoveTitleBarMouseUp(func) {
    if (_element_MoveDialog_IsMoving) {
      _element_MoveDialog_IsMoving = false;
      _element_MoveDialog = null;
      _element_MoveDialog_Original_X = 0;
      _element_MoveDialog_Original_Y = 0;
      if (func !== null) {
        func();
      }
    }
  }
  function onMoveDocumentMouseMove(e) {
    if (_element_MoveDialog_IsMoving) {
      _element_MoveDialog.style.left = e.pageX - _element_MoveDialog_X + "px";
      _element_MoveDialog.style.top = e.pageY - _element_MoveDialog_Y + "px";
    }
  }
  function onMoveDocumentMouseLeave() {
    if (_element_MoveDialog_IsMoving) {
      _element_MoveDialog.style.left = _element_MoveDialog_Original_X + "px";
      _element_MoveDialog.style.top = _element_MoveDialog_Original_Y + "px";
      _element_MoveDialog_IsMoving = false;
      _element_MoveDialog = null;
      _element_MoveDialog_Original_X = 0;
      _element_MoveDialog_Original_Y = 0;
    }
  }
  function buildTabContainer(container) {
    var tabsContainer = createElement("div");
    container.appendChild(tabsContainer);
    return tabsContainer;
  }
  function buildTab(container, text, onClickEvent, selected) {
    selected = isDefined(selected) ? selected : false;
    var className = "tab tab-control" + (selected ? "-selected" : _string.empty);
    var tab = createElement("div", className);
    setNodeText(tab, text);
    container.appendChild(tab);
    tab.onclick = function() {
      onClickEvent(tab);
    };
  }
  function buildTabContents(container, selected, canScroll) {
    selected = isDefined(selected) ? selected : false;
    canScroll = isDefined(canScroll) ? canScroll : true;
    var tabContainer = createElement("div", "checkbox-container tab-content custom-scroll-bars");
    container.appendChild(tabContainer);
    if (canScroll) {
      tabContainer.className += " custom-scroll-bars";
    }
    if (!selected) {
      tabContainer.style.display = "none";
    }
    return tabContainer;
  }
  function showTabContents(tab, contents, container) {
    var tabs = container.getElementsByClassName("tab-control-selected");
    var tabsLength = tabs.length;
    var allContents = container.getElementsByClassName("tab-content");
    var allContentsLength = allContents.length;
    var tabIndex = 0;
    for (; tabIndex < tabsLength; tabIndex++) {
      tabs[tabIndex].className = "tab tab-control";
    }
    var allContentsIndex = 0;
    for (; allContentsIndex < allContentsLength; allContentsIndex++) {
      allContents[allContentsIndex].style.display = "none";
    }
    tab.className = "tab tab-control-selected";
    contents.style.display = "block";
  }
  function selectTab(container, tabIndex) {
    tabIndex = isDefined(tabIndex) ? tabIndex : 0;
    var tabs = container.getElementsByClassName("tab");
    var tabsLength = tabs.length;
    if (tabsLength > 0) {
      tabs[tabIndex].click();
    }
  }
  function setEventClassesAndColors(event, eventDetails, toDate, setNotInMonthCss) {
    setNotInMonthCss = isDefined(setNotInMonthCss) ? setNotInMonthCss : false;
    if (isDefined(toDate) && toDate < new Date()) {
      event.className += " expired";
    }
    if (setNotInMonthCss && isDefined(toDate) && toDate < _currentDate && (toDate.getFullYear() !== _currentDate.getFullYear() || toDate.getMonth() !== _currentDate.getMonth())) {
      event.className += " not-in-current-month";
    }
    if (isDefinedStringAndSet(eventDetails.color)) {
      event.style.backgroundColor = eventDetails.color;
      if (isDefinedStringAndSet(eventDetails.colorText)) {
        event.style.color = eventDetails.colorText;
      }
      if (isDefinedStringAndSet(eventDetails.colorBorder)) {
        event.style.borderColor = eventDetails.colorBorder;
      }
    } else {
      if (eventDetails.isAllDay) {
        event.className += " all-day";
      }
    }
  }
  function setEventClassesForActions(event, eventDetails) {
    if (_element_SearchDialog_FocusedEventID === eventDetails.id) {
      event.className += " focused-event";
    }
    if (isEventIdSelected(eventDetails.id)) {
      event.className += " selected-event";
    }
    if (isEventIdCopied(eventDetails.id)) {
      if (_copiedEventDetails_Cut) {
        event.className += " cut-event";
      } else {
        event.className += " copy-event";
      }
    }
  }
  function updateEventClasses(id, className, remove) {
    remove = isDefined(remove) ? remove : false;
    var elements = _document.getElementsByClassName("event");
    var elementsArray = [].slice.call(elements);
    var elementsArrayLength = elementsArray.length;
    var elementsArrayIndex = 0;
    for (; elementsArrayIndex < elementsArrayLength; elementsArrayIndex++) {
      var element = elementsArray[elementsArrayIndex];
      var elementAttributeData = element.getAttribute("event-id");
      if (elementAttributeData !== null && elementAttributeData === id.toString()) {
        if (!remove) {
          element.className += _string.space + className;
        } else {
          element.className = element.className.replace(_string.space + className, _string.empty);
        }
      }
    }
  }
  function checkEventForBrowserNotifications(date, eventDetails) {
    if (isDateToday(date) && !_datePickerModeEnabled) {
      var newFrom = new Date();
      var newTo = new Date();
      var today = new Date();
      var repeatEvery = getNumber(eventDetails.repeatEvery);
      newFrom.setHours(eventDetails.from.getHours(), eventDetails.from.getMinutes(), 0, 0);
      newTo.setHours(eventDetails.to.getHours(), eventDetails.to.getMinutes(), 0, 0);
      if (repeatEvery === _repeatType.never && !isDateToday(eventDetails.from)) {
        newFrom.setHours(0, 0, 0, 0);
      }
      if (repeatEvery === _repeatType.never && !isDateToday(eventDetails.to)) {
        newTo.setHours(23, 59, 59, 99);
      }
      if (today >= newFrom && today <= newTo) {
        if (!isDefinedBoolean(eventDetails.showAsBusy) || eventDetails.showAsBusy) {
          _isCalendarBusy = true;
        }
        if (!_eventNotificationsTriggered.hasOwnProperty(eventDetails.id) && !isDefinedBoolean(eventDetails.showAlerts) || eventDetails.showAlerts) {
          runBrowserNotificationAction(function() {
            launchBrowserNotificationForEvent(eventDetails);
          }, false, eventDetails);
        }
      }
    }
  }
  function launchBrowserNotificationForEvent(eventDetails) {
    _eventNotificationsTriggered[eventDetails.id] = true;
    var notification = new Notification(_options.eventNotificationTitle, {body:_options.eventNotificationBody.replace("{0}", eventDetails.title)});
    notification.onclick = function() {
      var url = getString(eventDetails.url);
      if (url === _string.empty) {
        showEventEditingDialog(eventDetails);
      } else {
        openEventUrl(url);
      }
      triggerOptionsEventWithData("onNotificationClicked", eventDetails);
    };
  }
  function checkForBrowserNotificationsPermission() {
    runBrowserNotificationAction(function() {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    });
  }
  function runBrowserNotificationAction(action, writeConsoleLog, eventDetails) {
    if (_options.eventNotificationsEnabled && !_datePickerModeEnabled) {
      writeConsoleLog = isDefined(writeConsoleLog) ? writeConsoleLog : true;
      if (!Notification) {
        if (writeConsoleLog) {
          console.error("Browser notifications API unavailable.");
        }
      } else {
        action();
      }
      if (isDefined(eventDetails)) {
        triggerOptionsEventWithData("onNotification", eventDetails);
      }
    }
  }
  function openEventUrl(url) {
    _window.open(url, _options.urlWindowTarget);
    triggerOptionsEvent("onEventUrlClicked", url);
  }
  function setCopiedEventsClasses(clear) {
    clear = isDefined(clear) ? clear : true;
    var copiedEventDetailsLength = _copiedEventDetails.length;
    var copiedEventDetailsIndex = 0;
    for (; copiedEventDetailsIndex < copiedEventDetailsLength; copiedEventDetailsIndex++) {
      var eventDetails = _copiedEventDetails[copiedEventDetailsIndex];
      if (_copiedEventDetails_Cut) {
        updateEventClasses(eventDetails.id, "cut-event", clear);
      } else {
        updateEventClasses(eventDetails.id, "copy-event", clear);
      }
    }
  }
  function setCopiedEvents(eventDetails) {
    _copiedEventDetails = [];
    var selectedEventsLength = _eventsSelected.length;
    if (selectedEventsLength > 0) {
      var selectedEventIndex = 0;
      for (; selectedEventIndex < selectedEventsLength; selectedEventIndex++) {
        _copiedEventDetails.push(_eventsSelected[selectedEventIndex]);
      }
    } else {
      _copiedEventDetails.push(eventDetails);
    }
  }
  function isEventIdSelected(id) {
    var result = false;
    var eventsSelectedLength = _eventsSelected.length;
    var eventsSelectedIndex = 0;
    for (; eventsSelectedIndex < eventsSelectedLength; eventsSelectedIndex++) {
      if (_eventsSelected[eventsSelectedIndex].id === id) {
        result = true;
        break;
      }
    }
    return result;
  }
  function isEventIdCopied(id) {
    var result = false;
    var copiedEventDetailsLength = _copiedEventDetails.length;
    var copiedEventDetailsIndex = 0;
    for (; copiedEventDetailsIndex < copiedEventDetailsLength; copiedEventDetailsIndex++) {
      if (_copiedEventDetails[copiedEventDetailsIndex].id === id) {
        result = true;
        break;
      }
    }
    return result;
  }
  function pasteEventsToDate(date, cut) {
    var copiedEventDetailsLength = _copiedEventDetails.length;
    var copiedEventDetailsIndex = 0;
    for (; copiedEventDetailsIndex < copiedEventDetailsLength; copiedEventDetailsIndex++) {
      var eventDetails = _copiedEventDetails[copiedEventDetailsIndex];
      var totalDays = getTotalDaysBetweenDates(eventDetails.from, eventDetails.to);
      var newEvent = !cut ? cloneEventDetails(eventDetails) : eventDetails;
      newEvent.from.setDate(date.getDate());
      newEvent.from.setMonth(date.getMonth());
      newEvent.from.setFullYear(date.getFullYear());
      newEvent.to.setDate(date.getDate());
      newEvent.to.setMonth(date.getMonth());
      newEvent.to.setFullYear(date.getFullYear());
      newEvent.to.setDate(newEvent.to.getDate() + totalDays);
      if (!cut) {
        newEvent.id = null;
        _this.addEvent(newEvent, false, true);
      } else {
        triggerOptionsEventWithData("onEventUpdated", newEvent);
      }
    }
    showNotificationPopUp(_options.eventsPastedText.replace("{0}", copiedEventDetailsLength));
    if (cut) {
      clearSelectedEvents();
      _copiedEventDetails = [];
      _copiedEventDetails_Cut = false;
    }
    buildDayEvents();
    refreshOpenedViews();
  }
  function storeMultiSelectEvent(e, eventDetails) {
    cancelBubble(e);
    hideAllDropDowns();
    if (!isEventLocked(eventDetails)) {
      if (isControlKey(e)) {
        if (!isEventIdSelected(eventDetails.id)) {
          _eventsSelected.push(eventDetails);
          updateEventClasses(eventDetails.id, "selected-event", false);
        } else {
          var eventsSelectedLength = _eventsSelected.length;
          var eventsSelectedIndex = 0;
          for (; eventsSelectedIndex < eventsSelectedLength; eventsSelectedIndex++) {
            if (_eventsSelected[eventsSelectedIndex].id === eventDetails.id) {
              _eventsSelected.splice(eventsSelectedIndex, 1);
              break;
            }
          }
          updateEventClasses(eventDetails.id, "selected-event", true);
        }
      } else {
        clearSelectedEvents();
      }
    } else {
      if (!isControlKey(e)) {
        clearSelectedEvents();
      }
    }
  }
  function clearSelectedEvents() {
    var cleared = false;
    var eventsSelectedLength = _eventsSelected.length;
    if (eventsSelectedLength > 0) {
      var eventsSelectedIndex = 0;
      for (; eventsSelectedIndex < eventsSelectedLength; eventsSelectedIndex++) {
        updateEventClasses(_eventsSelected[eventsSelectedIndex].id, "selected-event", true);
      }
      cleared = true;
      _eventsSelected = [];
    }
    return cleared;
  }
  function setCopiedEventsFromKeyDown(cut) {
    _copiedEventDetails = [];
    _copiedEventDetails_Cut = isDefined(cut) ? cut : false;
    var selectedEventsLength = _eventsSelected.length;
    if (selectedEventsLength > 0) {
      var selectedEventIndex = 0;
      for (; selectedEventIndex < selectedEventsLength; selectedEventIndex++) {
        _copiedEventDetails.push(_eventsSelected[selectedEventIndex]);
      }
      setCopiedEventsClasses(false);
    }
  }
  function pasteCopiedEventsFromKeyDown() {
    var copiedEventsLength = _copiedEventDetails.length;
    if (isOverlayVisible(_element_FullDayView) && copiedEventsLength > 0) {
      pasteEventsToDate(_element_FullDayView_DateSelected, _copiedEventDetails_Cut);
    }
  }
  function startAutoRefreshTimer() {
    if (_options.autoRefreshTimerDelay > 0 && !_datePickerModeEnabled && _timer_RefreshMainDisplay_Enabled) {
      startTimer(_timerName.autoRefresh, function() {
        refreshViews();
      }, _options.autoRefreshTimerDelay);
    }
  }
  function clearAutoRefreshTimer() {
    if (_options.autoRefreshTimerDelay > 0 && !_datePickerModeEnabled && _timer_RefreshMainDisplay_Enabled) {
      stopAndResetTimer(_timerName.autoRefresh);
    }
  }
  function refreshViews(fromButton, triggerEvent) {
    fromButton = isDefined(fromButton) ? fromButton : false;
    triggerEvent = isDefined(triggerEvent) ? triggerEvent : false;
    if (isOnlyMainDisplayVisible() || fromButton) {
      refreshOpenedViews();
      updateFullDayViewTimeArrowPosition();
      if (_isDateToday) {
        build();
      } else {
        buildDayEvents();
      }
      if (triggerEvent) {
        triggerOptionsEvent("onRefresh");
      }
    }
  }
  function isOnlyMainDisplayVisible() {
    return !isTooltipVisible() && !isDisabledBackgroundDisplayed() && !isYearSelectorDropDownVisible() && !areDropDownMenusVisible() && !isSideMenuOpen() && _eventDetails_Dragged === null;
  }
  function startTimer(timerName, func, timeout, interval) {
    interval = isDefined(interval) ? interval : true;
    if (!doesTimerExist(timerName)) {
      if (interval) {
        _timers[timerName] = setInterval(func, timeout);
      } else {
        _timers[timerName] = setTimeout(function() {
          func();
          delete _timers[timerName];
        }, timeout);
      }
    }
  }
  function stopAndResetTimer(timerName) {
    if (doesTimerExist(timerName)) {
      clearTimeout(_timers[timerName]);
      delete _timers[timerName];
    }
  }
  function doesTimerExist(timerName) {
    return _timers.hasOwnProperty(timerName) && _timers[timerName] !== null;
  }
  function stopAndResetAllTimers() {
    var timerName;
    for (timerName in _timers) {
      if (_timers.hasOwnProperty(timerName) && _timers[timerName] !== null) {
        clearTimeout(_timers[timerName]);
        delete _timers[timerName];
      }
    }
  }
  function getGroupName(group) {
    return group.toLowerCase();
  }
  function getGroups() {
    var groups = [];
    var groupsAnyCase = [];
    getAllEventsFunc(function(eventDetails) {
      var group = getString(eventDetails.group);
      if (group !== _string.empty && groupsAnyCase.indexOf(group.toLowerCase()) === -1) {
        groups.push(group);
        groupsAnyCase.push(group.toLowerCase());
      }
    });
    groups.sort();
    return groups;
  }
  function showOverlay(element) {
    if (!isOverlayVisible(element)) {
      element.className += " overlay-shown";
      hideSearchDialog();
    }
  }
  function hideOverlay(element) {
    if (isOverlayVisible(element)) {
      element.className = element.className.replace(" overlay-shown", _string.empty);
    }
  }
  function isOverlayVisible(element) {
    return element !== null && element.className.indexOf("overlay-shown") > -1;
  }
  function createElement(type, className, inputType, inputId) {
    var result = null;
    var nodeType = type.toLowerCase();
    var isText = nodeType === "text";
    if (!_elementTypes.hasOwnProperty(nodeType)) {
      _elementTypes[nodeType] = isText ? _document.createTextNode(_string.empty) : _document.createElement(nodeType);
    }
    result = _elementTypes[nodeType].cloneNode(false);
    if (type === "input" && inputType !== "button" || type === "textarea") {
      if (isDefined(inputId)) {
        result.id = inputId;
      } else {
        result.id = newGuid();
      }
    }
    if (isDefined(className)) {
      result.className = className;
    }
    if (isDefined(inputType)) {
      result.type = inputType;
    }
    return result;
  }
  function createTextHeaderElement(container, text, className) {
    var element = createElement("p");
    setNodeText(element, text);
    container.appendChild(element);
    if (isDefined(className)) {
      element.className = className;
    }
    return element;
  }
  function createSpanElement(container, text, className, event, cancelDblClick, addSeparator) {
    cancelDblClick = isDefined(cancelDblClick) ? cancelDblClick : false;
    addSeparator = isDefined(addSeparator) ? addSeparator : false;
    if (addSeparator) {
      container.appendChild(createElement("div", "separator"));
    }
    var element = createElement("span", className);
    var isEventDefined = isDefinedFunction(event);
    setNodeText(element, text);
    container.appendChild(element);
    if (isEventDefined) {
      element.onclick = event;
    }
    if (cancelDblClick && isEventDefined) {
      element.ondblclick = cancelBubble;
    }
  }
  function createButtonElement(container, text, className, event, tooltipText) {
    var button = createElement("input", className, "button");
    button.value = text;
    button.onclick = event;
    container.appendChild(button);
    if (isDefined(tooltipText)) {
      addToolTip(button, tooltipText, true);
    }
    return button;
  }
  function getElementByID(id) {
    if (!_elements.hasOwnProperty(id) || _elements[id] === null) {
      _elements[id] = getInternalElementByID(id);
    }
    if (!_document.body.contains(_elements[id])) {
      _elements[id] = getInternalElementByID(id);
    }
    return _elements[id];
  }
  function getInternalElementByID(id) {
    var element = null;
    if (_element_Calendar === null) {
      element = _document.getElementById(id);
    } else {
      var elements = _element_Calendar.getElementsByTagName("*");
      var elementsLength = elements.length;
      var elementIndex = 0;
      for (; elementIndex < elementsLength; elementIndex++) {
        if (elements[elementIndex].id === id) {
          element = elements[elementIndex];
          break;
        }
      }
    }
    return element;
  }
  function addNode(parent, node) {
    try {
      if (!parent.contains(node)) {
        parent.appendChild(node);
      }
    } catch (e) {
      console.warn(e.message);
    }
  }
  function removeNode(parent, node) {
    try {
      if (parent.contains(node)) {
        parent.removeChild(node);
      }
    } catch (e) {
      console.warn(e.message);
    }
  }
  function cancelBubble(e) {
    e.preventDefault();
    e.cancelBubble = true;
  }
  function cancelBubbleOnly(e) {
    e.cancelBubble = true;
  }
  function showElementAtMousePosition(e, element) {
    var left = e.pageX;
    var top = e.pageY;
    var scrollPosition = getScrollPosition();
    element.style.display = "block";
    if (left + element.offsetWidth > _window.innerWidth) {
      left = left - element.offsetWidth;
    } else {
      left++;
    }
    if (top + element.offsetHeight > _window.innerHeight) {
      top = top - element.offsetHeight;
    } else {
      top++;
    }
    if (left < scrollPosition.left) {
      left = e.pageX + 1;
    }
    if (top < scrollPosition.top) {
      top = e.pageY + 1;
    }
    element.style.left = left + "px";
    element.style.top = top + "px";
  }
  function setInputType(input, type) {
    try {
      input.type = type;
    } catch (e) {
      console.error(e.message);
      input.type = "text";
    }
  }
  function getOffset(element) {
    var left = 0;
    var top = 0;
    for (; element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop);) {
      left = left + (element.offsetLeft - element.scrollLeft);
      top = top + (element.offsetTop - element.scrollTop);
      element = element.offsetParent;
    }
    return {left:left, top:top};
  }
  function getScrollPosition() {
    var doc = _document.documentElement;
    var left = (_window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    var top = (_window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    return {left:left, top:top};
  }
  function removeLastCloseWindowEvent(popCloseWindowEvent) {
    popCloseWindowEvent = isDefined(popCloseWindowEvent) ? popCloseWindowEvent : true;
    if (popCloseWindowEvent) {
      _openDialogs.pop();
    }
  }
  function cloneEventDetails(value, deleteId) {
    deleteId = isDefined(deleteId) ? deleteId : true;
    var object = JSON.parse(JSON.stringify(value));
    object.from = new Date(object.from);
    object.to = new Date(object.to);
    if (isDefined(object.repeatEnds)) {
      object.repeatEnds = new Date(object.repeatEnds);
    }
    delete object.created;
    delete object.lastUpdated;
    if (deleteId) {
      delete object.id;
    }
    return object;
  }
  function setElementClassName(element, className) {
    if (element !== null) {
      element.className = className;
    }
  }
  function stripHTMLTagsFromText(text) {
    var result = text;
    if (!_options.allowHtmlInDisplay) {
      var div = createElement("div");
      div.innerHTML = text;
      result = div.innerText;
    }
    return result;
  }
  function getStyleValueByName(element, stylePropertyName) {
    var value = null;
    if (_window.getComputedStyle) {
      value = document.defaultView.getComputedStyle(element, null).getPropertyValue(stylePropertyName);
    } else if (element.currentStyle) {
      value = element.currentStyle[stylePropertyName];
    }
    return value;
  }
  function setNodeText(element, text) {
    if (!_options.allowHtmlInDisplay) {
      element.innerText = stripHTMLTagsFromText(text);
    } else {
      element.innerHTML = text;
    }
  }
  function updateToolbarButtonVisibleState(button, flag) {
    if (button !== null) {
      if (!flag) {
        button.style.display = "none";
      } else {
        button.style.display = "inline-block";
      }
    }
  }
  function updateContainerClassChildren(containerClass, func, ignoreElement) {
    var elements = _element_Calendar.getElementsByClassName(containerClass);
    var elementsLength = elements.length;
    var elementIndex = 0;
    for (; elementIndex < elementsLength; elementIndex++) {
      var element = elements[elementIndex];
      var elementChildren = element.children;
      var elementChildrenLength = elementChildren.length;
      var elementChildrenIndex = 0;
      for (; elementChildrenIndex < elementChildrenLength; elementChildrenIndex++) {
        if (elementChildren[elementChildrenIndex] !== ignoreElement) {
          func(elementChildren[elementChildrenIndex]);
        }
      }
    }
  }
  function reverseElementsOrder(parent) {
    var children = parent.children;
    var childrenLength = children.length - 1;
    for (; childrenLength--;) {
      parent.appendChild(children[childrenLength]);
    }
  }
  function buildRadioButton(container, labelText, groupName, onChangeEvent) {
    var lineContents = createElement("div", "radio-button-container");
    container.appendChild(lineContents);
    var label = createElement("label", "radio-button");
    lineContents.appendChild(label);
    var input = createElement("input", null, "radio");
    input.name = groupName;
    label.appendChild(input);
    if (isDefined(onChangeEvent)) {
      input.onchange = onChangeEvent;
    }
    label.appendChild(createElement("span", "check-mark"));
    createSpanElement(label, labelText, "text");
    return input;
  }
  function buildCheckBox(container, labelText, onChangeEvent, name, checked, extraClassName, onClickEvent) {
    extraClassName = isDefined(extraClassName) ? _string.space + extraClassName : _string.empty;
    var lineContents = createElement("div");
    container.appendChild(lineContents);
    var label = createElement("label", "checkbox" + extraClassName);
    lineContents.appendChild(label);
    if (isDefined(onClickEvent)) {
      label.onclick = onClickEvent;
    }
    var input = createElement("input", null, "checkbox");
    label.appendChild(input);
    if (isDefined(name)) {
      input.name = name;
    }
    if (isDefined(onChangeEvent)) {
      input.onchange = onChangeEvent;
    }
    if (isDefined(checked)) {
      input.checked = checked;
    }
    label.appendChild(createElement("span", "check-mark"));
    createSpanElement(label, labelText, "text");
    return [input, label];
  }
  function buildToolbarButton(container, cssClass, tooltipText, onClickEvent, overrideShow) {
    var button = createElement("div", cssClass);
    button.ondblclick = cancelBubble;
    button.onclick = onClickEvent;
    container.appendChild(button);
    addToolTip(button, tooltipText, overrideShow);
    return button;
  }
  function buildNoEventsAvailableText(container, onClickEvent) {
    container.innerHTML = _string.empty;
    var contents = createElement("div", "no-events-available-text");
    container.appendChild(contents);
    createTextHeaderElement(contents, _options.noEventsAvailableFullText);
    if (_options.manualEditingEnabled) {
      contents.appendChild(createElement("div"));
      createSpanElement(contents, _options.clickText + _string.space);
      createSpanElement(contents, _options.hereText, "link", onClickEvent);
      createSpanElement(contents, _string.space + _options.toAddANewEventText);
    }
  }
  function padNumber(number) {
    var numberString = number.toString();
    return numberString.length === 1 ? "0" + numberString : numberString;
  }
  function trimString(string) {
    return string.replace(/^\s+|\s+$/g, _string.empty);
  }
  function newGuid() {
    var result = [];
    var charIndex = 0;
    for (; charIndex < 32; charIndex++) {
      if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
        result.push("-");
      }
      var character = Math.floor(Math.random() * 16).toString(16);
      result.push(character);
    }
    return result.join(_string.empty);
  }
  function startsWith(data, start) {
    return data.substring(0, start.length) === start;
  }
  function startsWithAnyCase(data, start) {
    return data.substring(0, start.length).toLowerCase() === start.toLowerCase();
  }
  function endsWith(data, end) {
    return data.substring(data.length - end.length, data.length) === end;
  }
  function getShortUrlString(url, maxLength) {
    var result = url;
    maxLength = isDefined(maxLength) ? maxLength : 30;
    if (url.length > maxLength) {
      var sideLength = maxLength % 2 === 0 ? maxLength / 2 : (maxLength - 1) / 2;
      result = url.substring(0, sideLength) + "..." + url.substring(url.length - sideLength);
    }
    return result;
  }
  function isDefinedOnly(data) {
    return data !== undefined;
  }
  function isDefined(data) {
    return isDefinedOnly(data) && data !== null && data !== _string.empty;
  }
  function isFunction(object) {
    return typeof object === "function";
  }
  function isDefinedFunction(object) {
    return isDefined(object) && isFunction(object);
  }
  function isDefinedString(object) {
    return isDefined(object) && typeof object === "string";
  }
  function isDefinedNumber(object) {
    return isDefined(object) && typeof object === "number";
  }
  function isDefinedBoolean(object) {
    return isDefined(object) && typeof object === "boolean";
  }
  function isDefinedObject(object) {
    return isDefined(object) && typeof object === "object";
  }
  function isDefinedArray(object) {
    return isDefinedObject(object) && object instanceof Array;
  }
  function isDefinedStringAndSet(object) {
    return isDefinedString(object) && object !== _string.empty;
  }
  function isDefinedDate(object) {
    return isDefinedObject(object) && object instanceof Date;
  }
  function isDefinedDOMElement(object) {
    return isDefinedObject(object) && object.tagName !== undefined;
  }
  function isValidUrl(url) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
  }
  function areArraysTheSame(array1, array2) {
    var result = isDefinedArray(array1) && isDefinedArray(array2);
    if (result) {
      array1.sort();
      array2.sort();
      result = JSON.stringify(array1) === JSON.stringify(array2);
    }
    return result;
  }
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getDefaultNumber(value, defaultValue) {
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultDate(value, defaultValue) {
    return isDefinedDate(value) ? value : defaultValue;
  }
  function storeEventsInLocalStorage() {
    if (_options.useLocalStorageForEvents && _window.localStorage) {
      _window.localStorage.clear();
      var orderedEvents = getOrderedEvents(getAllEvents());
      var orderedEventsLength = orderedEvents.length;
      var orderedEventIndex = 0;
      for (; orderedEventIndex < orderedEventsLength; orderedEventIndex++) {
        var orderedEvent = orderedEvents[orderedEventIndex];
        var orderedEventsJson = JSON.stringify(orderedEvent);
        _window.localStorage.setItem("CJS_" + orderedEventIndex.toString(), orderedEventsJson);
      }
    }
  }
  function loadEventsFromLocalStorage() {
    if (_options.useLocalStorageForEvents && _window.localStorage) {
      var keysLength = _window.localStorage.length;
      var keyIndex = 0;
      for (; keyIndex < keysLength; keyIndex++) {
        var eventJson = _window.localStorage.getItem(_window.localStorage.key(keyIndex));
        var event = getObjectFromString(eventJson);
        if (isDefined(event)) {
          _this.addEvent(event, false, false, false);
        }
      }
    }
  }
  function exportEvents(events, type, filename, copyToClipboard) {
    type = isDefined(type) ? type.toLowerCase() : "csv";
    copyToClipboard = isDefined(copyToClipboard) ? copyToClipboard : false;
    var contents = _string.empty;
    var contentsEvents = getOrderedEvents(getExportEvents(events), false);
    if (type === "csv") {
      contents = getCsvContents(contentsEvents);
    } else if (type === "xml") {
      contents = getXmlContents(contentsEvents, filename);
    } else if (type === "json") {
      contents = getJsonContents(contentsEvents);
    } else if (type === "text") {
      contents = getTextContents(contentsEvents, filename);
    } else if (type === "ical") {
      contents = getICalContents(contentsEvents);
    } else if (type === "md") {
      contents = getMdContents(contentsEvents);
    } else if (type === "html") {
      contents = getHtmlContents(contentsEvents, filename);
    } else if (type === "tsv") {
      contents = getTsvContents(contentsEvents);
    }
    if (contents !== _string.empty) {
      if (copyToClipboard) {
        _navigator.clipboard.writeText(contents);
        showNotificationPopUp(_options.eventsExportedText);
      } else {
        var tempLink = createElement("a");
        var fileAttributes = getExportFileAttributes(type);
        var mimeTypeStart = fileAttributes[0];
        var mimeTypeEnd = fileAttributes[1];
        var extension = fileAttributes[2];
        filename = isDefined(filename) ? filename : getExportDownloadFilename(extension);
        tempLink.style.display = "none";
        tempLink.setAttribute("target", "_blank");
        tempLink.setAttribute("href", "data:" + mimeTypeStart + "/" + mimeTypeEnd + ";charset=utf-8," + encodeURIComponent(contents));
        tempLink.setAttribute("download", filename);
        _document.body.appendChild(tempLink);
        tempLink.click();
        _document.body.removeChild(tempLink);
        showNotificationPopUp(_options.eventsExportedToText.replace("{0}", filename));
      }
      triggerOptionsEvent("onEventsExported");
    }
  }
  function getExportFileAttributes(exportType) {
    var mimeTypeStart = "text";
    var mimeTypeEnd = exportType;
    var extension = exportType;
    if (exportType === "text") {
      mimeTypeEnd = "plain";
      extension = "txt";
    } else if (exportType === "ical") {
      mimeTypeEnd = "calendar";
      extension = "ics";
    } else if (exportType === "json") {
      mimeTypeStart = "application";
    } else if (exportType === "md") {
      mimeTypeEnd = "x-markdown";
    } else if (exportType === "html") {
      mimeTypeEnd = "html";
    } else if (exportType === "tsv") {
      mimeTypeEnd = "tab-separated-values";
    }
    return [mimeTypeStart, mimeTypeEnd, extension];
  }
  function getExportEvents(events) {
    var csvOrderedEvents = [];
    if (isDefined(events)) {
      csvOrderedEvents = csvOrderedEvents.concat(events);
    } else {
      csvOrderedEvents = getAllEvents();
    }
    csvOrderedEvents = getOrderedEvents(csvOrderedEvents);
    return csvOrderedEvents;
  }
  function getExportDownloadFilename(extension) {
    var date = new Date();
    var datePart = padNumber(date.getDate()) + "-" + padNumber(date.getMonth() + 1) + "-" + date.getFullYear();
    var timePart = padNumber(date.getHours()) + "-" + padNumber(date.getMinutes());
    return _options.exportStartFilename + datePart + "_" + timePart + "." + extension;
  }
  function getYesNoFromBoolean(flag) {
    return flag ? _options.yesText : _options.noText;
  }
  function getStringFromDateTime(eventDate) {
    var result = _options.repeatsNever;
    if (isDefined(eventDate)) {
      var date = padNumber(eventDate.getDate()) + "/" + padNumber(eventDate.getMonth() + 1) + "/" + eventDate.getFullYear();
      var time = padNumber(eventDate.getHours()) + ":" + padNumber(eventDate.getMinutes());
      result = date + _string.space + time;
    }
    return result;
  }
  function getString(value, defaultValue) {
    defaultValue = isDefined(defaultValue) ? defaultValue : _string.empty;
    return isDefinedString(value) ? value : defaultValue;
  }
  function stripNewLines(value) {
    return value.replace(/\n|\r/g, _string.empty);
  }
  function getNumber(value, defaultValue) {
    defaultValue = isDefined(defaultValue) ? defaultValue : 0;
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getBooleanAsNumber(value, defaultValue) {
    defaultValue = isDefined(defaultValue) ? defaultValue : 0;
    return isDefinedBoolean(value) ? value ? 1 : 0 : defaultValue;
  }
  function getBoolean(value, defaultValue) {
    defaultValue = isDefined(defaultValue) ? defaultValue : false;
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getArray(value, defaultValue) {
    defaultValue = isDefined(defaultValue) ? defaultValue : [];
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getRepeatsText(value) {
    var result = _options.dailyText;
    var repeatEvery = getNumber(value);
    if (repeatEvery === _repeatType.everyDay) {
      result = _options.repeatsEveryDayText;
    } else if (repeatEvery === _repeatType.everyWeek) {
      result = _options.repeatsEveryWeekText;
    } else if (repeatEvery === _repeatType.every2Weeks) {
      result = _options.repeatsEvery2WeeksText;
    } else if (repeatEvery === _repeatType.everyMonth) {
      result = _options.repeatsEveryMonthText;
    } else if (repeatEvery === _repeatType.everyYear) {
      result = _options.repeatsEveryYearText;
    } else if (repeatEvery === _repeatType.custom) {
      result = _options.repeatsByCustomSettingsText;
    }
    return result;
  }
  function getRepeatsCustomTypeText(value) {
    var result = _options.dailyText;
    var repeatEveryCustomType = getNumber(value);
    if (repeatEveryCustomType === _repeatCustomType.daily) {
      result = _options.dailyText;
    } else if (repeatEveryCustomType === _repeatCustomType.weekly) {
      result = _options.weeklyText;
    } else if (repeatEveryCustomType === _repeatCustomType.monthly) {
      result = _options.monthlyText;
    } else if (repeatEveryCustomType === _repeatCustomType.yearly) {
      result = _options.yearlyText;
    }
    return result;
  }
  function getArrayText(value, includeSpeechMarks) {
    includeSpeechMarks = isDefined(includeSpeechMarks) ? includeSpeechMarks : false;
    var array = getArray(value);
    if (includeSpeechMarks) {
      var arrayLength = array.length;
      var arrayIndex = 0;
      for (; arrayIndex < arrayLength; arrayIndex++) {
        array[arrayIndex] = '"' + array[arrayIndex] + '"';
      }
    }
    return array.join(",");
  }
  function getPropertyName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  function getPropertyValue(name, value, forJson) {
    forJson = isDefined(forJson) ? forJson : false;
    var result = !forJson ? getString(value) : '"' + getString(value) + '"';
    if (typeof value === "boolean") {
      result = !forJson ? getYesNoFromBoolean(value) : value.toString();
    } else if (typeof value === "object" && value instanceof Date) {
      result = !forJson ? getStringFromDateTime(value) : '"' + value.toISOString() + '"';
    } else if (typeof value === "object" && value instanceof Array) {
      if (name === "repeatEveryExcludeDays" && !forJson) {
        result = getArrayDays(value);
      } else {
        if (forJson) {
          result = "[" + getArrayText(value, true) + "]";
        } else {
          result = getArrayText(value);
        }
      }
    } else if (typeof value === "number") {
      if (name === "repeatEvery" && !forJson) {
        result = getRepeatsText(value);
      } else if (name === "repeatEveryCustomType" && !forJson) {
        result = getRepeatsCustomTypeText(value);
      } else if (name === "type" && !forJson) {
        result = _eventType[parseInt(value)].text;
      } else {
        result = value.toString();
      }
    }
    return result;
  }
  function getArrayDays(days) {
    var daysNames = [];
    if (isDefinedArray(days)) {
      var daysLength = days.length;
      var dayIndex = 0;
      for (; dayIndex < daysLength; dayIndex++) {
        var weekDayNumber = days[dayIndex] - 1;
        if (weekDayNumber === -1) {
          weekDayNumber = 6;
        }
        daysNames.push(_options.dayNames[weekDayNumber]);
      }
    }
    return getArrayText(daysNames);
  }
  function getExportHeaders() {
    var headers = [_options.idText, _options.typeText, _options.fromText, _options.toText, _options.isAllDayText, _options.titleText, _options.descriptionText, _options.locationText, _options.backgroundColorText, _options.textColorText, _options.borderColorText, _options.repeatsText, _options.repeatEndsText, _options.repeatDaysToExcludeText, _options.seriesIgnoreDatesText, _options.createdText, _options.lastUpdatedText, _options.organizerNameText, _options.organizerEmailAddressText, _options.urlText, 
    _options.lockedText, _options.showAlertsText, _options.showAsBusyText];
    var headersLength = headers.length;
    return [headers, headersLength];
  }
  function getExportRow(eventDetails) {
    var eventContents = [];
    eventContents.push(getString(eventDetails.id));
    eventContents.push(_eventType[getNumber(eventDetails.type)].text);
    eventContents.push(getStringFromDateTime(eventDetails.from));
    eventContents.push(getStringFromDateTime(eventDetails.to));
    eventContents.push(getYesNoFromBoolean(eventDetails.isAllDay));
    eventContents.push(getString(eventDetails.title));
    eventContents.push(getString(eventDetails.description));
    eventContents.push(getString(eventDetails.location));
    eventContents.push(getString(eventDetails.color));
    eventContents.push(getString(eventDetails.colorText));
    eventContents.push(getString(eventDetails.colorBorder));
    eventContents.push(getRepeatsText(eventDetails.repeatEvery));
    eventContents.push(getStringFromDateTime(eventDetails.repeatEnds));
    eventContents.push(getArrayDays(eventDetails.repeatEveryExcludeDays));
    eventContents.push(getArrayText(eventDetails.seriesIgnoreDates));
    eventContents.push(getStringFromDateTime(eventDetails.created));
    eventContents.push(getStringFromDateTime(eventDetails.lastUpdated));
    eventContents.push(getString(eventDetails.organizerName));
    eventContents.push(getString(eventDetails.organizerEmailAddress));
    eventContents.push(getString(eventDetails.url));
    eventContents.push(getYesNoFromBoolean(eventDetails.locked));
    eventContents.push(getYesNoFromBoolean(!isDefinedBoolean(eventDetails.showAlerts) || eventDetails.showAlerts));
    eventContents.push(getYesNoFromBoolean(!isDefinedBoolean(eventDetails.showAsBusy) || eventDetails.showAsBusy));
    return eventContents;
  }
  function getOrderedEventPropertyNameList(eventDetails) {
    var propertyNames = [];
    var propertyName;
    for (propertyName in eventDetails) {
      if (eventDetails.hasOwnProperty(propertyName)) {
        propertyNames.push(propertyName);
      }
    }
    propertyNames.sort();
    return propertyNames;
  }
  function getExportDateTime() {
    var dateExported = new Date();
    var dateExportedMeta = getCustomFormattedDateText("{ddd}, {dd} {mmm} {yyyy}", dateExported);
    dateExportedMeta = dateExportedMeta + (" " + padNumber(dateExported.getHours()) + ":" + padNumber(dateExported.getMinutes()) + ":" + padNumber(dateExported.getSeconds()));
    return dateExportedMeta;
  }
  function getCsvContents(orderedEvents) {
    var orderedEventLength = orderedEvents.length;
    var exportHeaders = getExportHeaders();
    var headers = exportHeaders[0];
    var headersLength = exportHeaders[1];
    var csvHeaders = [];
    var csvContents = [];
    var headerIndex = 0;
    for (; headerIndex < headersLength; headerIndex++) {
      csvHeaders.push(getCsvValue(headers[headerIndex]));
    }
    csvContents.push(getCsvValueLine(csvHeaders));
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      storeCsvData(csvContents, orderedEvents[orderedEventIndex]);
    }
    return csvContents.join("\n");
  }
  function storeCsvData(csvContents, eventDetails) {
    var eventContents = getExportRow(eventDetails);
    var eventContentsLength = eventContents.length;
    var eventContentsIndex = 0;
    for (; eventContentsIndex < eventContentsLength; eventContentsIndex++) {
      eventContents[eventContentsIndex] = getCsvValue(eventContents[eventContentsIndex]);
    }
    csvContents.push(getCsvValueLine(eventContents));
  }
  function getCsvValue(text) {
    text = text.replace(/(\r\n|\n|\r)/gm, _string.empty).replace(/(\s\s)/gm, _string.space);
    text = text.replace(/"/g, '""');
    text = '"' + text + '"';
    return text;
  }
  function getCsvValueLine(csvValues) {
    return csvValues.join(",");
  }
  function getXmlContents(orderedEvents, filename) {
    var contents = [];
    var orderedEventLength = orderedEvents.length;
    contents.push('<?xml version="1.0" ?>');
    contents.push("<Calendar>");
    if (isDefined(filename)) {
      contents.push("<Filename>" + filename + "</Filename>");
    }
    contents.push("<LastModified>" + getExportDateTime() + "</LastModified>");
    contents.push("</Calendar>");
    contents.push("<Events>");
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      var orderedEvent = orderedEvents[orderedEventIndex];
      var propertyNames = getOrderedEventPropertyNameList(orderedEvent);
      var propertyNamesLength = propertyNames.length;
      contents.push("<Event>");
      var propertyNameIndex = 0;
      for (; propertyNameIndex < propertyNamesLength; propertyNameIndex++) {
        var propertyName = propertyNames[propertyNameIndex];
        if (propertyName !== "customTags") {
          if (orderedEvent.hasOwnProperty(propertyName) && orderedEvent[propertyName] !== null) {
            var newPropertyName = getPropertyName(propertyName);
            contents.push("<" + newPropertyName + ">" + getPropertyValue(propertyName, orderedEvent[propertyName]) + "</" + newPropertyName + ">");
          }
        }
      }
      contents.push("</Event>");
    }
    contents.push("</Events>");
    return contents.join("\n");
  }
  function getJsonContents(orderedEvents) {
    var contents = [];
    var orderedEventLength = orderedEvents.length;
    contents.push("{");
    contents.push('"events": [');
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      var orderedEvent = orderedEvents[orderedEventIndex];
      var propertyNames = getOrderedEventPropertyNameList(orderedEvent);
      var propertyNamesLength = propertyNames.length;
      contents.push("{");
      var propertyNameIndex = 0;
      for (; propertyNameIndex < propertyNamesLength; propertyNameIndex++) {
        var propertyName = propertyNames[propertyNameIndex];
        if (propertyName !== "customTags") {
          if (orderedEvent.hasOwnProperty(propertyName) && orderedEvent[propertyName] !== null) {
            contents.push('"' + propertyName + '":' + getPropertyValue(propertyName, orderedEvent[propertyName], true) + ",");
          }
        }
      }
      var lastJsonEntry = contents[contents.length - 1];
      contents[contents.length - 1] = lastJsonEntry.substring(0, lastJsonEntry.length - 1);
      contents.push("},");
    }
    contents[contents.length - 1] = "}";
    contents.push("]");
    contents.push("}");
    return contents.join("\n");
  }
  function getTextContents(orderedEvents, filename) {
    var contents = [];
    var orderedEventLength = orderedEvents.length;
    if (isDefined(filename)) {
      contents.push("Filename: " + filename);
    }
    contents.push("Last Modified: " + getExportDateTime());
    contents.push(_string.empty);
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      var orderedEvent = orderedEvents[orderedEventIndex];
      var propertyNames = getOrderedEventPropertyNameList(orderedEvent);
      var propertyNamesLength = propertyNames.length;
      var propertyNameIndex = 0;
      for (; propertyNameIndex < propertyNamesLength; propertyNameIndex++) {
        var propertyName = propertyNames[propertyNameIndex];
        if (propertyName !== "customTags") {
          if (orderedEvent.hasOwnProperty(propertyName) && orderedEvent[propertyName] !== null) {
            contents.push(getPropertyName(propertyName) + ": " + getPropertyValue(propertyName, orderedEvent[propertyName]));
          }
        }
      }
      contents.push(_string.empty);
    }
    contents.pop();
    return contents.join("\n");
  }
  function getICalContents(orderedEvents) {
    var contents = [];
    var orderedEventLength = orderedEvents.length;
    contents.push("BEGIN:VCALENDAR");
    contents.push("VERSION:2.0");
    contents.push("PRODID:-//Bunoon//Calendar.js v" + _this.getVersion() + "//EN");
    contents.push("CALSCALE:GREGORIAN");
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      var orderedEvent = orderedEvents[orderedEventIndex];
      var organizerName = getString(orderedEvent.organizerName);
      var organizerEmailAddress = getString(orderedEvent.organizerEmailAddress);
      var repeatEvery = getNumber(orderedEvent.repeatEvery);
      if (!isDefinedString(organizerName)) {
        organizerName = _options.organizerName;
      }
      if (!isDefinedString(organizerEmailAddress)) {
        organizerEmailAddress = _options.organizerEmailAddress;
      }
      contents.push("BEGIN:VEVENT");
      contents.push("UID:" + getString(orderedEvent.id));
      contents.push("STATUS:CONFIRMED");
      contents.push("SEQUENCE:0");
      if (!isDefinedBoolean(orderedEvent.showAsBusy) || orderedEvent.showAsBusy) {
        contents.push("TRANSP:OPAQUE");
      } else {
        contents.push("TRANSP:TRANSPARENT");
      }
      if (orderedEvent.isAllDay) {
        contents.push("DTSTART:" + getICalDateString(orderedEvent.from));
        contents.push("DTEND:" + getICalDateString(orderedEvent.to));
      } else {
        contents.push("DTSTART:" + getICalDateTimeString(orderedEvent.from));
        contents.push("DTEND:" + getICalDateTimeString(orderedEvent.to));
      }
      if (isDefinedDate(orderedEvent.created)) {
        var created = getICalDateTimeString(orderedEvent.created);
        contents.push("DTSTAMP:" + created);
        contents.push("CREATED:" + created);
      }
      if (isDefinedDate(orderedEvent.lastUpdated)) {
        contents.push("LAST-MODIFIED:" + getICalDateTimeString(orderedEvent.lastUpdated));
      }
      if (isDefinedString(organizerName) && isDefinedString(organizerEmailAddress)) {
        contents.push("ORGANIZER;CN=" + organizerName + ":MAILTO:" + organizerEmailAddress);
      }
      if (repeatEvery !== _repeatType.never) {
        contents.push("RRULE:" + getICalRRuleForEvent(orderedEvent, repeatEvery));
      }
      if (isDefinedString(orderedEvent.title)) {
        contents.push("SUMMARY:" + getICalSingleLine(orderedEvent.title));
      }
      if (isDefinedString(orderedEvent.description)) {
        contents.push("DESCRIPTION:" + getICalSingleLine(orderedEvent.description));
      }
      if (isDefinedString(orderedEvent.location)) {
        contents.push("LOCATION:" + getICalSingleLine(orderedEvent.location));
      }
      if (isDefinedString(orderedEvent.url)) {
        contents.push("URL:" + getICalSingleLine(orderedEvent.url));
      }
      if (isDefinedString(orderedEvent.group)) {
        contents.push("CATEGORIES:" + getICalSingleLine(orderedEvent.group));
      }
      if (!isDefinedBoolean(orderedEvent.showAlerts) || orderedEvent.showAlerts) {
        contents.push("BEGIN:VALARM");
        contents.push("TRIGGER;VALUE=DATE-TIME:" + getICalDateTimeString(orderedEvent.from));
        contents.push("ACTION:DISPLAY");
        contents.push("END:VALARM");
      }
      contents.push("END:VEVENT");
    }
    contents.push("END:VCALENDAR");
    return contents.join("\r\n");
  }
  function getICalSingleLine(value) {
    return stripNewLines(stripHTMLTagsFromText(getString(value)));
  }
  function getICalDateTimeString(eventDate) {
    var format = [];
    if (isDefined(eventDate)) {
      format.push(eventDate.getFullYear());
      format.push(padNumber(eventDate.getMonth() + 1));
      format.push(padNumber(eventDate.getDate()));
      format.push("T");
      format.push(padNumber(eventDate.getHours()));
      format.push(padNumber(eventDate.getMinutes()));
      format.push("00Z");
    }
    return format.join(_string.empty);
  }
  function getICalDateString(eventDate) {
    var format = [];
    if (isDefined(eventDate)) {
      format.push(eventDate.getFullYear());
      format.push(padNumber(eventDate.getMonth() + 1));
      format.push(padNumber(eventDate.getDate()));
    }
    return format.join(_string.empty);
  }
  function getICalRRuleForEvent(orderedEvent, repeatEvery) {
    var contents = [];
    if (repeatEvery === _repeatType.custom) {
      var repeatEveryCustomType = getNumber(orderedEvent.repeatEveryCustomType);
      var repeatEveryCustomValue = getNumber(orderedEvent.repeatEveryCustomValue);
      if (repeatEveryCustomType === _repeatCustomType.daily) {
        contents.push("FREQ=DAILY");
      } else if (repeatEveryCustomType === _repeatCustomType.weekly) {
        contents.push("FREQ=WEEKLY");
      } else if (repeatEveryCustomType === _repeatCustomType.monthly) {
        contents.push("FREQ=MONTHLY");
      } else if (repeatEveryCustomType === _repeatCustomType.yearly) {
        contents.push("FREQ=YEARLY");
      }
      contents.push("INTERVAL=" + repeatEveryCustomValue.toString());
    } else {
      if (repeatEvery === _repeatType.everyDay) {
        contents.push("FREQ=DAILY");
      } else if (repeatEvery === _repeatType.everyWeek || repeatEvery === _repeatType.every2Weeks) {
        contents.push("FREQ=WEEKLY");
      } else if (repeatEvery === _repeatType.everyMonth) {
        contents.push("FREQ=MONTHLY");
      } else if (repeatEvery === _repeatType.everyYear) {
        contents.push("FREQ=YEARLY");
      }
      if (repeatEvery === _repeatType.every2Weeks) {
        contents.push("INTERVAL=2");
      } else {
        contents.push("INTERVAL=1");
      }
    }
    if (isDefinedDate(orderedEvent.repeatEnds)) {
      contents.push("UNTIL=" + getICalDateTimeString(orderedEvent.repeatEnds));
    }
    return contents.join(";");
  }
  function getMdContents(orderedEvents) {
    var orderedEventLength = orderedEvents.length;
    var exportHeaders = getExportHeaders();
    var headersLength = exportHeaders[1];
    var contents = [getMdFileRow(exportHeaders[0])];
    var headerLines = [];
    var headerIndex = 0;
    for (; headerIndex < headersLength; headerIndex++) {
      headerLines.push("---");
    }
    contents.push(getMdFileRow(headerLines));
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      var rowContents = getExportRow(orderedEvents[orderedEventIndex]);
      contents.push(getMdFileRow(rowContents));
    }
    return contents.join("\n");
  }
  function getMdFileRow(contents) {
    return "| " + contents.join(" | ") + " |";
  }
  function getHtmlContents(orderedEvents, filename) {
    var contents = [];
    var orderedEventLength = orderedEvents.length;
    contents.push("<!DOCTYPE html>");
    contents.push("<html>");
    contents.push("<head>");
    contents.push('<meta charset="utf-8" />');
    contents.push('<meta http-equiv="Last-Modified" content="' + getExportDateTime() + ' GMT" />');
    if (isDefined(filename)) {
      contents.push("<title>" + filename + "</title>");
    }
    contents.push("</head>");
    contents.push("<body>");
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      var orderedEvent = orderedEvents[orderedEventIndex];
      var propertyNames = getOrderedEventPropertyNameList(orderedEvent);
      var propertyNamesLength = propertyNames.length;
      contents.push("<h3><b>" + orderedEvent.id + ":</b></h3>");
      contents.push("<ul>");
      var propertyNameIndex = 0;
      for (; propertyNameIndex < propertyNamesLength; propertyNameIndex++) {
        var propertyName = propertyNames[propertyNameIndex];
        if (propertyName !== "customTags") {
          if (orderedEvent.hasOwnProperty(propertyName) && orderedEvent[propertyName] !== null) {
            contents.push("<li><b>" + getPropertyName(propertyName) + "</b>: " + getPropertyValue(propertyName, orderedEvent[propertyName]) + "</li>");
          }
        }
      }
      contents.push("</ul>");
    }
    contents.push("</body>");
    contents.push("</html>");
    return contents.join("\n");
  }
  function getTsvContents(orderedEvents) {
    var orderedEventLength = orderedEvents.length;
    var exportHeaders = getExportHeaders();
    var headers = exportHeaders[0];
    var headersLength = exportHeaders[1];
    var csvHeaders = [];
    var csvContents = [];
    var headerIndex = 0;
    for (; headerIndex < headersLength; headerIndex++) {
      csvHeaders.push(getTsvValue(headers[headerIndex]));
    }
    csvContents.push(getTsvValueLine(csvHeaders));
    var orderedEventIndex = 0;
    for (; orderedEventIndex < orderedEventLength; orderedEventIndex++) {
      storeTsvData(csvContents, orderedEvents[orderedEventIndex]);
    }
    return csvContents.join("\n");
  }
  function storeTsvData(csvContents, eventDetails) {
    var eventContents = getExportRow(eventDetails);
    var eventContentsLength = eventContents.length;
    var eventContentsIndex = 0;
    for (; eventContentsIndex < eventContentsLength; eventContentsIndex++) {
      eventContents[eventContentsIndex] = getTsvValue(eventContents[eventContentsIndex]);
    }
    csvContents.push(getTsvValueLine(eventContents));
  }
  function getTsvValue(text) {
    text = text.replace(/\\/g, "\\\\");
    return text;
  }
  function getTsvValueLine(csvValues) {
    return csvValues.join("\t");
  }
  function isOptionEventSet(name) {
    return isDefinedFunction(_options[name]);
  }
  function triggerOptionsEvent(name) {
    if (_options !== null && isOptionEventSet(name)) {
      _options[name]();
    }
  }
  function triggerOptionsEventWithData(name, data) {
    if (_options !== null && isOptionEventSet(name)) {
      _options[name](data);
    }
  }
  function triggerOptionsEventWithMultipleData(name, data1, data2) {
    if (_options !== null && isOptionEventSet(name)) {
      _options[name](data1, data2);
    }
  }
  function moveBackMonth(e) {
    if (isDefined(e)) {
      cancelBubble(e);
    }
    if (!_datePickerModeEnabled || _datePickerVisible) {
      var previousMonth = new Date(_currentDate);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      if (previousMonth.getFullYear() >= _options.minimumYear) {
        build(previousMonth);
        triggerOptionsEventWithData("onPreviousMonth", previousMonth);
      }
    }
  }
  function moveForwardMonth(e) {
    if (isDefined(e)) {
      cancelBubble(e);
    }
    if (!_datePickerModeEnabled || _datePickerVisible) {
      var nextMonth = new Date(_currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      if (nextMonth.getFullYear() <= _options.maximumYear) {
        build(nextMonth);
        triggerOptionsEventWithData("onNextMonth", nextMonth);
      }
    }
  }
  function moveBackYear() {
    if (!_datePickerModeEnabled || _datePickerVisible) {
      var previousYear = new Date(_currentDate);
      previousYear.setFullYear(previousYear.getFullYear() - 1);
      if (previousYear.getFullYear() >= _options.minimumYear) {
        build(previousYear);
        triggerOptionsEventWithData("onPreviousYear", previousYear);
      }
    }
  }
  function moveForwardYear() {
    if (!_datePickerModeEnabled || _datePickerVisible) {
      var nextYear = new Date(_currentDate);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      if (nextYear.getFullYear() <= _options.maximumYear) {
        build(nextYear);
        triggerOptionsEventWithData("onNextYear", nextYear);
      }
    }
  }
  function moveToday() {
    if (!_datePickerModeEnabled || _datePickerVisible) {
      var today = new Date();
      if (_currentDate.getMonth() !== today.getMonth() || _currentDate.getFullYear() !== today.getFullYear()) {
        build();
        triggerOptionsEvent("onToday");
      }
    }
  }
  function toStorageDate(date) {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  }
  function buildDefaultOptions(newOptions) {
    _options = getOptions(newOptions);
    _options.showDayNumberOrdinals = getDefaultBoolean(_options.showDayNumberOrdinals, true);
    _options.dragAndDropForEventsEnabled = getDefaultBoolean(_options.dragAndDropForEventsEnabled, true);
    _options.maximumEventsPerDayDisplay = getDefaultNumber(_options.maximumEventsPerDayDisplay, 3);
    _options.exportEventsEnabled = getDefaultBoolean(_options.exportEventsEnabled, true);
    _options.manualEditingEnabled = getDefaultBoolean(_options.manualEditingEnabled, true);
    _options.showTimesInMainCalendarEvents = getDefaultBoolean(_options.showTimesInMainCalendarEvents, false);
    _options.autoRefreshTimerDelay = getDefaultNumber(_options.autoRefreshTimerDelay, 30000);
    _options.fullScreenModeEnabled = getDefaultBoolean(_options.fullScreenModeEnabled, true);
    _options.eventTooltipDelay = getDefaultNumber(_options.eventTooltipDelay, 1000);
    _options.minimumDayHeight = getDefaultNumber(_options.minimumDayHeight, 0);
    _options.holidays = getDefaultArray(_options.holidays, getStandardHolidays());
    _options.organizerName = getDefaultString(_options.organizerName, _string.empty);
    _options.organizerEmailAddress = getDefaultString(_options.organizerEmailAddress, _string.empty);
    _options.spacing = getDefaultNumber(_options.spacing, 10);
    _options.showAllDayEventDetailsInFullDayView = getDefaultBoolean(_options.showAllDayEventDetailsInFullDayView, false);
    _options.showWeekNumbersInTitles = getDefaultBoolean(_options.showWeekNumbersInTitles, false);
    _options.showTimelineArrowOnFullDayView = getDefaultBoolean(_options.showTimelineArrowOnFullDayView, true);
    _options.maximumEventTitleLength = getDefaultNumber(_options.maximumEventTitleLength, 0);
    _options.maximumEventDescriptionLength = getDefaultNumber(_options.maximumEventDescriptionLength, 0);
    _options.maximumEventLocationLength = getDefaultNumber(_options.maximumEventLocationLength, 0);
    _options.maximumEventGroupLength = getDefaultNumber(_options.maximumEventGroupLength, 0);
    _options.eventNotificationsEnabled = getDefaultBoolean(_options.eventNotificationsEnabled, false);
    _options.showPreviousNextMonthNamesInMainDisplay = getDefaultBoolean(_options.showPreviousNextMonthNamesInMainDisplay, true);
    _options.showDayNamesInMainDisplay = getDefaultBoolean(_options.showDayNamesInMainDisplay, true);
    _options.tooltipsEnabled = getDefaultBoolean(_options.tooltipsEnabled, true);
    _options.useOnlyDotEventsForMainDisplay = getDefaultBoolean(_options.useOnlyDotEventsForMainDisplay, false);
    _options.urlWindowTarget = getDefaultString(_options.urlWindowTarget, "_blank");
    _options.defaultEventBackgroundColor = getDefaultString(_options.defaultEventBackgroundColor, "#484848");
    _options.defaultEventTextColor = getDefaultString(_options.defaultEventTextColor, "#F5F5F5");
    _options.defaultEventBorderColor = getDefaultString(_options.defaultEventBorderColor, "#282828");
    _options.showExtraToolbarButtons = getDefaultBoolean(_options.showExtraToolbarButtons, true);
    _options.showEmptyDaysInWeekView = getDefaultBoolean(_options.showEmptyDaysInWeekView, true);
    _options.hideEventsWithoutGroupAssigned = getDefaultBoolean(_options.hideEventsWithoutGroupAssigned, false);
    _options.showHolidays = getDefaultBoolean(_options.showHolidays, true);
    _options.useTemplateWhenAddingNewEvent = getDefaultBoolean(_options.useTemplateWhenAddingNewEvent, true);
    _options.useEscapeKeyToExitFullScreenMode = getDefaultBoolean(_options.useEscapeKeyToExitFullScreenMode, true);
    _options.minimumDatePickerDate = getDefaultDate(_options.minimumDatePickerDate, null);
    _options.maximumDatePickerDate = getDefaultDate(_options.maximumDatePickerDate, null);
    _options.allowHtmlInDisplay = getDefaultBoolean(_options.allowHtmlInDisplay, false);
    _options.datePickerSelectedDateFormat = getDefaultString(_options.datePickerSelectedDateFormat, "{d}{o} {mmmm} {yyyy}");
    _options.initialDateTime = getDefaultDate(_options.initialDateTime, null);
    _options.events = getDefaultArray(_options.events, null);
    _options.applyCssToEventsNotInCurrentMonth = getDefaultBoolean(_options.applyCssToEventsNotInCurrentMonth, true);
    _options.weekendDays = isInvalidOptionArray(_options.weekendDays, 0) ? [0, 6] : _options.weekendDays;
    _options.addYearButtonsInDatePickerMode = getDefaultBoolean(_options.addYearButtonsInDatePickerMode, false);
    _options.workingDays = isInvalidOptionArray(_options.workingDays, 0) ? [] : _options.workingDays;
    _options.minimumYear = getDefaultNumber(_options.minimumYear, 1900);
    _options.maximumYear = getDefaultNumber(_options.maximumYear, 2099);
    _options.defaultEventDuration = getDefaultNumber(_options.defaultEventDuration, 30);
    _options.monthTitleBarDateFormat = getDefaultString(_options.monthTitleBarDateFormat, "{mmmm} {yyyy}");
    _options.configurationDialogEnabled = getDefaultBoolean(_options.configurationDialogEnabled, true);
    _options.popUpNotificationsEnabled = getDefaultBoolean(_options.popUpNotificationsEnabled, true);
    _options.showMonthButtonsInYearDropDownMenu = getDefaultBoolean(_options.showMonthButtonsInYearDropDownMenu, true);
    _options.showSideMenuDays = getDefaultBoolean(_options.showSideMenuDays, true);
    _options.showSideMenuGroups = getDefaultBoolean(_options.showSideMenuGroups, true);
    _options.showSideMenuEventTypes = getDefaultBoolean(_options.showSideMenuEventTypes, true);
    _options.showSideMenuWorkingDays = getDefaultBoolean(_options.showSideMenuWorkingDays, true);
    _options.showSideMenuWeekendDays = getDefaultBoolean(_options.showSideMenuWeekendDays, true);
    _options.startOfWeekDay = getDefaultNumber(_options.startOfWeekDay, _day.monday);
    _options.useLocalStorageForEvents = getDefaultBoolean(_options.useLocalStorageForEvents, false);
    _options.shortcutKeysEnabled = getDefaultBoolean(_options.shortcutKeysEnabled, true);
    _options.workingHoursStart = getDefaultString(_options.workingHoursStart, null);
    _options.workingHoursEnd = getDefaultString(_options.workingHoursEnd, null);
    _options.reverseOrderDaysOfWeek = getDefaultBoolean(_options.reverseOrderDaysOfWeek, false);
    if (isInvalidOptionArray(_options.visibleDays)) {
      _options.visibleDays = [0, 1, 2, 3, 4, 5, 6];
      _previousDaysVisibleBeforeSingleDayView = [];
    }
    if (!isDefinedBoolean(_options.allowEventScrollingOnMainDisplay)) {
      _options.allowEventScrollingOnMainDisplay = false;
      if (_options.allowEventScrollingOnMainDisplay) {
        _options.maximumEventsPerDayDisplay = 0;
      }
    }
    setTranslationStringOptions();
    setEventTypeTranslationStringOptions();
    checkForBrowserNotificationsPermission();
  }
  function buildDefaultSearchOptions(newSearchOptions) {
    _optionsForSearch = getOptions(newSearchOptions, _options.searchOptions);
    _optionsForSearch.enabled = getDefaultBoolean(_optionsForSearch.enabled, true);
    _optionsForSearch.lastSearchText = getDefaultString(_optionsForSearch.lastSearchText, _string.empty);
    _optionsForSearch.not = getDefaultBoolean(_optionsForSearch.not, false);
    _optionsForSearch.matchCase = getDefaultBoolean(_optionsForSearch.matchCase, false);
    _optionsForSearch.showAdvanced = getDefaultBoolean(_optionsForSearch.showAdvanced, false);
    _optionsForSearch.searchTitle = getDefaultBoolean(_optionsForSearch.searchTitle, true);
    _optionsForSearch.searchLocation = getDefaultBoolean(_optionsForSearch.searchLocation, false);
    _optionsForSearch.searchDescription = getDefaultBoolean(_optionsForSearch.searchDescription, false);
    _optionsForSearch.searchGroup = getDefaultBoolean(_optionsForSearch.searchGroup, false);
    _optionsForSearch.searchUrl = getDefaultBoolean(_optionsForSearch.searchUrl, false);
    _optionsForSearch.startsWith = getDefaultBoolean(_optionsForSearch.startsWith, false);
    _optionsForSearch.endsWith = getDefaultBoolean(_optionsForSearch.endsWith, false);
    _optionsForSearch.contains = getDefaultBoolean(_optionsForSearch.contains, true);
    _optionsForSearch.left = getDefaultNumber(_optionsForSearch.left, null);
    _optionsForSearch.top = getDefaultNumber(_optionsForSearch.top, null);
    _optionsForSearch.history = getDefaultArray(_optionsForSearch.history, []);
  }
  function setTranslationStringOptions() {
    if (isInvalidOptionArray(_options.dayHeaderNames, 7)) {
      _options.dayHeaderNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
    if (isInvalidOptionArray(_options.dayNames, 7)) {
      _options.dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    }
    if (isInvalidOptionArray(_options.dayNamesAbbreviated, 7)) {
      _options.dayNamesAbbreviated = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
    if (isInvalidOptionArray(_options.monthNames, 12)) {
      _options.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }
    if (isInvalidOptionArray(_options.monthNamesAbbreviated, 12)) {
      _options.monthNamesAbbreviated = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    }
    _options.previousMonthTooltipText = getDefaultString(_options.previousMonthTooltipText, "Previous Month");
    _options.nextMonthTooltipText = getDefaultString(_options.nextMonthTooltipText, "Next Month");
    _options.previousDayTooltipText = getDefaultString(_options.previousDayTooltipText, "Previous Day");
    _options.nextDayTooltipText = getDefaultString(_options.nextDayTooltipText, "Next Day");
    _options.previousWeekTooltipText = getDefaultString(_options.previousWeekTooltipText, "Previous Week");
    _options.nextWeekTooltipText = getDefaultString(_options.nextWeekTooltipText, "Next Week");
    _options.addEventTooltipText = getDefaultString(_options.addEventTooltipText, "Add Event");
    _options.closeTooltipText = getDefaultString(_options.closeTooltipText, "Close");
    _options.exportEventsTooltipText = getDefaultString(_options.exportEventsTooltipText, "Export Events");
    _options.todayTooltipText = getDefaultString(_options.todayTooltipText, "Today");
    _options.refreshTooltipText = getDefaultString(_options.refreshTooltipText, "Refresh");
    _options.searchTooltipText = getDefaultString(_options.searchTooltipText, "Search");
    _options.expandDayTooltipText = getDefaultString(_options.expandDayTooltipText, "Expand Day");
    _options.listAllEventsTooltipText = getDefaultString(_options.listAllEventsTooltipText, "View All Events");
    _options.listWeekEventsTooltipText = getDefaultString(_options.listWeekEventsTooltipText, "View Current Week Events");
    _options.fromText = getDefaultString(_options.fromText, "From:");
    _options.toText = getDefaultString(_options.toText, "To:");
    _options.isAllDayText = getDefaultString(_options.isAllDayText, "Is All-Day");
    _options.titleText = getDefaultString(_options.titleText, "Title:");
    _options.descriptionText = getDefaultString(_options.descriptionText, "Description:");
    _options.locationText = getDefaultString(_options.locationText, "Location:");
    _options.addText = getDefaultString(_options.addText, "Add");
    _options.updateText = getDefaultString(_options.updateText, "Update");
    _options.cancelText = getDefaultString(_options.cancelText, "Cancel");
    _options.removeEventText = getDefaultString(_options.removeEventText, "Remove");
    _options.addEventTitle = getDefaultString(_options.addEventTitle, "Add Event");
    _options.editEventTitle = getDefaultString(_options.editEventTitle, "Edit Event");
    _options.exportStartFilename = getDefaultString(_options.exportStartFilename, "exported_events_");
    _options.fromTimeErrorMessage = getDefaultString(_options.fromTimeErrorMessage, "Please select a valid 'From' time.");
    _options.toTimeErrorMessage = getDefaultString(_options.toTimeErrorMessage, "Please select a valid 'To' time.");
    _options.toSmallerThanFromErrorMessage = getDefaultString(_options.toSmallerThanFromErrorMessage, "Please select a 'To' date that is larger than the 'From' date.");
    _options.titleErrorMessage = getDefaultString(_options.titleErrorMessage, "Please enter a value in the 'Title' field (no empty space).");
    _options.stText = getDefaultString(_options.stText, "st");
    _options.ndText = getDefaultString(_options.ndText, "nd");
    _options.rdText = getDefaultString(_options.rdText, "rd");
    _options.thText = getDefaultString(_options.thText, "th");
    _options.yesText = getDefaultString(_options.yesText, "Yes");
    _options.noText = getDefaultString(_options.noText, "No");
    _options.allDayText = getDefaultString(_options.allDayText, "All-Day");
    _options.allEventsText = getDefaultString(_options.allEventsText, "All Events");
    _options.toTimeText = getDefaultString(_options.toTimeText, "to");
    _options.confirmEventRemoveTitle = getDefaultString(_options.confirmEventRemoveTitle, "Confirm Event Removal");
    _options.confirmEventRemoveMessage = getDefaultString(_options.confirmEventRemoveMessage, "Removing this event cannot be undone.  Do you want to continue?");
    _options.okText = getDefaultString(_options.okText, "OK");
    _options.exportEventsTitle = getDefaultString(_options.exportEventsTitle, "Export Events");
    _options.selectColorsText = getDefaultString(_options.selectColorsText, "Select Colors");
    _options.backgroundColorText = getDefaultString(_options.backgroundColorText, "Background Color:");
    _options.textColorText = getDefaultString(_options.textColorText, "Text Color:");
    _options.borderColorText = getDefaultString(_options.borderColorText, "Border Color:");
    _options.searchEventsTitle = getDefaultString(_options.searchEventsTitle, "Search Events");
    _options.previousText = getDefaultString(_options.previousText, "Previous");
    _options.nextText = getDefaultString(_options.nextText, "Next");
    _options.matchCaseText = getDefaultString(_options.matchCaseText, "Match Case");
    _options.repeatsText = getDefaultString(_options.repeatsText, "Repeats:");
    _options.repeatDaysToExcludeText = getDefaultString(_options.repeatDaysToExcludeText, "Repeat Days To Exclude:");
    _options.daysToExcludeText = getDefaultString(_options.daysToExcludeText, "Days To Exclude:");
    _options.seriesIgnoreDatesText = getDefaultString(_options.seriesIgnoreDatesText, "Series Ignore Dates:");
    _options.repeatsNever = getDefaultString(_options.repeatsNever, "Never");
    _options.repeatsEveryDayText = getDefaultString(_options.repeatsEveryDayText, "Every Day");
    _options.repeatsEveryWeekText = getDefaultString(_options.repeatsEveryWeekText, "Every Week");
    _options.repeatsEvery2WeeksText = getDefaultString(_options.repeatsEvery2WeeksText, "Every 2 Weeks");
    _options.repeatsEveryMonthText = getDefaultString(_options.repeatsEveryMonthText, "Every Month");
    _options.repeatsEveryYearText = getDefaultString(_options.repeatsEveryYearText, "Every Year");
    _options.repeatsCustomText = getDefaultString(_options.repeatsCustomText, "Custom:");
    _options.repeatOptionsTitle = getDefaultString(_options.repeatOptionsTitle, "Repeat Options");
    _options.moreText = getDefaultString(_options.moreText, "More");
    _options.includeText = getDefaultString(_options.includeText, "Include:");
    _options.minimizedTooltipText = getDefaultString(_options.minimizedTooltipText, "Minimize");
    _options.restoreTooltipText = getDefaultString(_options.restoreTooltipText, "Restore");
    _options.removeAllEventsInSeriesText = getDefaultString(_options.removeAllEventsInSeriesText, "Remove All Events In Series");
    _options.createdText = getDefaultString(_options.createdText, "Created:");
    _options.organizerNameText = getDefaultString(_options.organizerNameText, "Organizer:");
    _options.organizerEmailAddressText = getDefaultString(_options.organizerEmailAddressText, "Organizer Email:");
    _options.enableFullScreenTooltipText = getDefaultString(_options.enableFullScreenTooltipText, "Turn On Full-Screen Mode");
    _options.disableFullScreenTooltipText = getDefaultString(_options.disableFullScreenTooltipText, "Turn Off Full-Screen Mode");
    _options.idText = getDefaultString(_options.idText, "ID:");
    _options.expandMonthTooltipText = getDefaultString(_options.expandMonthTooltipText, "Expand Month");
    _options.repeatEndsText = getDefaultString(_options.repeatEndsText, "Repeat Ends:");
    _options.noEventsAvailableText = getDefaultString(_options.noEventsAvailableText, "No events available.");
    _options.viewWeekEventsText = getDefaultString(_options.viewWeekEventsText, "View Week Events");
    _options.noEventsAvailableFullText = getDefaultString(_options.noEventsAvailableFullText, "There are no events available to view.");
    _options.clickText = getDefaultString(_options.clickText, "Click");
    _options.hereText = getDefaultString(_options.hereText, "here");
    _options.toAddANewEventText = getDefaultString(_options.toAddANewEventText, "to add a new event.");
    _options.weekText = getDefaultString(_options.weekText, "Week");
    _options.groupText = getDefaultString(_options.groupText, "Group:");
    _options.configurationTooltipText = getDefaultString(_options.configurationTooltipText, "Configuration");
    _options.configurationTitleText = getDefaultString(_options.configurationTitleText, "Configuration");
    _options.groupsText = getDefaultString(_options.groupsText, "Groups");
    _options.eventNotificationTitle = getDefaultString(_options.eventNotificationTitle, "Calendar.js");
    _options.eventNotificationBody = getDefaultString(_options.eventNotificationBody, "The event '{0' has started.");
    _options.optionsText = getDefaultString(_options.optionsText, "Options:");
    _options.startsWithText = getDefaultString(_options.startsWithText, "Starts With");
    _options.endsWithText = getDefaultString(_options.endsWithText, "Ends With");
    _options.containsText = getDefaultString(_options.containsText, "Contains");
    _options.displayTabText = getDefaultString(_options.displayTabText, "Display");
    _options.enableAutoRefreshForEventsText = getDefaultString(_options.enableAutoRefreshForEventsText, "Enable auto-refresh for events");
    _options.enableBrowserNotificationsText = getDefaultString(_options.enableBrowserNotificationsText, "Enable browser notifications");
    _options.enableTooltipsText = getDefaultString(_options.enableTooltipsText, "Enable tooltips");
    _options.dayText = getDefaultString(_options.dayText, "day");
    _options.daysText = getDefaultString(_options.daysText, "days");
    _options.hourText = getDefaultString(_options.hourText, "hour");
    _options.hoursText = getDefaultString(_options.hoursText, "hours");
    _options.minuteText = getDefaultString(_options.minuteText, "minute");
    _options.minutesText = getDefaultString(_options.minutesText, "minutes");
    _options.enableDragAndDropForEventText = getDefaultString(_options.enableDragAndDropForEventText, "Enable drag & drop for events");
    _options.organizerTabText = getDefaultString(_options.organizerTabText, "Organizer");
    _options.removeEventsTooltipText = getDefaultString(_options.removeEventsTooltipText, "Remove Events");
    _options.confirmEventsRemoveTitle = getDefaultString(_options.confirmEventsRemoveTitle, "Confirm Events Removal");
    _options.confirmEventsRemoveMessage = getDefaultString(_options.confirmEventsRemoveMessage, "Removing these non-repeating events cannot be undone.  Do you want to continue?");
    _options.eventText = getDefaultString(_options.eventText, "Event");
    _options.optionalText = getDefaultString(_options.optionalText, "Optional");
    _options.urlText = getDefaultString(_options.urlText, "Url:");
    _options.openUrlText = getDefaultString(_options.openUrlText, "Open Url");
    _options.enableDayNameHeadersInMainDisplayText = getDefaultString(_options.enableDayNameHeadersInMainDisplayText, "Enable day name headers in the main display");
    _options.thisWeekTooltipText = getDefaultString(_options.thisWeekTooltipText, "This Week");
    _options.dailyText = getDefaultString(_options.dailyText, "Daily");
    _options.weeklyText = getDefaultString(_options.weeklyText, "Weekly");
    _options.monthlyText = getDefaultString(_options.monthlyText, "Monthly");
    _options.yearlyText = getDefaultString(_options.yearlyText, "Yearly");
    _options.repeatsByCustomSettingsText = getDefaultString(_options.repeatsByCustomSettingsText, "By Custom Settings");
    _options.lastUpdatedText = getDefaultString(_options.lastUpdatedText, "Last Updated:");
    _options.advancedText = getDefaultString(_options.advancedText, "Advanced");
    _options.copyText = getDefaultString(_options.copyText, "Copy");
    _options.pasteText = getDefaultString(_options.pasteText, "Paste");
    _options.duplicateText = getDefaultString(_options.duplicateText, "Duplicate");
    _options.showAlertsText = getDefaultString(_options.showAlertsText, "Show Alerts");
    _options.selectDatePlaceholderText = getDefaultString(_options.selectDatePlaceholderText, "Select date...");
    _options.hideDayText = getDefaultString(_options.hideDayText, "Hide Day");
    _options.notSearchText = getDefaultString(_options.notSearchText, "Not (opposite)");
    _options.showEmptyDaysInWeekViewText = getDefaultString(_options.showEmptyDaysInWeekViewText, "Show empty days in the week view");
    _options.showHolidaysInTheDisplaysText = getDefaultString(_options.showHolidaysInTheDisplaysText, "Show holidays in the main display and title bars");
    _options.newEventDefaultTitle = getDefaultString(_options.newEventDefaultTitle, "* New Event");
    _options.urlErrorMessage = getDefaultString(_options.urlErrorMessage, "Please enter a valid Url in the 'Url' field (or leave blank).");
    _options.searchTextBoxPlaceholder = getDefaultString(_options.searchTextBoxPlaceholder, "Search title, description, etc...");
    _options.currentMonthTooltipText = getDefaultString(_options.currentMonthTooltipText, "Current Month");
    _options.cutText = getDefaultString(_options.cutText, "Cut");
    _options.showMenuTooltipText = getDefaultString(_options.showMenuTooltipText, "Show Menu");
    _options.eventTypesText = getDefaultString(_options.eventTypesText, "Event Types");
    _options.lockedText = getDefaultString(_options.lockedText, "Locked:");
    _options.typeText = getDefaultString(_options.typeText, "Type:");
    _options.sideMenuHeaderText = getDefaultString(_options.sideMenuHeaderText, "Calendar.js");
    _options.sideMenuDaysText = getDefaultString(_options.sideMenuDaysText, "Days");
    _options.visibleDaysText = getDefaultString(_options.visibleDaysText, "Visible Days");
    _options.previousYearTooltipText = getDefaultString(_options.previousYearTooltipText, "Previous Year");
    _options.nextYearTooltipText = getDefaultString(_options.nextYearTooltipText, "Next Year");
    _options.showOnlyWorkingDaysText = getDefaultString(_options.showOnlyWorkingDaysText, "Show Only Working Days");
    _options.exportFilenamePlaceholderText = getDefaultString(_options.exportFilenamePlaceholderText, "Name (optional)");
    _options.errorText = getDefaultString(_options.errorText, "Error");
    _options.exportText = getDefaultString(_options.exportText, "Export");
    _options.configurationUpdatedText = getDefaultString(_options.configurationUpdatedText, "Configuration updated.");
    _options.eventAddedText = getDefaultString(_options.eventAddedText, "{0} event added.");
    _options.eventUpdatedText = getDefaultString(_options.eventUpdatedText, "{0} event updated.");
    _options.eventRemovedText = getDefaultString(_options.eventRemovedText, "{0} event removed.");
    _options.eventsRemovedText = getDefaultString(_options.eventsRemovedText, "{0} events removed.");
    _options.eventsExportedToText = getDefaultString(_options.eventsExportedToText, "Events exported to {0}.");
    _options.eventsPastedText = getDefaultString(_options.eventsPastedText, "{0} events pasted.");
    _options.eventsExportedText = getDefaultString(_options.eventsExportedText, "Events exported.");
    _options.copyToClipboardOnlyText = getDefaultString(_options.copyToClipboardOnlyText, "Copy to clipboard only");
    _options.workingDaysText = getDefaultString(_options.workingDaysText, "Working Days");
    _options.weekendDaysText = getDefaultString(_options.weekendDaysText, "Weekend Days");
    _options.showAsBusyText = getDefaultString(_options.showAsBusyText, "Show As Busy");
    _options.selectAllText = getDefaultString(_options.selectAllText, "Select All");
    _options.selectNoneText = getDefaultString(_options.selectNoneText, "Select None");
  }
  function setEventTypeTranslationStringOptions() {
    setEventTypeOption(_options.eventTypeNormalText, "Normal", 0);
    setEventTypeOption(_options.eventTypeMeetingText, "Meeting", 1);
    setEventTypeOption(_options.eventTypeBirthdayText, "Birthday", 2);
    setEventTypeOption(_options.eventTypeHolidayText, "Holiday", 3);
    setEventTypeOption(_options.eventTypeTaskText, "Task", 4);
  }
  function setEventTypeOption(optionEventText, defaultEventText, eventId) {
    if (_eventType.hasOwnProperty(eventId)) {
      if (!isDefinedString(optionEventText)) {
        _eventType[eventId].text = defaultEventText;
      } else {
        _eventType[eventId].text = optionEventText;
      }
    }
  }
  function isInvalidOptionArray(array, minimumLength) {
    minimumLength = isDefinedNumber(minimumLength) ? minimumLength : 1;
    return !isDefinedArray(array) || array.length < minimumLength;
  }
  function getOptions(newOptions, alternateOptions) {
    if (!isDefinedObject(newOptions)) {
      if (!isDefinedObject(alternateOptions)) {
        newOptions = {};
      } else {
        newOptions = alternateOptions;
      }
    }
    return newOptions;
  }
  function getStandardHolidays() {
    return [{day:1, month:1, title:"New Year's Day", onClickUrl:"https://en.wikipedia.org/wiki/New_Year%27s_Day"}, {day:14, month:2, title:"Valentine's Day", onClickUrl:"https://en.wikipedia.org/wiki/Valentine%27s_Days"}, {day:1, month:4, title:"April Fools' Day", onClickUrl:"https://en.wikipedia.org/wiki/April_Fools%27_Day"}, {day:22, month:4, title:"Earth Day", onClickUrl:"https://en.wikipedia.org/wiki/Earth_Day"}, {day:31, month:10, title:"Halloween", onClickUrl:"https://en.wikipedia.org/wiki/Halloween"}, 
    {day:11, month:11, title:"Remembrance Day", onClickUrl:"https://en.wikipedia.org/wiki/Remembrance_Day"}, {day:24, month:12, title:"Christmas Eve", onClickUrl:"https://en.wikipedia.org/wiki/Christmas_Eve"}, {day:25, month:12, title:"Christmas Day", onClickUrl:"https://en.wikipedia.org/wiki/Christmas"}, {day:26, month:12, title:"Boxing Day", onClickUrl:"https://en.wikipedia.org/wiki/Boxing_Day"}, {day:31, month:12, title:"New Year's Eve", onClickUrl:"https://en.wikipedia.org/wiki/New_Year%27s_Eve"}];
  }
  var _this = this;
  var _string = {empty:"", space:" "};
  var _day = {monday:0, saturday:5, sunday:6};
  var _keyCodes = {enter:13, escape:27, left:37, right:39, down:40, a:65, c:67, e:69, f:70, g:71, m:77, o:79, v:86, x:88, f5:116, f11:122};
  var _repeatType = {never:0, everyDay:1, everyWeek:2, every2Weeks:3, everyMonth:4, everyYear:5, custom:6};
  var _repeatCustomType = {daily:0, weekly:1, monthly:2, yearly:3};
  var _eventType = {0:{text:"Normal Label", eventEditorInput:null}, 1:{text:"Meeting Label", eventEditorInput:null}, 2:{text:"Birthday Label", eventEditorInput:null}, 3:{text:"Holiday Label", eventEditorInput:null}, 4:{text:"Task Label", eventEditorInput:null}};
  var _configuration = {visibleGroups:null, visibleEventTypes:null, visibleAllEventsMonths:{}, visibleWeeklyEventsDay:{}};
  var _timerName = {windowResize:"WindowResize", fullDayEventSizeTracking:"FullDayEventSizeTracking", searchOptionsChanged:"SearchOptionsChanged", searchEventsHistoryDropDown:"SearchEventsHistoryDropDown", showToolTip:"ShowToolTip", autoRefresh:"AutoRefresh", hideNotification:"HideNotification", sideMenuEvents:"SideMenuEvents"};
  var _timers = {};
  var _options = {};
  var _optionsForSearch = {};
  var _datePickerInput = null;
  var _datePickerHiddenInput = null;
  var _datePickerModeEnabled = false;
  var _datePickerVisible = false;
  var _currentDate = null;
  var _currentDateForDatePicker = null;
  var _largestDateInView = null;
  var _elementTypes = {};
  var _elements = {};
  var _eventNotificationsTriggered = {};
  var _document = null;
  var _window = null;
  var _navigator = null;
  var _elementID = null;
  var _initialized = false;
  var _initializedFirstTime = false;
  var _initializedDocumentEvents = false;
  var _events = {};
  var _timer_RefreshMainDisplay_Enabled = true;
  var _eventDetails_Dragged_DateFrom = null;
  var _eventDetails_Dragged = null;
  var _cachedStyles = null;
  var _isFullScreenModeActivated = false;
  var _isDateToday = false;
  var _isCalendarBusy = false;
  var _isCalendarBusy_LastState = false;
  var _openDialogs = [];
  var _eventsSelected = [];
  var _copiedEventDetails = [];
  var _copiedEventDetails_Cut = false;
  var _previousDaysVisibleBeforeSingleDayView = [];
  var _elementID_Day = "day-";
  var _elementID_Month = "month-";
  var _elementID_WeekDay = "week-day-";
  var _elementID_FullDay = "full-day-";
  var _elementID_DayElement = "calendar-day-";
  var _elementID_YearSelected = "year-selected-";
  var _element_Rows = [];
  var _element_DisabledBackground = null;
  var _element_Calendar = null;
  var _element_Calendar_AllVisibleEvents = [];
  var _element_MoveDialog_Original_X = 0;
  var _element_MoveDialog_Original_Y = 0;
  var _element_MoveDialog = null;
  var _element_MoveDialog_IsMoving = false;
  var _element_MoveDialog_X = 0;
  var _element_MoveDialog_Y = 0;
  var _element_HeaderDateDisplay = null;
  var _element_HeaderDateDisplay_YearSelector_DropDown = null;
  var _element_HeaderDateDisplay_YearSelector_DropDown_Text = null;
  var _element_HeaderDateDisplay_YearSelector_DropDown_Arrow = null;
  var _element_HeaderDateDisplay_YearSelector = null;
  var _element_HeaderDateDisplay_YearSelector_Contents = null;
  var _element_HeaderDateDisplay_YearSelector_Contents_Months = {};
  var _element_HeaderDateDisplay_ExportEventsButton = null;
  var _element_HeaderDateDisplay_FullScreenButton = null;
  var _element_HeaderDateDisplay_SearchButton = null;
  var _element_DayNamesHeader = null;
  var _element_SideMenu = null;
  var _element_SideMenu_Changed = false;
  var _element_SideMenu_Content = null;
  var _element_SideMenu_Content_Section_Groups = null;
  var _element_SideMenu_Content_Section_Groups_Content = null;
  var _element_SideMenu_Content_Section_EventTypes = null;
  var _element_SideMenu_Content_Section_EventTypes_Content = null;
  var _element_SideMenu_Content_Section_Days = null;
  var _element_SideMenu_Content_Section_Days_Content = null;
  var _element_SideMenu_Content_Section_WorkingDays = null;
  var _element_SideMenu_Content_Section_WorkingDays_Content = null;
  var _element_SideMenu_Content_Section_WeekendDays = null;
  var _element_SideMenu_Content_Section_WeekendDays_Content = null;
  var _element_SideMenu_DisabledBackground = null;
  var _element_EventEditorDialog = null;
  var _element_EventEditorDialog_Tab_Event = null;
  var _element_EventEditorDialog_Tab_Type = null;
  var _element_EventEditorDialog_Tab_Repeats = null;
  var _element_EventEditorDialog_Tab_Extra = null;
  var _element_EventEditorDialog_DisabledArea = null;
  var _element_EventEditorDialog_TitleBar = null;
  var _element_EventEditorDialog_DateFrom = null;
  var _element_EventEditorDialog_TimeFrom = null;
  var _element_EventEditorDialog_DateTo = null;
  var _element_EventEditorDialog_TimeTo = null;
  var _element_EventEditorDialog_IsAllDay = null;
  var _element_EventEditorDialog_ShowAlerts = null;
  var _element_EventEditorDialog_ShowAsBusy = null;
  var _element_EventEditorDialog_Title = null;
  var _element_EventEditorDialog_SelectColors = null;
  var _element_EventEditorDialog_Description = null;
  var _element_EventEditorDialog_Location = null;
  var _element_EventEditorDialog_Group = null;
  var _element_EventEditorDialog_Url = null;
  var _element_EventEditorDialog_RepeatEvery_Never = null;
  var _element_EventEditorDialog_RepeatEvery_EveryDay = null;
  var _element_EventEditorDialog_RepeatEvery_EveryWeek = null;
  var _element_EventEditorDialog_RepeatEvery_Every2Weeks = null;
  var _element_EventEditorDialog_RepeatEvery_EveryMonth = null;
  var _element_EventEditorDialog_RepeatEvery_EveryYear = null;
  var _element_EventEditorDialog_RepeatEvery_Custom = null;
  var _element_EventEditorDialog_RepeatEvery_RepeatOptionsButton = null;
  var _element_EventEditorDialog_RepeatEvery_Custom_Type_Daily = null;
  var _element_EventEditorDialog_RepeatEvery_Custom_Type_Weekly = null;
  var _element_EventEditorDialog_RepeatEvery_Custom_Type_Monthly = null;
  var _element_EventEditorDialog_RepeatEvery_Custom_Type_Yearly = null;
  var _element_EventEditorDialog_RepeatEvery_Custom_Value = null;
  var _element_EventEditorDialog_EventDetails = {};
  var _element_EventEditorDialog_AddUpdateButton = null;
  var _element_EventEditorDialog_RemoveButton = null;
  var _element_EventEditorColorsDialog = null;
  var _element_EventEditorColorsDialog_Color = null;
  var _element_EventEditorColorsDialog_ColorText = null;
  var _element_EventEditorColorsDialog_ColorBorder = null;
  var _element_EventEditorRepeatOptionsDialog = null;
  var _element_EventEditorRepeatOptionsDialog_Mon = null;
  var _element_EventEditorRepeatOptionsDialog_Tue = null;
  var _element_EventEditorRepeatOptionsDialog_Wed = null;
  var _element_EventEditorRepeatOptionsDialog_Thu = null;
  var _element_EventEditorRepeatOptionsDialog_Fri = null;
  var _element_EventEditorRepeatOptionsDialog_Sat = null;
  var _element_EventEditorRepeatOptionsDialog_Sun = null;
  var _element_EventEditorRepeatOptionsDialog_RepeatEnds = null;
  var _element_FullDayView = null;
  var _element_FullDayView_Title = null;
  var _element_FullDayView_Contents = null;
  var _element_FullDayView_Contents_AllDayEvents = null;
  var _element_FullDayView_Contents_Hours = null;
  var _element_FullDayView_Contents_WorkingHours = null;
  var _element_FullDayView_DateSelected = null;
  var _element_FullDayView_EventsShown = [];
  var _element_FullDayView_EventsShown_Sizes = [];
  var _element_FullDayView_ExportEventsButton = null;
  var _element_FullDayView_FullScreenButton = null;
  var _element_FullDayView_TodayButton = null;
  var _element_FullDayView_TimeArrow = null;
  var _element_FullDayView_SearchButton = null;
  var _element_FullDayView_ContextMenu_ClickPositionHourMinutes = null;
  var _element_FullDayView_Event_Dragged = null;
  var _element_FullDayView_Event_Dragged_EventDetails = null;
  var _element_FullDayView_Event_Dragged_Offset = null;
  var _element_ListAllEventsView = null;
  var _element_ListAllEventsView_ExportEventsButton = null;
  var _element_ListAllEventsView_FullScreenButton = null;
  var _element_ListAllEventsView_SearchButton = null;
  var _element_ListAllEventsView_Contents = null;
  var _element_ListAllEventsView_EventsShown = [];
  var _element_ListAllEventsView_MinimizeRestoreFunctions = [];
  var _element_ListAllWeekEventsView = null;
  var _element_ListAllWeekEventsView_Title = null;
  var _element_ListAllWeekEventsView_ExportEventsButton = null;
  var _element_ListAllWeekEventsView_FullScreenButton = null;
  var _element_ListAllWeekEventsView_SearchButton = null;
  var _element_ListAllWeekEventsView_Contents = null;
  var _element_ListAllWeekEventsView_Contents_FullView = {};
  var _element_ListAllWeekEventsView_Contents_FullView_Contents = {};
  var _element_ListAllWeekEventsView_Contents_FullView_Events = {};
  var _element_ListAllWeekEventsView_Contents_FullView_DateIDs = [];
  var _element_ListAllWeekEventsView_EventsShown = [];
  var _element_ListAllWeekEventsView_DateSelected = null;
  var _element_ListAllWeekEventsView_MinimizeRestoreFunctions = [];
  var _element_MessageDialog = null;
  var _element_MessageDialog_TitleBar = null;
  var _element_MessageDialog_Message = null;
  var _element_MessageDialog_RemoveAllEvents = null;
  var _element_MessageDialog_RemoveAllEvents_Label = null;
  var _element_MessageDialog_YesButton = null;
  var _element_MessageDialog_NoButton = null;
  var _element_ExportEventsDialog = null;
  var _element_ExportEventsDialog_Filename = null;
  var _element_ExportEventsDialog_Option_CSV = null;
  var _element_ExportEventsDialog_Option_XML = null;
  var _element_ExportEventsDialog_Option_JSON = null;
  var _element_ExportEventsDialog_Option_TEXT = null;
  var _element_ExportEventsDialog_Option_iCAL = null;
  var _element_ExportEventsDialog_Option_MD = null;
  var _element_ExportEventsDialog_Option_HTML = null;
  var _element_ExportEventsDialog_Option_TSV = null;
  var _element_ExportEventsDialog_ExportEvents = null;
  var _element_ExportEventsDialog_Option_ExportEventsToClipboard = null;
  var _element_ExportEventsDialog_Options = null;
  var _element_Tooltip = null;
  var _element_Tooltip_TitleButtons = null;
  var _element_Tooltip_TitleButtons_CloseButton = null;
  var _element_Tooltip_TitleButtons_EditButton = null;
  var _element_Tooltip_Title = null;
  var _element_Tooltip_Date = null;
  var _element_Tooltip_TotalTime = null;
  var _element_Tooltip_Repeats = null;
  var _element_Tooltip_Description = null;
  var _element_Tooltip_Location = null;
  var _element_Tooltip_Url = null;
  var _element_Tooltip_EventDetails = null;
  var _element_DropDownMenu_Day = null;
  var _element_DropDownMenu_Day_Paste_Separator = null;
  var _element_DropDownMenu_Day_Paste = null;
  var _element_DropDownMenu_Day_DateSelected = null;
  var _element_DropDownMenu_Event = null;
  var _element_DropDownMenu_Event_EventDetails = null;
  var _element_DropDownMenu_Event_FormattedDateSelected = null;
  var _element_DropDownMenu_Event_OpenUrlSeparator = null;
  var _element_DropDownMenu_Event_OpenUrl = null;
  var _element_DropDownMenu_Event_DuplicateSeparator = null;
  var _element_DropDownMenu_Event_Duplicate = null;
  var _element_DropDownMenu_Event_EditEvent = null;
  var _element_DropDownMenu_Event_CutSeparator = null;
  var _element_DropDownMenu_Event_Cut = null;
  var _element_DropDownMenu_Event_CopySeparator = null;
  var _element_DropDownMenu_Event_Copy = null;
  var _element_DropDownMenu_Event_RemoveSeparator = null;
  var _element_DropDownMenu_Event_Remove = null;
  var _element_DropDownMenu_Event_ExportEventsSeparator = null;
  var _element_DropDownMenu_Event_ExportEvents = null;
  var _element_DropDownMenu_FullDay = null;
  var _element_DropDownMenu_FullDay_RemoveEvents_Separator = null;
  var _element_DropDownMenu_FullDay_RemoveEvents = null;
  var _element_DropDownMenu_FullDay_Paste_Separator = null;
  var _element_DropDownMenu_FullDay_Paste = null;
  var _element_DropDownMenu_HeaderDay = null;
  var _element_DropDownMenu_HeaderDay_HideDay = null;
  var _element_DropDownMenu_HeaderDay_HideDay_Separator = null;
  var _element_DropDownMenu_HeaderDay_ShowOnlyWorkingDays = null;
  var _element_DropDownMenu_HeaderDay_ShowOnlyWorkingDays_Separator = null;
  var _element_DropDownMenu_HeaderDay_SelectedDay = null;
  var _element_SearchDialog = null;
  var _element_SearchDialog_MinimizedRestoreButton = null;
  var _element_SearchDialog_Contents = null;
  var _element_SearchDialog_For = null;
  var _element_SearchDialog_MatchCase = null;
  var _element_SearchDialog_Not = null;
  var _element_SearchDialog_Advanced = null;
  var _element_SearchDialog_Advanced_Container = null;
  var _element_SearchDialog_Include_Title = null;
  var _element_SearchDialog_Include_Location = null;
  var _element_SearchDialog_Include_Description = null;
  var _element_SearchDialog_Include_Group = null;
  var _element_SearchDialog_Include_Url = null;
  var _element_SearchDialog_Option_StartsWith = null;
  var _element_SearchDialog_Option_EndsWith = null;
  var _element_SearchDialog_Option_Contains = null;
  var _element_SearchDialog_Previous = null;
  var _element_SearchDialog_Next = null;
  var _element_SearchDialog_Moved = false;
  var _element_SearchDialog_SearchResults = [];
  var _element_SearchDialog_SearchIndex = 0;
  var _element_SearchDialog_FocusedEventID = null;
  var _element_SearchDialog_History_DropDown = null;
  var _element_SearchDialog_History_DropDown_Button = null;
  var _element_ConfigurationDialog = null;
  var _element_ConfigurationDialog_Display = null;
  var _element_ConfigurationDialog_Organizer = null;
  var _element_ConfigurationDialog_Display_EnableAutoRefresh = null;
  var _element_ConfigurationDialog_Display_EnableBrowserNotifications = null;
  var _element_ConfigurationDialog_Display_EnableTooltips = null;
  var _element_ConfigurationDialog_Display_EnableDragAndDropForEvents = null;
  var _element_ConfigurationDialog_Display_EnableDayNamesInMainDisplay = null;
  var _element_ConfigurationDialog_Display_ShowEmptyDaysInWeekView = null;
  var _element_ConfigurationDialog_Display_ShowHolidaysInTheDisplays = null;
  var _element_ConfigurationDialog_Organizer_Name = null;
  var _element_ConfigurationDialog_Organizer_Email = null;
  var _element_Notification = null;
  this.turnOnFullScreen = function() {
    if (!_datePickerModeEnabled) {
      turnOnFullScreenMode();
    }
  };
  this.turnOffFullScreen = function() {
    if (!_datePickerModeEnabled) {
      turnOffFullScreenMode();
    }
  };
  this.isFullScreenActivated = function() {
    return _isFullScreenModeActivated;
  };
  this.startTheAutoRefreshTimer = function() {
    if (!_datePickerModeEnabled) {
      _timer_RefreshMainDisplay_Enabled = true;
      startAutoRefreshTimer();
    }
  };
  this.stopTheAutoRefreshTimer = function() {
    if (!_datePickerModeEnabled) {
      clearAutoRefreshTimer();
      _timer_RefreshMainDisplay_Enabled = false;
    }
  };
  this.destroy = function() {
    removeDocumentEvents();
    stopAndResetAllTimers();
    clearElementsByClassName(_document.body, "calendar-dialog");
    clearElementsByClassName(_document.body, "calendar-drop-down-menu");
    clearElementsByClassName(_document.body, "calendar-tooltip");
    clearElementsByClassName(_document.body, "calendar-tooltip-event");
    clearElementsByClassName(_document.body, "calendar-notification");
    if (_datePickerModeEnabled) {
      _document.removeEventListener("click", hideDatePickerMode);
    }
    if (_options.tooltipsEnabled) {
      document.body.removeEventListener("mousemove", hideTooltip);
    }
    _element_Calendar.className = _string.empty;
    _element_Calendar.innerHTML = _string.empty;
    triggerOptionsEvent("onDestroy", _elementID);
  };
  this.moveToPreviousMonth = function() {
    moveBackMonth();
  };
  this.moveToNextMonth = function() {
    moveForwardMonth();
  };
  this.moveToPreviousYear = function() {
    moveBackYear();
  };
  this.moveToNextYear = function() {
    moveForwardYear();
  };
  this.moveToToday = function() {
    moveToday();
  };
  this.getCurrentDisplayDate = function() {
    return new Date(_currentDate);
  };
  this.setCurrentDisplayDate = function(date) {
    if (isDefinedDate(date) && (!_datePickerModeEnabled || _datePickerVisible)) {
      var newDate = new Date(date);
      if (!doDatesMatch(_currentDate, newDate)) {
        if (newDate.getFullYear() >= _options.minimumYear && newDate.getFullYear() <= _options.maximumYear) {
          build(newDate);
          triggerOptionsEventWithData("onSetDate", newDate);
        }
      }
    }
  };
  this.getSelectedDatePickerDate = function() {
    return _datePickerModeEnabled ? new Date(_currentDateForDatePicker) : null;
  };
  this.setSelectedDatePickerDate = function(date) {
    if (isDefinedDate(date) && _datePickerModeEnabled) {
      var newDate = new Date(date);
      var newDateAllowed = isDateValidForDatePicker(newDate);
      if (newDateAllowed && !doDatesMatch(newDate, _currentDateForDatePicker)) {
        if (newDate.getFullYear() >= _options.minimumYear && newDate.getFullYear() <= _options.maximumYear) {
          newDate.setHours(0, 0, 0, 0);
          hideDatePickerMode();
          updateDatePickerInputValueDisplay(newDate);
          triggerOptionsEventWithData("onDatePickerDateChanged", newDate);
          _currentDateForDatePicker = newDate;
        }
      }
    }
  };
  this.exportAllEvents = function(type) {
    if (_options.exportEventsEnabled && !_datePickerModeEnabled) {
      type = !isDefinedString(type) ? "csv" : type;
      exportEvents(null, type);
    }
  };
  this.refresh = function() {
    if (!_datePickerModeEnabled) {
      refreshViews(true, true);
    }
  };
  this.setEvents = function(events, updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      _events = {};
      this.addEvents(events, updateEvents, false);
      if (triggerEvent) {
        triggerOptionsEventWithData("onEventsSet", events);
      }
    }
  };
  this.setEventsFromJson = function(json, updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      var dataObject = getObjectFromString(json);
      if (isDefinedArray(dataObject)) {
        this.setEvents(dataObject, updateEvents, false);
      } else if (isDefinedObject(dataObject) && dataObject.hasOwnProperty("events")) {
        this.setEvents(dataObject.events, updateEvents, false);
      }
      if (triggerEvent) {
        triggerOptionsEventWithData("onEventsSetFromJSON", json);
      }
    }
  };
  this.addEvents = function(events, updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      var eventsLength = events.length;
      var eventIndex = 0;
      for (; eventIndex < eventsLength; eventIndex++) {
        var event = events[eventIndex];
        this.addEvent(event, false, false, false);
      }
      storeEventsInLocalStorage();
      if (triggerEvent) {
        triggerOptionsEventWithData("onEventsAdded", events);
      }
      if (updateEvents) {
        updateSideMenu();
        buildDayEvents();
        refreshOpenedViews();
      }
    }
  };
  this.addEventsFromJson = function(json, updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      var dataObject = getObjectFromString(json);
      if (isDefinedArray(dataObject)) {
        this.addEvents(dataObject, updateEvents, false);
      } else if (isDefinedObject(dataObject) && dataObject.hasOwnProperty("events")) {
        this.addEvents(dataObject.events, updateEvents, false);
      }
      if (triggerEvent) {
        triggerOptionsEventWithData("onEventsAddedFromJSON", json);
      }
    }
  };
  this.addEvent = function(event, updateEvents, triggerEvent, setLastUpdated) {
    var added = false;
    if (!_datePickerModeEnabled) {
      setLastUpdated = !isDefinedBoolean(setLastUpdated) ? true : setLastUpdated;
      if (isDefinedString(event.from)) {
        event.from = new Date(event.from);
      }
      if (isDefinedString(event.to)) {
        event.to = new Date(event.to);
      }
      if (isDefinedString(event.repeatEnds)) {
        event.repeatEnds = new Date(event.repeatEnds);
      }
      if (isDefinedString(event.created)) {
        event.created = new Date(event.created);
      }
      if (isDefinedString(event.lastUpdated)) {
        event.lastUpdated = new Date(event.lastUpdated);
      }
      if (event.from <= event.to) {
        var storageDate = toStorageDate(event.from);
        var storageGuid = newGuid();
        if (!_events.hasOwnProperty(storageDate)) {
          _events[storageDate] = {};
        }
        if (!_events[storageDate].hasOwnProperty(storageGuid)) {
          updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
          triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
          var title = getString(event.title);
          var description = getString(event.description);
          var location = getString(event.location);
          var group = getString(event.group);
          var url = getString(event.url);
          if (isDefined(_configuration.visibleGroups)) {
            _configuration.visibleGroups.push(getGroupName(group));
          }
          if (!isDefined(event.id)) {
            event.id = storageGuid;
          } else {
            storageGuid = event.id;
          }
          if (_options.maximumEventTitleLength > 0 && title !== _string.empty && title.length > _options.maximumEventTitleLength) {
            event.title = event.title.substring(0, _options.maximumEventTitleLength);
          }
          if (_options.maximumEventDescriptionLength > 0 && description !== _string.empty && description.length > _options.maximumEventDescriptionLength) {
            event.description = event.description.substring(0, _options.maximumEventDescriptionLength);
          }
          if (_options.maximumEventLocationLength > 0 && location !== _string.empty && location.length > _options.maximumEventLocationLength) {
            event.location = event.location.substring(0, _options.maximumEventLocationLength);
          }
          if (_options.maximumEventGroupLength > 0 && group !== _string.empty && group.length > _options.maximumEventGroupLength) {
            event.group = event.group.substring(0, _options.maximumEventGroupLength);
          }
          if (url !== _string.empty && !isValidUrl(url)) {
            event.url = _string.empty;
          }
          if (!isDefinedDate(event.created)) {
            event.created = new Date();
          }
          if (setLastUpdated) {
            event.lastUpdated = new Date();
          }
          _events[storageDate][storageGuid] = getAdjustedAllDayEvent(event);
          added = true;
          if (triggerEvent) {
            triggerOptionsEventWithData("onEventAdded", event);
          }
          if (updateEvents) {
            storeEventsInLocalStorage();
            updateSideMenu();
            buildDayEvents();
            refreshOpenedViews();
          }
        }
      }
    }
    return added;
  };
  this.updateEvents = function(events, updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      var eventsLength = events.length;
      var eventIndex = 0;
      for (; eventIndex < eventsLength; eventIndex++) {
        var event = events[eventIndex];
        this.updateEvent(event.id, event, false, false);
      }
      if (triggerEvent) {
        triggerOptionsEventWithData("onEventsUpdated", events);
      }
      if (updateEvents) {
        storeEventsInLocalStorage();
        updateSideMenu();
        buildDayEvents();
        refreshOpenedViews();
      }
    }
  };
  this.updateEvent = function(id, event, updateEvents, triggerEvent) {
    var updated = false;
    if (!_datePickerModeEnabled) {
      updated = this.removeEvent(id, false, false);
      if (updated) {
        updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
        triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
        updated = this.addEvent(event, updateEvents, false);
        storeEventsInLocalStorage();
        if (updated && triggerEvent) {
          triggerOptionsEventWithData("onEventUpdated", event);
        }
      }
    }
    return updated;
  };
  this.updateEventDateTimes = function(id, from, to, repeatEnds, updateEvents, triggerEvent) {
    var updated = false;
    if (!_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      getAllEventsFunc(function(eventDetails) {
        if (eventDetails.id === id) {
          eventDetails.from = from;
          eventDetails.to = to;
          eventDetails.repeatEnds = repeatEnds;
          updated = true;
          if (triggerEvent) {
            triggerOptionsEventWithData("onEventUpdated", eventDetails);
          }
          if (updateEvents) {
            storeEventsInLocalStorage();
            updateSideMenu();
            buildDayEvents();
            refreshOpenedViews();
          }
          return true;
        }
      });
    }
    return updated;
  };
  this.removeEvent = function(id, updateEvents, triggerEvent) {
    var removed = false;
    if (!_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      getAllEventsFunc(function(event, storageDate, storageGuid) {
        if (storageGuid === id) {
          delete _events[storageDate][storageGuid];
          removed = true;
          if (triggerEvent) {
            triggerOptionsEventWithData("onEventRemoved", event);
          }
          if (updateEvents) {
            storeEventsInLocalStorage();
            updateSideMenu();
            buildDayEvents();
            refreshOpenedViews();
          }
          return true;
        }
      });
    }
    return removed;
  };
  this.clearEvents = function(updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      _events = {};
      if (triggerEvent) {
        triggerOptionsEvent("onEventsCleared");
      }
      if (updateEvents) {
        storeEventsInLocalStorage();
        updateSideMenu();
        buildDayEvents();
        refreshOpenedViews();
      }
    }
  };
  this.getEvents = function() {
    var events = [];
    if (!_datePickerModeEnabled) {
      events = getOrderedEvents(getAllEvents());
    }
    return events;
  };
  this.getEvent = function(id) {
    var returnEvent = null;
    if (isDefinedString(id) && !_datePickerModeEnabled) {
      getAllEventsFunc(function(eventDetails) {
        if (eventDetails.id === id) {
          returnEvent = eventDetails;
          return true;
        }
      });
    }
    return returnEvent;
  };
  this.removeExpiredEvents = function(updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      getAllEventsFunc(function(eventDetails) {
        var repeatEvery = getNumber(eventDetails.repeatEvery);
        if (repeatEvery === _repeatType.never && eventDetails.to < new Date()) {
          _this.removeEvent(eventDetails.id, false, triggerEvent);
        }
      });
      if (updateEvents) {
        storeEventsInLocalStorage();
        updateSideMenu();
        buildDayEvents();
        refreshOpenedViews();
      }
    }
  };
  this.addEventType = function(id, text) {
    var result = false;
    if (isDefinedNumber(id) && isDefinedString(text) && !_datePickerModeEnabled) {
      if (!_eventType.hasOwnProperty(id)) {
        _eventType[id] = {text:text, eventEditorInput:null};
        if (isDefined(_configuration.visibleEventTypes)) {
          _configuration.visibleEventTypes.push(id);
        }
        result = true;
      }
    }
    return result;
  };
  this.removeEventType = function(id) {
    var result = false;
    if (isDefinedNumber(id) && !_datePickerModeEnabled) {
      if (_eventType.hasOwnProperty(id)) {
        delete _eventType[id];
        result = true;
      }
    }
    return result;
  };
  this.setVisibleEventTypes = function(ids, triggerEvent) {
    if (isDefinedArray(ids) && !_datePickerModeEnabled) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      _configuration.visibleEventTypes = [];
      var idsLength = ids.length;
      var idIndex = 0;
      for (; idIndex < idsLength; idIndex++) {
        if (_configuration.visibleEventTypes.indexOf(ids[idIndex]) === -1) {
          _configuration.visibleEventTypes.push(ids[idIndex]);
        }
      }
      refreshViews(true, false);
      if (triggerEvent) {
        triggerOptionsEvent("onVisibleEventTypesChanged", _configuration.visibleEventTypes);
      }
    }
  };
  this.getAllGroups = function() {
    return getGroups();
  };
  this.clearAllGroups = function(updateEvents, triggerEvent) {
    if (!_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      getAllEventsFunc(function(eventDetails) {
        eventDetails.group = null;
      });
      if (triggerEvent) {
        triggerOptionsEvent("onGroupsCleared");
      }
      if (updateEvents) {
        updateSideMenu();
        buildDayEvents();
        refreshOpenedViews();
      }
    }
  };
  this.removeGroup = function(groupName, updateEvents, triggerEvent) {
    if (isDefinedString(groupName) && !_datePickerModeEnabled) {
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      var checkGroupName = groupName.toLowerCase();
      getAllEventsFunc(function(eventDetails) {
        if (eventDetails.group !== null && eventDetails.group.toLowerCase() === checkGroupName) {
          eventDetails.group = null;
        }
      });
      if (triggerEvent) {
        triggerOptionsEvent("onGroupRemoved", groupName);
      }
      if (updateEvents) {
        updateSideMenu();
        buildDayEvents();
        refreshOpenedViews();
      }
    }
  };
  this.setVisibleGroups = function(groupNames, triggerEvent) {
    if (isDefinedArray(groupNames) && !_datePickerModeEnabled) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      _configuration.visibleGroups = [];
      var groupNamesLength = groupNames.length;
      var groupNameIndex = 0;
      for (; groupNameIndex < groupNamesLength; groupNameIndex++) {
        var groupName = getGroupName(groupNames[groupNameIndex]);
        if (_configuration.visibleGroups.indexOf(groupName) === -1) {
          _configuration.visibleGroups.push(groupName);
        }
      }
      refreshViews(true, false);
      if (triggerEvent) {
        triggerOptionsEvent("onVisibleGroupsChanged", _configuration.visibleGroups);
      }
    }
  };
  this.setClipboardEvent = function(event) {
    if (isDefinedObject(event) && !_datePickerModeEnabled) {
      _copiedEventDetails = [cloneEventDetails(event)];
    }
  };
  this.setClipboardEvents = function(events) {
    if (isDefinedArray(events) && !_datePickerModeEnabled) {
      _copiedEventDetails = [];
      var eventsLength = events.length;
      var eventIndex = 0;
      for (; eventIndex < eventsLength; eventIndex++) {
        _copiedEventDetails.push(cloneEventDetails(events[eventIndex]));
      }
    }
  };
  this.getClipboardEvents = function() {
    var result = null;
    if (!_datePickerModeEnabled) {
      result = _copiedEventDetails;
    }
    return result;
  };
  this.clearClipboard = function() {
    if (!_datePickerModeEnabled) {
      _copiedEventDetails = [];
    }
  };
  this.getVersion = function() {
    return "2.3.4";
  };
  this.getId = function() {
    return _elementID;
  };
  this.isBusy = function() {
    return _isCalendarBusy;
  };
  this.setOptions = function(newOptions, triggerEvent) {
    newOptions = getOptions(newOptions);
    var propertyName;
    for (propertyName in newOptions) {
      if (newOptions.hasOwnProperty(propertyName)) {
        _options[propertyName] = newOptions[propertyName];
      }
    }
    resetOptionsForDatePickerMode();
    checkForBrowserNotificationsPermission();
    if (_initialized) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      if (triggerEvent) {
        triggerOptionsEventWithData("onOptionsUpdated", _options);
      }
      _initialized = false;
      if (!_datePickerModeEnabled || _datePickerVisible) {
        build(_currentDate, true, true);
      }
    }
  };
  this.setSearchOptions = function(newSearchOptions, triggerEvent) {
    if (!_datePickerModeEnabled) {
      newSearchOptions = getOptions(newSearchOptions);
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      hideSearchDialog();
      var propertyName;
      for (propertyName in newSearchOptions) {
        if (newSearchOptions.hasOwnProperty(propertyName)) {
          _optionsForSearch[propertyName] = newSearchOptions[propertyName];
        }
      }
      if (triggerEvent) {
        triggerOptionsEventWithData("onSearchOptionsUpdated", _optionsForSearch);
      }
    }
  };
  this.addHolidays = function(holidays, triggerEvent, updateEvents) {
    if (isDefinedArray(holidays) && !_datePickerModeEnabled) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      _options.holidays = _options.holidays.concat(holidays);
      if (triggerEvent) {
        triggerOptionsEventWithData("onOptionsUpdated", _options);
      }
      if (updateEvents) {
        build(_currentDate, true, true);
      }
    }
  };
  this.removeHolidays = function(holidayNames, triggerEvent, updateEvents) {
    if (isDefinedArray(holidayNames) && !_datePickerModeEnabled) {
      triggerEvent = !isDefinedBoolean(triggerEvent) ? true : triggerEvent;
      updateEvents = !isDefinedBoolean(updateEvents) ? true : updateEvents;
      var holidaysLength = _options.holidays.length;
      var holidaysRemaining = [];
      var holidayIndex = 0;
      for (; holidayIndex < holidaysLength; holidayIndex++) {
        var holiday = _options.holidays[holidayIndex];
        var holidayText = getString(holiday.title, _string.empty);
        if (holidayNames.indexOf(holidayText) === -1) {
          holidaysRemaining.push(holiday);
        }
      }
      _options.holidays = holidaysRemaining;
      if (triggerEvent) {
        triggerOptionsEventWithData("onOptionsUpdated", _options);
      }
      if (updateEvents) {
        build(_currentDate, true, true);
      }
    }
  };
  this.getHolidays = function() {
    return _options.holidays;
  };
  (function(documentObject, windowObject, navigatorObject) {
    _document = documentObject;
    _window = windowObject;
    _navigator = navigatorObject;
    _elementID = elementOrId;
    if (isDefinedString(_elementID) || isDefinedDOMElement(_elementID)) {
      buildDefaultOptions(options);
      buildDefaultSearchOptions(searchOptions);
      build(_options.initialDateTime, true);
      if (_element_Calendar !== null && isDefinedBoolean(_options.openInFullScreenMode) && _options.openInFullScreenMode && !_datePickerModeEnabled) {
        forceTurnOnFullScreenMode();
      }
    }
  })(document, window, navigator);
};