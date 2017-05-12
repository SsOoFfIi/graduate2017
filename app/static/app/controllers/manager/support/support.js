app.controller('supportController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.data = {
            name: $stateParams.name || ''
        };

        //分页信息
        $scope.paginationConf = {
            currentPage: $stateParams.pageNum || 1,
            totalItems: 0,
            itemsPerPage: $stateParams.pageSize || 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.changePath();
            }
        };
        //router
        $scope.changePath = function () {
            $state.go('app.manager.support', {
                pageNum: $scope.paginationConf.currentPage,
                pageSize: $scope.paginationConf.itemsPerPage,
                name: $scope.data.name
            });
        };

        $scope.tableData = [];
        $scope.load = function () {
            $ajax.get('/support/user/list', {
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage,
                name: $scope.data.name
            }, function (data) {
                $scope.tableData = data.list;
                $scope.paginationConf.totalItems = data.total;
            })
        };

        $scope.load();
        $scope.editAccount = function (account) {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'editAccountModalContent.html',
                controller: 'editAccountController',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    data: function () {
                        return {
                            account: angular.copy(account),
                            callback: function () {
                                $scope.load();
                            }
                        }
                    }
                }
            });

        };

        $scope.deleteAccount = function (account) {
            layer.confirm('确定要删除账号' + account.name + '吗？', {
                btn: ['删除', '取消']
            }, function (index) {
                $ajax.post('/support/user/delete', {
                    userId: account.id
                }, function () {
                    Notify.success('账户已删除');
                    layer.close(index);
                    $scope.load();

                })
            })
        };

        $scope.resetPassword = function (account) {
            layer.confirm('确定要重置账号' + account.name + '的密码为【123456】吗？', {
                btn: ['确定', '取消']
            }, function (index) {
                $ajax.post('/support/user/resetPassword', {
                    userId: account.id
                }, function () {
                    Notify.success('密码已重置');
                    layer.close(index);
                    $scope.load();
                })
            })
        }


    }]);

app.controller('editAccountController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data',
    function ($scope, $rootScope, $ajax, $modalInstance, data) {
        //是否新增
        $scope.isCreate = !data.account;
        //对话框标题
        $scope.title = $scope.isCreate ? '新增账户' : '编辑账户信息';
        $scope.power = {//权限列表,默认全选
            id1: 0,//0代表选中
            id2: 0,
            id3: 0,
            id4: 0,
            id5: 0,
            id6: 0,
            id7: 0,
        };
        if ($scope.isCreate) {//新增
            data.account = {
                loginName: '',
                name: '',
                mobile: '',
                password: '',
                disPowers: '',//被禁用的权限列表
            };
        } else {//编辑
            if (data.account.disPowers) {//有权限被禁用
                var split = data.account.disPowers.split(",");//切割数组
                if (split.indexOf("100000020001") >= 0) $scope.power.id1 = 100000020001;
                if (split.indexOf("100000020002") >= 0) $scope.power.id2 = 100000020002;
                if (split.indexOf("100000020003") >= 0) $scope.power.id3 = 100000020003;
                if (split.indexOf("100000010001") >= 0) $scope.power.id4 = 100000010001;
                if (split.indexOf("100000010002") >= 0) $scope.power.id5 = 100000010002;
                if (split.indexOf("200000010001") >= 0) $scope.power.id6 = 200000010001;
                if (split.indexOf("200000010002") >= 0) $scope.power.id7 = 200000010002;
            }
        }

        $scope.data = data;


        $scope.ok = function () {
            $scope.data.account.disPowers='';
            //遍历未选中的权限
            for (var key in  $scope.power) {
                if ($scope.power[key] > 0) {
                    $scope.data.account.disPowers += $scope.power[key] + ',';
                }
            }
            if ($scope.data.account.disPowers.length > 1) {
                $scope.data.account.disPowers = $scope.data.account.disPowers.substring(0, $scope.data.account.disPowers.length - 1)
            }
            if (!($scope.editAccountForm.$invalid)) {
                //处理获取数据
                if ($scope.isCreate) {
                    $ajax.post('/support/user/add', $scope.data.account, function () {
                        Notify.success("新增账户成功");
                        $modalInstance.close();
                        data.callback();
                    });
                } else {
                    $ajax.post('/support/user/update', $scope.data.account, function () {
                        Notify.success("修改账户信息成功");
                        $modalInstance.close();
                        data.callback();
                    });

                }
            }
        };
        $scope.cancel = function () {
            $modalInstance.close();
        }
    }]);