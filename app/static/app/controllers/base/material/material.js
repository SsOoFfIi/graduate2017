app.controller('materialController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $state.current.url == '/material' && $state.go('app.base.material.mpnews', {}, {location: 'replace'});
    }]);