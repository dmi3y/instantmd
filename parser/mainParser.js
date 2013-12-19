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
			rulesBlocks = flavorDetails.rules.blocks,
			parsersPool = {},
			hashOfPromises = {};

		/**
		 * Stack found blocks into object of promises
		 * @param  {str} blockName
		 * @param  {int} offset        [description]
		 * @param  {[type]} blockRules [description]
		 * @return {[type]}            [description]
		 */
		function parseDownWith(blockName, position, offset) {

			var
				parserPool = parsersPool[blockName] || [];

			parserPool.push({position: position, offset: offset});

			parsersPool[blockName] = parserPool;
		}

		function formHashOfPromises () {
			var
				blockParsePromise,
				blockName,
				parserPool,
				parsedmd;

			for ( blockName in parsersPool ) {

				parserPool = parsersPool[blockName];

				blockParsePromise = new RSVP.Promise(function (resolve, reject) {
					var
						blockParser = config.flavor + blockName + '/parser';

					requirejs([blockParser],
						function growTree(blockParser) {
							parsedmd = blockParser('abcabc');
							tree.push(parsedmd);
							resolve(tree);
						}
					);

				});
				hashOfPromises[blockName] = blockParsePromise;
			}



		}

		/**
		 * Recurcive line checker
		 */
		(function assignParsers() {
			/*jshint maxcomplexity: 7*/
			var
				mdline,
				mdlinesLen = container.splitted.length,
				position = 0,
				blockRules,
				lineRules,
				blockName,
				blockRuleIx = 0,
				offset,
				startover = false;

			for ( position; mdlinesLen > position; position++ ) {
				mdline = container.splitted[position];

				if ( utils.isNotBlank(mdline) ) {
					for (blockName in rulesBlocks) {

						if ( startover ) {
							startover = false;
							break;
						}

						blockRules = rulesBlocks[blockName];

						for ( blockRuleIx in blockRules.test ) {

							offset = position + parseInt(blockRuleIx, 10);

								lineRules = blockRules.test[blockRuleIx];
								
								if ( isLineFits(lineRules, mdline) ) {
									parseDownWith(blockName, position, offset);
									startover = true;
									break;
								}
						}
					}
				}
			}
			formHashOfPromises();
		})();

		RSVP.hash(hashOfPromises)
			.then(function shakeTree (el) {
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