angular.module('reg')
    .controller('GuideCtrl', [
        '$scope',
        function($scope) {

            // Anchor scrolling
            window.onscroll = function() {
                scrollFunction()
            };

            function scrollFunction() {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    document.getElementById("myBtn").style.display = "block";
                } else {
                    document.getElementById("myBtn").style.display = "none";
                }
            }

            document.getElementById('myBtn').addEventListener('click', function() {
                $("html, body").animate({
                    scrollTop: 0
                }, "fast");
            });

            $('a[href^="#"]').click(function() {
                $('html, body').animate({
                    scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
                }, 500);

                return false;
            });

            // Sticky date section
            // $(document).ready(function() {
            //     var sticky_4_to_9_months = $("#months49").offset();
            //     var sticky_4_months = $("#months4").offset();
            //     var sticky_2_months = $("#months2").offset();
            //     var sticky_1_month = $("#month").offset();
            //     var sticky_1_week = $("#week").offset();
            //     var day_of_event = $("#dayofevent").offset();
            //
            //     $(window).scroll(function() {
            //         var scroll = $(window).scrollTop();
            //         if (scroll < sticky_4_to_9_months.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_4_to_9_months.top <= scroll && scroll < sticky_4_months.top) {
            //             $('#months49').addClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_4_months.top <= scroll && scroll < sticky_2_months.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').addClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_2_months.top <= scroll && scroll < sticky_1_month.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').addClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_1_month.top <= scroll && scroll < sticky_1_week.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').addClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (sticky_1_week.top <= scroll && scroll < day_of_event.top) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').addClass('sticky');
            //             $('#dayofevent').removeClass('sticky');
            //         } else if (day_of_event.top <= scroll) {
            //             $('#months49').removeClass('sticky');
            //             $('#months4').removeClass('sticky');
            //             $('#months2').removeClass('sticky');
            //             $('#month').removeClass('sticky');
            //             $('#week').removeClass('sticky');
            //             $('#dayofevent').addClass('sticky');
            //         } else {
            //             $('#dayofevent').removeClass('sticky');
            //         }
            //     });
            // });
            setTimeout(function(){
                var stickyHeaders = (function() {
                    var $window = $(window),
                        $stickies;

                    var load = function(stickies) {

                        if (typeof stickies === "object" && stickies instanceof jQuery && stickies.length > 0) {
                            $stickies = stickies.each(function() {
                                var $thisSticky = $(this).wrap('<div class="followWrap" />');

                                $thisSticky
                                    .data('originalPosition', $thisSticky.offset().top)
                                    .data('originalHeight', $thisSticky.outerHeight())
                                    .parent()
                                    .height($thisSticky.outerHeight());
                            });

                            $window.off("scroll.stickies").on("scroll.stickies", function() {
                                _whenScrolling();
                            });
                        }
                    };

                    var _whenScrolling = function() {
                        $stickies.each(function(i) {
                            var $thisSticky = $(this),
                                $stickyPosition = $thisSticky.data('originalPosition');

                            if ($stickyPosition <= $window.scrollTop()) {
                                var $nextSticky = $stickies.eq(i + 1),
                                    $nextStickyPosition = $nextSticky.data('originalPosition') - $thisSticky.data('originalHeight');

                                $thisSticky.addClass("fixed");

                                if ($nextSticky.length > 0 && $thisSticky.offset().top >= $nextStickyPosition) {
                                    $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                                }

                            } else {
                                var $prevSticky = $stickies.eq(i - 1);

                                $thisSticky.removeClass("fixed");

                                if ($prevSticky.length > 0 && $window.scrollTop() <= $thisSticky.data('originalPosition') - $thisSticky.data('originalHeight')) {
                                    $prevSticky.removeClass("absolute").removeAttr("style");
                                }
                            }
                        });
                    };

                    return {
                        load: load
                    };
                })();

                $(function() {
                    stickyHeaders.load($(".sticky"));
                });
            }, 500);

        }
    ]);
