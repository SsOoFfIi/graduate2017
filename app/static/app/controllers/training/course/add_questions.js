app.controller('addQuestionsController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    '$timeout',
    'Upload',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, $timeout, Upload) {
        if(!$stateParams.id) $scope.$parent.getCourseData();
        $scope.optionsLabel = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        $scope.questions = $scope.$parent.savedQuestions || [];
        $scope.data = {};


        if(!$scope.$parent.savedQuestions) {
            $ajax.get('/cms/train/selectCourseTopic', {trainId: $stateParams.id}, function(data) {
                if(!data.course) $scope.$parent.getCourseData();
                $scope.$parent.course = data.course;
                if(data.topics.length) {
                    for(var i = data.topics.length;i--;) {
                        data.topics[i].options = JSON.parse(data.topics[i].options);
                    }
                } else {
                    data.topics = []
                }
                $scope.$parent.savedQuestions = data.topics;
                $scope.questions = data.topics;
                $scope.data.selectedQuestion = $scope.questions[0];
            });
        } else {
            $scope.questions = $scope.$parent.savedQuestions;
            $scope.data.selectedQuestion = $scope.questions[0];
        }

        $scope.addNewQuestion = function () {
            var newQuestion = {
                type: 2,
                question: '',
                analysis: '',
                options: [{
                    text: '',
                    isAnswer: 'N'
                }, {
                    text: '',
                    isAnswer: 'N'
                }]
            };
            $scope.questions.push(newQuestion);
            $scope.data.selectedQuestion = newQuestion;
        };
        $scope.deleteQuestion = function (index) {
            $scope.questions.splice(index, 1);
            $scope.data.selectedQuestion = $scope.questions[0] || undefined;
        };
        $scope.addNewOption = function () {
            $scope.data.selectedQuestion.options.push({
                text: '',
                isAnswer: 'N'
            })
        };
        $scope.deleteOption = function (index) {
            $scope.data.selectedQuestion.options.splice(index, 1);
        };


        $scope.isEdit = !!$stateParams.mediaId;
        $scope.linkArticleData = {
            type: 'news'
        };
        $scope.articles = [{}];
        $scope.selectedArticle = $scope.articles[0];

        if ($scope.isEdit) {
            $ajax.get('/cms/wechatMpMsgPicLink/selectByMediaId', {
                mediaId: $stateParams.mediaId
            }, function (result) {
                $scope.linkArticleData = result;
                $scope.articles = JSON.parse(result.content);
                $scope.selectedArticle = $scope.articles[0];
            });
        }

        $scope.next = function() {
            if(!$scope.questions.length) {
                Notify.warn('请添加题目！');
                return;
            }
            for(var i = 0; i < $scope.questions.length; i++) {
                var question = $scope.questions[i];
                if(!question.question) {
                    Notify.warn('请填写题目内容！');
                    $scope.data.selectedQuestion = question;
                    return;
                }
                for(var j = 0; j < question.options.length; j++) {
                    if(!question.options[j].text) {
                        Notify.warn('请填写所有选项！');
                        $scope.data.selectedQuestion = question;
                        return;
                    }
                }
                if(question.options.filter(function(q){return q.isAnswer == 'Y'}).length == 0) {
                    Notify.warn('请至少选择一项正确答案！');
                    $scope.data.selectedQuestion = question;
                    return;
                }
                if(!question.analysis) {
                    Notify.warn('请填写答案解析！');
                    $scope.data.selectedQuestion = question;
                    return;
                }
            }
            $scope.$parent.savedQuestions = $scope.questions;
            $state.go('app.training.course.settings');
        };

        $scope.upload = function (file, errFiles) {
            if(!file) return;
            if (!/(\.xls|\.xlsx)$/i.test(file.name)) {
                Notify.error('只能是xls或xlsx格式的Excel文件！');
                return false;
            }
            Upload.upload({
                url: '/cms/train/upload/topic',
                data: {file: file}
            }).then(function (resp) {
                var result = resp.data;
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                if (result.code == 200) {
                    for(var i = 0; i< result.data.length; i++) {
                        result.data[i].options = JSON.parse(result.data[i].options);
                    }
                    $scope.questions = $scope.questions.concat(result.data);
                    $scope.data.selectedQuestion = result.data[0];
                } else {
                    Notify.error(result.msg);
                }
            }, function (resp) {
                Notify.error('上传文件失败！');
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });
        };
    }]);