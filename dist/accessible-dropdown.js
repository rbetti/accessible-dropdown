(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyboard = exports.getSettings = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Default settings
var defaultSettings = {
  navName: "nav-main",
  uuidPrefix: 'accessible-dropdown',
  // default uuidPrefix to be added
  hasChildrenClass: 'hasChildren',
  topNavItemClass: '__li-level1',
  // default css class for a top-level navigation item in the menu
  subNavItemClass: '.subnav',
  // default css class for a submenu
  hoverClass: 'hover',
  // default css class for the hover state
  focusClass: 'focus',
  // default css class for the focus state
  openClass: 'open' // default css class for the open state

};

var getSettings = function getSettings(customSettings) {
  return _objectSpread({}, defaultSettings, {}, customSettings);
};

exports.getSettings = getSettings;
var keyboard = {
  BACKSPACE: 8,
  COMMA: 188,
  DELETE: 46,
  DOWN: 40,
  END: 35,
  ENTER: 13,
  ESCAPE: 27,
  HOME: 36,
  LEFT: 37,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PERIOD: 190,
  RIGHT: 39,
  SPACE: 32,
  TAB: 9,
  UP: 38
};
exports.keyboard = keyboard;

},{}],2:[function(require,module,exports){
"use strict";

var _accessibleDropdown = require("./accessible-dropdown.defaults");

var _utils = _interopRequireDefault(require("./utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uuid = 0,
    //mouseTimeoutID = null,
focusTimeoutID = null;

var AccessibleDropdown = function AccessibleDropdown(element, opts) {
  _classCallCheck(this, AccessibleDropdown);

  var self = this;
  self.settings = (0, _accessibleDropdown.getSettings)(opts);

  if (typeof element === 'string') {
    self.element = document.querySelector(element);
  } else {
    if (typeof element.length !== 'undefined' && element.length > 0) {
      self.element = element[0];
    } else {
      self.element = element;
    }
  }

  self.init();
};

AccessibleDropdown.prototype = {
  init: function init() {
    var self = this;
    self.menu = self.element.querySelectorAll('ul')[0]; // selects the first UL item inside the nav element
    // Add ARIA role attribute if main element is not a NAV

    if (self.element.tagName !== 'NAV') self.element.setAttribute('role', 'navigation');
    self.focusable = self.menu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    var navItemsWithChildren = self.menu.querySelectorAll(".".concat(self.settings.hasChildrenClass));
    navItemsWithChildren && Array.from(navItemsWithChildren).forEach(function (item) {
      var link = item.querySelector(':scope > a'),
          subnav = item.querySelector(self.settings.subNavItemClass);
      self.addUniqueId(link);
      self.addUniqueId(subnav);

      _utils["default"].setAttributes(link, {
        'aria-haspopup': true,
        'aria-controls': subnav.id,
        'aria-expanded': false,
        'tabindex': 0
      });

      _utils["default"].setAttributes(subnav, {
        'aria-hidden': true,
        'aria-labelledby': link.id
      });
    }); // Add listeners

    self.onFocusinListener = self.onFocusin.bind(self);
    self.onFocusoutListener = self.onFocusout.bind(self);
    self.onKeydownListener = self.onKeydown.bind(self);
    self.menu.addEventListener('focusin', self.onFocusinListener);
    self.menu.addEventListener('focusout', self.onFocusoutListener);
    self.menu.addEventListener('keydown', self.onKeydownListener);
  },
  onMouseover: function onMouseover(e) {
    var self = this;
    var target = e.target.tagName == 'LI' ? e.target : e.target.closest('li');
    if (!target) return false;
    target.classList.add(self.settings.hoverClass);
  },
  onMouseout: function onMouseout(e) {
    var self = this;
    var target = e.target.tagName == 'LI' ? e.target : e.target.closest('li');
    if (!target) return false;
    target.classList.remove(self.settings.hoverClass);
  },
  onFocusin: function onFocusin(e) {
    var self = this;
    clearTimeout(focusTimeoutID);
    var target = e.target,
        parent = target.closest('li');
    parent.classList.add(self.settings.focusClass);
    self.toggleSubnav(e, target);
  },
  onFocusout: function onFocusout(e) {
    var self = this;
    var target = e.target,
        parent = target.closest('li');
    parent.classList.remove(self.settings.focusClass);
    focusTimeoutID = setTimeout(function () {
      self.toggleSubnav(e, target, true);
    }, 250);
  },
  onKeydown: function onKeydown(e) {
    var self = this,
        target = e.target,
        parent = target.closest('li'),
        isTopNavItem = parent.classList.contains(self.settings.navName + self.settings.topNavItemClass),
        topNavItem = target.closest('.' + self.settings.navName + self.settings.topNavItemClass),
        tabbables = Array.from(self.focusable).filter(function (item) {
      return getComputedStyle(item).visibility === 'visible';
    }),
        keycode = e.keyCode || e.which,
        i = 0;

    switch (keycode) {
      case _accessibleDropdown.keyboard.DOWN:
        e.preventDefault();

        var _target;

        if (parent.classList.contains(self.settings.hasChildrenClass) && isTopNavItem) {
          self.toggleSubnav(e, e.target); //let subnav = parent.querySelector(`.${self.settings.navName}${self.settings.subNavItemClass}`);

          var subnav = parent.querySelector(self.settings.subNavItemClass);
          subnav.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')[0].focus();
        } else if (parent.nextElementSibling) {
          _target = parent.nextElementSibling.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')[0];

          _target.focus();

          self.toggleSubnav(e, _target);
        } else if (topNavItem.nextElementSibling) {
          for (i = 0; i < tabbables.length; i++) {
            if (tabbables[i] == target) {
              _target = tabbables[i + 1];
              break;
            }
          }

          _target.focus();

          self.toggleSubnav(e, _target);
        }

        break;

      case _accessibleDropdown.keyboard.UP:
        e.preventDefault();

        for (i = 0; i < tabbables.length; i++) {
          if (tabbables[i] == target) {
            var previous = tabbables[i - 1];
            break;
          }
        }

        if (!previous) return false;
        previous.focus();
        self.toggleSubnav(e, previous);
        break;

      case _accessibleDropdown.keyboard.RIGHT:
        e.preventDefault();

        if (isTopNavItem) {
          if (!parent.nextElementSibling) return false;
          _target = parent.nextElementSibling.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')[0];
        } else {
          for (i = 0; i < tabbables.length; i++) {
            if (tabbables[i] == target) {
              _target = tabbables[i + 1];
              break;
            }
          }
        }

        _target.focus();

        self.toggleSubnav(e, _target);
        break;

      case _accessibleDropdown.keyboard.LEFT:
        e.preventDefault();

        if (isTopNavItem) {
          if (!parent.previousElementSibling) return false;
          _target = parent.previousElementSibling.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')[0];
        } else {
          for (i = 0; i < tabbables.length; i++) {
            if (tabbables[i] == target) {
              _target = tabbables[i - 1];
              break;
            }
          }
        }

        _target.focus();

        self.toggleSubnav(e, _target);
        break;
    }
  },
  toggleSubnav: function toggleSubnav(event, target, hide) {
    var self = this;
    var parent = target.closest("li"),
        hasPopup = parent.querySelector("[aria-haspopup]"),
        subnav = parent.querySelector(":scope > ".concat(self.settings.subNavItemClass)),
        siblings = Array.prototype.filter.call(parent.parentNode.children, function (child) {
      return child !== parent;
    }); // Hide all panels.

    if (hide) {
      var activeItems = self.menu.querySelectorAll("[aria-expanded=true]");
      activeItems && Array.from(activeItems).forEach(function (item) {
        item.setAttribute("aria-expanded", "false");

        var _subnav = document.getElementById(item.getAttribute("aria-controls"));

        _subnav.classList.remove(self.settings.openClass);

        _subnav.setAttribute("aria-hidden", "true");
      });
    } else {
      hasPopup && hasPopup.setAttribute("aria-expanded", "true");

      if (subnav) {
        subnav && subnav.classList.add(self.settings.openClass);
        subnav && subnav.setAttribute("aria-hidden", "false");

        var _subnav = subnav.querySelector(".".concat(self.settings.navName + self.settings.subNavItemClass));

        _subnav && _subnav.classList.remove(self.settings.openClass);
        _subnav && _subnav.setAttribute("aria-hidden", "true");
      } // close siblings subnavs


      siblings && Array.from(siblings).forEach(function (sibling) {
        sibling.classList.remove(self.settings.focusClass);
        var subItems = sibling.querySelectorAll("[aria-expanded]");
        subItems && Array.from(subItems).forEach(function (item) {
          item.setAttribute("aria-expanded", "false");

          var _subnav = document.getElementById(item.getAttribute("aria-controls"));

          _subnav.classList.remove(self.settings.openClass);

          _subnav.setAttribute("aria-hidden", "true");
        });
      }); //this.toggleExpandedEventHandlers()
    }
  },
  addUniqueId: function addUniqueId(element) {
    if (!element.id) element.id = this.settings.uuidPrefix + "-" + new Date().getTime() + "-" + ++uuid;
  }
};
window.AccessibleDropdown = AccessibleDropdown; // Array.from polyfill
// Production steps of ECMA-262, Edition 6, 22.1.2.1

if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;

    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };

    var toInteger = function toInteger(value) {
      var number = Number(value);

      if (isNaN(number)) {
        return 0;
      }

      if (number === 0 || !isFinite(number)) {
        return number;
      }

      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };

    var maxSafeInteger = Math.pow(2, 53) - 1;

    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    }; // The length property of the from method is 1.


    return function from(arrayLike
    /*, mapFn, thisArg */
    ) {
      // 1. Let C be the this value.
      var C = this; // 2. Let items be ToObject(arrayLike).

      var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      } // 4. If mapfn is undefined, then let mapping be false.


      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;

      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        } // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.


        if (arguments.length > 2) {
          T = arguments[2];
        }
      } // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).


      var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).

      var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

      var k = 0; // 17. Repeat, while k < len… (also steps a - h)

      var kValue;

      while (k < len) {
        kValue = items[k];

        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }

        k += 1;
      } // 18. Let putStatus be Put(A, "length", len, true).


      A.length = len; // 20. Return A.

      return A;
    };
  }();
}
/*
 * scope polyfill
 * https://stackoverflow.com/questions/6481612/queryselector-search-immediate-children
 */


(function (doc, proto) {
  try {
    // check if browser supports :scope natively
    doc.querySelector(':scope body');
  } catch (err) {
    // polyfill native methods if it doesn't
    ['querySelector', 'querySelectorAll'].forEach(function (method) {
      var nativ = proto[method];

      proto[method] = function (selectors) {
        if (/(^|,)\s*:scope/.test(selectors)) {
          // only if selectors contains :scope
          var id = this.id; // remember current element id

          this.id = 'ID_' + Date.now(); // assign new unique id

          selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID

          var result = doc[method](selectors);
          this.id = id; // restore previous id

          return result;
        } else {
          return nativ.call(this, selectors); // use native code for other selectors
        }
      };
    });
  }
})(window.document, Element.prototype);
/*
 * closest polyfill
 * https://developer.mozilla.org/it/docs/Web/API/Element/closest
 */


if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

},{"./accessible-dropdown.defaults":1,"./utils":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var UTILS = {
  /**
  * Get all of an element's parent elements up the DOM tree
  * https://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
  * @param  {Node}   elem     The element
  * @param  {String} selector Selector to match against [optional]
  * @return {Array}           The parent elements
  */
  getParents: function getParents(elem, selector) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length; //while (--i >= 0 && matches.item(i) !== this) {}

        return i > -1;
      };
    } // Setup parents array


    var parents = []; // Get matching parent elements

    for (; elem && elem !== document; elem = elem.parentNode) {
      // Add matching parents to array
      if (selector) {
        if (elem.matches(selector)) {
          parents.push(elem);
        }
      } else {
        parents.push(elem);
      }
    }

    return parents;
  },
  setAttributes: function setAttributes(el, attrs) {
    for (var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }
};
var _default = UTILS;
exports["default"] = _default;

},{}]},{},[2]);

//# sourceMappingURL=accessible-dropdown.js.map
