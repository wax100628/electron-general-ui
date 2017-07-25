'use strict';

const ipcRender = require('electron').ipcRenderer;

var utils = require('../js/utils');
var log = utils.log;

// 添加按钮click事件监听
$("#menu-min").click(function(ev){
	ipcRender.send('min-window');
});

$("#menu-max").click(function(ev){
	ipcRender.send('max-window');
});

$("#menu-close").click(function(ev){
	ipcRender.send('close-window');
});

// 菜单按钮单击事件
$("#menu-toggle").click(function () {
    $("#wrapper").toggleClass("toggled");
    if ($("#wrapper").hasClass('toggled'))
	{
        $("#menu-toggle").attr('class', "glyphicon glyphicon-align-right");
//		$("#min-max-close").css('margin-right', '200px');
		$("#min-max-close").animate({
			'margin-right':'200px'
		});
	}
    else
	{
        $("#menu-toggle").attr('class', "glyphicon glyphicon-align-justify");
//		$("#min-max-close").css('margin-right', '0px');
		$("#min-max-close").animate({
			'margin-right':'0px'
		});
	}
    
	setTimeout(function(){
		ipcRender.send('resize-charts');
	}, 400);
});

// 恢复、最大化消息, 设置图标
ipcRender.on('restored', () => {
    $("#menu-max").attr('class', "glyphicon glyphicon-resize-full");
    $("#menu-max").attr('title', "最大化");
});
ipcRender.on('maximized', () => {
    $("#menu-max").attr('class', "glyphicon glyphicon-resize-small");
    $("#menu-max").attr('title', "恢复");
});

// 两个图表
$("#sensors-data-charts").click(function(){
    $("#page-content-wrapper").load("../html/loading.html");
	setTimeout(function(){
        $("#page-content-wrapper").load("../html/charts.html")
        ipcRender.send('resize-charts');
	}, 2000);
});

// Log消息至浏览器console
ipcRender.on('log-msg', (ev,arg)=>{
    log(arg);
});

// 发送打开关于窗口的消息
$("#about").click(function(){
    ipcRender.send('open-about-dialog');
});
