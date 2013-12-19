/**
 * get blockquote blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function blockquote( mdline ) {
		mdline = '<blockquote>' + mdline + '</blockquote>';
		return mdline;

	}
	return blockquote;
});
