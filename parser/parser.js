/*jshint globalstrict: true, expr: true*/
/*global define, requirejs*/

'use strict';

define(['utils', 'rsvp', 'config'], function(utils, RSVP, config) {
	var
		container = {},
		tree = [];
	/**
	 * Chekcks if line fits the block rule
	 * @param  {mix}  blockRule function or regExp
	 * @param  {str}  l         line of md
	 * @return {Boolean}
	 */
	function isLineFits(blockRule, l) {
		var
			bri = 0, brl = blockRule.length, brix,
			test = false;

		for ( bri; bri < brl; bri++ ) {
			brix = blockRule[bri];
			if ( utils.isRegExp(brix) ) {
				test = brix.test(l);
			} else {
				test = brix(l);
			}
			if ( test ) break;
		}
		return test;
	}

	function andShakeWith(flavorDetails){
		var
			l, j = 0,
			blocks = flavorDetails.rules.blocks;

		function parseToTree(blockName, fix, blockRules) {
			var
				blockParser = config.flavor + blockName + '/parser';

			requirejs([blockParser],
				function addToParsers(blockParser) {
					blockParser(l, container, tree, j);
				}
			);
		}

		(function checkLine() {
			var
				blockRules,
				blockRule,
				blockName,
				blockRuleIx, fix;

			for (blockName in blocks) {
				blockRules = blocks[blockName];

				for (blockRuleIx in blockRules.test) {
					fix = j + parseInt(blockRuleIx, 10);
					l = container.splitted[fix];

					if ( utils.isNotBlank(l) ) {
						blockRule = blockRules.test[blockRuleIx];
						
						if ( isLineFits(blockRule, l) ) {
							parseToTree(blockName, fix, blockRules);
							delete blocks[blockName];
						}

						if ( container.linesOrig > j ) {
							checkLine();
							j += 1;
						}
					}
				}
			}
		})();
	}

	/**
	 * Load markdown flawor from config
	 * pass it further to pre-parser
	 */
	function getFlavor () {
		var
			flavor = config.flavor,
			flavorDetails = flavor + 'details';

		requirejs([flavorDetails],
			andShakeWith(flavorDetails)
		);
	}

	/**
	 * Get markdown string and parse it
	 * into valid HTML string according the rules
	 * @param  {str} str  markdown string
	 * @return {str} html HTML string
	 */
	function parseStr( str ) {
		var
			len, arr, html;

		container.str = str;
		arr = str.split(/\r|\n|\r\n/);
		len = arr.length - 1;
		container.linesOrig = len;
		container.splitted = arr;
		html = getFlavor();
		return html;
	}

	/* Public methods */
	return {
		parseStr: parseStr
	};

});
