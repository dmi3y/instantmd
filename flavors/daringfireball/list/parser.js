/**
 * get list blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function list( mdline ) {
		mdline = '<list>' + mdline + '</list>';
		return mdline;
	}
	return list;
});
