/**
 * Created by test on 2017/3/24.
 */
app.controller('formController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {

        // $scope.data.form = {
        //     tableName :'',
        //     tablePwd :'',
        //     subjectString :'',
        //     period:''
        // };
      $scope.ok = function () {
          $scope.period = Number($scope.data.form.period);
          $ajax.post('/index/optionalcourse/create/',{
           owner: $rootScope.userData.username,
           tableName:  $scope.data.form.tableName,
           tablePwd:  $scope.data.form.tablePwd,
           subjectString:  $scope.data.form.subjectString,
           period:  $scope.period
           } , function (data) {
                    Notify.success("新增表成功，表序号为："+ data.serialNum);
                    // $modalInstance.close();
                    // data.callback();
                    // $rootScope.loadStoreData();
                    window.location.href="#/overview";
                }
       );
      }

    }]);