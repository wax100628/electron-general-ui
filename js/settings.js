'use strict';

var portObjOption = {

	hostAddr: 0x00,
	localAddr: 0x00,
	portName: '',
	baudRate: 9600,
	parity: "none",
	dataBits: 8,
	flowCtrl: 'none',
	stopBits: 1

}
const ipcRender = require('electron').ipcRenderer;
var notifier = require('node-notifier');
var fs = require('fs');
var config_path = process.cwd() + '/config/config.json';
var nconf = require('nconf').file({file:config_path});

// 读取配置
$(function () {
	if (fs.existsSync(config_path)) {
		nconf.load();
		portObjOption.portName = nconf.get('portName');
		if(getPort(portObjOption.portName) == -1)
        {
            ipcRender.send('open-information-dialog', '未检测到可用串口!');
         }

		portObjOption.hostAddr = nconf.get('hostAddr');
		$("#hostAddr").val(portObjOption.hostAddr);
		portObjOption.localAddr = nconf.get('localAddr');
		$("#localAddr").val(portObjOption.localAddr);

		portObjOption.baudRate = nconf.get('baudRate');
		$("#baudRate").val(portObjOption.baudRate);
		
		portObjOption.parity = nconf.get('parity');
		$("#parity").val(portObjOption.parity);

		portObjOption.dataBits = nconf.get('dataBits');
		$("#dataBits").val(portObjOption.dataBits);

		portObjOption.stopBits = nconf.get('stopBits');
		$("#stopBits").val(portObjOption.stopBits);

		if(nconf.get('devMode') === true)
			$("#devMode").val('true');
		else
			$("#devMode").val('false');

		// portObjOption.flowCtrl = nconf.get('flowCtrl');
	}else{
		if (!fs.existsSync(process.cwd() + '/config')) {
			fs.mkdirSync(process.cwd() + '/config');
		}
		if(getPort('') == -1)
        {
            ipcRender.send('open-information-dialog', '未检测到可用串口!');
         }
	}

}());

// 保存串口设置
$("#apply").click(function applySettings(evt){
	evt.preventDefault();
	nconf.set('localAddr', Number($("#localAddr").val()));
	nconf.set('hostAddr', Number($("#hostAddr").val()));
	nconf.set('portName', $("#portName").val());
	nconf.set('baudRate', Number($("#baudRate").val()));
	nconf.set('dataBits', Number($("#dataBits").val()));
	nconf.set('stopBits', Number($("#stopBits").val()));
	nconf.set('parity', $("#parity").val());
	
	var dev = $("#devMode").val();
	if(dev == 'true')
		nconf.set('devMode', true);
	else
		nconf.set('devMode', false);

	nconf.save();
	notifier.notify('串口设置已保存至 ' + config_path);
});

// 枚举可用串口
function getPort(portName) {
	let SerialPort = require("serialport");
	let portInner = "";
	SerialPort.list(function(err, ports) {
        if(ports.length == 0)
        {
            return -1;
        }

		ports.forEach(function(port) {
			let com = port.comName;
			console.log('port: ' + com);
			let isSelected = com === portName ? true : false;
			console.log('is selected: ' + isSelected);
			let innerOption = '';
			if(isSelected)
				innerOption = `<option value="${com}" selected="selected">${com}</option>`;
			else
				innerOption = `<option value="${com}">${com}</option>`;

			$(innerOption).appendTo("#portName");

		});
	});

    return 0;
}
