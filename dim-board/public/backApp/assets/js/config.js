/* ============================================================
 * File: config.js
 * Configure routing
 * ============================================================ */

angular.module('dim')
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',

        function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
            $urlRouterProvider
                .otherwise('/../backApp/dashboard');

                $stateProvider.state('app', {
                        abstract: true,
                        url: "/app",
                        templateUrl: "../backApp/dashboards/partial/dashboards.view/dashboards.view.html"
                });
                $stateProvider.state('app.dashboard', {
                    url: "/dashboard",
                    templateUrl: "../backApp/tpl/dashboard.html",
                    controller: 'DashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'nvd3',
                                    'mapplic',
                                    'rickshaw',
                                    'metrojs',
                                    'sparkline',
                                    'skycons',
                                    'switchery'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        '../backApp/assets/js/controllers/dashboard.js'
                                    ]);
                                });
                        }]
                    }
                })

            // Email app
            .state('app.email', {
                    abstract: true,
                    url: '/email',
                    templateUrl: '../backApp/tpl/apps/email/email.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'menuclipper',
                                    'wysihtml5'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        '../backApp/assets/js/apps/email/service.js',
                                        '../backApp/assets/js/apps/email/email.js'
                                    ])
                                });
                        }]
                    }
                })
                .state('app.email.inbox', {
                    url: '/inbox/:emailId',
                    templateUrl: '../backApp/tpl/apps/email/email_inbox.html'
                })
                .state('app.email.compose', {
                    url: '/compose',
                    templateUrl: '../backApp/tpl/apps/email/email_compose.html'
                })
                // Social app
                .state('app.social', {
                    url: '/social',
                    templateUrl: '../backApp/tpl/apps/social/social.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'isotope',
                                    'stepsForm'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        '../backApp/pages/js/pages.social.min.js',
                                        '../backApp/assets/js/apps/social/social.js'
                                    ])
                                });
                        }]
                    }
                })
                //Calendar app
                .state('app.calendar', {
                    url: '/calendar',
                    templateUrl: '../backApp/tpl/apps/calendar/calendar.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'switchery',
                                    'jquery-ui',
                                    'moment',
                                    'hammer'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        '../backApp/pages/js/pages.calendar.min.js',
                                        '../backApp/assets/js/apps/calendar/calendar.js'
                                    ])
                                });
                        }]
                    }
                })
                .state('app.builder', {
                    url: '/builder',
                    template: '<div></div>',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                '../backApp/assets/js/controllers/builder.js',
                            ]);
                        }]
                    }
                })

            // UI Elements 
            .state('app.ui', {
                    url: '/ui',
                    template: '<div ui-view></div>'
                })
                .state('app.ui.color', {
                    url: '/color',
                    templateUrl: '../backApp/tpl/ui_color.html'
                })
                .state('app.ui.typo', {
                    url: '/typo',
                    templateUrl: '../backApp/tpl/ui_typo.html'
                })
                .state('app.ui.icons', {
                    url: '/icons',
                    templateUrl: '../backApp/tpl/ui_icons.html',
                    controller: 'IconsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'sieve',
                                    'line-icons'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load([
                                        '../backApp/assets/js/controllers/icons.js'
                                    ])
                                });
                        }]
                    }
                })
                .state('app.ui.buttons', {
                    url: '/buttons',
                    templateUrl: '../backApp/tpl/ui_buttons.html'
                })
                .state('app.ui.notifications', {
                    url: '/notifications',
                    templateUrl: '../backApp/tpl/ui_notifications.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                '../backApp/assets/js/controllers/notifications.js'
                            ]);
                        }]
                    }
                })
                .state('app.ui.modals', {
                    url: '/modals',
                    templateUrl: '../backApp/tpl/ui_modals.html',
                    controller: 'ModalsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                '../backApp/assets/js/controllers/modals.js'
                            ]);
                        }]
                    }
                })
                .state('app.ui.progress', {
                    url: '/progress',
                    templateUrl: '../backApp/tpl/ui_progress.html'
                })
                .state('app.ui.tabs', {
                    url: '/tabs',
                    templateUrl: '../backApp/tpl/ui_tabs.html'
                })
                .state('app.ui.sliders', {
                    url: '/sliders',
                    templateUrl: '../backApp/tpl/ui_sliders.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'noUiSlider',
                                'ionRangeSlider'
                            ], {
                                insertBefore: '#lazyload_placeholder'
                            });
                        }]
                    }
                })
                .state('app.ui.treeview', {
                    url: '/treeview',
                    templateUrl: '../backApp/tpl/ui_treeview.html',
                    controller: 'TreeCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'navTree'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/treeview.js');
                                });
                        }]
                    }
                })
                .state('app.ui.nestables', {
                    url: '/nestables',
                    templateUrl: '../backApp/tpl/ui_nestable.html',
                    controller: 'NestableCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'nestable'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/nestable.js');
                                });
                        }]
                    }
                })

            // Form elements
            .state('app.forms', {
                    url: '/forms',
                    template: '<div ui-view></div>'
                })
                .state('app.forms.elements', {
                    url: '/elements',
                    templateUrl: '../backApp/tpl/forms_elements.html',
                    controller: 'FormElemCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'switchery',
                                    'select',
                                    'moment',
                                    'datepicker',
                                    'daterangepicker',
                                    'timepicker',
                                    'inputMask',
                                    'autonumeric',
                                    'wysihtml5',
                                    'summernote',
                                    'tagsInput',
                                    'dropzone'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/forms_elements.js');
                                });
                        }]
                    }
                })
                .state('app.forms.layouts', {
                    url: '/layouts',
                    templateUrl: '../backApp/tpl/forms_layouts.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'datepicker',
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/forms_layouts.js');
                                });
                        }]
                    }
                })
                .state('app.forms.wizard', {
                    url: '/wizard',
                    templateUrl: '../backApp/tpl/forms_wizard.html',
                    controller: 'FormWizardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'wizard'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/forms_wizard.js');
                                });
                        }]
                    }
                })

            // Portlets
            .state('app.portlets', {
                url: '/portlets',
                templateUrl: '../backApp/tpl/portlets.html',
                controller: 'PortletCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '../backApp/assets/js/controllers/portlets.js'
                        ]);
                    }]
                }
            })

            // Tables
            .state('app.tables', {
                    url: '/tables',
                    template: '<div ui-view></div>'
                })
                .state('app.tables.basic', {
                    url: '/basic',
                    templateUrl: '../backApp/tpl/tables_basic.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'dataTables'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/tables.js');
                                });
                        }]
                    }
                })
                .state('app.tables.dataTables', {
                    url: '/dataTables',
                    templateUrl: '../backApp/tpl/tables_dataTables.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'dataTables'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/dataTables.js');
                                });
                        }]
                    }
                })

            // Maps
            .state('app.maps', {
                    url: '/maps',
                    template: '<div class="full-height full-width" ui-view></div>'
                })
                .state('app.maps.google', {
                    url: '/google',
                    templateUrl: '../backApp/tpl/maps_google_map.html',
                    controller: 'GoogleMapCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'google-map'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/google_map.js')
                                        .then(function() {
                                            return loadGoogleMaps();
                                        });
                                });
                        }]
                    }
                })
                .state('app.maps.vector', {
                    url: '/vector',
                    templateUrl: '../backApp/tpl/maps_vector_map.html',
                    controller: 'VectorMapCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'mapplic',
                                    'select'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/vector_map.js');
                                });
                        }]
                    }
                })

            // Charts
            .state('app.charts', {
                url: '/charts',
                templateUrl: '../backApp/tpl/charts.html',
                controller: 'ChartsCtrl',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([
                                'nvd3',
                                'rickshaw',
                                'sparkline'
                            ], {
                                insertBefore: '#lazyload_placeholder'
                            })
                            .then(function() {
                                return $ocLazyLoad.load('../backApp/assets/js/controllers/charts.js');
                            });
                    }]
                }
            })

            // Extras
            .state('app.extra', {
                    url: '/extra',
                    template: '<div ui-view></div>'
                })
                .state('app.extra.invoice', {
                    url: '/invoice',
                    templateUrl: '../backApp/tpl/extra_invoice.html'
                })
                .state('app.extra.blank', {
                    url: '/blank',
                    templateUrl: '../backApp/tpl/extra_blank.html'
                })
                .state('app.extra.gallery', {
                    url: '/gallery',
                    templateUrl: '../backApp/tpl/extra_gallery.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                    'isotope',
                                    'codropsDialogFx',
                                    'metrojs',
                                    'owlCarousel',
                                    'noUiSlider'
                                ], {
                                    insertBefore: '#lazyload_placeholder'
                                })
                                .then(function() {
                                    return $ocLazyLoad.load('../backApp/assets/js/controllers/gallery.js');
                                });
                        }]
                    }
                })
                .state('app.extra.timeline', {
                    url: '/timeline',
                    templateUrl: '../backApp/tpl/extra_timeline.html'
                })

            // Extra - Others
            .state('access', {
                    url: '/access',
                    template: '<div class="full-height" ui-view></div>'
                })
                .state('access.404', {
                    url: '/404',
                    templateUrl: '../backApp/tpl/extra_404.html'
                })
                .state('access.500', {
                    url: '/500',
                    templateUrl: '../backApp/tpl/extra_500.html'
                })
                .state('access.login', {
                    url: '/login',
                    templateUrl: '../backApp/tpl/extra_login.html'
                })
                .state('access.register', {
                    url: '/register',
                    templateUrl: '../backApp/tpl/extra_register.html'
                })
                .state('access.lock_screen', {
                    url: '/lock_screen',
                    templateUrl: '../backApp/tpl/extra_lock_screen.html'
                })

        }
    ]);