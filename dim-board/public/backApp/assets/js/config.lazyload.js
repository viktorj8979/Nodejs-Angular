/* ============================================================
 * File: config.lazyload.js
 * Configure modules for ocLazyLoader. These are grouped by 
 * vendor libraries. 
 * ============================================================ */

angular.module('dim')
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: true,
            events: true,
            modules: [{
                    name: 'isotope',
                    files: [
                        '../backApp/assets/plugins/imagesloaded/imagesloaded.pkgd.min.js',
                        '../backApp/assets/plugins/jquery-isotope/isotope.pkgd.min.js'
                    ]
                }, {
                    name: 'codropsDialogFx',
                    files: [
                        '../backApp/assets/plugins/codrops-dialogFx/dialogFx.js',
                        '../backApp/assets/plugins/codrops-dialogFx/dialog.css',
                        '../backApp/assets/plugins/codrops-dialogFx/dialog-sandra.css'
                    ]
                }, {
                    name: 'metrojs',
                    files: [
                        '../backApp/assets/plugins/jquery-metrojs/MetroJs.min.js',
                        '../backApp/assets/plugins/jquery-metrojs/MetroJs.css'
                    ]
                }, {
                    name: 'owlCarousel',
                    files: [
                        '../backApp/assets/plugins/owl-carousel/owl.carousel.min.js',
                        '../backApp/assets/plugins/owl-carousel/../backApp/assets/owl.carousel.css'
                    ]
                }, {
                    name: 'noUiSlider',
                    files: [
                        '../backApp/assets/plugins/jquery-nouislider/jquery.nouislider.min.js',
                        '../backApp/assets/plugins/jquery-nouislider/jquery.liblink.js',
                        '../backApp/assets/plugins/jquery-nouislider/jquery.nouislider.css'
                    ]
                }, {
                    name: 'nvd3',
                    files: [
                        '../backApp/assets/plugins/nvd3/lib/d3.v3.js',
                        '../backApp/assets/plugins/nvd3/nv.d3.min.js',
                        '../backApp/assets/plugins/nvd3/src/utils.js',
                        '../backApp/assets/plugins/nvd3/src/tooltip.js',
                        '../backApp/assets/plugins/nvd3/src/interactiveLayer.js',
                        '../backApp/assets/plugins/nvd3/src/models/axis.js',
                        '../backApp/assets/plugins/nvd3/src/models/line.js',
                        '../backApp/assets/plugins/nvd3/src/models/lineWithFocusChart.js',
                        '../backApp/assets/plugins/angular-nvd3/angular-nvd3.js',
                        '../backApp/assets/plugins/nvd3/nv.d3.min.css'
                    ],
                    serie: true // load in the exact order
                }, {
                    name: 'rickshaw',
                    files: [
                        '../backApp/assets/plugins/nvd3/lib/d3.v3.js',
                        '../backApp/assets/plugins/rickshaw/rickshaw.min.js',
                        '../backApp/assets/plugins/angular-rickshaw/rickshaw.js',
                        '../backApp/assets/plugins/rickshaw/rickshaw.min.css',
                    ],
                    serie: true
                }, {
                    name: 'sparkline',
                    files: [
                    '../backApp/assets/plugins/jquery-sparkline/jquery.sparkline.min.js',
                    '../backApp/assets/plugins/angular-sparkline/angular-sparkline.js'
                    ]
                }, {
                    name: 'mapplic',
                    files: [
                        '../backApp/assets/plugins/mapplic/js/hammer.js',
                        '../backApp/assets/plugins/mapplic/js/jquery.mousewheel.js',
                        '../backApp/assets/plugins/mapplic/js/mapplic.js',
                        '../backApp/assets/plugins/mapplic/css/mapplic.css'
                    ]
                }, {
                    name: 'skycons',
                    files: ['../backApp/assets/plugins/skycons/skycons.js']
                }, {
                    name: 'switchery',
                    files: [
                        '../backApp/assets/plugins/switchery/js/switchery.min.js',
                        '../backApp/assets/plugins/ng-switchery/ng-switchery.js',
                        '../backApp/assets/plugins/switchery/css/switchery.min.css',
                    ]
                }, {
                    name: 'menuclipper',
                    files: [
                        '../backApp/assets/plugins/jquery-menuclipper/jquery.menuclipper.css',
                        '../backApp/assets/plugins/jquery-menuclipper/jquery.menuclipper.js'
                    ]
                }, {
                    name: 'wysihtml5',
                    files: [
                        '../backApp/assets/plugins/bootstrap3-wysihtml5/bootstrap3-wysihtml5.min.css',
                        '../backApp/assets/plugins/bootstrap3-wysihtml5/bootstrap3-wysihtml5.all.min.js'
                    ]
                }, {
                    name: 'stepsForm',
                    files: [
                        '../backApp/assets/plugins/codrops-stepsform/css/component.css',
                        '../backApp/assets/plugins/codrops-stepsform/js/stepsForm.js'
                    ]
                }, {
                    name: 'jquery-ui',
                    files: ['../backApp/assets/plugins/jquery-ui-touch/jquery.ui.touch-punch.min.js']
                }, {
                    name: 'moment',
                    files: ['../backApp/assets/plugins/moment/moment.min.js',
                        '../backApp/assets/plugins/moment/moment-with-locales.min.js'
                    ]
                }, {
                    name: 'hammer',
                    files: ['../backApp/assets/plugins/hammer.min.js']
                }, {
                    name: 'sieve',
                    files: ['../backApp/assets/plugins/jquery.sieve.min.js']
                }, {
                    name: 'line-icons',
                    files: ['../backApp/assets/plugins/simple-line-icons/simple-line-icons.css']
                }, {
                    name: 'ionRangeSlider',
                    files: [
                        '../backApp/assets/plugins/ion-slider/css/ion.rangeSlider.css',
                        '../backApp/assets/plugins/ion-slider/css/ion.rangeSlider.skinFlat.css',
                        '../backApp/assets/plugins/ion-slider/js/ion.rangeSlider.min.js'
                    ]
                }, {
                    name: 'navTree',
                    files: [
                        '../backApp/assets/plugins/angular-bootstrap-nav-tree/abn_tree_directive.js',
                        '../backApp/assets/plugins/angular-bootstrap-nav-tree/abn_tree.css'
                    ]
                }, {
                    name: 'nestable',
                    files: [
                        '../backApp/assets/plugins/jquery-nestable/jquery.nestable.css',
                        '../backApp/assets/plugins/jquery-nestable/jquery.nestable.js',
                        '../backApp/assets/plugins/angular-nestable/angular-nestable.js'
                    ]
                }, {
                    //https://github.com/angular-ui/ui-select
                    name: 'select',
                    files: [
                        '../backApp/assets/plugins/bootstrap-select2/select2.css',
                        '../backApp/assets/plugins/angular-ui-select/select.min.css',
                        '../backApp/assets/plugins/angular-ui-select/select.min.js'
                    ]
                }, {
                    name: 'datepicker',
                    files: [
                        '../backApp/assets/plugins/bootstrap-datepicker/css/datepicker3.css',
                        '../backApp/assets/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                    ]
                }, {
                    name: 'daterangepicker',
                    files: [
                        '../backApp/assets/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                        '../backApp/assets/plugins/bootstrap-daterangepicker/daterangepicker.js'
                    ]
                }, {
                    name: 'timepicker',
                    files: [
                        '../backApp/assets/plugins/bootstrap-timepicker/bootstrap-timepicker.min.css',
                        '../backApp/assets/plugins/bootstrap-timepicker/bootstrap-timepicker.min.js'
                    ]
                }, {
                    name: 'inputMask',
                    files: [
                        '../backApp/assets/plugins/jquery-inputmask/jquery.inputmask.min.js'
                    ]
                }, {
                    name: 'autonumeric',
                    files: [
                        '../backApp/assets/plugins/jquery-autonumeric/autoNumeric.js'
                    ]
                }, {
                    name: 'summernote',
                    files: [
                        '../backApp/assets/plugins/summernote/css/summernote.css',
                        '../backApp/assets/plugins/summernote/js/summernote.min.js',
                        '../backApp/assets/plugins/angular-summernote/angular-summernote.min.js'
                    ],
                    serie: true // load in the exact order
                }, {
                    name: 'tagsInput',
                    files: [
                        '../backApp/assets/plugins/bootstrap-tag/bootstrap-tagsinput.css',
                        '../backApp/assets/plugins/bootstrap-tag/bootstrap-tagsinput.min.js'
                    ]
                }, {
                    name: 'dropzone',
                    files: [
                        '../backApp/assets/plugins/dropzone/css/dropzone.css',
                        '../backApp/assets/plugins/dropzone/dropzone.min.js',
                        '../backApp/assets/plugins/angular-dropzone/angular-dropzone.js'
                    ]
                }, {
                    name: 'wizard',
                    files: [
                        '../backApp/assets/plugins/lodash/lodash.min.js',
                        '../backApp/assets/plugins/angular-wizard/angular-wizard.min.css',
                        '../backApp/assets/plugins/angular-wizard/angular-wizard.min.js'
                    ]
                }, {
                    name: 'dataTables',
                    files: [
                        '../backApp/assets/plugins/jquery-datatable/media/css/jquery.dataTables.css',
                        '../backApp/assets/plugins/jquery-datatable/extensions/FixedColumns/css/dataTables.fixedColumns.min.css',
                        '../backApp/assets/plugins/datatables-responsive/css/datatables.responsive.css',
                        '../backApp/assets/plugins/jquery-datatable/media/js/jquery.dataTables.min.js',
                        '../backApp/assets/plugins/jquery-datatable/extensions/TableTools/js/dataTables.tableTools.min.js',
                        '../backApp/assets/plugins/jquery-datatable/extensions/Bootstrap/jquery-datatable-bootstrap.js',
                        '../backApp/assets/plugins/datatables-responsive/js/datatables.responsive.js',
                        '../backApp/assets/plugins/datatables-responsive/js/lodash.min.js'
                    ],
                    serie: true // load in the exact order
                }, {
                    name: 'google-map',
                    files: [
                        '../backApp/assets/plugins/angular-google-map-loader/google-map-loader.js',
                        '../backApp/assets/plugins/angular-google-map-loader/google-maps.js'
                    ]
                }

            ]
        });
    }]);