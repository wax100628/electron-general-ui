'use strict';

var config_path = process.cwd() + '/config/config.json';
var nconf = require('nconf').file({file:config_path});

function getValue(key){
	nconf.load();
	return nconf.get(key);
}

function setKeyValue(key, val){
	nconf.set(key, val);
	nconf.save();
}

module.exports = {
	getValue:getValue,
	setKeyValue:setKeyValue
};
