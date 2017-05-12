app.controller('followerDataController', ['$scope', '$rootScope', '$ajax', '$location', function ($scope, $rootScope, $ajax, $location) {

    $scope.data = {};
    $scope.date = {
        startDate: moment(),
        endDate: moment()
    };

    //增长概况
    $scope.increaseSituation = 1;
    $scope.increaseSituationData = {
        cancelCount: 0,
        netNewCount: 0,
        newCount: 0,
        totalCount: 0
    };
    var countAnimation = function(obj, attr, dest) {
        if(obj[attr] == dest) {
            return;
        }
        var tmp = obj[attr] > dest ? -1 : 1;
        var it = setInterval(function() {
            obj[attr] += tmp;
            if(obj[attr] == dest) {
                clearInterval(it);
                it = 0;
            }
            $scope.$digest();
        }, 10);
    };
    $scope.getIncreaseSituation = function (intervalEnum) {
        $scope.increaseSituation = intervalEnum;
        $ajax.get('/cms/dataStatistic/follower/increaseSituation', {
            intervalEnum: intervalEnum
        }, function (data) {
            $scope.increaseSituationData = data;
            // countAnimation($scope.increaseSituationData, 'isErpMemberCount', data.isErpMemberCount);
            // countAnimation($scope.increaseSituationData, 'isNotErpMemberCount', data.isNotErpMemberCount);
            // countAnimation($scope.increaseSituationData, 'isNotErpMemberPercent', data.isNotErpMemberPercent);
            // countAnimation($scope.increaseSituationData, 'totalCount', data.totalCount);
            // countAnimation($scope.increaseSituationData, 'sumCount', data.sumCount);
        });
    };
    $scope.getIncreaseSituation($scope.increaseSituation);

    //增长趋势
    $scope.showChart = function() {
        $scope.distribution.series[0].data = $scope.increaseTendencyData.map(function(d){return d.newCount});
        $scope.distribution.series[1].data = $scope.increaseTendencyData.map(function(d){return d.cancelCount});
        $scope.distribution.series[2].data = $scope.increaseTendencyData.map(function(d){return d.netNewCount});
        var myChart = echarts.init(document.getElementById('charts'));
        myChart.setOption($scope.distribution);
    };
    $scope.opts = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "确定",
            separator: "至",
            cancelLabel: '取消',
            customRangeLabel: '自定义范围',
            firstDay: 1
        },
        ranges: {
            '最近7天': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
            '最近15天': [moment().subtract(16, 'days'), moment().subtract(1, 'days')],
            '最近30天': [moment().subtract(31, 'days'), moment().subtract(1, 'days')]
        },
        eventHandlers: {'apply.daterangepicker': function(ev, picker) {
            $scope.getIncreaseTendency();
        }
        }
    };

    $scope.increaseTendencyParams = {
        date: {
            startDate: moment().subtract(7, 'days'),
            endDate: moment().subtract(1, 'days')
        }
    };
    $scope.increaseTendencyData = [];

    $scope.distribution = {
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [],
                splitLine: {
                    show: true
                },
                axisLine:{
                    show: false
                },
                axisTick: {
                    lineStyle: {color: '#ccc'}
                },
                axisLabel: {
                    textStyle: {color: '#999'}
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                minInterval: 1,
                axisLine:{
                    show: false
                },
                axisTick: {
                    lineStyle: {color: '#ccc'}
                },
                axisLabel: {
                    textStyle: {color: '#999'}
                }
            }
        ],
        grid: {
            left: '3%',
            right: '3%',
            bottom: '10%',
            top: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line'
            }
        },
        legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
            data: ['新增关注', '取消关注', '净关注']
        },
        series: [
            {
                symbolSize: 8,
                name: '新增关注',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#0B6EEF'
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(11, 110, 239, 0.2)'
                        }, {
                            offset: 1,
                            color: 'rgba(255, 255, 255, .1)'
                        }])
                    }
                },
                data: []
            },
            {
                symbolSize: 8,
                name: '取消关注',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#26C166',
                        lineStyle: {
                            width: 2
                        }
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(38, 193, 102, 0.1)'
                        }, {
                            offset: 1,
                            color: 'rgba(255, 255, 255, 0.1)'
                        }])
                    }
                },
                data: []
            },
            {
                symbolSize: 8,
                name: '净关注',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#FD6D4B',
                        lineStyle: {
                            width: 2
                        }
                    }
                },
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(253, 112, 79, 0.3)'
                        }, {
                            offset: 1,
                            color: 'rgba(255, 255, 255, .1)'
                        }])
                    }
                },
                data: []
            }
        ]
    };
    $scope.getIncreaseTendency = function () {
        $ajax.get('/cms/dataStatistic/follower/increaseTendency', {
            startDate: $scope.increaseTendencyParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.increaseTendencyParams.date.endDate.format('YYYY-MM-DD')
        }, function (data) {
            $scope.increaseTendencyData = data;
            $scope.distribution.xAxis[0].data = $scope.increaseTendencyData.map(function(d){return moment(d.date * 1000).format('YYYY-MM-DD')});
            $scope.showChart();
        });
    };
    $scope.getIncreaseTendency();

    //明细
    $scope.opts3 = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "确定",
            separator: "至",
            cancelLabel: '取消',
            customRangeLabel: '自定义范围',
            firstDay: 1
        },
        ranges: {
            '最近7天': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
            '最近15天': [moment().subtract(16, 'days'), moment().subtract(1, 'days')],
            '最近30天': [moment().subtract(31, 'days'), moment().subtract(1, 'days')]
        },
        eventHandlers: {'apply.daterangepicker': function(ev, picker) {
                $scope.getStoreRank();
            }
        },
        opens: "left"
    };

    //增长明细
    $scope.opts4 = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "确定",
            separator: "至",
            cancelLabel: '取消',
            customRangeLabel: '自定义范围',
            firstDay: 1
        },
        ranges: {
            '最近7天': [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
            '最近15天': [moment().subtract(16, 'days'), moment().subtract(1, 'days')],
            '最近30天': [moment().subtract(31, 'days'), moment().subtract(1, 'days')]
        },
        eventHandlers: {'apply.daterangepicker': function(ev, picker) {
            $scope.getIncreaseDetail();
        }
        }
    };
    $scope.paginationConf1 = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10,
        pagesLength: 10,
        perPageOptions: [10, 20, 30, 40, 50],
        hideGoto: true,
        onChange: function () {
            $scope.getIncreaseDetail();
        }
    };
    $scope.increaseDetailParams = {
        date: {
            startDate: moment().subtract(7, 'days'),
            endDate: moment().subtract(1, 'days')
        }
    };
    $scope.increaseDetailData = [];
    $scope.getIncreaseDetail = function () {
        $ajax.get('/cms/dataStatistic/follower/selectForPageByAppidAndDate', {
            startDate: $scope.increaseDetailParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.increaseDetailParams.date.endDate.format('YYYY-MM-DD'),
            pageNum: $scope.paginationConf1.currentPage,
            pageSize: $scope.paginationConf1.itemsPerPage
        }, function (data) {
            $scope.increaseDetailData = data.list;
            $scope.paginationConf1.totalItems = data.total;
        });
    };
    $scope.getIncreaseDetail();

    $scope.exportIncreaseDetail = function() {
        var params = {
            startDate: $scope.increaseDetailParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.increaseDetailParams.date.endDate.format('YYYY-MM-DD'),
            appid: $rootScope.mpAppid
        };
        window.open('/cms/dataStatistic/follower/exportByAppidAndDate?' + $.param(params), '_blank');
    }
}]);