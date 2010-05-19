/* Provided under the MIT license. See LICENSE for details */

(function ($) {
	$.fn.pagering = function (options) {
		var settings = {};
		var defaults = {
			columnGap: 20,
			columnWidth: 300,
			contentClass: "entry-content"
		};
		if (options) {
			settings = $.extend(defaults, options);
		} else {
			settings = defaults;
		}

		/* UTILITY FUNCTIONS */
		// http://gist.github.com/405856/
		var vendorPrefixes = ["", "-webkit-", "-moz-"];
		var test = document.createElement("div");
		// http://unscriptable.com/index.php/2009/05/01/a-better-javascript-memoizer/
		var cssSupport = (function () {
			var cache = {};
			return function (property, value) {
				if (undefined === cache[property]) {
					if (null === value) {
						value = 1;
					}
					for (var i = 0; i < vendorPrefixes.length; ++i) {
						var composedName = vendorPrefixes[i] + property;
						test.style.composedName = value;
						var cStyle = document.defaultView.getComputedStyle(test, null);
						if (null !== cStyle.getPropertyValue(composedName)) {
							cache[property] = vendorPrefixes[i];
							break;
						}
					}
				}
				return cache[property];
			};
		})();
		// http://gist.github.com/406015
		var cssDimensionInPx = (function () {
			return function ($element, property) {
				var dimension = $element.css(property);
				var dimensionInt = parseInt(dimension, 10);
				var fontSize = parseInt($element.css("font-size"), 10);
				if (dimension && !isNaN(dimensionInt)) {
					// no unit
					if ("" + dimensionInt === dimension) {
						return dimensionInt;
					// px
					} else if (dimension.length - 2 === dimension.indexOf("px")) {
						return dimensionInt;
					// em
					} else if (dimension.length - 2 === dimension.indexOf("em")) {
						return dimensionInt * fontSize;
					// %
					} else if (dimension.length - 1 === dimension.indexOf("%")) {
						return (dimensionInt * 0.01) * fontSize;
					}
				} else {
					return 0;
				}
			};
		})();

		var columnSupport = cssSupport("column-gap");
		if (undefined !== columnSupport) {
			// navigation elements
			var $dummyPageNav = $("<div class='pageNav'>");
			var $dummyPageLeft = $("<a class='pageLeft changePage'>←</a>");
			var $dummyPageRight = $("<a class='pageRight changePage'>→</a>");
			var $dummyPageCount = $("<div class='pageCount'>");
			var $dummyCurrentPage = $("<span class='currentPage'>1</span>");
			var $dummyTotalPages = $("<span class='totalPages'>1</span>");

			this.each(function () {
				var $pagerings = $(this);
				$pagerings.addClass("pageringed");
				$pagerings.each(function () {
					// this is lame
					var $pageNav = $dummyPageNav.clone();
					var $pageLeft = $dummyPageLeft.clone();
					var $pageRight = $dummyPageRight.clone();
					var $pageCount = $dummyPageCount.clone();
					var $currentPage = $dummyCurrentPage.clone();
					var $totalPages = $dummyTotalPages.clone();

					var $pagering = $(this);
					var $pageringContent = $pagering.find("." + settings.contentClass);
					var unpagedHeight = $pageringContent.height();
					$pageringContent.addClass("pageringedChapter");
					var pagedHeight = $pageringContent.height();
					var totalPagesEstimate = Math.ceil(unpagedHeight / pagedHeight);

					// http://forum.jquery.com/topic/how-to-pass-variables-in-jquery-css
					$pageringContent
							.css(columnSupport + "column-gap", settings.columnGap)
							.css(columnSupport + "column-width", settings.columnWidth);

					var columnGap = cssDimensionInPx($pageringContent,
							columnSupport + "column-gap");
					var contentViewportWidth = cssDimensionInPx($pageringContent,
							"width");

					$pagering.append($pageCount.append($currentPage).append("/")
							.append($totalPages));
					$totalPages.text(totalPagesEstimate);

					if (1 < totalPagesEstimate) {
						$pagering.append($pageNav.append($pageLeft).append($pageRight));

						var currentPage = 1;
						var currentOffset = 0;
						var newOffset = 0;

						var slidePage = function (multiplier) {
							currentOffset = cssDimensionInPx($pageringContent, "left");
							newOffset = multiplier * (contentViewportWidth + columnGap);
							$pageringContent.animate({ left : currentOffset + newOffset },
									500);
						};
						var updateNavClickability = function () {
							if (1 < currentPage) {
								$pageLeft.removeClass("disabled");
							} else {
								$pageLeft.addClass("disabled");
							}
							if (currentPage < totalPagesEstimate) {
								$pageRight.removeClass("disabled");
							} else {
								$pageRight.addClass("disabled");
							}
						};
						updateNavClickability(); // run once on load

						$pageLeft.click(function () {
							if (1 < currentPage) {
								currentPage -= 1;
								slidePage(1);
								$currentPage.text(currentPage);
							}
							updateNavClickability();
						});
						$pageRight.click(function () {
							if (currentPage < totalPagesEstimate) {
								slidePage(-1);
								currentPage += 1;
								$currentPage.text(currentPage);
							}
							updateNavClickability();
						});
					}
				});
			});
		}
		return this;
	};
})(jQuery);
