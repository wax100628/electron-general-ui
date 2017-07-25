'use strict';

const ipcRender = require('electron').ipcRenderer;

var utils = require('../js/utils');
var log = utils.log;

var minBtn = $("#menu-min")[0];
var maxBtn = $("#menu-max")[0];
var closeBtn = $("#menu-close")[0];
var titleBar = $("#title")[0];

// 添加按钮click事件监听
minBtn.addEventListener('click', () => {
    ipcRender.send('min-window');
});
maxBtn.addEventListener('click', () => {
    ipcRender.send('max-window');
});
closeBtn.addEventListener('click', () => {
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

// 串口设置
$("#port-set").click(function(){
    $("#page-content-wrapper").load("../html/loading.html");
    setTimeout(function(){
        $("#page-content-wrapper").load("../html/port-settings.html");
    }, 1000);
});

// 打开串口
$("#port-open").click(function(){
    ipcRender.send('open-port-cmd');
});

// 关闭串口
$("#port-close").click(function(){
    ipcRender.send('close-port-cmd');
});

ipcRender.on('log-msg', (ev,arg)=>{
    log(arg);
});

// J2自检
$("#j2-selfcheck-cmd").click(function(){
    ipcRender.send('j2-selfcheck-cmd');
});
// J3自检
$("#j3-selfcheck-cmd").click(function(){
    ipcRender.send('j3-selfcheck-cmd');
});
// J2采样
$("#j2-detect-cmd").click(function(){
    ipcRender.send('j2-detect-cmd');
});
// J3采样
$("#j3-detect-cmd").click(function(){
    ipcRender.send('j3-detect-cmd');
});

// 关于
$("#about").click(function(){
    ipcRender.send('open-about-dialog');
});
