/**
 * get hr blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function hr( blockRules, position, offset, container, tree ) {
		tree[position] = '<hr>' + container.splitted[position] + '</hr>';
		var
			splitted = container.splitted.slice(position),
			len = splitted.length;

		for (;len--;) {
			
		}

	}
	return hr;
});
