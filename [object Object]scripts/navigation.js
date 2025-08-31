"use strict";
(self["webpackChunkproject_name"] = self["webpackChunkproject_name"] || []).push([["navigation"],{

/***/ "./templates/src/assets/scripts/components/vanilla/navigation.js":
/*!***********************************************************************!*\
  !*** ./templates/src/assets/scripts/components/vanilla/navigation.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var Models_locker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! Models/locker */ "./templates/src/assets/scripts/models/locker.js");

/* harmony default export */ __webpack_exports__["default"] = (element => {
  const elements = {
    mobileToggle: element.querySelector('.js-navigation__mobile-toggle')
  };
  const states = {
    mobileNavOpen: 'is-mobile-navigation-open'
  };
  function init() {
    addListeners();
  }
  function addListeners() {
    elements.mobileToggle.addEventListener('click', mobileToggleClickHandler);
  }
  function mobileToggleClickHandler() {
    element.classList.toggle(states.mobileNavOpen);
    if (element.classList.contains(states.mobileNavOpen)) {
      (0,Models_locker__WEBPACK_IMPORTED_MODULE_0__.lockPage)();
    } else {
      (0,Models_locker__WEBPACK_IMPORTED_MODULE_0__.unlockPage)();
    }
  }
  init();
});

/***/ }),

/***/ "./templates/src/assets/scripts/models/locker.js":
/*!*******************************************************!*\
  !*** ./templates/src/assets/scripts/models/locker.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lockPage: function() { return /* binding */ lockPage; },
/* harmony export */   unlockPage: function() { return /* binding */ unlockPage; }
/* harmony export */ });
const states = {
  isLocked: 'is-locked'
};
const lockElement = document.querySelector('.page');
const documentElement = document.documentElement;
let locked = false;
let scrollPos = {
  x: 0,
  y: 0
};
function lockPage() {
  if (locked || !lockElement) {
    return false;
  }
  scrollPos = {
    x: window.scrollX,
    y: window.scrollY
  };
  locked = true;
  lockElement.style.top = -scrollPos.y + 'px';
  documentElement.classList.add(states.isLocked);
}
function unlockPage() {
  if (!locked) {
    return false;
  }
  documentElement.classList.remove(states.isLocked);
  // prevent smooth scroll behavior while jumping back
  documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(scrollPos.x, scrollPos.y);
  lockElement.style.top = 'auto';
  locked = false;
  documentElement.style.scrollBehavior = null;
}

/***/ })

}]);
//# sourceMappingURL=navigation.js.map