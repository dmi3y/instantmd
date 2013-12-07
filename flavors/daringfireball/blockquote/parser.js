/**
 * get blockquote blocks from the md text
 * @param  {string} l
 * @return {array}
 */

/*jshint globalstrict: true*/
/*global define*/
'use strict';

define(function(){
	function blockquote( blockRules, position, offset, container, tree ) {
		tree[position] = '<blockquote>' + container.splitted[position] + '</blockquote>';
		var
			splitted = container.splitted.slice(position),
			len = splitted.length;

		for (;len--;) {
			
		}

	}
	return blockquote;
});
