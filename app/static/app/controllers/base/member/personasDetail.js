app.controller('personasDetailController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.data = [{
            id: 0,
            name: '重要价值会员',
            summary: 'CMH数据支持，第一药店专家背书，打造最精准最实用的药店会员画像',
            details: [
                '重要价值会员是指活跃度、忠诚度、购买力都较高，为企业带来最大价值的会员。',
                '配合标签进行筛选，例如慢病人群标签，则筛选得到的会员是重要价值会员中的慢病会员，应确保不脱离。'
            ],
            total: 0,
            important: 0,
            type: 'importantValue'
        }, {
            id: 1,
            name: '重要保持会员',
            summary: 'CMH数据支持，第一药店专家背书，打造最精准最实用的药店会员画像',
            details: [
                '重要保持会员是指过去的忠诚度和购买力较高，但近期活跃度较低的会员，有脱离粘性的可能；',
                '企业应重视这部分会员，通过电话回访等措施，进行重新激活，防止高价值会员流失。'
            ],
            total: 0,
            important: 0,
            type: 'importantMaintenance'
        }, {
            id: 2,
            name: '重要发展会员',
            summary: 'CMH数据支持，第一药店专家背书，打造最精准最实用的药店会员画像',
            details: [
                '重要发展会员是潜力较高的会员，提高这部分会员的消费频率是提升销量的重要渠道；',
                '企业可通过各类促销活动吸引这部分会员，以养成会员的购买习惯，提升会员忠诚度。'
            ],
            total: 0,
            important: 0,
            type: 'importantDevelopment'
        }, {
            id: 3,
            name: '重要挽留会员',
            summary: 'CMH数据支持，第一药店专家背书，打造最精准最实用的药店会员画像',
            details: [
                '重要挽留会员是购买力较高，但粘性很差，活跃度较低的会员，企业应尝试进行挽留并分析流失原因；',
                '企业可通过一些优惠活动、赠送抵用券的方式进行挽留。'
            ],
            total: 0,
            important: 0,
            type: 'importantRetention'
        }];
        $scope.memberList = [];
        //分页信息
        $scope.paginationConf = {
            currentPage: 1,
            totalItems: 0,
            itemsPerPage: 10,
            pagesLength: 10,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
                $scope.load();
            }
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
                        {value: 335, name: '转化率'},
                        {value: 310, name: '其他'}
                    ]
                }
            ]
        };
        //参数
        $scope.currentData = $scope.data[$stateParams.type - 1];
        $scope.currentData.total = $stateParams.total;
        $scope.currentData.important = $stateParams.important;
        //圆形图
        $scope.distribution1.series[0].data[0].value = $scope.currentData.important;
        $scope.distribution1.series[0].data[0].name = $scope.currentData.name;
        $scope.distribution1.series[0].data[1].value = $scope.currentData.total - $scope.currentData.important;
        var myChart = echarts.init(document.getElementById('pieChart'));
        myChart.setOption($scope.distribution1);

        $scope.filterParams = {
            personas: $scope.currentData.type,
            memberFlag: 1
        }


        $scope.load = function () {
            $ajax.get('/cms/member/search/' + $scope.paginationConf.currentPage + '/' + $scope.paginationConf.itemsPerPage, $scope.filterParams, function (data, dataTime) {
                $scope.dataTime = dataTime;
                $scope.memberList = data.list;
                $scope.paginationConf.totalItems = data.total;

            });
        };
        $scope.load();
        //距今时间格式化
        $scope.toDays = function (time) {
            return parseInt(($scope.dataTime - time) / 3600 / 24);
        }

        //计算年龄
        $scope.getAge = function (birthday) {
            var nowDate = new Date($scope.dataTime * 1000);
            var birthdayDate = new Date(birthday*1000);
            var year = nowDate.getFullYear() - birthdayDate.getFullYear();
            if (year > 0) {
                return year + '岁';
            } else {
                return '1岁';
            }
        }

    }]);