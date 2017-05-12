app.controller('storeController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.opts = {
            locale: {
                applyClass: 'btn-green',
                applyLabel: "确定",
                fromLabel: "从",
                toLabel: "至",
                cancelLabel: '取消',
                customRangeLabel: '自定义范围',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                firstDay: 1,
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
                    '十月', '十一月', '十二月'
                ]
            },
            ranges: {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '最近7天': [moment().subtract(6, 'days'), moment()],
                '最近30天': [moment().subtract(30, 'days'), moment()],
                '本月': [moment().startOf('month'), moment().endOf('month')]
            }
        };

        $scope.status = [
            {name: '--请选择--', value: ''},
            {name: '审核中', value: '1'},
            {name: '审核通过', value: '2'},
            {name: '审核失败', value: '3'}];

        $scope.natureData = [
            {name: '社区店', value: 1},
            {name: '商超店', value: 2},
            {name: '医院店', value: 3},
            {name: '母婴店', value: 4},
            {name: '其它', value: 100}
        ];
        $scope.typeData = [
            {name: '加盟店', value: 1},
            {name: '直营店', value: 2},
            {name: '其它', value: 100}
        ];
        //初始化查询参数
        $scope.date = {
            startDate: moment().subtract(1, 'months').startOf('day'),
            endDate: moment().endOf('day')
        };
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

        $scope.changePath = function () {
            $state.go('app.base.store', {
                pageNum: $scope.paginationConf.currentPage,
                pageSize: $scope.paginationConf.itemsPerPage,
                name: $scope.data.name});
        };

        //列表数据
        $scope.tableData = [];
        //加载数据请求
        $scope.load = function () {
            $ajax.get('/cms/store/page', {
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage,
                // startDate: $scope.date.startDate.unix(),
                // endDate: $scope.date.endDate.unix(),
                name: $scope.data.name
            }, function (data) {
                $scope.tableData = data.list;
                $scope.paginationConf.totalItems = data.total;
            });
        };
        $scope.load();

        $scope.editStore = function (store) {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'editStoreModalContent.html',
                controller: 'editStoreController',
                backdrop: 'static',
                size: 'lg',

                resolve: {
                    data: function () {
                        return {
                            store: angular.copy(store),
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

        $scope.deleteStore = function (store) {
            layer.confirm('确定要删除门店' + store.name + '吗？', {
                btn: ['删除', '取消'] //按钮
            }, function (index) {
                $ajax['delete']('/cms/store/delete/' + store.id, function () {
                    Notify.success("门店已删除");
                    $scope.load();
                    layer.close(index);
                    delete $rootScope.storeMap[store.id + ''];
                });
            }, function () {
            });
        };

        $scope.downloadQRCode = function (store) {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'downloadQRCodeModal.html',
                controller: 'downloadQRCodeController',
                backdrop: 'static',
                size: 'sm',

                resolve: {
                    data: function () {
                        return {
                            store: angular.copy(store),
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

        var $importStoreBtn = $('#importStoreBtn');
        $importStoreBtn.upload({
            action: "/cms/store/insertListWithExcel", //上传地址
            location: ".storePage",
            fileName: "file",                        //文件名称。用于后台接收
            params: {
                appid: $rootScope.mpAppid
            },                               //参数
            accept: ".xls,.xlsx",                    //文件类型
            complete: function (result) {
                if (result.code == 200) {
                    $scope.load();
                    $rootScope.loadStoreData();
                    $modal.open({
                        windowClass: 'import-result-modal',
                        templateUrl: 'importError.html',
                        controller: 'importErrorController',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            data: function () {
                                return {
                                    result: result
                                };
                            }
                        }
                    });
                } else {
                    Notify.error(result.msg);
                }
                $(this).val('');
            },
            submit: function ($form) {   //提交之前
                var filename = $form.find(':file').val().toLowerCase();
                if (!/(\.xls|\.xlsx)$/i.test(filename)) {
                    Notify.error('只能是xls或xlsx格式的文件！');
                    return false;
                } else {
                    return true;
                }
            }
        });
    }]);

app.controller('editStoreController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    //是否新增
    $scope.isCreate = !data.store;

    //省份数据
    $scope.provinceData = areaData.filter(function (region) {
        return region.level == 0;
    });
    $scope.filterAreaData = function (parentId) {
        return areaData.filter(function (region) {
            return region.parentId === parentId;
        });
    };
    //对话框标题
    $scope.title = $scope.isCreate ? '新增门店' : '编辑门店信息';
    data.store = data.store || {
            acreage: 0,
            nature: '',
            type: '',
            medicareFlag: 1
        };
    $scope.data = data;

    //初始化省市区信息
    $scope.selectedArea = {
        province: undefined,
        city: undefined,
        area: undefined
    };
    if (!$scope.isCreate) {
        $scope.selectedArea.province = areaData.filter(function (region) {
            return region.name === data.store.provinceName && region.level == 0;
        })[0];
        $scope.selectedArea.city = areaData.filter(function (region) {
            return region.name === data.store.cityName;
        })[0];
        $scope.selectedArea.area = areaData.filter(function (region) {
            return region.name === data.store.areaName && region.level == 2;
        })[0];
    }

    //开业时间
    $scope.data.openTime = $scope.data.store.openTime ? moment(new Date($scope.data.store.openTime * 1000)) : moment().startOf('day');

    $scope.ok = function () {
        if (!($scope.editStoreForm.$invalid || !$scope.selectedArea.province || !$scope.selectedArea.city || !$scope.data.store.nature || !$scope.data.store.type)) {
            //处理获取数据
            $scope.data.store.provinceId = $scope.selectedArea.province.id;
            $scope.data.store.provinceName = $scope.selectedArea.province.name;
            $scope.data.store.cityId = $scope.selectedArea.city.id;
            $scope.data.store.cityName = $scope.selectedArea.city.name;
            if($scope.selectedArea.area) {
                $scope.data.store.areaId = $scope.selectedArea.area.id;
                $scope.data.store.areaName = $scope.selectedArea.area.name;
            } else {
                $scope.data.store.areaId = 0;
                $scope.data.store.areaName = '';
            }
            $scope.data.store.openTime = $scope.data.openTime.unix();

            if ($scope.isCreate) {
                $ajax.post('/cms/store/create', $scope.data.store, function () {
                    Notify.success("新增门店成功");
                    $modalInstance.close();
                    data.callback();
                    $rootScope.loadStoreData();
                });
            } else {
                $ajax.put('/cms/store/update/' + $scope.data.store.id, $scope.data.store, function () {
                    Notify.success("修改门店信息成功");
                    $modalInstance.close();
                    data.callback();
                    $rootScope.loadStoreData();
                });
            }
        }
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);

app.controller('downloadQRCodeController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    //对话框标题
    $scope.store = data.store;
    $scope.qrcodeUrl = '';

    $ajax.get('/cms/store/' + data.store.id + '/qrcode?mpOpenid=' + $rootScope.mpAppid, {}, function (result) {
        console.log(result);
        $scope.qrcodeUrl = result;
    });

    $scope.ok = function () {
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);

app.controller('importErrorController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {
    //对话框标题
    $scope.result = data.result;

    $scope.download = function () {
        window.open('/cms/download?fileName=' + $scope.result.data.errorFile, '_blank');
    };
    $scope.cancel = function () {
        $modalInstance.close();
    }
}]);