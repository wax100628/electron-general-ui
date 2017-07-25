const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain
} = require('electron');

var openAboutWindow = require('about-window').default;
var join = require('path').join;
var notifier = require('node-notifier');
var configuration = require('./js/configuration');
var utils = require('./js/utils');

// main进程
let win = null;

// 创建窗体
function createWindow() {
  win = new BrowserWindow({
    minWidth: 480,
    width: 770,
    minHeight: 480,
    height: 640,
	titleBarStyle: 'hidden-inset',
    frame: false,
    icon: join(__dirname, 'imgs', 'tray.ico'),
    show: false
  });

	// 加载首页
  win.loadURL(`file://${__dirname}/html/index.html`)
	
	// 窗口关闭时置 null
  win.on('closed', () => {
    win = null
  });

	// 可显示时才显示, 避免白屏窗口
  win.once('ready-to-show', () => {
    win.show();
  });
  
  // 发送 resize后的数据
  win.on('resize', ()=>{
      win.webContents.send('resize-charts-to-render', win.getContentSize());
  });
	
  win.on('maximize', function(){
	 win.webContents.send('maximized');
  });

  win.on('unmaximize', function(){
	 win.webContents.send('restored');
  });
}

// 入口
app.on('ready', () => {
  createWindow();
  // 注册快捷键
  globalShortcut.register('CommandOrControl+X', () => {
    win.webContents.openDevTools();
  });
});

// 所有窗口都关闭时, 程序退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 窗口最小化消息
ipcMain.on('min-window', () => {
  win.minimize();
});

// 窗口最大化消息
ipcMain.on('max-window', (ev, arg) => {
  if(win == null)
    return;

  if (win.isMaximized()) {
    win.restore();
    ev.sender.send('restored');
  } else {
    win.maximize();
    ev.sender.send('maximized');
  }
});

// 窗口关闭消息
ipcMain.on('close-window', () => {
  win.close();
  win = null;
});

// 发送 resize 消息
ipcMain.on('resize-charts', (ev, arg)=>{
	win.webContents.send('resize-charts-to-render', win.getContentSize());
});

// 信息弹窗
ipcMain.on('open-information-dialog', (ev, arg)=>{
    showMessage(arg[0]);
});

// 信息弹窗
function showMessage(msg){
    let dialog = require('electron').dialog;
    let options = {
        type: 'info',
        title: '提示',
        message: msg,
        buttons: ['ok']
    };

    dialog.showMessageBox(options, function(index){
        //
    });
}

// 打开 About 窗口
ipcMain.on('open-about-dialog', function(ev, arg){
    openAboutWindow({
        icon_path: join(__dirname, 'imgs', 'logo.png'),
        copyright: 'Copyright (c) 2017 张洁'
    });
});
