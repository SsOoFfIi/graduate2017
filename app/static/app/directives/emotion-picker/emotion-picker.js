/**
 * Created by SJia on 2016/7/12.
 */
//Sidebar Menu Handle
angular.module('app')
    .directive('emotionPicker', function() {
        return {
            restrict: 'AC',
            templateUrl: 'app/directives/emotion-picker/picker.html',
            replace: true,
            scope: {
                onEmotionSelect: '&'
            },
            link: function (scope, el, attr) {
                scope.hover = function($event) {
                    if($event) {
                        scope.hoverId = $event.currentTarget.dataset.id;
                        scope.hoverTitle = $event.currentTarget.dataset.title;
                    } else {
                        scope.hoverId = 0;
                        scope.hoverTitle = '';
                    }
                };
                scope.select = function() {
                    scope.show = false;
                    scope.onEmotionSelect({id: scope.hoverId, title: scope.hoverTitle});
                };
            }
        };
    });

