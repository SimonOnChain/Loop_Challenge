export default {
  server: {
    baseDir: "templates/dist",
    middleware: [
      function (req, res, next) {
        // Remove any CSP headers that browser-sync might set
        res.removeHeader('Content-Security-Policy');
        res.removeHeader('Content-Security-Policy-Report-Only');
        next();
      }
    ]
  },
  files: "templates/dist/**/*",
  port: 3000,
  open: false,
  notify: false
};