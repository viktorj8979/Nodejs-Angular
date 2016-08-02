/* ============================================================
 * Directive: skycons
 * AngularJS directive for skycons plugin
 * http://darkskyapp.github.io/skycons/
 * ============================================================ */

angular.module('dim')
    .directive('skycons', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
            	var skycons = new Skycons();
                skycons.add($(element).get(0), attrs.class);
                skycons.play();
            }
        }
    });