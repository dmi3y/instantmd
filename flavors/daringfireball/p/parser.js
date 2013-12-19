/**
 * get p blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function p( mdline ) {
		mdline = '<p>' + mdline + '</p>';
		return mdline;

	}
	return p;
});
