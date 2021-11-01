const cli = require('cac')()
const shell = require('shelljs');
const fs = require('fs');
const walk = require('walk');
const Handlebars = require("handlebars");
const path = require('path');

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

cli
  .command('create', 'Create a microservice')
  .option('--def [def]', 'Project definition file')
  .action(options => {
    console.log(options);
    
    fs.readFile(options.def, 'utf8', (err, data) => {
      var projectDef = JSON.parse(data);
      var templatePath = 'project-templates/dotnet';

      // Walker options
      var walker  = walk.walk(templatePath, { followLinks: false });
      var files   = [];

      walker.on('file', function(root, stat, next) {
          files.push(root + '/' + stat.name);
          next();
      });

      walker.on('end', function() {
          //console.log(files);

          files.forEach(fileName => {

            var fixedPath = fileName.split('\\\\').join("/").split("\\").join("/")
            var parsedFileName = Handlebars.compile(fixedPath.replace("\\", "/"), { noEscape: true, strict: true })(projectDef);
            
            parsedFileName = path.join("C:/out-test/", parsedFileName);

            console.log(parsedFileName);

            fs.readFile(fileName, 'utf8', (err, data) => {
              var parsedContent = Handlebars.compile(data)(projectDef, { strict: true });

              //console.log(parsedContent);
              //ensureDirectoryExistence(parsedFileName);

              //fs.writeFile(parsedFileName, parsedContent, { flag: 'a+' }, (err) => {console.log(err)});

            });

          });
      });


      /*
      */

    });
  });

cli.help()

cli.parse()