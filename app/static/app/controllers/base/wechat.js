app.controller('wechatController', [
    '$scope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $ajax, $state, $stateParams, $location, $modal) {
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
            {name: '--请选择--', value: ''},
            {name: '社区店', value: '1'},
            {name: '商超店', value: '2'},
            {name: '医院店', value: '3'},
            {name: '母婴店', value: '4'},
            {name: '其它', value: '100'}
        ];
        $scope.typeData = [
            {name: '--请选择--', value: ''},
            {name: '加盟店', value: '1'},
            {name: '直营店', value: '2'},
            {name: '其它', value: '100'}
        ];
        //初始化查询参数
        $scope.date = {
            startDate: moment().subtract(1, 'months').startOf('day'),
            endDate: moment().endOf('day')
        };
        $scope.data = {
            name: ''
        };

        //分页信息
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.changePath();
            }
        };

        $scope.changePath = function () {
            $scope.load();
        };

        //列表数据
        $scope.tableData = [];
        //加载数据请求
        $scope.load = function () {
            $ajax.get('/cms/store/page', {
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage,
                // startDate: $scope.date.startDate.unix() * 1000,
                // endDate: $scope.date.endDate.unix() * 1000,
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
                size: 0,

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
                });
            }, function () {
            });
        }
    }]);