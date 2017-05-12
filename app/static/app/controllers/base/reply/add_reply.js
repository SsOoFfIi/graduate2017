app.controller('addReplyController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal) {
        $scope.keywords = [];

        $scope.onEmotionSelect = function(id, title) {
            console.log(arguments);
            var tagsInput = $('tags-input input');
            tagsInput.val(tagsInput.val() + '/' + title).focus();

            var inputElem = angular.element(tagsInput[0]);
            inputElem.data().$ngModelController.$setViewValue(inputElem.val());
        };

        $scope.materials = [];

        if($stateParams.id) {
            $ajax.get('/cms/wechat/reply/keyword/' + $stateParams.id, {
                mpAppid: $rootScope.mpAppid
            }, function (result) {
                console.log('-----------------');
                console.log(result);
                $scope.keywords = JSON.parse(result.keywordData).map(function(d){
                    return {
                        text: d.keyword,
                        type: d.relation
                    };
                });

                $scope.materials = JSON.parse(result.replyData).map(function(r) {
                    var data = {type: r.type};
                    if(data.type == 'text') {
                        data.content = r.content;
                    } else if(data.type == 'image') {
                        data.content = {
                            mediaId: r.content
                        }
                    } else if(data.type == 'mpnews') {
                        $ajax.get('/cms/wechat/material/news/info', {
                            mpAppid: $rootScope.mpAppid,
                            mediaId: r.content
                        }, function (result) {
                            data.content = {
                                mediaId: r.content,
                                content: result
                            };
                        }, function() {
                            data.content = {
                                mediaId: r.content,
                                isDeleted: true
                            }
                        });
                    } else if(data.type == 'news') {
                        $ajax.get('/cms/wechatMpMsgPicLink/selectByMediaId', {
                            mediaId: r.content
                        }, function (result) {
                            result.content = JSON.parse(result.content);
                            data.content = result;
                        }, function() {
                            data.content = {
                                mediaId: r.content,
                                isDeleted: true
                            }
                        });
                    }
                    return data;
                });
            });
        }

        $scope.addTextMessage = function() {
            $scope.$parent.addTextMessage(function(message) {
                $scope.materials.push({type: 'text', content: message});
            });
        };

        $scope.addNewsMessage = function() {
            $scope.$parent.addNewsMessage(function(news) {
                $scope.materials.push({type: 'mpnews', content: news});
            });
        };

        $scope.addLinkArticleMessage = function() {
            $scope.$parent.addLinkArticle(function(news) {
                $scope.materials.push({type: 'news', content: news});
            });
        };

        $scope.addImageMessage = function() {
            $scope.$parent.addImageMessage(function(image) {
                $scope.materials.push({type: 'image', content: image});
            });
        };

        $scope.removeKeyword = function (index) {
            $scope.keywords.splice(index, 1);
        };

        $scope.count = function(type) {
            if(type) {
                return $scope.materials.filter(function(m){return m.type == type;}).length;
            } else {
                return $scope.materials.length;
            }
        };

        $scope.removeMaterial = function(index) {
            $scope.materials.splice(index, 1);
        };

        $scope.changeMaterial = function(index) {
            var material = $scope.materials[index];
            switch (material.type) {
                case 'text':
                    $scope.$parent.addTextMessage(function(message) {
                        material.content = message;
                    }, material.content);
                    break;
                case 'mpnews':
                    $scope.$parent.addNewsMessage(function(news) {
                        material.content = news;
                    });
                    break;
                case 'news':
                    $scope.$parent.addLinkArticle(function(news) {
                        material.content = news;
                    });
                    break;
                case 'image':
                    $scope.$parent.addImageMessage(function(image) {
                        material.content = image;
                    });
                    break;
            }
        };

        $scope.save = function() {
            if(!$scope.keywords.length) {
                Notify.warn('请输入关键词!');
                return false;
            }
            if(!$scope.materials.length) {
                Notify.warn('至少有一条回复内容！');
                return false;
            }
            var keywordData = $scope.keywords.map(function(keywordItem){
                return {
                    keyword: keywordItem.text,
                    relation: keywordItem.type || 'eq'
                }
            });
            var replyData = $scope.materials.map(function(material) {
                return {
                    type: material.type,
                    content: material.type == 'text' ? material.content : material.content.mediaId
                }
            });
            if($stateParams.id) {
                $ajax.post('/cms/wechat/reply/keyword/update', {
                    id: $stateParams.id,
                    mpAppid: $rootScope.mpAppid,
                    keywordData: angular.toJson(keywordData),
                    replyData: angular.toJson(replyData)
                }, function () {
                    Notify.success("修改关键词回复成功!");
                    $state.go('app.base.reply.keywords', {}, {reload: true});
                });
            } else {
                $ajax.post('/cms/wechat/reply/keyword/add', {
                    mpAppid: $rootScope.mpAppid,
                    keywordData: angular.toJson(keywordData),
                    replyData: angular.toJson(replyData)
                }, function () {
                    Notify.success("新增关键词回复成功!");
                    $state.go('app.base.reply.keywords', {}, {reload: true});
                });
            }
        };
    }]);