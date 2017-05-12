app.controller('menuController', [
    '$scope',
    '$rootScope',
    '$ajax',
    '$state',
    '$stateParams',
    '$location',
    '$modal',
    '$cookies',
    function ($scope, $rootScope, $ajax, $state, $stateParams, $location, $modal, $cookies) {
        $scope.data = {
            buttons: [{"name": "新建菜单", "subButtons": [], "isDeleted": true}, {
                "name": "新建菜单",
                "subButtons": [],
                "isDeleted": true
            }, {"name": "新建菜单", "subButtons": [], "isDeleted": true}]
        };

        var dontShowNotify = $cookies.dontShowNotify;

        $scope.load = function () {
            $ajax.get('/cms/wechat/menu/get', {
                mpAppid: $rootScope.mpAppid
            }, function (data) {
                if(dontShowNotify != 1) {
                    $modal.open({
                        windowClass: 'notify-modal',
                        templateUrl: 'notifyModal.html',
                        controller: 'notifyModalController',
                        backdrop: 'static',
                        size: 'lg'
                    });
                }
                if (data && data.buttons) {
                    for(var i= 0;i<3;i++) {
                        if(data.buttons[i]) {
                            $scope.data.buttons[i] = data.buttons[i];
                        }
                    }
                }
            });
        };

        $scope.load();

        $scope.addMenu = function (button) {
            if (button.isDeleted) {
                button.isDeleted = false;
            } else if (!button.subButtons) {
                button.subButtons = [{
                    "name": "子菜单"
                }];
            } else if (button.subButtons.length < 5) {
                button.subButtons.unshift({
                    "name": "子菜单"
                });
            }
        };

        $scope.selectedButton = null;
        $scope.selectedButtonLevel = 0;
        $scope.editMenu = function (button, level) {
            if ($scope.selectedButton == button) {
                $scope.selectedButton = null;
                $scope.selectedButtonLevel = 0;
            } else {
                $scope.selectedButton = button;
                $scope.selectedButtonLevel = level;
                if(button.type == 'click' && button.key.indexOf('mpnewsMaterial_') == 0 && !button.__data__) {
                    $ajax.get('/cms/wechat/material/news/info', {
                        mpAppid: $rootScope.mpAppid,
                        mediaId: button.key.split('mpnewsMaterial_')[1]
                    }, function (result) {
                        console.log(result);
                        button.__data__ = {
                            content: result
                        }
                    }, function(result) {
                        console.log(result);
                        button.__data__ = {
                            isDeleted: true
                        }
                    });
                }else if(button.type == 'click' && button.key.indexOf('newsMaterial_') == 0 && !button.__data__) {
                    $ajax.get('/cms/wechatMpMsgPicLink/selectByMediaId', {
                        mpAppid: $rootScope.mpAppid,
                        mediaId: button.key.split('newsMaterial_')[1]
                    }, function (result) {
                        console.log(result);
                        result.content = JSON.parse(result.content);
                        button.__data__ = result
                    }, function(result) {
                        console.log(result);
                        button.__data__ = {
                            isDeleted: true
                        }
                    });
                }
            }
        };
        $scope.deleteMenu = function (buttonIndex, subButtonIndex) {
            if (subButtonIndex == undefined) {
                layer.confirm('确定要删除菜单及所有子菜单吗？', {
                    btn: ['删除', '取消'] //按钮
                }, function (index) {
                    $scope.$apply(function () {
                        $scope.data.buttons[buttonIndex] = {
                            name: '新建菜单',
                            subButtons: [],
                            isDeleted: true
                        };
                    });
                    layer.close(index);
                }, function () {
                });
            } else {
                $scope.data.buttons[buttonIndex].subButtons.splice(subButtonIndex, 1);
            }
        };
        $scope.selectMenuAction = function () {
            $modal.open({
                windowClass: '',
                templateUrl: 'selectMenuActionModal.html',
                controller: 'selectMenuActionController',
                backdrop: 'static',
                size: 0,

                resolve: {
                    data: function () {
                        return {
                            selectActionCallback: function (type) {
                                switch (type) {
                                    case 'mpnews':
                                        $scope.$parent.addNewsMessage(function (news) {
                                            $scope.selectedButton.type = 'click';
                                            $scope.selectedButton.key = 'mpnewsMaterial_' + news.mediaId;
                                            $scope.selectedButton.__data__ = news;
                                        });
                                        break;
                                    case 'news':
                                        $scope.$parent.addLinkArticle(function (news) {
                                            $scope.selectedButton.type = 'click';
                                            $scope.selectedButton.key = 'newsMaterial_' + news.mediaId;
                                            $scope.selectedButton.__data__ = news;
                                        });
                                        break;
                                    case 'picture':
                                        $scope.$parent.addImageMessage(function (image) {
                                            $scope.selectedButton.type = 'click';
                                            $scope.selectedButton.key = 'imageMaterial_' + image.mediaId;
                                            $scope.selectedButton.__data__ = image;
                                        });
                                        break;
                                    case 'text':
                                        break;
                                    case 'keyword':
                                        break;
                                    case 'voice':
                                        break;
                                    case 'pic_sysphoto':
                                    case 'pic_photo_or_album':
                                    case 'location_select':
                                        $scope.selectedButton.type = type;
                                        $scope.selectedButton.key = 'rselfmenu_' + (+new Date());
                                        break;
                                }
                            }
                        };
                    }
                }
            });
        };

        $scope.isNameValid = function(level) {
            return (level == 1 && $scope.selectedButton.name.replace(/[^\x00-\xff]/g, "01").length <= 8) ||
                (level == 2 && $scope.selectedButton.name.replace(/[^\x00-\xff]/g, "01").length <= 16);
        };

        $scope.createMenu = function () {
            var button;
            for (var i = 0; i < $scope.data.buttons.length; i++) {
                button = $scope.data.buttons[i];
                if(button.isDeleted) {
                    continue;
                }
                if (button.name.replace(/[^\x00-\xff]/g, "01").length > 8) {
                    Notify.warn('菜单名称超过最大长度!');
                    $scope.selectedButton = button;
                    $scope.selectedButtonLevel = 1;
                    return;
                } else if (button.subButtons.length == 0) {
                    if (!button.type) {
                        Notify.warn('请选择菜单功能!');
                        $scope.selectedButton = button;
                        $scope.selectedButtonLevel = 1;
                        return;
                    } else if (button.type == 'view') {
                        if(!button.url) {
                            Notify.warn('请输入跳转链接!');
                            $scope.selectedButton = button;
                            $scope.selectedButtonLevel = 1;
                            return;
                        } else if(!(button.url.indexOf('http://') == 0 || button.url.indexOf('https://') == 0)) {
                            Notify.warn('链接必须以http://或https://开头!');
                            $scope.selectedButton = button;
                            $scope.selectedButtonLevel = 1;
                            return;
                        }
                    }
                }
                for (var j = 0; j < $scope.data.buttons[i].subButtons.length; j++) {
                    button = $scope.data.buttons[i].subButtons[j];
                    if (button.name.replace(/[^\x00-\xff]/g, "01").length > 16) {
                        Notify.warn('菜单名称超过最大长度!');
                        $scope.selectedButton = button;
                        $scope.selectedButtonLevel = 2;
                        return;
                    } else if (!button.type) {
                        Notify.warn('请选择菜单功能!');
                        $scope.selectedButton = button;
                        $scope.selectedButtonLevel = 2;
                        return;
                    } else if (button.type == 'view') {
                        if(!button.url) {
                            Notify.warn('请输入跳转链接!');
                            $scope.selectedButton = button;
                            $scope.selectedButtonLevel = 1;
                            return;
                        } else if(!(button.url.indexOf('http://') == 0 || button.url.indexOf('https://') == 0)) {
                            Notify.warn('链接必须以"http://"或"https://"开头!');
                            $scope.selectedButton = button;
                            $scope.selectedButtonLevel = 1;
                            return;
                        }
                    }
                }
            }
            layer.confirm('确定要发布菜单吗？', {
                btn: ['发布', '取消'] //按钮
            }, function (index) {
                var buttons = $scope.data.buttons.filter(function(b){return !b.isDeleted});
                if (buttons.length) {
                    $ajax.post('/cms/wechat/menu/create', {
                        mpAppid: $rootScope.mpAppid,
                        wxMenu: {
                            buttons: buttons
                        }
                    }, function (data) {
                        Notify.success('菜单已发布!');
                        layer.close(index);
                        if($stateParams.from == 'memberCard') {
                            $state.go('app.base.memberCard', {}, {location: true});
                        }
                    });
                } else {
                    $ajax.get('/cms/wechat/menu/delete', {
                        mpAppid: $rootScope.mpAppid
                    }, function (data) {
                        Notify.success('菜单已发布!');
                        layer.close(index);
                    });
                }
            }, function () {
            });
        };
    }]);

app.controller('selectMenuActionController', ['$scope', '$ajax', '$modalInstance', 'data', function ($scope, $ajax, $modalInstance, data) {
    $scope.selectAction = function (type) {
        data.selectActionCallback(type);
        $modalInstance.close();
    }

    $scope.close = function() {
        $modalInstance.close();
    }
}]);

app.controller('notifyModalController', ['$scope', '$rootScope', '$ajax', '$modalInstance', '$modal', '$cookieStore', function ($scope, $rootScope, $ajax, $modalInstance, $modal, $cookieStore) {
    $scope.cancel = function () {
        document.cookie = 'dontShowNotify=1;expires='+(new Date((+new Date()) + 900000000000).toGMTString())+';path=/';
        $modalInstance.close();
    }
}]);