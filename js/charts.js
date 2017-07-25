'use strict';

const ipcCharts = require('electron').ipcRenderer;
var echarts = require('echarts');

// 两个图表
var tpChart = echarts.init(document.getElementById('tp-content-wrapper'));
var icpChart = echarts.init(document.getElementById('icp-content-wrapper'));

// icp X 轴
var icpXAxisData = [];
// icp 两条线
var icp1Data = [];
var icp2Data = [];

for (var i = 0; i < 100; i++) {
    icpXAxisData.push(i);
    icp1Data.push(((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5).toFixed(2));
    icp2Data.push(((Math.cos(i / 5) * (i / 5 -10) + i / 6).toFixed(2) * 5).toFixed(2));
}

// 显示 icp 图
var icpOption = {
    title: {
        text: '振动图表-柱状图'
    },
    legend: {
        data: ['ICP1', 'ICP2'],
        align: 'left'
    },
    toolbox: {
        // y: 'bottom',
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            dataView: {},
            saveAsImage: {
                pixelRatio: 2
            },
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {}
        }
    },
    tooltip: {},
    xAxis: {
        data: icpXAxisData,
        silent: false,
        splitLine: {
            show: false
        }
    },
    yAxis: {
    },
    series: [{
        name: 'ICP1',
        type: 'bar',
        data: icp1Data,
        animationDelay: function (idx) {
            return idx * 10;
        }
    }, {
        name: 'ICP2',
        type: 'bar',
        data: icp2Data,
        animationDelay: function (idx) {
            return idx * 10 + 100;
        }
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
        return idx * 5;
    }
};


// tp 线
var tpXData = [];
var tpData = [];

for(var i = 0; i < 7; i++)
{
	let date = new Date();
	tpData.push(Math.floor(Math.random() * 10) + i);
	let ms = date.getMilliseconds() / 1000;
	let fp = (String(ms).split('.'))[1];
	tpXData.push('' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + fp);
}

// TP100 温度曲线
var tp100option = {
    title: {
        text: 'TP100',
        subtext: '虚构数值'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['温度']
    },
    toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            magicType: {type: ['line', 'bar']},
            saveAsImage: {},
            restore: {}
        }
    },
    xAxis:  {
        type: 'category',
		axisLabel:{
			rotate: 30
		},
        boundaryGap: false,
        data: tpXData
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    series: [
        {
            name:'温度',
            type:'line',
            data:tpData,
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
    ]
};


// div resize
ipcCharts.on('resize-charts-to-render', (ev, arg)=>{

	console.log(arg);

	if(arg.length == 2)
	{
		$("#tp-content-wrapper").css('height', arg[1]/2);
		$("#icp-content-wrapper").css('height', arg[1]/2);
	}

	tpChart.resize();
	icpChart.resize();
});

$(document).ready(function(){
    // 绑定图表
    tpChart.setOption(tp100option);
    icpChart.setOption(icpOption);
    tpChart.resize();
    icpChart.resize();
});
