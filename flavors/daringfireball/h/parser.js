/**
 * get h blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function h( blockRules, position, offset, container, tree ) {
		tree[position] = '<h>' + container.splitted[position] + '</h>';
		var
			splitted = container.splitted.slice(position),
			len = splitted.length;

		for (;len--;) {
			
		}

	}
	return h;
});