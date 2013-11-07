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
	/**
	 * Mixing up the promises instead of 
	 * callback hell
	 * @param  {obj} flavorDetails parser details
	 * @return {str}               html parsed string from md
	 */
	function andShakeWith(flavorDetails){
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
					}
				);

			});

			return blockParsePromise;
		}

		/**
		 * Recurcive line checker
		 */
		(function checkLine() {
			var
				blocks = flavorDetails.rules.blocks,
				mdline, position = 0,
				blockRules,
				blockRule,
				blockName,
				blockRuleIx, offset,
				arrayOfPromises = [];

			for (blockName in blocks) {
				blockRules = blocks[blockName];

				for (blockRuleIx in blockRules.test) {
					offset = position + parseInt(blockRuleIx, 10);
					mdline = container.splitted[offset];

					if ( utils.isNotBlank(mdline) ) {
						blockRule = blockRules.test[blockRuleIx];
						
						if ( isLineFits(blockRule, mdline) ) {
							arrayOfPromises.push(parseDownWith(blockName, blockRules, position, offset));
							delete blocks[blockName];
						}

						if ( container.linesOrig > position ) {
							checkLine();
							position += 1;
						}
					}
				}
			}
		})();

		RSVP.all(arrayOfPromises).then(function shakeTree () {
			tree;

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
