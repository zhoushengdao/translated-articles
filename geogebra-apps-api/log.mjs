/**
 * 批量打印多个 Geogebra 对像的多个属性
 * @param objs {string[]} 对象名
 * @param methods {string[]} 方法名
 */
function log(objs, methods) {
  let logObj = {};
  for (const obj of objs) {
    logObj[obj] = {};
    for (const method of methods) {
      logObj[obj][method] = ggbApplet[method](obj);
    }
  }
  window.console.log(logObj);
}
