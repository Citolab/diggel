var fs = require('fs');
var path = require('path');

const basePath = path.join(process.cwd());
const version_xml = path.join(basePath, 'version.xml');
const apk = path.join(
  basePath,
  'platforms/android/app/build/outputs/apk/debug/app-debug.apk'
);

if (!fs.existsSync(version_xml)) {
  console.error('version.xml not found.');
}

if (!fs.existsSync(apk)) {
  console.error('apk not found.');
}

var release_folder = path.join(process.cwd(), '../../release');
if (!fs.existsSync(release_folder)) {
  fs.mkdirSync(release_folder);
} else {
  fs.readdir(release_folder, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(release_folder, file), (err) => {
        if (err) throw err;
      });
    }
  });
}
fs.copyFile(version_xml, path.join(release_folder, 'version.xml'), (err) => {
  if (err) throw err;
  console.log(`version.xml was copied to ${release_folder}`);
});

fs.copyFile(apk, path.join(release_folder, 'diggel.apk'), (err) => {
  if (err) throw err;
  console.log(`diggel.apk was copied to ${release_folder}`);
});
