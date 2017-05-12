app.controller('helpController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        if($state.current.name == 'app.help') {
            $state.go('app.help.news.list', {}, {reload: true, location: 'replace'});
        }
    }]);