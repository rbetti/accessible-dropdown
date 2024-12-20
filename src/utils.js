const UTILS = {

  /**
  * Get all of an element's parent elements up the DOM tree
  * https://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
  * @param  {Node}   elem     The element
  * @param  {String} selector Selector to match against [optional]
  * @return {Array}           The parent elements
  */
  getParents: ( elem, selector ) => {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;
            //while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
          };
    }

    // Setup parents array
    var parents = [];

    // Get matching parent elements
    for ( ; elem && elem !== document; elem = elem.parentNode ) {

      // Add matching parents to array
      if ( selector ) {
        if ( elem.matches( selector ) ) {
          parents.push( elem );
        }
      } else {
        parents.push( elem );
      }
    }

    return parents;
  },

  setAttributes: (el, attrs) => {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }
}

export default UTILS;