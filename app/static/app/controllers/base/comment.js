app.controller('commentController', [
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
                separator: "至",
                cancelLabel: '取消',
                customRangeLabel: '自定义范围',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                firstDay: 1,
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月',
                    '十月', '十一月', '十二月'
                ]
            },
            ranges: {
                '今天': [moment().startOf('day'), moment().endOf('day')],
                '昨天': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
                '最近7天': [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
                '最近30天': [moment().subtract(30, 'days').startOf('day'), moment().endOf('day')],
                '本月': [moment().startOf('month').startOf('day'), moment().endOf('month').endOf('day')]
            }
        };
        $scope.data = {
            content: ''
        };
        //初始化查询参数
        $scope.date = {
            startDate: moment().subtract(1, 'months').startOf('day'),
            endDate: moment().endOf('day')
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

        $scope.onEmotionSelect = function(id, title, comment) {
            if(((comment.replyContent || '') + '/' + title).length > 600) {
                Notify.warn('超出最大字数限制！');
                return false;
            }
            comment.replyContent = (comment.replyContent || '') + '/' + title;
        };
        $scope.commentList = [];

        $scope.JSON = JSON;

        $scope.load = function() {
            $ajax.get('/cms/wechat/message/list', {
                mpAppid: $rootScope.mpAppid,
                pageSize: $scope.paginationConf.itemsPerPage,
                pageNum: $scope.paginationConf.currentPage,
                startTime: $scope.date.startDate.unix(),
                endTime: $scope.date.endDate.unix(),
                content: $scope.data.content
            }, function (data) {
                console.log(data);
                $scope.commentList = data.list;
                for(var i = 0; i < $scope.commentList.length; i++) {
                    $scope.commentList[i].replies = JSON.parse($scope.commentList[i].replyDescr || '[]');
                }
                $scope.paginationConf.totalItems = data.total;
            });
        };

        $scope.load();

        $scope.reply = function(comment) {
            if(!comment.replyContent) {
                Notify.warn('请输入回复内容!');
                return false;
            }
            $ajax.post('/cms/wechat/message/reply', {
                id: comment.id,
                mpAppid: $rootScope.mpAppid,
                content: comment.replyContent
            }, function (data) {
                $scope.load();
            });
        };
    }]);