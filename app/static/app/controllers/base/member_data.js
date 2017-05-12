app.controller('memberDataController', ['$scope', '$rootScope', '$ajax', '$location', function ($scope, $rootScope, $ajax, $location) {

    $scope.data = {};
    $scope.date = {
        startDate: moment(),
        endDate: moment()
    };

    $scope.filterType = [
        {key: -1, value: '微信会员'},
        {key: 0, value: '新注册微信会员'},
        {key: 1, value: '原ERP会员激活'}
    ];

    //增长概况
    $scope.increaseSituation = 1;
    $scope.increaseSituationData = {
        increasePercent: 0,
        isErpMemberCount: 0,
        isErpMemberPercent: 0,
        isNotErpMemberCount: 0,
        isNotErpMemberPercent: 0,
        totalCount: 0,
        sumCount: 0
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
        $ajax.get('/cms/dataStatistic/increaseSituation', {
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
        if($scope.increaseTendencyParams.isErpMember == -1) {
            $scope.distribution.series[0].name = '微信会员新增';
            $scope.distribution.series[0].data = $scope.increaseTendencyData.map(function(d){return d.totalCount});
        } else if ($scope.increaseTendencyParams.isErpMember == 0) {
            $scope.distribution.series[0].name = '新注册微信会员新增';
            $scope.distribution.series[0].data = $scope.increaseTendencyData.map(function(d){return d.isNotErpMemberCount});
        } else if ($scope.increaseTendencyParams.isErpMember == 1) {
            $scope.distribution.series[0].name = '原ERP会员激活新增';
            $scope.distribution.series[0].data = $scope.increaseTendencyData.map(function(d){return d.isErpMemberCount});
        }
        var myChart = echarts.init(document.getElementById('charts'));
        myChart.setOption($scope.distribution);
    };
    $scope.maxDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
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
        },
        isErpMember: -1,
        store: null
    };
    $scope.increaseTendencyData = [];

    $scope.distribution = {
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [],
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#efefef'
                    }
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
                boundaryGap: ['0', '10%'],
                axisLine:{
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#efefef'
                    }
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
            data: ['微信会员新增', '新注册微信会员新增', '原ERP会员激活新增']
        },
        series: [
            {
                name: '所有微信会员',
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
                            color: '#639bf5'
                        }, {
                            offset: 1,
                            color: 'rgba(255, 255, 255, .2)'
                        }])
                    }
                },
                data: []
            }
        ]
    };
    $scope.getIncreaseTendency = function () {
        $ajax.get('/cms/dataStatistic/increaseTendency', {
            isErpMember: $scope.increaseTendencyParams.isErpMember,
            startDate: $scope.increaseTendencyParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.increaseTendencyParams.date.endDate.format('YYYY-MM-DD'),
            storeId: $scope.increaseTendencyParams.store ? $scope.increaseTendencyParams.store.key : 0
        }, function (data) {
            $scope.increaseTendencyData = data;
            $scope.distribution.xAxis[0].data = $scope.increaseTendencyData.map(function(d){return d.date});
            $scope.showChart();
        });
    };
    $scope.getIncreaseTendency();

    //渠道效果
    $scope.opts2 = {
        locale: {
            applyClass: 'btn-green',
            applyLabel: "确定",
            separator: "至",
            cancelLabel: '取消',
            customRangeLabel: '自定义范围',
            firstDay: 1
        },
        ranges: {
            '最近7天': [moment().subtract(6, 'days'), moment().subtract(1, 'days')],
            '最近15天': [moment().subtract(15, 'days'), moment().subtract(1, 'days')],
            '最近30天': [moment().subtract(30, 'days'), moment().subtract(1, 'days')]
        },
        eventHandlers: {'apply.daterangepicker': function(ev, picker) {
            $scope.getChannelInfluence();
        }
        }
    };
    $scope.channelInfluenceParams = {
        date: {
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days')
        }
    };
    $scope.channelInfluenceData = {
        fansCount: 0
    };

    $scope.distribution1 = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {d}% ({c})"
        },
        legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
            data: ['转化率', '流失率']
        },
        series: [
            {
                label: {
                    normal: {
                        show: true,
                        formatter: function (d) {
                            if (d.name == "转化率") {
                                return "\n转化率：" + d.percent + "%"
                            } else {
                                return "\n流失率：" + d.percent + "%"
                            }
                        }
                    }
                },
                name: '访问来源',
                type: 'pie',
                radius: ['40%', '70%'],
                color: ['#2372F3', '#c6c6c6'],
                data: [
                    {value: 335, name: '转化率'},
                    {value: 310, name: '流失率'}
                ]
            }
        ]
    };
    $scope.getChannelInfluence = function () {
        $ajax.get('/cms/dataStatistic/channelInfluence', {
            startDate: $scope.channelInfluenceParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.channelInfluenceParams.date.endDate.format('YYYY-MM-DD')
        }, function (data) {
            $scope.channelInfluenceData = data;
            $scope.distribution1.series[0].data[0].value = data.memberCount;
            $scope.distribution1.series[0].data[1].value = data.notMemberCount;
            var myChart = echarts.init(document.getElementById('pieChart'));
            myChart.setOption($scope.distribution1);
        });
    };
    $scope.getChannelInfluence();

    //门店排名
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
    $scope.paginationConf = {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 5,
        pagesLength: 7,
        perPageOptions: [10, 20, 30, 40, 50],
        hideGoto: true,
        onChange: function () {
            $scope.getStoreRank();
        }
    };
    $scope.storeRankParams = {
        date: {
            startDate: moment().subtract(1, 'days'),
            endDate: moment().subtract(1, 'days')
        },
        sort: {
            totalCount: 'desc'
        }
    };
    $scope.storeRankData = [];
    $scope.getStoreRank = function () {
        $ajax.get('/cms/dataStatistic/selectForPageRank', {
            startDate: $scope.storeRankParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.storeRankParams.date.endDate.format('YYYY-MM-DD'),
            pageNum: $scope.paginationConf.currentPage,
            pageSize: $scope.paginationConf.itemsPerPage,
            orderBy: angular.toJson($scope.storeRankParams.sort)
        }, function (data) {
            $scope.storeRankData = data.list;
            $scope.paginationConf.totalItems = data.total;
        });
    };
    $scope.getStoreRank();
    $scope.sortStoreRank = function() {
        $scope.storeRankParams.sort.totalCount = $scope.storeRankParams.sort.totalCount == 'asc' ? 'desc' : 'asc';
        $scope.getStoreRank();
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
        },
        store: null
    };
    $scope.increaseDetailData = [];
    $scope.getIncreaseDetail = function () {
        $ajax.get('/cms/dataStatistic/selectForPageByAppidAndDateAndStoreIds', {
            startDate: $scope.increaseDetailParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.increaseDetailParams.date.endDate.format('YYYY-MM-DD'),
            pageNum: $scope.paginationConf1.currentPage,
            pageSize: $scope.paginationConf1.itemsPerPage,
            storeId: $scope.increaseDetailParams.store ? $scope.increaseDetailParams.store.key : 0
        }, function (data) {
            $scope.increaseDetailData = data.list;
            $scope.paginationConf1.totalItems = data.total;
        });
    };
    $scope.getIncreaseDetail();

    $scope.exportRank = function() {
        var params = {
            startDate: $scope.storeRankParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.storeRankParams.date.endDate.format('YYYY-MM-DD'),
            appid: $rootScope.mpAppid
        };
        window.open('/cms/dataStatistic/export/exportRank?' + $.param(params), '_blank');
    };

    $scope.exportIncreaseDetail = function() {
        var params = {
            startDate: $scope.increaseDetailParams.date.startDate.format('YYYY-MM-DD'),
            endDate: $scope.increaseDetailParams.date.endDate.format('YYYY-MM-DD'),
            appid: $rootScope.mpAppid,
            storeId: $scope.increaseDetailParams.store ? $scope.increaseDetailParams.store.key : 0
        };
        window.open('/cms/dataStatistic/export/exportByAppidAndDateAndStoreIds?' + $.param(params), '_blank');
    }
}]);