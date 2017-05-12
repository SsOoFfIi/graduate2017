angular.module('app')
    .config([
        '$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: true,
                events: true,
                modules: [
                    {
                        name: 'toaster',
                        files: [
                            '/static/lib/modules/angularjs-toaster/toaster.css',
                            '/static/lib/modules/angularjs-toaster/toaster.js'
                        ]
                    },
                    {
                        name: 'ui.select',
                        files: [
                            '/static/lib/modules/angular-ui-select/select.css',
                            '/static/lib/modules/angular-ui-select/select.js'
                        ]
                    },
                    {
                        name: 'ngTagsInput',
                        files: [
                            '/static/lib/modules/ng-tags-input/ng-tags-input.js'
                        ]
                    },
                    {
                        name: 'daterangepicker',
                        serie: true,
                        files: [
                            '/static/lib/modules/angular-daterangepicker/moment.js',
                            '/static/lib/modules/angular-daterangepicker/daterangepicker.js',
                            '/static/lib/modules/angular-daterangepicker/angular-daterangepicker.js'
                        ]
                    },
                    {
                        name: 'vr.directives.slider',
                        files: [
                            '/static/lib/modules/angular-slider/angular-slider.min.js'
                        ]
                    },
                    {
                        name: 'minicolors',
                        files: [
                            '/static/lib/modules/angular-minicolors/jquery.minicolors.js',
                            '/static/lib/modules/angular-minicolors/angular-minicolors.js'
                        ]
                    },
                    {
                        name: 'textAngular',
                        files: [
                            '/static/lib/modules/text-angular/textAngular-sanitize.min.js',
                            '/static/lib/modules/text-angular/textAngular-rangy.min.js',
                            '/static/lib/modules/text-angular/textAngular.min.js'
                        ]
                    },
                    {
                        name: 'ng-nestable',
                        files: [
                            '/static/lib/modules/angular-nestable/jquery.nestable.js',
                            '/static/lib/modules/angular-nestable/angular-nestable.js'
                        ]
                    },
                    {
                        name: 'angularBootstrapNavTree',
                        files: [
                            '/static/lib/modules/angular-bootstrap-nav-tree/abn_tree_directive.js'
                        ]
                    },
                    {
                        name: 'ui.calendar',
                        files: [
                            '/static/lib/jquery/fullcalendar/jquery-ui.custom.min.js',
                            '/static/lib/jquery/fullcalendar/moment.min.js',
                            '/static/lib/jquery/fullcalendar/fullcalendar.js',
                            '/static/lib/modules/angular-ui-calendar/calendar.js'
                        ]
                    },
                    {
                        name: 'ngGrid',
                        files: [
                            '/static/lib/modules/ng-grid/ng-grid.min.js',
                            '/static/lib/modules/ng-grid/ng-grid.css'
                        ]
                    },
                    {
                        name: 'dropzone',
                        files: [
                            '/static/lib/modules/angular-dropzone/dropzone.min.js',
                            '/static/lib/modules/angular-dropzone/angular-dropzone.js'
                        ]
                    }
                ]
            });
        }
    ]);