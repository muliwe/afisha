'use strict';

angular.module('afisha').directive('ticket', ['$sce',
    function($sce) {
    return {
        restrict: 'E',
        template: '<iframe src="{{url}}" id="ticket" scroll="no"></iframe>',
        scope: {
            show: '='
        },
        link: function (scope, element, attr) {
            scope.url = $sce.trustAsResourceUrl('https://mapp.kassa.rambler.ru/place/hallplan?sessionid=' + scope.show +
                '&WidgetID=19473&LocationUrl=http%3A%2F%2Fwww.kinokadr.ru%2Fafisha%2F');
        }
    };
}]);

