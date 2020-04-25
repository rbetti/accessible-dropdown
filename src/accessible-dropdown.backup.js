import { getInstanceSettings } from './accessible-dropdown.defaults';

const AccessibleDropdown = function(customSettings) {
  this.settings = getInstanceSettings(customSettings);
  this.init();
};

let uuid = 0,
  mouseTimeoutID = null,
	focusTimeoutID = null;

AccessibleDropdown.prototype = {
  init: function() {
    this.nav = document.querySelector(this.settings.selector);
    this.menu = this.nav.querySelectorAll('ul')[0]; // selects the first UL item inside the nav element

    this.nav.setAttribute('role', 'navigation'); // check

    let navItemsWithChildren = this.menu.querySelectorAll(this.settings.hasChildrenClass);
    navItemsWithChildren && Array.from(navItemsWithChildren).forEach( item => {
      //var liItem = $(liItem), link = liItem.find('> a'), subnav = liItem.find('> .' + settings.navName + settings.subNavItemClass);
      let link = item.querySelector(':scope > a'),
          subnav = item.querySelector(':scope > ul');

      this.addUniqueId(link);
      this.addUniqueId(subnav);

      this.setAttributes(link, {
        'aria-haspopup': true,
				'aria-controls': subnav.id,
				'aria-expanded': false
      });

      this.setAttributes(subnav, {
        'role': 'menu', // CHECK
				'aria-expanded': false,
				'aria-hidden': true,
				'aria-labelledby': link.id
			});

      // Event listeners
      const _this = this;
      this.menu.addEventListener('mouseover', this.eventHandler.bind(this), false);
    });
  },

  eventHandler: function(e) {
    console.log(this);
    clearTimeout(mouseTimeoutID);
    let target = e.target,
        topNavItem = target.closest(this.settings.selector + this.settings.topNavItemClass);

    target.classList.add( this.settings.hoverClass );
    topNavItem.classList.add( this.settings.hoverClass );
  },

  mouseOverHandler: function(e) {
    clearTimeout(mouseTimeoutID);

    let target = e.target,
    topNavItem = target.closest(this.settings.selector + settings.topNavItemClass);

    target.classList.add(this.settings.hoverClass);
    topNavItem.classList.add(this.settings.hoverClass);

		//_togglePanel(event.target);
  },

  addUniqueId: function(element) {
		if(!element.id)
      element.id = this.settings.uuidPrefix + "-" + new Date().getTime() + "-" + (++uuid);
	},

  setAttributes: (el, attrs) => {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }
}

let accessibleNav = new AccessibleDropdown({
  selector: '#navbar',
  hoverClass: 'spuzzo'
});


// Array.from polyfill
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

/*
 * scope polyfill
 * https://stackoverflow.com/questions/6481612/queryselector-search-immediate-children
 */
(function(doc, proto) {
  try { // check if browser supports :scope natively
    doc.querySelector(':scope body');
  } catch (err) { // polyfill native methods if it doesn't
    ['querySelector', 'querySelectorAll'].forEach(function(method) {
      var nativ = proto[method];
      proto[method] = function(selectors) {
        if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
          var id = this.id; // remember current element id
          this.id = 'ID_' + Date.now(); // assign new unique id
          selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
          var result = doc[method](selectors);
          this.id = id; // restore previous id
          return result;
        } else {
          return nativ.call(this, selectors); // use native code for other selectors
        }
      }
    });
  }
})(window.document, Element.prototype);
