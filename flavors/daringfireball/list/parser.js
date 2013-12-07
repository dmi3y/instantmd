/**
 * get list blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function list( blockRules, position, offset, container, tree ) {
		tree[position] = '<list>' + container.splitted[position] + '</list>';
		var
			splitted = container.splitted.slice(position),
			len = splitted.length;

		for (;len--;) {
			
		}

	}
	return list;
});
