/**
 * get p blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function p( blockRules, position, offset, container, tree ) {
		tree[position] = '<p>' + container.splitted[position] + '</p>';
		var
			splitted = container.splitted.slice(position),
			len = splitted.length;

		for (;len--;) {
			
		}

	}
	return p;
});
