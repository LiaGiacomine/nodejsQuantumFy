var domains = require('./country-list.json');
var blacklist = ["si.edu", "america.edu"];

module.exports = function(email, acceptSub) {
	var domain;
	if (acceptSub) {
		var dump = email.split("@").reverse()[0].split(".").reverse();
		domain = dump[1]+"."+dump[0];
	}
	else {
		domain = email.split("@").reverse()[0];
	}
	if (blacklist[domain] === undefined && domains.hasOwnProperty(domain)) {
		return domains[domain];
	}
	else {
		return false;
	}
}