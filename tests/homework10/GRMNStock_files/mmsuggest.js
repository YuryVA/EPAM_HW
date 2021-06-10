/* mmsuggest.js */

// mmsuggest.js: Suggestion dropdown box for HTML.
// Copyright exorbyte GmbH, 2005, 2006. All rights reserved.
// Author: Leo Meyer, leo.meyer_at_exorbyte.com
// Version: 5.6, 10.04.07
//
// Usage: see demo.
//
// Veraenderungen an diesem Code sind nur mit ausdruecklicher Zustimmung der 
// exorbyte GmbH gestattet.
// Modification of this code only with explicit permission by exorbyte GmbH.

var exorbyteLogo = "exlogo_tiny.gif";		// path to exorbyte logo, not affected by iconPath
var mm_refcnt = 0;
var mm_inputs = new Array();
var mmUA = navigator.userAgent;
var firefox = mmUA.search(/firefox/i) >= 0;
var opera = mmUA.search(/Opera/i) >= 0;
var ie = mmUA.search(/MSIE/i);
if (ie >= 0) {
	var ieVersion = mmUA.substr(ie + 4, 3);
	ie = true;
} else ie = false;
var ieZIndexBug = ie && (parseInt(ieVersion) < 7.0);
var mm_flashtime = 50; 		// ms
var mm_qtime = 0;
var mmIgnoreFirstMouseEnter = false;	// firefox behaviour workaround: ignore first mouse enter when displaying

// bit flags
var AS_NOLOGO = 1;			// don't display exorbyte logo - only for licensed users
var AS_NOSUBMIT = 2;		// don't do a form commit on return while the suggest box is open
var AS_TABSELECTS = 4;		// pressing TAB activates the selected entry
var AS_DISPLAY_INPUT = 8;	// adds a header row containing the user's input
var AS_HIERARCHICAL = 16;	// display suggestions in hierarchical mode
var AS_GROUPED = 32;		// display suggestions in grouped mode (category grouping), useful for one-level categories
var AS_GROUPED_DISPLAYCAT = 64;		// display suggestions in grouped mode (category grouping) plus category labels, useful for |-separated subcategory labels
var AS_GENERATED_CATEGORIES_NOT_SELECTABLE = 128;	// HIERARCHICAL and GROUPED categories are not selectable if this flag is set
var AS_NO_ROOT = 256;		// don't display root node in grouped and hierarchical modes

/** Parameter container for flexible parameter handling */
function mmSuggestParams() {
	this.requestURL = "";			// URL for the server side part
	this.iconPath = mmURLIcons;		// relative or absolute path to icons, must end with "/" if not empty; override this in template modules
	this.flags = 0;				// a combination of the AS_ flags
	this.width = -1;				// if -1, width is calculated automatically; can be set in the setup function
	this.top = -1;				// fixed absolute top position (-1: dynamic)
	this.left = 0;				// left position (dependent on the value of align)
	this.align = "left";			// default: left alignment
	this.oneColumn = false;			// force one column display
	this.letterLimit = 2;				// if the length of the input is less than this number, no request is made
	this.searchDelay = 200;			// ms until search is started (default: 250)
	this.compareResults = true;				// compare new results and update the display only if differences are found
	this.normalfg = "black";			// default normal foreground
	this.normalbg = "white";			// default normal background
	this.highlightfg = "white";			// default highlighted foreground
	this.highlightbg = "navy";			// default highlighted background
	this.debug = false;				// enables component-specific debugging
	this.overlappedObjects = null;		// Array of SELECT combobox objects that may be hidden by the dropdown (IE display bug workaround)
	this.document = window.document;		// target document object, default: current document
	this.valueField = 0;					// field containing the search value
	this.searchValueObject = null;			// object for search value
	this.beforeRequest = function (target) { return true; };		// function that is called before a request is made; cancel request by returning false
	this.onActivate = null;			// custom function(input, row) that is activated onClick or on enter key; return false to suppress commit
	this.inputTitle = "Ihre Eingabe";		// text that is displayed with the input if AS_DISPLAY_INPUT is set
	this.clickout = false;			// set to true for clickout logging
	this.clickoutField = 0;			// field that contains the value that should be used for the clickout logging
	this.headerFunction = null;			// custom function(target, iDiv, rows) returns header HTML for a set of rows. Parent is the parent DIV element to be filled
	this.rowFunction = null;			// custom function(target, rows, fieldIndex, row, iDiv) sets iDiv's inner HTML. fieldIndex is an array that contains the indexes of field names. Returns (boolean)addEvents.
	this.groupedRowFunction = null;			// custom function(target, rows, fieldIndex, row, iDiv) sets iDiv's inner HTML. fieldIndex is an array that contains the indexes of field names. Returns (boolean)addEvents.
	this.footerFunction = null;			// custom function(target, iDiv, rows) returns footer HTML for a set of rows. Parent is the parent DIV element to be filled
	this.preFunction = null;			// preprocessing function(target, rows) returns rowArray
	this.preUserFunction = null;
	this.hierarchicalSearchTermIndicator = "Suchbegriff";		// abstract search term denominator
	this.suggBoxTop = function (iDiv) { return false; };		// function that sets HTML for the top DIV in the suggestion box
	this.suggBoxBottom = function (iDiv) { return false; };		// function that sets HTML for the bottom DIV in the suggestion box
	this.suggBoxLeftFrameHTML = function () { return ""; };		// function that returns HTML for the left frame part of a suggRow
	this.suggBoxRightFrameHTML = function () { return ""; };		// function that returns HTML for the right frame part of a suggRow	
	this.pageSize = 0;					// if this value is greater than 0, page navigation is activated
	this.navigationBar = null;			// function(target, nDiv, page, maxPages) to generate navigation bar HTML
	this.nocache = false;				// bypass browser caching
	this.navigationPos = "top";		// place to show the navigation bar. possible values are "top", "bottom" and "both"
	this.suggestBoxResultContainer = null;

	return 0;
}

// consts used in navig and selection contexts
var MM_DOWNDIR = false;
var MM_UPDIR = true;

////////// helper functions ///////////

// String extensions
String.prototype.startsWith = function (s) {
	if (Number(s.length) > Number(this.length)) return false;
	return this.substring(0, s.length) == s;
}
String.prototype.trim = function () {
	return this.replace(/^\s+/, "").replace(/\s+$/, "");
};

function sortFirst(a, b) {
	// expects a, b to be arrays
	if (a[0] > b[0])
		return 1;
	else if (a[0] < b[0])
		return -1;
	else return 0;
}

function sortLengthLonger(a, b) {
	// expects a, b to be strings
	// sort longer ones first
	return b.length - a.length;
}

function sortLengthShorter(a, b) {
	// expects a, b to be strings
	// sort shorter ones first
	return a.length - b.length;
}

//////// helper functions end //////////

function mmDoBlur(event) {
	if (!event && window.event) {
		event = window.event;
	}
	// hide suggestion boxes
	for (var i = 0; i < mm_inputs.length; i++) {
		mmHideSuggBox(mm_inputs[i]);
	}
	target = (typeof (event.srcElement) == "undefined" ? event.target : event.srcElement);
	// target lost focus
	target.lostFocus = true;
	if ((typeof target.oldBlur != "undefined") && (target.oldBlur != null))
		target.oldBlur(event);

	return 0;
}

function mmDoFocus(event) {
	if (!event && window.event) {
		event = window.event;
	}
	target = (typeof (event.srcElement) == "undefined" ? event.target : event.srcElement);
	// target has focus
	target.lostFocus = false;
	if ((typeof target.oldFocus != "undefined") && (target.oldFocus != null))
		target.oldFocus(event);

	return 0;
}

function mmPageNavig(target_id, mmDirection) {
	//	alert("pageNavig!");
	var target = mm_inputs[target_id];
	if (Number(target.parameters.pageSize) <= 0) return 0;
	if (mmDirection == MM_DOWNDIR) {
		if (Number(target.mmPageOffset) + Number(target.parameters.pageSize) >= Number(target.rows.length)) return 0;
		// increase pageOffset and redisplay
		var newOfs = Number(target.mmPageOffset) + Number(target.parameters.pageSize);
		mmFillDiv(target, target.rows, newOfs);
	} else {
		// MM_UPDIR
		if (Number(target.mmPageOffset) <= 0) return 0;
		// decrease pageOffset and redisplay
		var newOfs = Number(target.mmPageOffset) - Number(target.parameters.pageSize);
		if (newOfs < 0) newOfs = 0;
		mmFillDiv(target, target.rows, newOfs);
	}
	// ensure that box is focused and div is shown; IE/Opera event behaviour workaround
	setTimeout(function () {
		target.focus();
		mmShowSuggBox(target);
	}, 10);
	mmCancelEvent(false);
	return false;
}

function mmGetPageNavig(target, dir) {
	if (dir == MM_UPDIR)
		return "mmPageNavig(" + target.mm_refcnt + ", MM_UPDIR);";
	else
		return "mmPageNavig(" + target.mm_refcnt + ", MM_DOWNDIR);";
}

function mmCheckKey(event, target) {
	if (event.ctrlKey && (event.altKey || event.shiftKey) && (event.keyCode == 120)) {
		target.dynamicNotification = !target.dynamicNotification;
		return true;
	}
	if (event.ctrlKey && (event.altKey || event.shiftKey) && (event.keyCode == 119)) {
		mmDoSearch(target.targetIndex, true);
		return true;
	}
	if (event.ctrlKey && (event.altKey || event.shiftKey) && (event.keyCode == 118)) {
		target.parameters.debug = !target.parameters.debug;
		return true;
	}
	return false;
}

function mmCancelEvent(event) {
	if (ie) {
		event = window.event;
		window.event.returnValue = false;
	}
	event.cancelBubble = true;
	event.returnValue = false;
	event.cancel = true;
	return false;
}

function mmDoFieldKeyDown(event) {
	if (!event && window.event) {
		event = window.event;
	}
	target = (typeof (event.srcElement) == "undefined" ? event.target : event.srcElement);
	//	alert(event.keyCode);
	if (!target.xmlhttp) return 0;
	switch (Number(event.keyCode)) {
		case 40: {
			// down
			if (!target.suggVisible) {
				mmCallSearch(target, 10);
				return false;
			} else {
				if (target.suggCount > 0) {
					if (target.lastHighlightedId < target.lastDisplayedRow) {
						mmSelectRow(target, target.lastHighlightedId + 1, MM_DOWNDIR);
					}
					return mmCancelEvent(event);
				}
			}
			break;
		}
		case 38: {
			// up
			if (target.suggCount > 0) {
				if (target.lastHighlightedId > target.firstDisplayedRow) {
					mmSelectRow(target, target.lastHighlightedId - 1, MM_UPDIR);
					mmShowSuggBox(target);
				}
				return mmCancelEvent(event);
			}
			break;
		}
		case 33: {
			// PgUp
			if (target.suggVisible && (target.suggCount > 0)) {
				mmPageNavig(target.mm_refcnt, MM_UPDIR);
				mmSelectRow(target, target.firstDisplayedRow, MM_UPDIR);
				return mmCancelEvent(event);
			}
			break;
		}
		case 34: {
			// PgDn
			if (target.suggVisible && (target.suggCount > 0)) {
				mmPageNavig(target.mm_refcnt, MM_DOWNDIR);
				mmSelectRow(target, target.lastDisplayedRow, MM_DOWNDIR);
				return mmCancelEvent(event);
			}
			break;
		}
		case 35: {
			// End
			if (target.suggVisible && (target.suggCount > 0)) {
				mmSelectRow(target, target.lastDisplayedRow, MM_DOWNDIR);
				// don't cancel event				
				return true;
			}
			break;
		}
		case 36: {
			// Home
			if (target.suggVisible && (target.suggCount > 0)) {
				mmSelectRow(target, target.firstDisplayedRow, MM_UPDIR);
				// don't cancel event				
				return true;
			}
			break;
		}
		case 13: {
			// Enter
			if (target.suggVisible && (target.lastHighlightedId >= 0)) {
				mmHideSuggBox(target);
				var row = target.parameters.document.getElementById("suggRow" + target.mm_refcnt + "_" + target.lastHighlightedId);
				// row selected?
				if (row) {
					var fx = row.mmMouseDown;
					fx();
				}
				return mmCancelEvent(event);
			} else {
				// no box visible or nothing selected, submit input
				mmSubmitString(target, target.value);
				return mmCancelEvent(event);
			}
			break;
		}
		case 9: {
			// TAB
			if (target.suggVisible && (target.lastHighlightedId >= 0) && ((target.parameters.flags & AS_TABSELECTS) == AS_TABSELECTS)) {
				mmHideSuggBox(target);
				var row = target.parameters.document.getElementById("suggRow" + target.mm_refcnt + "_" + target.lastHighlightedId);
				if (row) {
					var fx = row.mmMouseDown;
					if (!fx()) return mmCancelEvent(event);
				}
				return true;
			}
			break;
		}
		case 27: {
			// Escape
			if (target.suggVisible) {
				mmSelectRow(target, -1);
				mmHideSuggBox(target);
				return mmCancelEvent(event);
			}
			break;
		}
		case 116: {
			// F5, block search on refresh
			return true;
		}
	}
	if (mmCheckKey(event, target)) return false;
	if ((event.keyCode == 8) || (event.keyCode == 32) || (event.keyCode >= 46)) {
		mmCallSearch(target, target.parameters.searchDelay);
	}

	return 0;
}

function mmGetXMLHTTP() {
	var result = false;
	if (typeof XMLHttpRequest != "undefined") {
		result = new XMLHttpRequest();
	} else {
		try {
			result = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				result = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) { }
		}
	}
	return result;
}

function mmGetParentProps(elem, prop) {
	// returns the sum of the property "prop" along the offsetParent row of elem
	var result = 0;
	while (elem != null) {
		result += elem[prop];
		elem = elem.offsetParent;
	}
	return result;
}

function mmSelectRow(target, row, direction) {
	var rowDiv;
	var hoverClass = "hovered";
	if (target.lastHighlightedId > -1) {
		rowDiv = target.parameters.document.getElementById("suggRow" + target.mm_refcnt + "_" + target.lastHighlightedId);
		if (rowDiv) {
			rowDiv.style.backgroundColor = rowDiv.oldBackgroundColor;
			rowDiv.style.color = rowDiv.oldColor;

			rowDiv.className = rowDiv.className.replace(hoverClass, "");

			var children = rowDiv.childNodes;
			for (i = 0; i < children.length; i++) {
				children[i].style.backgroundColor = children[i].oldBackgroundColor;
				children[i].style.color = children[i].oldColor;
			}
		}
	}
	var selectable = false;
	var safeCount = 0;
	// find next selectable element for the given direction, if possible
	while (!selectable && (safeCount < 2 * Number(target.rows.length))) {
		rowDiv = target.parameters.document.getElementById("suggRow" + target.mm_refcnt + "_" + row);
		rowDiv.className = rowDiv.className.replace(hoverClass, "");
		if (!rowDiv) break;
		selectable = typeof (rowDiv.selectable) != 'undefined';
		if (!selectable) {
			if (direction == MM_UPDIR) {
				row--;
				safeCount++;
			} else {
				row++;
				safeCount++;
			}
			if (row <= 0) {
				direction = !direction;
				row = 0;
			}
			if (row >= Number(target.rows.length)) {
				direction = !direction;
				row = Number(target.rows.length) - 1;
			}
		}
	}
	if (rowDiv) {
		rowDiv.className += " " + hoverClass;

		target.lastHighlightedId = row;
		if (rowDiv.oldBackgroundColor != rowDiv.style.backgroundColor) {
			rowDiv.oldBackgroundColor = rowDiv.style.backgroundColor;
		}

		if (rowDiv.oldColor != rowDiv.style.color) {
			rowDiv.oldColor = rowDiv.style.color;
		}

		if (target.parameters.highlightbg != '') {
			rowDiv.style.backgroundColor = target.parameters.highlightbg;

		}

		if (target.parameters.highlightfg != '') {
			rowDiv.style.color = target.parameters.highlightfg;
		}

		var children = rowDiv.childNodes;
		for (i = 0; i < Number(children.length) ; i++) {
			if (children[i].oldBackgroundColor != children[i].style.backgroundColor)
				children[i].oldBackgroundColor = children[i].style.backgroundColor;
			if (children[i].oldColor != children[i].style.color)
				children[i].oldColor = children[i].style.color;
			if (target.parameters.highlightbg != '')
				children[i].style.backgroundColor = target.parameters.highlightbg;
			if (target.parameters.highlightfg != '')
				children[i].style.color = target.parameters.highlightfg;
		}
	}

	return 0;
}

function mmMouseEnter(target_id, id) {
	// firefox selection bug workaround
	if (mmIgnoreFirstMouseEnter) {
		mmIgnoreFirstMouseEnter = false;
		return 0;
	}
	var target = mm_inputs[target_id];
	mmSelectRow(target, id);

	return 0;
}

function mmSubmitString(target, string) {
	// if an alternative search field has been specified, use it
	if (target.parameters.searchValueObject != null)
		target.parameters.searchValueObject.value = string;
	else
		target.value = string;
	if ((target.form.action != "") && ((target.parameters.flags & AS_NOSUBMIT) != AS_NOSUBMIT)) {
		target.form.submit();
	}

	return 0;
}

function mmSetDivSize(target) {
	if (target.suggBox) {
		var width = Number(target.offsetWidth);
		if (!isNaN(target.parameters.width)) {
			width = (target.parameters.width <= 0 ? width : target.parameters.width);
			target.suggBox.style.width = width + "px";
			return true;
		} else if (target.parameters.width.indexOf("%") !== -1) {
			target.suggBox.style.width = target.parameters.width;
			return true;
		}
	}

	return false;
}

function mmUnflash(target_id, oCol, nCol, count) {
	var target = mm_inputs[target_id];
	target.style.backgroundColor = oCol;
	count--;
	if (count > 0) {
		setTimeout("mmFlash(" + target_id + ", \"" + nCol + "\", " + count + ");", mm_flashtime);
	}

	return 0;
}

function mmFlash(target_id, nCol, count) {
	var target = mm_inputs[target_id];
	var oCol = target.style.backgroundColor;
	target.style.backgroundColor = nCol;
	var cmd = "mmUnflash(" + target_id + ", \"" + oCol + "\", \"" + nCol + "\", " + count + ");";
	setTimeout(cmd, mm_flashtime);

	return 0;
}

function replaceHTMLEntities(str) {
	if (typeof str != "String")
		str = String(str);
	var result = str.replace(/&/g, "&amp;");
	result = result.replace(/</g, "&lt;");
	result = result.replace(/>/g, "&gt;");
	result = result.replace(/'/g, "&#39;");	// ie apos bug!
	result = result.replace(/"/g, "&quot;");
	return result;
}

function mmRedirectClick(target_id, row, coBypass) {
	var target = mm_inputs[target_id];
	if (target.parameters.clickout && (typeof coBypass == "undefined")) {
		url = mmQReplace(target.parameters.requestURL, target) + "&click=" + escape(target.rows[row][target.parameters.clickoutField]) + "&coID=" + escape(target.coID) + "&hash=" + Math.random();
		target.xmlhttp.open("GET", url, true);
		target.xmlhttp.send(null);
		window.setTimeout("mmRedirectClick(" + target_id + ", " + row + ", true)", 100);
		return 0;
	}
	if ((typeof target.parameters.onActivate != "undefined") && (target.parameters.onActivate != null) && (target.parameters.onActivate != "")) {
		if (target.parameters.onActivate(target, target.rows[row]))
			mmSubmitString(target, target.rows[row][target.parameters.valueField]);
	} else {
		mmSubmitString(target, target.rows[row][target.parameters.valueField]);
	}

	return 0;
}

function mmFillDiv(target, rows, pageOffset) {
	// remove previous elements
	while (target.suggBox.hasChildNodes()) {
		target.suggBox.removeChild(target.suggBox.firstChild);
	}
	var po = 0;	// local pageOffset
	var pe = Number(rows.length);	// local page end
	// consider pageOffset?
	if (!isNaN(pageOffset)) {
		po = pageOffset;
		target.mmPageOffset = pageOffset;
	}
	if (target.parameters.pageSize > 0) {
		pe = po + Number(target.parameters.pageSize);
		if (pe > Number(rows.length)) pe = Number(rows.length);
	}
	target.firstDisplayedRow = po;
	target.lastDisplayedRow = pe - 1;
	var fieldnames = target.fieldnames;
	// top div
	if ((typeof target.parameters.suggBoxTop != "undefined") && (target.parameters.suggBoxTop != null) && (target.parameters.suggBoxTop != "")) {
		var tDiv = target.parameters.document.createElement("div");
		tDiv.style.width = "100%";
		if (target.parameters.suggBoxTop(tDiv))
			target.suggBox.appendChild(tDiv);
	}
	var localize = (fieldnames.length != 2) || (fieldnames[0] != "Name") || (fieldnames[1] != "Key");
	if (localize && (typeof target.parameters.headerFunction != "undefined") && (target.parameters.headerFunction != null) && (target.parameters.headerFunction != "")) {
		var iDiv = target.parameters.document.createElement("div");
		var ih = target.parameters.headerFunction(target, iDiv, rows);
		iDiv.innerHTML = ih;
		iDiv.style.width = "100%";
		target.suggBox.appendChild(iDiv);
	}
	// nav div? (top/both)
	if (target.parameters.pageSize > 0 && (target.parameters.navigationPos == "top" || target.parameters.navigationPos == "both")) {
		var nDiv = target.parameters.document.createElement("div");
		var page = Math.round(po / target.parameters.pageSize) + 1;
		var maxPages = Math.ceil(Number(rows.length) / Number(target.parameters.pageSize));
		// custom nav div?
		if ((typeof target.parameters.navigationBar != "undefined") && (target.parameters.navigationBar != null) && (target.parameters.navigationBar != "")) {
			if (target.parameters.navigationBar(target, nDiv, page, maxPages))
				target.suggBox.appendChild(nDiv);
		} else {
			// predefined nav div
			var l_inactive = (page <= 1);
			var r_inactive = (page >= maxPages);
			nDiv.onmousedown = function (event) {
				mmCancelEvent(event);
				return false;
			}
			nDiv.innerHTML = "<div class='navRow'>" +
			"<a href='#' onmousedown='" + mmGetPageNavig(target, MM_UPDIR) + "'>" +
				"<img valign='absmiddle' border=0 id='navleft' title='Zur�ckbl�ttern (PgUp)' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "leftarrow" + (l_inactive ? "_inactive" : "") + ".png'></a>" +
				"<sup>Seite " + page + " von " + maxPages + "</sup>" +
			"<a href='#' onmousedown='" + mmGetPageNavig(target, MM_DOWNDIR) + "'>" +
				"<img valign='absmiddle' border=0 name='navright' title='Vorbl�ttern (PgDown)' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "rightarrow" + (r_inactive ? "_inactive" : "") + ".png'></a>" +
			"</div>";
			// use different event model in IE
			if (ie) {
				var e = nDiv.firstChild.childNodes[0];
				e.onmousedown = new Function("", mmGetPageNavig(target, MM_UPDIR));
				var e = nDiv.firstChild.childNodes[2];
				e.onmousedown = new Function("", mmGetPageNavig(target, MM_DOWNDIR));
			}
			target.suggBox.appendChild(nDiv);
		}
	}
	if (localize && (typeof target.parameters.rowFunction != "undefined") && (target.parameters.rowFunction != null) && (target.parameters.rowFunction != "")) {
		// prepare field names array
		var field_index = new Array();
		for (j = 0; j < Number(fieldnames.length) ; j++) {
			field_index[fieldnames[j]] = j;
		}
	}
	for (var i = po; i < pe; i++) {
		var rowDiv = target.parameters.document.createElement("div");
		rowDiv.style.width = "100%";
		var leftSpan = target.parameters.document.createElement("span");
		leftSpan.innerHTML = target.parameters.suggBoxLeftFrameHTML();
		rowDiv.appendChild(leftSpan);

		var iDiv = target.parameters.document.createElement("div");
		iDiv.id = "suggRow" + target.mm_refcnt + "_" + i;
		iDiv.className = "suggRow";
		iDiv.style.cursor = "pointer";
		iDiv.style.width = "100%";
		if (target.parameters.normalbg != '')
			iDiv.style.backgroundColor = target.parameters.normalbg;
		if (target.parameters.normalfg != '')
			iDiv.style.color = target.parameters.normalfg;

		var addEvents = true;
		if (localize && (typeof target.parameters.rowFunction != "undefined") && (target.parameters.rowFunction != null) && (target.parameters.rowFunction != "")) {
			addEvents = target.parameters.rowFunction(target, rows, field_index, i, iDiv);
		} else {
			if ((rows[i].length > 1) && !target.parameters.oneColumn)
				iDiv.innerHTML =
					"<span class='suggProduct'>" +
					"<nobr>" +
					replaceHTMLEntities(rows[i][0]) +
					"</nobr>" +
					"</span>" +
					"<span class='suggCat'>" +
					"<nobr>" +
					replaceHTMLEntities(rows[i][1]) +
					"</nobr>" +
					"</span>";
			else
				iDiv.innerHTML =
					"<span class='suggProduct'>" +
					"<nobr>" +
					replaceHTMLEntities(rows[i][0]) +
					"&nbsp;&nbsp;</nobr>" +
					"</span>";
		}
		if (addEvents) {
			iDiv.selectable = true;
			// take different browser event models into account
			// store function in a separate property because it is used elsewhere
			iDiv.mmMouseOver = new Function("evt", "mmMouseEnter(" + target.mm_refcnt + "," + i + ")");
			if (ie) iDiv.onmouseover = iDiv.mmMouseOver;
			if (!ie) iDiv.addEventListener('mouseover', iDiv.mmMouseOver, false);
			iDiv.mmMouseDown = new Function("evt", "mmRedirectClick(" + target.mm_refcnt + ", '" + i + "')");
			if (ie) iDiv.onmousedown = iDiv.mmMouseDown;
			if (!ie) iDiv.addEventListener('mousedown', iDiv.mmMouseDown, false);
		}
		rowDiv.appendChild(iDiv);

		var rightSpan = target.parameters.document.createElement("span");
		rightSpan.innerHTML = target.parameters.suggBoxRightFrameHTML();
		rowDiv.appendChild(rightSpan);

		target.suggBox.appendChild(rowDiv);
	}

	// nav div? (bottom/both)
	if (target.parameters.pageSize > 0 && (target.parameters.navigationPos == "bottom" || target.parameters.navigationPos == "both")) {
		var nDiv = target.parameters.document.createElement("div");
		var page = Math.round(po / target.parameters.pageSize) + 1;
		var maxPages = Math.ceil(Number(rows.length) / Number(target.parameters.pageSize));
		// custom nav div?
		if ((typeof target.parameters.navigationBar != "undefined") && (target.parameters.navigationBar != null) && (target.parameters.navigationBar != "")) {
			if (target.parameters.navigationBar(target, nDiv, page, maxPages))
				target.suggBox.appendChild(nDiv);
		} else {
			// predefined nav div
			var l_inactive = (page <= 1);
			var r_inactive = (page >= maxPages);
			nDiv.onmousedown = function (event) {
				mmCancelEvent(event);
				return false;
			}
			nDiv.innerHTML = "<div class='navRow'>" +
			"<a href='#' onmousedown='" + mmGetPageNavig(target, MM_UPDIR) + "'>" +
				"<img valign='absmiddle' border=0 id='navleft' title='Zur�ckbl�ttern (PgUp)' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "leftarrow" + (l_inactive ? "_inactive" : "") + ".png'></a>" +
				"<sup>Seite " + page + " von " + maxPages + "</sup>" +
			"<a href='#' onmousedown='" + mmGetPageNavig(target, MM_DOWNDIR) + "'>" +
				"<img valign='absmiddle' border=0 name='navright' title='Vorbl�ttern (PgDown)' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "rightarrow" + (r_inactive ? "_inactive" : "") + ".png'></a>" +
			"</div>";
			// use different event model in IE
			if (ie) {
				var e = nDiv.firstChild.childNodes[0];
				e.onmousedown = new Function("", mmGetPageNavig(target, MM_UPDIR));
				var e = nDiv.firstChild.childNodes[2];
				e.onmousedown = new Function("", mmGetPageNavig(target, MM_DOWNDIR));
			}
			target.suggBox.appendChild(nDiv);
		}
	}

	if (((target.parameters.flags & AS_NOLOGO) == AS_NOLOGO) && (typeof target.parameters.footerFunction != "undefined") && (target.parameters.footerFunction != null) && (target.parameters.footerFunction != "")) {
		var iDiv = target.parameters.document.createElement("div");
		var ih = target.parameters.footerFunction(target, iDiv, rows);
		iDiv.innerHTML = ih;
		iDiv.style.width = "100%";
		target.suggBox.appendChild(iDiv);
	}

	// Following code may only be removed or modified if contract regulations permit
	// Der folgende Code darf nur entfernt oder veraendert werden, falls die Vertragsbedingungen es gestatten
	if ((target.parameters.flags & AS_NOLOGO) == 0) {
		var eDiv = target.parameters.document.createElement("div");
		eDiv.style.cursor = "pointer";
		eDiv.mmMouseDown = new Function("", "window.location.href = 'http://www.exorbyte.de';");
		eDiv.innerHTML = "<div class='suggSides'><div align=right style='padding: 0; margin: 0; border-top:thin solid gray; vertical-align: middle;'><nobr><font size=1 style='font-family: Verdana, Arial, Helvetica, Sans-Serif; vertical-align: middle;'>Powered by <img class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + exorbyteLogo + "' style='padding: 0; margin: 0; vertical-align: middle;' align='texttop' alt='www.exorbyte.de'></font></nobr></div></div>";
		if (ie) eDiv.onmousedown = eDiv.mmMouseDown;
		if (!ie) eDiv.addEventListener('mousedown', eDiv.mmMouseDown, false);
		target.suggBox.appendChild(eDiv);
	}
	// Der vorstehende Code darf nur entfernt oder veraendert werden, falls die Vertragsbedingungen es gestatten
	// Previous code may only be removed or modified if contract regulations permit


	// bottom div
	if ((typeof target.parameters.suggBoxBottom != "undefined") && (target.parameters.suggBoxBottom != null) && (target.parameters.suggBoxBottom != "")) {
		var iDiv = target.parameters.document.createElement("div");
		iDiv.style.width = "100%";
		if (target.parameters.suggBoxBottom(iDiv))
			target.suggBox.appendChild(iDiv);
	}
	// highlight first currently visible item
	target.lastHighlightedId = po - 1;

	return 0;
}


/**
 * Method is coming from Server and will be evaluate
 */
function mmSuggestDeliver(target_id, fieldnames, rows, totalSuggCount, coID) {
	if ((target < 0) || (target >= Number(mm_inputs.length))) {
		return 0;
	}

	var target = mm_inputs[target_id];
	if (!target) {
		return 0;
	}

	// deferred creation for IE
	if (ie)
		if (!mmCreateBox(target))
			return 0;
	target.timeout = 0;
	target.coID = coID;
	target.fieldnames = fieldnames;
	target.mmPageOffset = 0;
	if (target.dynamicNotification)
		window.status = "Received data after " + (new Date().getTime() - mm_qtime) + " ms";
	// lost focus in the mean time? special treatment for IE
	if (target.lostFocus && !(ie && target.parameters.debug)) {
		mmHideSuggBox(target);
		return 0;
	}
	// no results?
	if (rows.length == 0) {
		mmHideSuggBox(target);
		if (target.dynamicNotification)
			mmFlash(target.targetIndex, "gray", 3);
		return 0;
	}
	// row index alias generation
	for (var r = 0; r < rows.length; r++) {
		for (var f = 0; f < Number(fieldnames.length) ; f++) {
			var row = rows[r];
			if (f < Number(row.length)) {
				row[fieldnames[f]] = row[f];
			}
		}
	}
	// preprocessing?
	if ((typeof target.parameters.preUserFunction != "undefined") && (target.parameters.preUserFunction != null) && (target.parameters.preUserFunction !== "")) {
		rows = target.parameters.preUserFunction(target, rows);
	}
	if ((typeof target.parameters.preFunction != "undefined") && (target.parameters.preFunction != null) && (target.parameters.preFunction != "")) {
		rows = target.parameters.preFunction(target, rows);
	}

	//Don't get only 1 hit when searching for commodities, where name = symbol of a share or fund
	if (!target.value == "oil" || !target.value == "gold" || !target.value == "lead" || !target.value == "corn" || !target.value == "rice") {
		rows = tryGetSingleRowBySymbol(rows, target.value);
	}

	target.suggCount = rows.length;
	// check for new values, respect compareResults flag
	var identical = (target.rows) && (Number(target.rows.length) == Number(rows.length)) && target.parameters.compareResults;
	if (identical)
		for (var i = 0; i < Number(rows.length) ; i++) {
			if (Number(rows[i].length) != Number(target.rows[i].length))
				identical = false;
			if (!identical) break;
			for (var j = 0; j < Number(rows[i].length) ; j++)
				if (rows[i][j] != target.rows[i][j]) {
					identical = false;
					break;
				}
		}
	var insert_input = (target.parameters.flags & AS_DISPLAY_INPUT) == AS_DISPLAY_INPUT;
	var has_header = (typeof target.parameters.headerFunction != "undefined") && (target.parameters.headerFunction != null) && (target.parameters.headerFunction != "");
	// display only under following conditions
	if (!identical || insert_input || has_header || (target.parameters.pageSize > 0)) {
		if (insert_input) {
			rows.unshift(new Array(target.value, target.parameters.inputTitle));
		}
		target.rows = rows;
		target.suggCount = Number(rows.length);
		mmFillDiv(target, rows);
	}
	mmShowSuggBox(target);
	return 0;
}

/**
 * if searchTerm equals Symbol, then return single row. => https://vpnportal.finanzennet.de:8444/browse/FINUS-325
 * @param {Array} rows - Resultset from server.
 * @param {string} searchTerm - typed in input field by user.
 */
function tryGetSingleRowBySymbol(rows, searchTerm) {
	if (!searchTerm || searchTerm == "") {
		return rows;
	}
	try {
		for (var i = 0; i < rows.length; i++) {
			var node = rows[i][2];
			if (node == null || node.row == null) {
				continue;
			}
			if (node.row[2] !== "") {
				var split = node.row[2].split("|");
				var identifier = split[0] !== "" && (node.row[1] === "Stocks" || node.row[1] === "Funds")
					? split[0]
					: split[1];
				if (identifier === searchTerm.toUpperCase()) {
					var result = [];
					for (var y = 0; y < rows.length; y++) {
						if (rows[y][0] === node.row[1]) {
							result.push(rows[y]);
						}
					}
					result.push(rows[i]);
					return result;
				}
			}
		}
	} catch (e) {
		return rows;
	}
	return rows;
}

function mmCallSearch(target, delay) {
	// target has focus
	target.lostFocus = false;
	if (target.timeout != 0)
		window.clearTimeout(target.timeout);
	target.timeout = setTimeout("mmDoSearch(" + target.mm_refcnt + ")", delay);

	return 0;
}

function mmQReplace(url, target) {
	var v = target.value;
	// replace url parameters
	var turl = "";
	var inPar = false;
	var par = "";
	for (var i = 0; i < Number(url.length) ; i++) {
		// in parameter?
		if (inPar) {
			// end of parameter?
			if (url.charAt(i) == '$') {
				// lookahead = 1
				if ((i < url.length - 1) && (url.charAt(i + 1) == '$')) {
					i++;
					turl += '$';
				} else {
					// evaluate parameter
					if (par != "") {
						// use input value?
						if (par == 'v') {
							turl += BasicReplace(escape(v));
							inPar = false;
						} else {
							// evaluate parameter
							var pv = escape(eval(par));
							turl += pv;
							inPar = false;
						}
					}
				}
			} else
				// still in parameter
				par += url.charAt(i);
		} else
			// out of parameter
			if (url.charAt(i) == '$') {
				// lookahead = 1
				if ((i < Number(url.length) - 1) && (url.charAt(i + 1) == '$')) {
					i++;
					turl += '$';
				} else {
					// start parameter
					par = "";
					inPar = true;
				}
			} else
				turl += url.charAt(i);
	}
	return turl;
}

function mmDoSearch(target_id, direct) {
	var target = mm_inputs[target_id];
	target.timeout = 0;
	// lost focus in the mean time?
	if (target.lostFocus) {
		return 0;
	}
	if (Number(target.value.length) < Number(target.parameters.letterLimit)) {
		mmHideSuggBox(target);
		return 0;
	}
	mmDoSuggest(target_id, direct);

	return 0;
}

function callInProgress(xmlhttp) {
	switch (xmlhttp.readyState) {
		case 1, 2, 3:
			return true;
			break;

			// Case 4 and 0
		default:
			return false;
			break;
	}
}

function mmDoSuggest(target_id, direct) {
	try {
		var target = mm_inputs[target_id];
		if (!target.xmlhttp) return 0;
		if (!target.parameters.beforeRequest(target)) {
			return 0;
		}
		// search running right now?
		if (callInProgress(target.xmlhttp)) {
			// cancel current search
			target.xmlhttp.onreadystatechange = function () { };		// IE bug workaround
			target.xmlhttp.abort();
			target.xmlhttp = mmGetXMLHTTP();  // Get a new xmlhttp object
		}
		var url = target.parameters.requestURL;
		url = mmQReplace(url, target) + "&target_id=" + target_id +
			// bypass caching when clickout tracking is on
			(target.parameters.clickout || target.parameters.nocache ? "&hash=" + Math.random() : "");
		if (direct) {
			target.parameters.document.location.href = url;
		} else {
			target.xmlhttp.open("GET", url, true);
			target.xmlhttp.onreadystatechange = target.async_fn;
			if (target.parameters.debug) {
				alert("Sending request: " + url);
			}
			if (!callInProgress(target.xmlhttp)) {
				target.xmlhttp.send(null);
				mm_qtime = new Date().getTime();
			}
		}
	} catch (E) {
		if (target.parameters.debug) {
			alert("URL processing interrupted: " + E);
		}
	}

	return 0;
}

function mmNotifyError(target) {
	if (target.dynamicNotification) {
		mmFlash(target.targetIndex, "red", 3);
	}

	return 0;
}

function mmOverlapsObject(target, obj) {
	if (!obj) return false;
	var result = false;
	var l = mmGetParentProps(target.suggBox, "offsetLeft");
	var t = mmGetParentProps(target.suggBox, "offsetTop");
	var r = l + Number(target.suggBox.offsetWidth);
	var b = t + Number(target.suggBox.offsetHeight);
	var ol = mmGetParentProps(obj, "offsetLeft");
	var ot = mmGetParentProps(obj, "offsetTop");
	var or = ol + Number(obj.offsetWidth);
	var ob = ot + Number(obj.offsetHeight);
	if (ol <= l) {
		if (ot <= t)
			result = (ob > t) && (or > l);
		else
			result = (ot <= b) && (or > l);
	} else if (ol <= r) {
		if (ot <= t)
			result = (ob > t);
		else
			result = (ot <= b);
	}
	return result;
}

function mmShowSuggBox(target) {
	if (!target.suggBox) {
		return 0;
	}
	//var arrow = document.getElementById("suggest-arrow");
	target.suggBox.style.visibility = "visible";
	//arrow.style.display = "block";
	mmIgnoreFirstMouseEnter = firefox;
	target.suggVisible = true;
	if ((target.parameters.overlappedObjects != null) & ieZIndexBug) {
		for (var i = 0; i < Number(target.parameters.overlappedObjects.length) ; i++) {
			if (mmOverlapsObject(target, target.parameters.overlappedObjects[i])) {
				target.parameters.overlappedObjects[i].style.visibility = "hidden";
				arrow.style.display = "none";
			} else {
				target.parameters.overlappedObjects[i].style.visibility = "visible";
				arrow.style.display = "block";
			}
		}
	}

	return 0;
}

function mmHideSuggBox(target) {
    target.suggVisible = false;
    if (!target.suggBox) return 0;
    target.suggBox.style.visibility = "hidden";
    if ((target.parameters.overlappedObjects != null) & ieZIndexBug) {
        for (var i = 0; i < Number(target.parameters.overlappedObjects.length); i++)
            if (target.parameters.overlappedObjects[i])
                target.parameters.overlappedObjects[i].style.visibility = "visible";
    }

    return 0;
}

function mmOnResize() {
	for (i = 0; i < Number(mm_inputs.length) ; i++) {
		mmSetDivSize(mm_inputs[i]);
	}

	return 0;
}

function mmCreateBox(input, container) {
	if (input.created) {
		return true;
	}

	// return false if target document not yet loaded (only ie)
	if (ie && (input.parameters.document.readyState != "complete")) {
		return false;
	}

	input.suggBox = input.parameters.document.getElementsByClassName(container)[0];
	mmSetDivSize(input);
	input.created = true;
	return true;
}

/** Returns true if setup is successful */
function SetupMMSuggest(input, args) {
	// Internet Explorer 5.0 and below can't handle MMSuggest code
	if (ie && (parseInt(ieVersion) <= 5.0)) return 0;
	try {
		// create parameter container
		input.parameters = new mmSuggestParams();
		for (var i in args) {
			if (typeof input.parameters[i] != "undefined") {
				input.parameters[i] = args[i];
			} else {
				// parameter specification error
				alert("SetupMMSuggest parameter undefined: " + i + "=" + args[i]);
			}
		}
		input.suggBox = null;			// suggestion box (DIV)
		input.suggVisible = false;
		input.xmlhttp = null;
		input.lastHighlightedId = -1;
		input.suggCount = -1;
		input.dynamicNotification = false;
		input.timeout = 0;

		input.xmlhttp = mmGetXMLHTTP();
		if (!input.xmlhttp) {
			return false;
		}

		// setup input field	
		input.autocomplete = "off";
		input.setAttribute("autocomplete", "off");
		input.oldBlur = input.onblur;
		input.onblur = mmDoBlur;
		input.oldFocus = input.onfocus;
		input.onfocus = mmDoFocus;
		input.onkeyup = mmDoFieldKeyDown;

		// remember input field
		mm_inputs.push(input);
		input.targetIndex = mm_inputs.length - 1;
		// setup state change fn
		var fn = function () {
			if (input.xmlhttp.readyState == 4)
				if (input.xmlhttp.responseText.charAt(0) == "<") {
					if (input.parameters.debug) {
						alert("Error: Received XML or HTML reply");
					}
				} else {
					try {
						if (input.parameters.debug) {
							alert("Received response: " + input.xmlhttp.responseText);
						}
						eval(input.xmlhttp.responseText);
						return 0;
					} catch (e) {
						if (input.parameters.debug) {
							alert('Error executing the response: ' + e);
						}
					}
					// try to fix possible quotation mistakes
					var txt = input.xmlhttp.responseText.replace(/\'/g, "\\\\'");
					try {
						eval(txt);
					} catch (e) {
						if (input.parameters.debug) {
							alert('Error executing the response: ' + e);
						}
						mmNotifyError(input);
						mmHideSuggBox(input);
					}
				}
		};

		input.async_fn = fn;
		input.xmlhttp.onreadystatechange = input.async_fn;

		input.mm_refcnt = mm_refcnt;
		mm_refcnt++;

		// deferred creation only for Internet Explorer
		if (ie)
			input.created = false;
		else
			mmCreateBox(input, args.suggestBoxResultContainer);

		// hierarchical setup?
		if ((input.parameters.flags & AS_HIERARCHICAL) === AS_HIERARCHICAL) {
			if ((typeof MMNode == "undefined") ||
				(typeof mmHierarchicalPreFunction == "undefined"))
				throw "AS_HIERARCHICAL has been specified, but:\nCannot use hierarchical functions - please include modules mmnode.js and mmhierarchical.js";
			input.parameters.preFunction = mmHierarchicalPreFunction;
			input.parameters.rowFunction = mmHierarchicalRowFunction;
			input.parameters.oldOnActivate = input.parameters.onActivate;
			input.parameters.onActivate = mmOnActivate;
			if (input.parameters.debug) {
				alert("Hierarchical functions prepared for component " + input.name);
			}
		}

		// grouped setup?
		if (((input.parameters.flags & AS_GROUPED) == AS_GROUPED) || ((input.parameters.flags & AS_GROUPED_DISPLAYCAT) == AS_GROUPED_DISPLAYCAT)) {
			if ((typeof MMNode == "undefined") ||
				(typeof mmGroupedPreFunction == "undefined"))
				throw "AS_GROUPED or AS_GROUPED_DISPLAYCAT has been specified, but:\nCannot use grouped functions - please include modules mmnode.js and mmgrouped.js";
			input.parameters.preFunction = mmGroupedPreFunction;
			if ((typeof input.parameters.groupedRowFunction != "undefined") && (input.parameters.groupedRowFunction != null) && (input.parameters.groupedRowFunction != "")) {
				input.parameters.rowFunction = input.parameters.groupedRowFunction;
			} else {
				input.parameters.rowFunction = mmGroupedRowFunction;
			}
			input.parameters.oldOnActivate = input.parameters.onActivate;
			input.parameters.onActivate = mmGroupedOnActivate;
			if (input.parameters.debug) {
				alert("Grouped functions prepared for component " + input.name);
			}
			// switch to one/two column mode depending on group type
			if ((input.parameters.flags & AS_GROUPED_DISPLAYCAT) == AS_GROUPED_DISPLAYCAT)
				input.parameters.oneColumn = false;
			else
				input.parameters.oneColumn = true;
		}

		window.oldResize = window.onresize;
		window.onresize = mmOnResize;

		// suggest function for direct calls
		input.suggest = function () {
			window.setTimeout(function () {
				input.focus();
				input.lostFocus = false;
				mmDoSuggest(input.mm_refcnt, false);
			}, 50)
		};

		// preload images for paged view?
		if (input.parameters.pageSize > 0) {
			var i1 = new Image();
			i1.src = input.parameters.iconPath + "leftarrow.png";
			var i2 = new Image();
			i2.src = input.parameters.iconPath + "leftarrow_inactive.png";
			var i3 = new Image();
			i3.src = input.parameters.iconPath + "rightarrow.png";
			var i4 = new Image();
			i4.src = input.parameters.iconPath + "rightarrow_inactive.png";
		}

		if (input.parameters.debug) {
			alert("Setup successful for MMSuggest on component " + input.name);
		}

		return true;

	} catch (e) {
		alert("MMSuggest Error:\n" + e);
		return false;
	}

	return true;
}

// provided for backwards compatibility
function SetupAutoSuggest(input, args) {
	return SetupMMSuggest(input, args);
}

//function to switch the suggest functionality on/off
function enableAutosuggest(target) {
	if (target.onkeydown == null) {
		target.onkeydown = mmDoFieldKeyDown;
		return true;
	} else {
		target.onkeydown = null;
		return false;
	}
}

function BasicReplace(text) {
	text = text.replace('+', '%2B');
	text = text.replace('%FC', 'ue');//ü
	text = text.replace('%E4', 'ae');//ä
	text = text.replace('%F6', 'oe');//ö
	text = text.replace('%DC', 'Ue');//Ü
	text = text.replace('%C4', 'Ae');//Ä
	text = text.replace('%D6', 'Oe');//Ö
	text = text.replace('ß', 'ss');
	return text;
}
// mmnode.js: Support class for MMSuggest.
// Copyright exorbyte GmbH, 2005, 2006. All rights reserved.
// Author: Leo Meyer, leo.meyer_at_exorbyte.com
// Version: 4.7, 8.11.06
//
// Veraenderungen an diesem Code sind nur mit ausdruecklicher Zustimmung der 
// exorbyte GmbH gestattet.
// Modification of this code only with explicit permission by exorbyte GmbH.


String.prototype.startsWithWord = function (str) {
	if (str == "") return true;
	var a = this.toLowerCase().startsWith(str.toLowerCase());
	var b = this.charAt(str.length).match(/\W/) != null;
	return a && b;
}

function MMNode(value, cat, label) {

	this.value = value;
	this.label = label;
	this.cat = cat;
	this.level = 0;
	this.children = new Array();
	this.parent = null;
	this.row = null;

	this.sink = function (node) {
		// disallow duplicates
		if (node.value == this.value)
			return true;
		// node is a child of this node if node's value starts with this node's value
		// and there should remain more than three characters
		if (node.value.startsWithWord(this.value) && (node.value.length - this.value.length > 3)) {
			// test children
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].sink(node))
					return true;
			}
			// no child sinks the node
			// sink it here
			this.children.push(node);
			node.label = (this.level >= 1 ? "... " : "") + node.value.substr(this.value.length);
			node.level = this.level + 1;
			node.parent = this;
			return true;
		}
	}

	this.group = function (node, catRest) {
		if (typeof catRest == 'undefined') catRest = node.cat;
		//		alert("group: node = " + node.value + ", catRest = " + catRest);
		// last category level?
		if (catRest == "") {
			this.addChild(node);
			node.cat = catRest;
			return true;
		}
		var cats = catRest.split("|");
		var cat = cats[0];
		// go through children
		for (var i = 0; i < this.children.length; i++) {
			// category equal?
			if (this.children[i].label == cat) {
				cats.shift();
				this.children[i].group(node, cats.join("|"));
				return true;
			}
		}
		// no child found, add category node
		var cnode = new MMNode((this.value != "" ? this.value + "|" : "") + cat, "", cat);
		this.addChild(cnode);
		cats.shift();
		return cnode.group(node, cats.join("|"));
	}

	this.groupDisplayCat = function (node, catRest) {
		if (typeof catRest == 'undefined') catRest = node.cat;
		//		alert("group: node = " + node.value + ", catRest = " + catRest);
		var cats = catRest.split("|");
		// last category level?
		if (cats.length == 1) {
			this.addChild(node);
			node.cat = catRest;
			return true;
		}
		var cat = cats[0];
		// go through children
		for (var i = 0; i < this.children.length; i++) {
			// category equal?
			if (this.children[i].label == cat) {
				cats.shift();
				this.children[i].groupDisplayCat(node, cats.join("|"));
				return true;
			}
		}
		// no child found, add category node
		var cnode = new MMNode((this.value != "" ? this.value + "|" : "") + cat, "", cat);
		this.addChild(cnode);
		cats.shift();
		return cnode.groupDisplayCat(node, cats.join("|"));
	}

	this.dump = function (indent) {
		if (typeof indent == 'undefined') indent = "";
		var result = indent + this.label + " (" + this.value + ", " + this.cat + ")\n";
		for (var i = 0; i < this.children.length; i++) {
			result += this.children[i].dump(indent + "+-") + "\n";
		}
		return result;
	}

	this.getAsArray = function (arr, cutStr) {
		if (this.value == "") this.value = this.label;
		if (typeof this.label == 'undefined') this.label = this.value;
		if ((typeof cutStr != 'undefined') && (this.label != cutStr) && this.label.startsWith(cutStr))
			this.label = this.label.substr(cutStr.length);
		arr.push(new Array(label, this.cat, this));
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].getAsArray(arr, this.label);
		}
	}

	this.addChild = function (node) {
		this.children.push(node);
		node.parent = this;
		node.level = this.level + 1;
	}


	this.isLastChild = function () {
		if (this.parent == null) return true;
		return (this == this.parent.children[this.parent.children.length - 1]);
	}

	this.levelUp = function () {
		this.level--;
		// correct levels of children
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].levelUp();
		}
	}

	this.contract = function () {

		// contract children
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].contract();
		}
		if (this.parent == null) return;
		// does this node have only one child?
		if (this.children.length == 1) {
			// yes - contract the child
			var node = this.children[0];
			this.value = node.value;
			this.label = this.label + " " + node.label;
			this.cat = node.cat;
			this.children = node.children;
			// correct levels recursively
			for (var i = 0; i < this.children.length; i++) {
				this.children[i].parent = this;
				this.children[i].levelUp();
			}
		}
	}
}

// mmgrouped.js
function mmGroupedPreFunction(target, rows) {
	try {
		// store original rows
		target.originalRows = rows;
		// generate tree
		var root = new MMNode("", "", target.value);
		var sRows = rows;
		for (var z = 0; z < sRows.length; z++) {
			var node = new MMNode(sRows[z][0], sRows[z][1], sRows[z][0]);
			node.row = sRows[z];
			if ((target.parameters.flags & AS_GROUPED) == AS_GROUPED)
				root.group(node);
			else
				if ((target.parameters.flags & AS_GROUPED_DISPLAYCAT) == AS_GROUPED_DISPLAYCAT)
					root.groupDisplayCat(node);
		}
		var result = new Array();
		// don't display root node?
		if ((target.parameters.flags & AS_NO_ROOT) == AS_NO_ROOT) {
			root.levelUp();
			for (var i = 0; i < root.children.length; i++) {
				root.children[i].parent = null;
			}
			root.getAsArray(result);
			result.shift();
		} else {
			root.getAsArray(result);
		}
		return result;

	} catch (E) {
		if (target.parameters.debug)
			alert("groupedPreFunction error: " + E);
	}

	return 0;
}

function mmGroupedRowFunction(target, rowArray, field_index, row, iDiv) {
	try {
		var node = rowArray[row][2];
		var value = node.label;
		var cat = node.cat;
		var icon = target.parameters.iconPath + "ordner.gif";
		var ph = "";
		if (node.children.length == 0) {
			if (node.isLastChild())
				icon = target.parameters.iconPath + "lastchild.gif";
			else
				icon = target.parameters.iconPath + "child.gif";
		} else if (node.parent != null) {
			if (node.isLastChild())
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "lastchild.gif'>";
			else
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "child.gif'>";
		}
		// insert placeholders depending on the node's level
		var parent = node;
		for (var i = node.level - 1; i > 0; i--) {
			parent = parent.parent;
			if (parent.isLastChild()) {
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "platzhalter.gif'>" + ph;
			} else {
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "line.gif'>" + ph;
			}
		}
		var result = true;
		// one displayed column?
		if (target.parameters.oneColumn) {
			if (node.children.length > 0) {
				icon = target.parameters.iconPath + "ordner.gif";
				var ih = "<span class='suggGroupCaption'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
							replaceHTMLEntities(rowArray[row][0]) +
							"&nbsp;&nbsp;</nobr></span>";
				// determine whether events on these rows
				result = (target.parameters.flags & AS_GENERATED_CATEGORIES_NOT_SELECTABLE) != AS_GENERATED_CATEGORIES_NOT_SELECTABLE;
			} else {
			    var ih = "<span class='suggGroupProductOnly'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
							replaceHTMLEntities(rowArray[row][0]) +
							"&nbsp;&nbsp;</nobr></span>";
			}
		} else {
			// two displayed columns
			if (node.children.length > 0) {
				icon = target.parameters.iconPath + "ordner.gif";
				var ih = "<span class='suggGroupCaption'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
							replaceHTMLEntities(rowArray[row][0]) +
							"&nbsp;&nbsp;</nobr></span><span class='suggGroupCat'><nobr>" +
							replaceHTMLEntities(cat) +
							"&nbsp;&nbsp;</nobr></span>";
				// determine whether events on these rows
				result = (target.parameters.flags & AS_GENERATED_CATEGORIES_NOT_SELECTABLE) != AS_GENERATED_CATEGORIES_NOT_SELECTABLE;
			} else {
			    var ih = "<span class='suggGroupProduct'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
							replaceHTMLEntities(rowArray[row][0]) +
							"&nbsp;&nbsp;</nobr></span><span class='suggGroupCat'><nobr>" +
							replaceHTMLEntities(cat) +
							"&nbsp;&nbsp;</nobr></span>";
			}
		}
		iDiv.innerHTML = ih;
		return result;
	} catch (E) {
		if (target.parameters.debug)
			alert("mmGroupedRowFunction error: " + E);
	}

	return 0;
}

function mmGroupedOnActivate(input, row) {
	var node = row[2];
	var realRow = node.row;
	if ((typeof target.parameters.oldOnActivate != "undefined") && (target.parameters.oldOnActivate != null) && (target.parameters.oldOnActivate != "")) {
		// generated node?
		if (realRow == null) {
			// build realRow on the fly
			realRow = new Array(node.value);
			realRow[input.fieldnames[0]] = node.value;
			// append enough columns to make it look like an original row
			// generate row index aliases
			for (var i = 1; i < input.fieldnames.length; i++) {
				realRow.push("");
				realRow[input.fieldnames[i]] = "";
			}
		}
		if (target.parameters.oldOnActivate(target, realRow))
			mmSubmitString(target, realRow[target.parameters.valueField]);
	} else {
		// standard behaviour
		var value = node.value;
		if (node.children.length > 0) {
			input.value = value;
			setTimeout(function () {
				input.focus();
				input.suggest();
			}, 50);
		} else {
			mmSubmitString(target, realRow[target.parameters.valueField]);
		}
	}
	// don't submit
	return false;
}

// mmHierarchical.js
function mmHierarchicalPreFunction(target, rows) {
	try {
		// store original rows
		target.originalRows = rows;
		// compound detection
		var sRows = rows;
		// duplicate last row
		sRows.push(sRows[sRows.length - 1]);
		// prefix detection
		var prevcount = new Array();
		var prevparts = new Array();
		var cands = new Array();
		for (var z = 0; z < sRows.length; z++) {
			var v = sRows[z][0].replace(/^\s+/, "").replace(/\s+$/, "");
			var parts = v.split(" ");
			// extend prevcount list
			while (prevcount.length < parts.length) {
				prevcount.push(0);
				prevparts.push("");
			}
			// calculate count
			var count = new Array();
			var valuechanged = false;
			for (var i = 0; i < parts.length; i++) {
				if (!valuechanged) {
					if (prevparts[i] == parts[i]) {
						count.push(prevcount[i] + 1);
					} else {
						count.push(1)
						valuechanged = true;
					}
				} else {
					count.push(1);
				}
			}
			// pad count with zeroes up to the length of prevcount
			while (count.length < prevcount.length) {
				count.push(1);
			}
			for (i = count.length - 1; i >= 0; i--) {
				var pi = prevcount[i];
				if (pi >= 2) {
					var cand = prevparts.slice(0, i + 1).join(" ");
					cands.push(cand);
				}
			}
			prevparts = parts;
			prevcount = count;
		}
		//		alert("detected " + cands.length + " compound candidates");
		// sort cands by length
		cands = cands.sort(sortLengthShorter);
		// generate tree
		var root = new MMNode("", target.parameters.hierarchicalSearchTermIndicator, target.value);
		var sRows = rows;
		// pre-populate with matching compounds
		for (var j = 0; j < cands.length; j++) {
			var newNode = new MMNode(cands[j], target.parameters.hierarchicalSearchTermIndicator);
			newNode.row = new Array(cands[j]);
			for (var v = 1; v < target.fieldnames.length; v++) {
				newNode.row.push("");
				newNode.row[target.fieldnames[v]] = "";
			}
			root.sink(newNode);
		}
		// populate with rows
		for (var z = 0; z < sRows.length; z++) {
			var node = new MMNode(sRows[z][0], sRows[z][1], sRows[z][0]);
			node.row = sRows[z];
			root.sink(node);
		}
		var result = new Array();
		// contract
		root.contract();
		// don't display root node?
		if ((target.parameters.flags & AS_NO_ROOT) == AS_NO_ROOT) {
			root.levelUp();
			for (var i = 0; i < root.children.length; i++) {
				root.children[i].parent = null;
			}
			root.getAsArray(result);
			result.shift();
		} else {
			root.getAsArray(result);
		}
		return result;

	} catch (E) {
		if (target.parameters.debug)
			alert("hierarchicalPreFunction error: " + E);
	}

	return 0;
}

function mmHierarchicalRowFunction(target, rowArray, field_index, row, iDiv) {
	try {
		var node = rowArray[row][2];
		var value = node.label;
		var cat = node.cat;
		//		alert(cat);
		var icon = target.parameters.iconPath + "ordner.gif";
		var ph = "";
		if (node.children.length == 0) {
			if (node.isLastChild())
				icon = target.parameters.iconPath + "lastchild.gif";
			else
				icon = target.parameters.iconPath + "child.gif";
		} else if (node.parent != null) {
			if (node.isLastChild())
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "lastchild.gif'>";
			else
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "child.gif'>";
		}
		// insert placeholders depending on the node's level
		var parent = node;
		for (var i = node.level - 1; i > 0; i--) {
			//			alert(node.value + " " + i);
			parent = parent.parent;
			if (parent.isLastChild()) {
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "platzhalter.gif'>" + ph;
			}
			else {
			    ph = "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + target.parameters.iconPath + "line.gif'>" + ph;
			}
		}
		var result = true;
		// one displayed column?
		if (target.parameters.oneColumn) {
			if (cat == target.parameters.hierarchicalSearchTermIndicator) {
				icon = target.parameters.iconPath + "ordner.gif";
				var ih = "<span class='suggHierarchicalProduct'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
						replaceHTMLEntities(value.replace(/,$/, "...")) +
						"&nbsp;&nbsp;</nobr></span>";
				// determine whether events on these rows
				result = (target.parameters.flags & AS_GENERATED_CATEGORIES_NOT_SELECTABLE) != AS_GENERATED_CATEGORIES_NOT_SELECTABLE;
			} else {
			    var ih = "<span class='suggHierarchicalProduct'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
						"<a href='javascript:'>" + replaceHTMLEntities(value.replace(/<.*>/, "")) + "</a>" +
						"&nbsp;&nbsp;</nobr></span>";
			}
		} else {
			// two displayed columns
			if (cat == target.parameters.hierarchicalSearchTermIndicator) {
				icon = target.parameters.iconPath + "ordner.gif";
				var ih = "<span class='suggHierarchicalProduct' title='" +
						replaceHTMLEntities((node.row ? node.row[0] : node.value)) +
						"'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
						replaceHTMLEntities(value.replace(/,$/, "...")) +
						"&nbsp;&nbsp;</nobr></span><span class='suggHierarchicalCat'><nobr>" +
						replaceHTMLEntities(cat) +
						"&nbsp;&nbsp;</nobr></span>";
				// determine whether events on these rows
				result = (target.parameters.flags & AS_GENERATED_CATEGORIES_NOT_SELECTABLE) != AS_GENERATED_CATEGORIES_NOT_SELECTABLE;
			} else {
				var ih = "<span class='suggHierarchicalProduct' title='" +
						replaceHTMLEntities((node.row ? node.row[0] : node.value)) +
						"'><nobr>" + ph + "<img align='middle' class=\"lazy\" src=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" data-original='" + icon + "'>" +
						"<a href='javascript:'>" + replaceHTMLEntities(value.replace(/<.*>/, "")) + "</a>" +
						"&nbsp;&nbsp;</nobr></span><span class='suggHierarchicalCat'><nobr>" +
						replaceHTMLEntities(cat) +
						"&nbsp;&nbsp;</nobr></span>";
			}
		}
		iDiv.innerHTML = ih;
		return result;
	} catch (E) {
		if (target.parameters.debug)
			alert("hierarchicalRowFunction error: " + E);
	}

	return 0;
}

function mmHierarchicalOnActivate(input, row) {
	var node = row[2];
	var realRow = node.row;
	if ((typeof target.parameters.oldOnActivate != "undefined") && (target.parameters.oldOnActivate != null) && (target.parameters.oldOnActivate != "")) {
		// generated node?
		if (realRow == null) {
			// build realRow on the fly
			realRow = new Array(node.value);
			realRow[input.fieldnames[0]] = node.value;
			// append enough columns to make it look like an original row
			// generate row index aliases
			for (var i = 1; i < input.fieldnames.length; i++) {
				realRow.push("");
				realRow[input.fieldnames[i]] = "";
			}
		}
		if (target.parameters.oldOnActivate(target, realRow))
			mmSubmitString(target, realRow[target.parameters.valueField]);
	} else {
		// standard behaviour
		var value = node.value;
		if (node.cat == target.parameters.hierarchicalSearchTermIndicator) {
			input.value = value;
			setTimeout(function () {
				input.focus();
				input.suggest();
			}, 50);
		} else {
			mmSubmitString(target, realRow[target.parameters.valueField]);
		}
	}
	// don't submit
	return false;
}