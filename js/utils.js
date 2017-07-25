'use strict';

function getCRC(s) {
	let sum = 0;
	let src = new Buffer(s, 'hex');
	for (var i = 0; i < src.length; i++) {
		sum += src[i];
	}
	sum &= 0xFF;
	let rst = sum.toString(16);
	return get2Char(rst);
}

function hexString(s) {
	let arr = s.split('');
	for (var i = 1; i < arr.length - 1; i = i + 2) {
		arr[i] += ' ';
	}
	return arr.join('');
}

function hexByte(s) {
	let n = parseInt(s, 16);
	let b = [0, 0, 0, 0, 0, 0, 0, 0];
	let i = 7;
	while (n > 0) {
		b[i--] = n % 2;
		n = Math.floor(n / 2);
	}
	return b;
}

function byteToHex(b) {
	let i = 0;
	let s = '';
	while (i < b.length) {
		let bb = new Array(8);
		for (var j = bb.length - 1; j >= 0; j--) {
			bb[j] = b[i++] || '0';
		}
		let hex = parseInt(bb.join(''), 2).toString(16);
		s += get2Char(hex);
	}
	return s;
}

function toHex(s) {
	let i = 0;
	let hex = '';
	while (i < s.length) {
		let ss = s.substring(i, i + 2);
		i += 2;
		ss = parseInt(ss).toString(16);
		hex += get2Char(ss);
	}
	return hex;
}

function get2Char(s) {
	return s.length == 1 ? '0' + s : s;
}

function log() {
	let fs = require('fs');
	let data = fs.readFileSync(process.cwd() + '/config/config.json');
	if (data.slice(0, 3).toString('hex') == 'efbbbf') {
		data = data.slice(3);
	}

	let config = JSON.parse(data);
	console.log('config.devMode: ' + config.devMode);
	if(config.devMode === false)
		return;

	let log = new Date().format("[yyyy-MM-dd hh:mm:ss]:  ") + [].slice.call(arguments).join(' ');
	console.log(log);
	if (!fs.existsSync(process.cwd() + '/log')) {
		fs.mkdirSync(process.cwd() + '/log');
	}
	let date = new Date().format('logyyyy-MM-dd.log')
	fs.appendFileSync(process.cwd() + '/log/' + date, log + '\r\n');
}

function getBlankByte(n) {
	let b = Array(n)
	for (var i = 0; i < b.length; i++) {
		b[i] = 0;
	}
	return b;
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

exports.log = log;
exports.toHex = toHex;
exports.hexString = hexString;
exports.getCRC = getCRC;
exports.get2Char = get2Char;
