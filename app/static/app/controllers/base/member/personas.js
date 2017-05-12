app.controller('personasController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.channelInfluenceParams = {
            date: {
                startDate: moment().subtract(1, 'days'),
                endDate: moment().subtract(1, 'days')
            }
        };
        $scope.channelInfluenceData = {
            total: 0,//总会员数
            importantValue: 0,//重要价值
            importantMaintenance: 0,//重要保持
            importantDevelopment: 0,//重要发展
            importantRetention: 0,//重要挽留
        };

        $scope.distribution1 = {
            tooltip: {
                trigger: 'item',
                formatter: function (params, ticket, callback) {
                    return params.name == '其他' ? '' : params.name + ': ' + params.percent + '%';
                }
            },
            series: [
                {
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    name: '',
                    type: 'pie',
                    radius: ['75%', '80%'],
                    color: ['#2372F3', '#efefef'],
                    data: [
                        {value: 335, name: '转化率', hoverAnimation: true},
                        {value: 310, name: '其他', hoverAnimation: false}
                    ]
                }
            ]
        };
        $scope.getChannelInfluence = function () {
            $ajax.get('/cms/member/statistics', {
                // startDate: $scope.channelInfluenceParams.date.startDate.format('YYYY-MM-DD'),
                // endDate: $scope.channelInfluenceParams.date.endDate.format('YYYY-MM-DD')
            }, function (data) {
                $scope.channelInfluenceData = data;

                var myChart = echarts.init(document.getElementById('pieChart'));
                $scope.distribution1.series[0].data[0].value = data.importantValue;
                $scope.distribution1.series[0].data[0].name = '重要价值会员';
                $scope.distribution1.series[0].data[1].value = data.total - data.importantValue;
                myChart.setOption($scope.distribution1);

                var myChart = echarts.init(document.getElementById('pieChart2'));
                $scope.distribution1.series[0].data[0].value = data.importantMaintenance;
                $scope.distribution1.series[0].data[1].value = data.total - data.importantMaintenance;
                $scope.distribution1.series[0].data[0].name = '重要保持会员';
                myChart.setOption($scope.distribution1);

                var myChart = echarts.init(document.getElementById('pieChart3'));
                $scope.distribution1.series[0].data[0].value = data.importantDevelopment;
                $scope.distribution1.series[0].data[1].value = data.total - data.importantDevelopment;
                $scope.distribution1.series[0].data[0].name = '重要发展会员';
                myChart.setOption($scope.distribution1);

                var myChart = echarts.init(document.getElementById('pieChart4'));
                $scope.distribution1.series[0].data[0].value = data.importantRetention;
                $scope.distribution1.series[0].data[1].value = data.total - data.importantRetention;
                $scope.distribution1.series[0].data[0].name = '重要挽留会员';
                myChart.setOption($scope.distribution1);
            });
        };
        $scope.getChannelInfluence();
    }]);