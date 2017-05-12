app.controller('mainController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        !$state.current.url && $state.go('app.main.overview', {}, {'location': 'replace'});
    }]);