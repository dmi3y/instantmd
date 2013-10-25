/*jshint globalstrict: true*/
/*global define*/

'use strict';

define(['utils'], function(utils) {
	function isList( test ) {
		return (/^\s*(\d\.|[\*\-\+])\s/).test(test);
	}
	function isNotList( test ) {
		return !isList(test);
	}
	return {
		rules: {
			blocks: {
				p: {
					test: {
						0: [utils.doesNotStartWith(['#','>','*','+','-']),isNotList]
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
				blockquote: {
					test: {
						0: [utils.startsWith('<')]
					}
				}
			},
			lines: []
		}
	};
});