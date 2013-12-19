/**
 * get h blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function h( mdline ) {
		mdline = '<h>' + mdline + '</h>';
		return mdline;

	}
	return h;
});
