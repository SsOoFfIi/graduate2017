app.controller('assistantController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    'Upload',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, Upload) {
        $scope.storeLoaded = false;
        $scope.storeList = [];
        $ajax.get('/cms/store/page', {
            pageSize: 10000,
            pageNum: 1
        }, function (data) {
            $scope.storeLoaded = true;
            $scope.storeList = data.list;
        });
        $scope.data = {
            name: $stateParams.name || '',//用于按昵称筛选
            customerStoreId: $stateParams.customerStoreId ? parseInt($stateParams.customerStoreId) : ''//用于筛选的门店id
        };

        //分页信息
        $scope.paginationConf = {
            currentPage: $stateParams.pageNum || 1,
            totalItems: 0,
            itemsPerPage: $stateParams.pageSize || 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.changePath(true);
            }
        };

        $scope.changePath = function (isNext) {
            $state.go('app.base.assistant.assistantList', {
                pageNum: isNext ? $scope.paginationConf.currentPage : 1,
                pageSize: $scope.paginationConf.itemsPerPage,
                name: $scope.data.name,
                customerStoreId: $scope.data.customerStoreId
            });
        };

        //列表数据
        $scope.tableData = [];
        //加载数据请求
        $scope.load = function () {
            $ajax.get('/cms/cmsCustomerStoreUser/page', {
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage,
                nameOrMobile: $scope.data.name,
                storeId: $scope.data.customerStoreId
            }, function (data) {
                $scope.tableData = data.list;
                $scope.paginationConf.totalItems = data.total;
            });
        };
        $scope.load();
        $scope.editAssistant = function (assistant) {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'editAssistantModalContent.html',
                controller: 'editAssistantController',
                backdrop: 'static',
                size: '',

                resolve: {
                    data: function () {
                        return {
                            storeList: $scope.storeList,
                            assistant: angular.copy(assistant),
                            natureData: $scope.natureData,
                            typeData: $scope.typeData,
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

        $scope.disableAssistant = function (assistant) {
            layer.confirm('确定禁用店员' + assistant.name + '吗？<br>禁用后该店员无法通过手机号登录心康助手。', {
                btn: ['禁用', '取消'] //按钮
            }, function (index) {
                $ajax.get('/cms/cmsCustomerStoreUser/delete', {id: assistant.id}, function () {
                    Notify.success("店员已禁用");
                    $scope.load();
                    layer.close(index);
                });
            }, function () {
            });
        };

        $scope.enableAssistant = function (assistant) {
            layer.confirm('确定重新启用' + assistant.name + '吗？<br>启用后店员有权限操作的功能会重启开通。', {
                btn: ['启用', '取消'] //按钮
            }, function (index) {
                $ajax.get('/cms/cmsCustomerStoreUser/unDelete', {id: assistant.id}, function () {
                    Notify.success("店员已重新启用");
                    $scope.load();
                    layer.close(index);
                });
            }, function () {
            });
        };

        $scope.upload = function (file, errFiles) {
            if (!/(\.xls|\.xlsx)$/i.test(file.name)) {
                Notify.error('只能是xls或xlsx格式的Excel文件！');
                return false;
            }
            Upload.upload({
                url: '/cms/cmsCustomerStoreUser/insertListWithExcel',
                data: {file: file}
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                if (resp.data.code == 200) {
                    $scope.load();
                    $modal.open({
                        windowClass: 'import-result-modal',
                        templateUrl: 'importResult.html',
                        controller: 'importResultController',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            data: function () {
                                return {
                                    result: resp.data
                                };
                            }
                        }
                    });
                } else {
                    Notify.error(resp.data.msg);
                }
            }, function (resp) {
                Notify.error('上传文件失败！');
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
    }]);

app.controller('editAssistantController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    //是否新增
    $scope.isCreate = !data.assistant;
    //对话框标题
    $scope.title = $scope.isCreate ? '新增店员' : '编辑店员信息';
    data.assistant = data.assistant || {
            gender: '男',
            position: '店长'
        };
    $scope.data = data;

    //开业时间
    $scope.data.birthday = $scope.data.assistant.birthday ? moment(new Date($scope.data.assistant.birthday * 1000)) : moment().startOf('day');

    $scope.ok = function () {
        if (!($scope.editAssistantForm.$invalid)) {
            //处理获取数据
            if ($scope.isCreate) {
                $ajax.post('/cms/cmsCustomerStoreUser/insert', $scope.data.assistant, function () {
                    Notify.success("新增店员成功");
                    $modalInstance.close();
                    data.callback();
                });
            } else {
                $ajax.put('/cms/cmsCustomerStoreUser/update', $scope.data.assistant, function () {
                    Notify.success("修改店员信息成功");
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

app.controller('importResultController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    //对话框标题
    $scope.result = data.result;

    $scope.download = function () {
        window.open('/cms/download?fileName=' + $scope.result.data.errorFile, '_blank');
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);