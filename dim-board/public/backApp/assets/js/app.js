/* ============================================================
 * File: app.js
 * Configure global module dependencies. Page specific modules
 * will be loaded on demand using ocLazyLoad
 * ============================================================ */

'use strict';

angular.module('dim', [
    'ui.router',
    'ui.utils',
    'oc.lazyLoad'
]);
 