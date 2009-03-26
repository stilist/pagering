/* Provided under the MIT license. See LICENSE for details */

function $(elemId) {
 return document.getElementById(elemId);
}

function debug(message) {
 debug = $('debug');
 debug.innerHTML += message + '<br>';
}

var pagering = {
 changePage: function(direction, totalPages, pageWidth) {
  var content = $('content');
  var text = $('text');
  var totalWidth = pageWidth * totalPages;
  /* returns e.g. '-30px', so we have to convert it from a String to an Integer */
  var leftMargin = text.style.marginLeft;
  var currentOffset = leftMargin === '' ? 0 : parseInt(leftMargin.split('px')[0]);

  var currentPageNumber = parseInt($('currentpage').innerHTML);

  if (direction === 'l') {
   if (Math.abs(currentOffset) >= pageWidth) {
    text.style.marginLeft = (currentOffset + pageWidth) + 'px';

    this.setCurrent(currentPageNumber - 1);
   }

  } else {
   if (Math.abs(currentOffset) < (totalWidth - pageWidth)) {
    text.style.marginLeft = (currentOffset - pageWidth) + 'px';

    this.setCurrent(currentPageNumber + 1);
   }
  }
 },
 setCount: function(totalPages) {
  var pageCount = $('totalpages');
  pageCount.innerHTML = totalPages;
 },
 setCurrent: function(pageNumber) {
  var currentPage = $('currentpage');
  currentPage.innerHTML = pageNumber;
 }
}

window.onload = function () {
 /* go into page mode and set the page count */
 var fullHeight = $('text').clientHeight;

 var content = $('content');
 content.setAttribute('class', 'pageringd');

 var text = $('text');

 var pagedHeight = text.clientHeight;
 var totalPages = Math.round(fullHeight / pagedHeight);
 pagering.setCount(totalPages);

 var pageWidth = text.clientWidth;

 /* watch for page changes */
 var leftArrow = document.getElementsByClassName('pageleft');
 for (var i = 0; i < leftArrow.length; i++) {
  leftArrow[i].addEventListener('click',
      function() { pagering.changePage('l', totalPages, pageWidth); }, false);
 }

 var rightArrow = document.getElementsByClassName('pageright');
 for (var i = 0; i < rightArrow.length; i++) {
  rightArrow[i].addEventListener('click',
      function() { pagering.changePage('r', totalPages, pageWidth); }, false);
 }
}
