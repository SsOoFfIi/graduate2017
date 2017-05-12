/**
 * Created by test on 2017/3/24.
 */
app.controller('statisticsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.data = {
            num: parseInt($stateParams.serialNum) || 1,
            pwd: $stateParams.tablePwd || '00000000',
        };

        //分页信息
        $scope.paginationConf = {
            currentPage: $stateParams.page || 1,
            // totalItems: 7,
            itemsPerPage: 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.change()
            }
        };

        $scope.change = function () {
            $state.go('app.main.statistics', {
                serialNum: $scope.data.num,
                tablePwd: $scope.data.pwd,
                page: $scope.paginationConf.currentPage
            })
        };
        $scope.subjectArray = [];

        $scope.visualize = [];
        $scope.tableList = [];
        // $scope.numData
        $scope.load = function () {
            $ajax.post('/index/tabdata/', {
                serialNum: $scope.data.num,
                tablePwd: $scope.data.pwd,
                page: parseInt($scope.paginationConf.currentPage)
            }, function (data) {
                $scope.paginationConf.totalItems = data.totalRow;
                $scope.tableList = data.list;
                $scope.subjectCount = data.subjectCount;
                $scope.subjectName = data.subjectName;
                $scope.visualize = data.visualize;
                $scope.tableName = data.tableName;
                $scope.subjectBoolean();
                 $scope.showChart();

            })
        };

        $scope.exportExcel = function () {
                window.open('/file/excelexport/' + $scope.data.num,'_blank');
        };

//神迹函数
        $scope.subjectBoolean = function () {
            var temp = [];
            for (var key in $scope.tableList) {
                for (var j = 0; j < $scope.subjectName.length + 1; j++) {
                    if ($scope.tableList[key][$scope.subjectName[j]] && j < $scope.subjectName.length) {
                        temp.push($scope.subjectName[j]);
                    }
                }
                $scope.tableList[key].sub = temp;
                $scope.subjectArray.push(temp);
                temp = [];
            }
        };


        $scope.load();


        $scope.name = [];
        $scope.subData = [];
        //增长趋势
        $scope.showChart = function () {

            for (var key in $scope.visualize) {
                $scope.name.push(key);
                $scope.subData.push($scope.visualize[key]);
            }


            var myChart = echarts.init(document.getElementById('charts'));
            myChart.setOption($scope.distribution);
        };

        $scope.distribution = {
            color: ['#3398DB'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: $scope.name,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '已选人数',
                    type: 'bar',
                    barWidth: '50%',
                    data: $scope.subData
                }
            ]
        };

          $scope.sure = function () {
            var modalInstance = $modal.open({
                windowClass: '',
                templateUrl: 'sure.html',
                controller: 'sureController',
                backdrop: 'static',
                size: 'normal',

                resolve: {
                    data: function () {
                        return {
                            // row: $scope.row,
                            // subjectName: $scope.subjectName,
                            // serialNum:parseInt($scope.table.id),
                            // rowNum: $scope.userrowData.rowNum,
                            // callback: function () {
                            //     $scope.load();

                            // }
                            // delete:$scope.delete()
                            num:$scope.data.num
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
        app.controller('sureController', ['$scope', '$rootScope', '$ajax', '$modalInstance', 'data', function ($scope, $rootScope, $ajax, $modalInstance, data) {

            $scope.data = data;

               $scope.delete= function () {
            $ajax.post('/index/tabdelete/',{
                serialNum:$scope.data.num,
                username:$rootScope.userData.username
            },function(){
                Notify.success("删除成功");
            })
        };
            $scope.ok = function () {

                $scope.delete();
                $modalInstance.close();
                window.location.href='#/overview';
            };
            $scope.cancel = function () {
                $modalInstance.close();
            }
        }]);


    }]);