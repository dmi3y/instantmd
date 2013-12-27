/*jshint globalstrict: true, expr: true*/
/*global define, requirejs*/

'use strict';

define(['utils', 'rsvp', 'config'], function(utils, RSVP, config) {
	var
		container = {},
		mdlinesLen,
		tree = [];

	/**
	 * Checks if line fits the block rule
	 * @param  {mix}  lineRules function or regExp
	 * @param  {str}  l         line of md
	 * @return {Boolean}
	 */
	function isLineFitsAnyOf(lineRules, l) {
		var
			lineRuleIx = lineRules.length,
			lineRule,
			test,
			result;

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
	 * Load markdown flawor from config
	 * pass it further to pre-parser
	 */
	function getFlavor() {
		var
			flavor = config.flavor,
			flavorDetails = flavor + 'details';

		requirejs([flavorDetails],
			function (flavorDetails) {

				andShakeWith(flavorDetails);
			}
		);
	}

	/**
	 * Mixing up the promises instead of 
	 * callback nested hell
	 * @param  {obj} flavorDetails parser details
	 * @return {str}               html parsed string from md
	 */
	function andShakeWith(flavorDetails) {
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

		function makeBlockParsePromise(blockName) {
			var
				blockParsePromise,
				parsedmd;

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
			return blockParsePromise;
		}

		function formHashOfPromises() {
			var
				blockParsePromise,
				blockName,
				parserPool;

			for ( blockName in parsersPool ) {

				parserPool = parsersPool[blockName];
				
				blockParsePromise = makeBlockParsePromise(blockName);
				hashOfPromises[blockName] = blockParsePromise;
			}
		}

		/**
		 * Recurcive line checker
		 */
		(function assignParsers(position) {
			/*jshint maxcomplexity: 7*/
			var
				mdline,
				blockRules,
				lineRules,
				blockName,
				blockRuleIx = 0,
				offset,
				startover = false;

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
						
						if ( isLineFitsAnyOf(lineRules, mdline) ) {

							parseDownWith(blockName, position, offset);
							startover = true;
							break;
						}
					}
				}
			}

			position += 1;
			
			if ( mdlinesLen > position ) {

				assignParsers(position);
			} else {

				formHashOfPromises();
			}
		}(0));

		RSVP.hash(hashOfPromises)
		.then(function shakeTree(el) {

			tree = tree;
		});
	}

	/**
	 * Get markdown string and parse it
	 * into valid HTML string according the rules
	 * @param  {str} str  markdown string
	 * @return {str} html HTML string
	 */
	function parseStr(str) {
		var
			len,
			arr,
			html;

		container.str = str;
		arr = str.split(/\r|\n|\r\n/);
		len = arr.length - 1;
		container.linesOrig = len;
		container.splitted = arr;

		mdlinesLen = container.splitted.length;
		html = getFlavor();
		return html;
	}

	/* Public methods */
	return {
		parseStr: parseStr
	};

});
