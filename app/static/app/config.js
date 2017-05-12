var app =
    angular.module('app')
        .config(
            [
                '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
                    app.controller = $controllerProvider.register;
                    app.directive = $compileProvider.directive;
                    app.filter = $filterProvider.register;
                    app.factory = $provide.factory;
                    app.service = $provide.service;
                    app.constant = $provide.constant;
                    app.value = $provide.value;
                    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
                }
            ]);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);

// app.config(['$breadcrumbProvider', function ($breadcrumbProvider) {
//     $breadcrumbProvider.setOptions({
//         template: '<ul class="breadcrumb">' +
//         '<li><i class="fa fa-home"></i><a ui-sref="app.home">首页</a></li>' +
//         '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract" ng-if="!step.ncyBreadcrumb.hideBreadcrumb">' +
//         '<a ng-switch-when="false" ui-sref="{{step.name}}" ui-sref-opts="{reload:true}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>' +
//         '</ul>'
//     });
// }]);

app.directive('spinbox', ['$parse', function ($parse) {
    return {
        restrict: 'C',      //以ClassName的形式被声明
        link: function (scope, element, attrs) {
            var $spinbox = element;
            var $input = $spinbox.find('.spinbox-input');
            var model = $input.attr('ng-model');
            $(element).spinbox({
                min: $input.attr('min'),
                max: $input.attr('max'),
                step: $input.attr('step')
            });
            element.on('changed.fu.spinbox', function () {
                if (!model) return;
                var setter = $parse(model).assign;
                scope.$apply(function () {
                    setter(scope, $spinbox.spinbox('value'));
                });
            });
        }
    }
}]);

app.directive('tooltip', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).tooltip({
                html: true,
                trigger: attrs.trigger || 'hover'
            });
        }
    }
}]);

app.directive('pwCheck', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            console.log(attrs);
            var firstPassword = '#' + attrs.name;
            var confirmPassword = '#' + attrs.pwCheck;
            console.log(elem);
            //鼠标离开触发验证事件
            //有人会问假如我用$(elem).add也是对的，的确，其实elem就是jquery对象，所以两种就对
            //可以通过 elem instanceOf jQuery 看返回结果是否为true来判别
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    ctrl.$setValidity('pwmatch', $(confirmPassword).val() === $(firstPassword).val());
                });
            });
        }
    }
});

app.service('$ajax', ['$rootScope', '$http', '$window', '$location', '$timeout', function ($rootScope, $http, $window, $location, $timeout) {
        var hideLoading = function () {
            $timeout(function () {
                $rootScope.showLoading = false;
            }, 200);
        }
        var resultInspector = function (result, success, error) {
            switch (result.code) {
                case 200:
                    success && success(result.data, result.t);
                    break;
                case 401:
                    window.location.replace('/');
                    break;
                default:
                    if (error) {
                        error(result);
                    } else {
                        Notify.error(result.data.error || '请求失败，请稍后重试!');
                    }
            }
        };
        return {
            get: function (url, params, success, error) {
                params && (params.t = + new Date());
                $rootScope.showLoading = true;
                $http({
                    method: 'GET',
                    url: url,
                    params: params
                }).then(function (response) {
                    console.log(params)
                    var result = response.data;
                    resultInspector(result, success, error);
                    hideLoading();
                }, function (response) {
                    console.log(params)
                    hideLoading();
                    Notify.error('请求失败，请稍后重试!');
                });
            },
            put: function (url, params, success, error) {
                $rootScope.showLoading = true;
                $http({
                    method: 'PUT',
                    url: url,
                    data: params
                }).then(function (response) {
                    var result = response.data;
                    resultInspector(result, success, error);
                    hideLoading();
                }, function (response) {
                    hideLoading();
                    Notify.error('请求失败，请稍后重试!');
                });
            },
            'delete': function (url, success, error) {
                $rootScope.showLoading = true;
                $http({
                    method: 'DELETE',
                    url: url
                }).then(function (response) {
                    var result = response.data;
                    resultInspector(result, success, error);
                    hideLoading();
                }, function (response) {
                    hideLoading();
                    Notify.error('请求失败，请稍后重试!');
                });
            },
            post: function (url, data, success, error) {
                $rootScope.showLoading = true;
                $http({
                    method: 'POST',
                    url: url,
                    data: data
                }).then(function (response) {
                    var result = response.data;
                    resultInspector(result, success, error);
                    hideLoading();
                }, function (response) {
                    hideLoading();
                    Notify.error('请求失败，请稍后重试!');
                });
            }
        };
    }]
);

app.filter('stringEllipsis', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || '…');
    };
});

app.filter('propsFilter', function() {
    /**
     * @param items 源数组
     * @param props 过滤属性
     * @param exact 精确匹配
     */
    return function(items, props, exact) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if(exact) {
                        if (item[prop].toString().toLowerCase() == text) {
                            itemMatches = true;
                            break;
                        }
                    } else {
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});