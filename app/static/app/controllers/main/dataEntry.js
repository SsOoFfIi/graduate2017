/**
 * Created by test on 2017/3/24.
 */
app.controller('dataController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {

        // $scope.changePath = function () {
        //
        //     $state.go('app.main.dataEntry', {
        //         serialNum: $scope.table.id,
        //         tablePwd: $scope.table.pwd
        //         // userName:
        //     })
        //     $scope.load();
        //
        // };

        // $scope.data = {
        //     num: $scope.table.id,
        //     // tablePwd: $stateParams.tablePwd,
        //     // username:$stateParams.userName
        // };
        $scope.subjectArray = [];
        //神迹函数
        $scope.subjectBoolean = function () {
            $scope.subjectArray = [];
            for (var j = 0; j < $scope.subjectName.length; j++) {
                if ($scope.row[$scope.subjectName[j]]) {
                    $scope.subjectArray.push($scope.subjectName[j]);
                }
            }
            console.log($scope.subjectArray);
        };
        $scope.load = function () {
            console.log("load");
            $ajax.post('/index/optionalcourse/userrow/', {
                serialNum: parseInt($scope.table.id),
                tablePwd: $scope.table.pwd,
                username: $rootScope.userData.username
            }, function (data) {
                $scope.subjectName = data.subjectName;
                $scope.userrowData = data;
                $scope.row = data.row;
                $scope.subjectBoolean();
                $scope.num = $scope.table.id;
            })
        };

        $scope.delete = function () {
            $ajax.post('/index/optionalcourse/modify/', {
                serialNum: parseInt($scope.table.id),
                type: -1,
                rowNum: $scope.userrowData.rowNum,
                username: $rootScope.userData.username,
                name: $rootScope.userData.name
                // subjectName:obj
            }, function () {
                Notify.success("删除成功");
                $scope.load();
                window.location.href = '#/dataEntry';

            })
        };
        $scope.insertData = function () {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'editTableData.html',
                controller: 'editTableDataController',
                backdrop: 'static',
                size: 'normal',

                resolve: {
                    data: function () {
                        return {
                            row: $scope.row,
                            subjectName: $scope.subjectName,
                            serialNum:parseInt($scope.table.id),
                            rowNum: $scope.userrowData.rowNum,
                            callback: function () {
                                $scope.load();
                            }
                        };
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        app.controller('editTableDataController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
            //是否新增
            $scope.isCreate = !data.rowNum;
            $scope.subjectName = data.subjectName;
            $scope.subjectBoolean = [];

            $scope.subjectDeal = function () {

            }

            //对话框标题
            $scope.title = $scope.isCreate ? '新增数据' : '修改数据';

            $scope.data = data;

            $scope.ok = function () {

                console.log($scope.subjectBoolean);

                var obj = {};
                for (var key in $scope.subjectBoolean) {
                    var item = $scope.subjectBoolean[key];
                    obj[key] = item;
                }


                // console.log(arrs);

                // var array = [{"OperatingSystem":"0"},{"cgd":"0"}];
                if ($scope.isCreate) {
                    $ajax.post('/index/optionalcourse/modify/', {
                        serialNum: data.serialNum,
                        type: 1,
                        rowNum: data.rowNum | '1',
                        username: $rootScope.userData.username,
                        name: $rootScope.userData.name,
                        subjectName: obj
                    }, function () {
                        Notify.success("新增成功");
                        $modalInstance.close();
                        data.callback();

                        window.location.href = '#/dataEntry';

                    });
                } else {
                    $ajax.post('/index/optionalcourse/modify/', {
                        serialNum: data.serialNum,
                        type: 0,
                        rowNum: data.rowNum,
                        username: $rootScope.userData.username,
                        name: $rootScope.userData.name,
                        subjectName: obj
                    }, function () {
                        data.callback();
                        Notify.success("修改信息成功");
                        $modalInstance.close();
                        window.location.href = '#/dataEntry';
                        // $scope.table.id = '';
                        // $scope.table.pwd = '';
                        data.callback();
                    });
                }
            };
            $scope.cancel = function () {
                $modalInstance.close();
            }
        }]);

    }]);