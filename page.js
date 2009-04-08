/* Provided under the MIT license. See LICENSE for details */

var dom = {
  $: function(elemId) {
    return document.getElementById(elemId);
  },
  addDiv: function(name, parent) {
    // prevent fastback cache from re-adding the element on load
    var existing = this.$(name);
    if (existing === null) {
      var el = document.createElement('div');
      el.setAttribute('id', name);
      parent.appendChild(el);
    }

    return this.$(name);
  },
  addText: function(text, parent) {
    var el = document.createTextNode(text);
    parent.appendChild(el);
  },
  getCSSValue: function(element, property) {
    var cs = document.defaultView.getComputedStyle(element, null);
    return cs.getPropertyValue(property);
  }
}

function debug(message) {
 debug = dom.$('debug');
 debug.innerHTML += message + '<br>';
}

var pagering = {
 // create paging nav
 // XXX: should move the current onload code in here
 init: function(elem) {
  var content = dom.$(elem);

  var pageNav = dom.addDiv('pagenav', content);
  var pageLeft = dom.addDiv('pageleft', pageNav);
  dom.addText('←', pageLeft);
  var pageRight = dom.addDiv('pageright', pageNav);
  dom.addText('→', pageRight);
 },
 changePage: function(direction, totalPages, pageWidth) {
  var content = dom.$('content');
  var text = dom.$('text');
  var totalWidth = pageWidth * totalPages;
  /* returns e.g. '-30px', so we have to convert it from a String to an Integer */
  var leftMargin = text.style.marginLeft;
  var currentOffset = leftMargin.length == 0 ? 0 : parseInt(leftMargin.split('px')[0]);

  var currentPageNumber = parseInt(dom.$('currentpage').innerHTML);

  if (direction === 'l') {
   if (Math.abs(currentOffset) >= pageWidth) {
    text.style.marginLeft = (currentOffset + pageWidth) + 'px';

    this.setCurrent(currentPageNumber - 1);
   }

  } else {
   if (Math.abs(currentOffset) < totalWidth) {
    text.style.marginLeft = (currentOffset - pageWidth) + 'px';

    this.setCurrent(currentPageNumber + 1);
   }
  }
 },
 CSSDimensionToInt: function(dimension, defaultValue) {
  var dimension = dimension.split('px')[0];
  // if the dimension has not been set (e.g., it's 'auto', 'normal', ...), hand
  // back defaultValue
  return parseInt(dimension) === NaN ? defaultValue : parseInt(dimension);
 },
 getColumnGap: function(element) {
  var columnGap = '';

  /* surely there's a way to compress this */
  if (dom.getCSSValue(element, 'column-gap') !== null) {
    columnGap = dom.getCSSValue(element, 'column-gap');
  } else if (dom.getCSSValue(element, '-webkit-column-gap') !== null) {
    columnGap = dom.getCSSValue(element, '-webkit-column-gap');
  } else if (dom.getCSSValue(element, '-moz-column-gap') !== null) {
    columnGap = dom.getCSSValue(element, '-moz-column-gap');
  }

  // CSS3 spec suggests 1em as the default column gap; use 13px as an average
  return this.CSSDimensionToInt(columnGap, 13);
 },
 setPageCount: function(totalPages) {
  var pageCount = dom.$('totalpages');
  pageCount.innerHTML = Math.round(totalPages);
 },
 setCurrent: function(pageNumber) {
  var currentPage = dom.$('currentpage');
  currentPage.innerHTML = pageNumber;
 }
}

window.onload = function () {
 var text = dom.$('text');

 /* go into page mode and set the page count */
 var fullHeight = text.clientHeight;

 var content = dom.$('content');
 content.setAttribute('class', 'pageringd');

 var pagedHeight = text.clientHeight;
 var totalPages = fullHeight / pagedHeight;
 pagering.setPageCount(totalPages);

 // page width has two parts:
 // 1) the width of the paged element
 // 2) CSS3 column-gap of the paged element
 var pageWidth = text.clientWidth;
 pageWidth += pagering.getColumnGap(text);

 if (totalPages > 1) {
  pagering.init('content');

  var leftArrow = dom.$('pageleft');
  leftArrow.addEventListener('click',
       function() { pagering.changePage('l', totalPages, pageWidth); }, false );
 
  var rightArrow = dom.$('pageright');
  rightArrow.addEventListener('click',
       function() { pagering.changePage('r', totalPages, pageWidth); }, false );
 }
}
