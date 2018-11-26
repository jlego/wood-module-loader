/**
 * Wood Plugin Module.
 * 模块自动加载
 * by jlego on 2018-11-18
 */
 const path = require('path');
 const fs = require('fs');

module.exports = async (app = {}, config = {}) => {
  ['model', 'controller', 'route'].forEach(async type => {
    let dirPath = config[type];
    const dirList = fs.readdirSync(path.resolve(__dirname, dirPath));
    dirList.forEach(async fileName => {
      let nameArr = fileName.split('.'),
        moduleName = nameArr[0],
        fileExt = nameArr[1];
      if (fileExt === 'js') {
        let theModule = require(path.resolve(__dirname, `${dirPath}/${moduleName}`));
        if (type === 'controller') {
          let controllerName = moduleName.replace('Controller', '');
          let _controllers = app.Plugin('controller')._controllers;
          let _models = app.Plugin('model')._models;
          if(!_controllers.has(controllerName)){
            theModule = typeof theModule === 'function' ? new theModule({ctx: app}, _models) : theModule;
            _controllers.set(controllerName, theModule);
          }
        }
      }
    });
  });
  return app;
}
