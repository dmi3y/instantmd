/*jshint globalstrict: true*/
/*global require*/

'use strict';

var
	requirejs = require('requirejs');

requirejs.config({
	baseUrl: 'parser',
	paths: {
	    flavors: '../flavors'
	}
});

requirejs(['parser'], function(parser) {
	var str = '  asdfasdf \n \n\n \t \t \n  asdf asd\nbcbcbcb hythythyt\n \tabcabc\t \n\t\n asdf';
	parser.parseStr(str);
});