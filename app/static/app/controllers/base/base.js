app.controller('baseController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    '$timeout',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, $timeout) {
        !$state.current.url && $state.go('app.base.home', {}, {location: 'replace'});

        $timeout(function () {
            var position = 'right';
            if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
                $(".sidebar-menu").slimScroll({destroy: true});
                $(".sidebar-menu").attr('style', '');
            }
            $('.sidebar-menu').slimscroll({
                height: $(window).height() - 90,
                position: position,
                size: '3px',
                color: '#333'
            });
        }, 1000);
    }]);