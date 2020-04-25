// Default settings
const defaultSettings = {
  navName: "nav-main",
  uuidPrefix: 'accessible-dropdown', // default uuidPrefix to be added
  hasChildrenClass: 'hasChildren',
  topNavItemClass: '__li-level1', // default css class for a top-level navigation item in the menu
  subNavItemClass: '__sublevel', // default css class for a submenu
  hoverClass: 'hover', // default css class for the hover state
  focusClass: 'focus', // default css class for the focus state
  openClass: 'open', // default css class for the open state
};

export const getInstanceSettings = customSettings => {
  return Object.assign({}, defaultSettings, customSettings);
};

export const keyboard = {
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
  UP: 38,
}
