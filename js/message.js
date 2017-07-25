'use strict';

var getCRC = require('./utils').getCRC;
var get2Char = require('./utils').get2Char;
var hexString = require('./utils').hexString;
var configuration = require('./configuration');

class Message {
    //	Head	Lenth	Tag		TagAddr	SourceAddr	Reserved	Ext 	Data    CRC
    // 	55AA	****	01-A1	**		**			0000    	0000	*		SUM
    //	2	 	2		1		1		1			2			2		N		1
    constructor() {
		//
    	let a = arguments;
    	if (a.length == 1) {
			if(a[0].length == 2)
    			this._constructor1(a[0]);/*发送*/
			else if(a[0].length >= 24)
   				this._constructor2(a[0]);/*解析*/
    	}
    }
/** msg发送构造 */
	_constructor1(tag) {
		this.head = "55aa";
		this.length = "0C00";
		this.tag = tag;
		this.tagAddr =  Number(configuration.getValue('hostAddr')).toString(16);
		this.sourceAddr = Number(configuration.getValue('localAddr')).toString(16);
		this.loopCount = "0000";
		this.extData = "0000";
		let msg = this.head + this.length + this.tag + this.tagAddr + this.sourceAddr + this.loopCount + this.extData;
		this.crc = getCRC(msg);
	}

/** 接收buf解析构造msg */
	_constructor2(src) {
		// 55a
		this.head = src.substring(0, 4);
		// length
		this.lenLow = src.substring(4, 6);
		this.lenHigh = src.substring(6, 8);
		this.length = this.lenHigh + this.lenLow;

		let l = parseInt(this.length, 16);
		this.tag = src.substring(8, 10);
		this.tagAddr = src.substring(10, 12);
		this.sourceAddr = src.substring(12, 14);
		this.loopCount = src.substring(14, 18);
		this.extData = src.substring(18, 20);
		this.data = src.substring(20, l * 2 - 2);
		this.crc = src.substr(-2, 2);
	}

	encode() {
		let msg = this.head 
					+ this.length
					+ this.tag 
					+ this.tagAddr 
					+ this.sourceAddr
					+ this.loopCount
					+ this.extData;
		this.crc = getCRC(msg);
		return msg + this.crc;
	}

	toString() {
		return hexString(this.encode());
	}

	get calllback() {
		return this._calllback;
	}

	set calllback(val) {
		this._calllback = val
	}

	get info() {
		return this._info;
	}

	set info(val) {
		this._info = val
	}

	get head() {
		return this._head;
	}
	set head(val) {
		this._head = val.toUpperCase();
	}

	get length() {
		return this._length;
	}
	set length(val) {
		this._length = val.toUpperCase();
	}

	get tag() {
		return this._tag;
	}
	set tag(val) {
		this._tag = val.toUpperCase();
	}

	get tagAddr() {
		return this._tagAddr;
	}
	set tagAddr(val) {
		this._tagAddr = val.toUpperCase();
	}

	get sourceAddr() {
		return this._sourceAddr;
	}
	set sourceAddr(val) {
		this._sourceAddr = val.toUpperCase();
	}

	get data() {
		return this._data;
	}
	set data(val) {
		this._data = val.toUpperCase();
	}

	get crc() {
		return this._crc;
	}
	set crc(val) {
		this._crc = val.toUpperCase();
	}

}

module.exports = Message;
