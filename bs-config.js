module.exports = {
  server: "templates/dist",
  files: "templates/dist/**/*",
  port: 3000,
  middleware: [
    {
      route: "",
      handle: function (req, res, next) {
        // Remove any CSP headers that browser-sync might set
        res.removeHeader('Content-Security-Policy');
        res.removeHeader('Content-Security-Policy-Report-Only');
        next();
      }
    }
  ]
};