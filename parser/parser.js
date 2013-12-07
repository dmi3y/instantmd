/*jshint globalstrict: true, expr: true*/
/*global define, requirejs*/

'use strict';

define(['utils', 'rsvp', 'config'], function(utils, RSVP, config) {
	var
		container = {},
		tree = [];
	/**
	 * Checks if line fits the block rule
	 * @param  {mix}  lineRules function or regExp
	 * @param  {str}  l         line of md
	 * @return {Boolean}
	 */
	function isLineFits(lineRules, l) {
		var
			lineRuleIx = lineRules.length, lineRule,
			test, result;

		for ( ;lineRuleIx--; ) {
			lineRule = lineRules[lineRuleIx];
			if ( utils.isRegExp(lineRule) ) {
				test = lineRule.test(l);
			} else {
				test = lineRule(l);
			}
			result = ((typeof result === 'boolean')? (result && test): test);
		}
		return result;
	}
	/**
	 * Mixing up the promises instead of 
	 * callback nested hell
	 * @param  {obj} flavorDetails parser details
	 * @return {str}               html parsed string from md
	 */
	function andShakeWith(flavorDetails){
		var
			position = 0,
			rulesBlocks = flavorDetails.rules.blocks,
			arrayOfPromises = [];

		/**
		 * Stack found blocks into object of promises
		 * @param  {str} blockName
		 * @param  {int} offset        [description]
		 * @param  {[type]} blockRules [description]
		 * @return {[type]}            [description]
		 */
		function parseDownWith(blockName, blockRules, position, offset) {
			var blockParsePromise = new RSVP.Promise(function (resolve, reject) {
				var
					blockParser = config.flavor + blockName + '/parser';

				requirejs([blockParser],
					function growTree(blockParser) {
						blockParser(blockRules, position, offset, container, tree);
						resolve(tree);
					}
				);

			});

			return blockParsePromise;
		}

		/**
		 * Recurcive line checker
		 */
		(function assignParsers() {
			var
				mdline,
				blockRules,
				lineRules,
				blockName,
				blockRuleIx, offset;

			for (blockName in rulesBlocks) {
				blockRules = rulesBlocks[blockName];

				for (blockRuleIx in blockRules.test) { // ARRAY @TODO think of use other type iterators
					offset = position + parseInt(blockRuleIx, 10);
					mdline = container.splitted[offset];

					if ( utils.isNotBlank(mdline) ) {
						lineRules = blockRules.test[blockRuleIx];
						
						if ( isLineFits(lineRules, mdline) ) {
							arrayOfPromises.push(parseDownWith(blockName, blockRules, position, offset));
							position += 1;
							delete rulesBlocks[blockName];
							break;
						}
					}
				}
			}

			if ( container.linesOrig > position ) {
				position += 1;
				assignParsers();
			}
		})();

		RSVP.all(arrayOfPromises)
			.then(function shakeTree () {
				tree = tree;

			});
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
			function ( flavorDetails ) {
				andShakeWith(flavorDetails);
			}
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
