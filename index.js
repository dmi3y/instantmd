/*jshint globalstrict: true*/
/*global require*/
/* nodeJs starting poing */
'use strict';

var
	requirejs = require('requirejs');

requirejs.config({
	baseUrl: 'parser',
	paths: {
	    flavors: '../flavors',
	    rsvp: '../node_modules/rsvp/dist/rsvp-2.0.4.amd'
	}
});

requirejs(['parser'], function(parser) {
	// var str = '  asdfasdf \n \n\n \t \t \n  asdf asd\nbcbcbcb hythythyt\n \tabcabc\t \n\t\n asdf  asdfasdf \n \n\n \t \t \n  asdf asd\nbcbcbcb hythythyt\n \tabcabc\t \n\t\n asdf  asdfasdf \n \n\n \t \t \n  asdf asd\nbcbcbcb hythythyt\n \tabcabc\t \n\t\n asdf';
	var str = '* list\n\n#header\n>blockquote \n \n\n \t \t \n  paragraph start asdf asd\nbcbcbcb hythythyt\n \tabcabc paragraph end\t \n\t\n asdf  asdfasdf \n \n\n \t \t \n  asdf asd\nbcbcbcb hythythyt\n \tabcabc\t \n\t\n asdf  asdfasdf \n \n\n \t \t \n  asdf asd\nbcbcbcb hythythyt\n \tabcabc\t \n\t\n asdf';
	parser.parseStr(str);
});