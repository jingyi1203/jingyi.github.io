const path = require("path");
const resolve = function(dir) {
  return path.join(__dirname, dir);
};

module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    const svgRule = config.module.rule("svg");
    svgRule.include.add(resolve("src/icons"));
    svgRule.uses.clear();
    svgRule
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .tap(options => {
        return {
          symbolId: "icon-[name]"
        };
      });

    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve("src/icons"));
  },
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: 8081,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        // target: "http://api.libr.lanbenzi.cn",
        target: "http://172.16.148.206:7007",
        // target: 'http://127.0.0.1:7002',
        ws: true,
        changOrigin: true
      }
    }
  }
};
