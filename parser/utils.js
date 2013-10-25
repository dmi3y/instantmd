/*jshint globalstrict: true*/
/*global define*/

'use strict';

define({
	isBlank: function( test ) {
		return (/^(\s*)$/).test(test);
	},
	isNotBlank: function( test ) {
		return !this.isBlank(test);
	},
	isRegExp: function( test ) {
		return !!( test && (test.test === /r/.test));
	},
	isBlankOrUndefined:	function ( test ) {
		var isBlank = this.isBlank(test),
			isUndefined = typeof(test) === 'undefined';
		return (isBlank || isUndefined);
	},
	startsWith: function( compare ) {
	  var arr;
	  if ( !Array.isArray(compare) ) {
	    arr = [];
	    arr.push(compare);
	    compare = arr;
	  }
	  return function tester( test ) {
	    var result, l = compare.length;
	    while(l-- && !result) {
	      result = test.indexOf(compare[l]) === 0;
	    }
	    
	    return result;
	  };
	},
	doesNotStartWith: function ( compare ) {
		var startsWithCompare = this.startsWith(compare);
		return function tester( test ) {
			return !startsWithCompare(test);
		};
	},
	endsWith: function( compare ) {
	  var arr;
	  if ( !Array.isArray(compare) ) {
	    arr = [];
	    arr.push(compare);
	    compare = arr;
	  }
	  return function tester( test ) {
	    var result, l = compare.length, tl = test.length, io;
	    while(l-- && !result) {
	      io = test.lastIndexOf(compare[l]) + compare[l].length;
	      result = io === tl;
	    }
	    
	    return result;
	  };
	},
	doesNotEndWith: function ( compare ) {
		var endsWithCompare = this.endsWith(compare);
		return function tester( test ) {
			return !endsWithCompare(test);
		};
	}
});
