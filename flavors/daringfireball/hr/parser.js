/**
 * get hr blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function hr( mdline ) {
		mdline = '<hr>' + mdline + '</hr>';
		return mdline;

	}
	return hr;
});
