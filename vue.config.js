const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    //本地測試
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8081',
    //     changeOrigin: true,
    //     pathRewrite: { '^/api': '' },
    //   },
    // },
    client: {
      overlay: {
        warnings: false,
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications.",
          ];
          if (ignoreErrors.includes(error.message)) {
            return false;
          }
        },
      },
    },
  }
})
