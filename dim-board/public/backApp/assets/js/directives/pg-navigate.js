/* ============================================================
 * Directive: pgNavigate
 * Pre-made view ports to be used for HTML5 mobile hybrid apps
 * ============================================================ */

angular.module('dim')
    .directive('pgNavigate', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                $(element).click(function() {
                    var $this     = $(this),
                        $el       = $($this.attr('data-view-port')),
                        isJustAdd = $this.attr('data-view-justAdd'),
                        $showElem;

                    if ($this.attr('data-toggle-view') != null) {
                        $el.children().last().children('.view').hide();
                        $($this.attr('data-toggle-view')).show();
                    }
                    if (isJustAdd) {
                        $showElem = $($(this).attr('data-view-elem'));

                        $el.addClass($this.attr('data-view-animation'));
                        $showElem.addClass('open');
                    } else {
                        $el.toggleClass($this.attr('data-view-animation'));
                    }
                    
                    return false;
                });


            }
        }
    });