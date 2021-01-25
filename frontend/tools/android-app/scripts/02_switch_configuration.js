#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

module.exports = function (ctx) {
  const projectRoot = ctx.opts.projectRoot;

  if (projectRoot) {
    var filestoreplace = [
      'www/index.html',
      'www/spacebook/index.html',
      'www/webspace/index.html',
      'www/spacegram/index.html',
      'www/spacetalk/index.html',
    ];
    filestoreplace.forEach(function (val, index, array) {
      var fullfilename = path.join(projectRoot, val);
      console.info(`start modifying ${fullfilename}`);
      if (fs.existsSync(fullfilename)) {
        replace_string_in_file(
          fullfilename,
          /<!-- web-version-config-on -->/,
          '<!-- web-version-config-off'
        );
        replace_string_in_file(
          fullfilename,
          /<!-- end-web-version-config-on -->/,
          'end-web-version-config-off -->'
        );
        replace_string_in_file(
          fullfilename,
          /<!-- cordova-version-config-off/,
          '<!-- cordova-version-config-on -->'
        );
        replace_string_in_file(
          fullfilename,
          /end-cordova-version-config-off -->/,
          '<!-- end-cordova-version-config-on -->'
        );
        console.info(`successfully modified ${fullfilename}`);
      } else {
        console.log('missing: ' + fullfilename);
      }
    });
  }
};

function replace_string_in_file(filename, to_replace, replace_with) {
  var data = fs.readFileSync(filename, 'utf8');

  var result = data.replace(new RegExp(to_replace, 'g'), replace_with);
  fs.writeFileSync(filename, result, 'utf8');
}
