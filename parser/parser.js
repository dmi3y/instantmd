/*jshint globalstrict: true, expr: true*/
/*global define, requirejs*/

'use strict';

define(['utils', 'config'], function(utils, config) {
	var
		container = {},
		tree = [];

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


	function getFlavor () {
		var
			flavor = config.flavor,
			flavorDetails = flavor + 'details';

		requirejs([flavorDetails],
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
		);
	}

	function parseStr( str ) {
		var
			len, arr;

		container.str = str;
		arr = str.split(/\r|\n|\r\n/);
		len = arr.length - 1;
		container.linesOrig = len;
		container.splitted = arr;
		getFlavor();

	}
	return {
		parseStr: parseStr
	};

});
