const path = require("path")

const hbsOptions = {
    viewEngine: {
        extname: ".handlebars",
        partialsDir: path.join(__dirname, "views"),
        defaultLayout: false,
      },
      viewPath: path.join(__dirname, "views"),
      extName: ".handlebars",
}
 module.exports = hbsOptions