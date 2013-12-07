/*jshint globalstrict: true*/
/*global define*/

'use strict';

define(['utils'], function(utils) {
	function isList( test ) {
		var result = (/^\s*(\d\.|[\*\-\+])\s/).test(test);
		return result;
	}
	function isNotList( test ) {
		var result = !isList(test);
		return result;
	}
	return {
		rules: {
			blocks: {
				blockquote: {
					test: {
						0: [utils.startsWith('>')]
					}
				},
				h: {
					test: {
						0: [utils.startsWith('#')],
						1: [/^(-(?!=)|=(?!-))+\s*$/]
					}
				},
				hr: {
					test: {
						0: [/^(-(?!\s*\*)|\*(?!\s*-)|\s)+$/]
					}
				},
				list: {
					test: {
						0: [isList]
					}
				},
				p: {
					test: {
						0: [utils.doesNotStartWith(['#','>','*','+','-']),isNotList]
					}
				}
			},
			lines: []
		}
	};
});
