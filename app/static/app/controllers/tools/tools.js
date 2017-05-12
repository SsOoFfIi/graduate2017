app.controller('toolsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        !$state.current.url && $state.go('app.tools.marketingTools', {}, {'location': 'replace'});
    }]);