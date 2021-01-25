// update the version in version.xml and config.xml
// for version cordova-plugin-app-update

var fs = require('fs');
var path = require('path');

const root = process.cwd();
const file = path.join(root, 'version.xml');

if (fs.existsSync(file)) {
  const newversion = replace_version_in_xml_version_file(file).toString();
  console.log(`update version in ${file} to ${newversion}`);
  replace_version_in_config_xml(path.join(root, 'config.xml'), newversion);
  console.log(`update version in config.xml to ${newversion}`);
} else {
  console.log(`file: '${file}' not found.`);
}

function replace_version_in_xml_version_file(filename) {
  var data = fs.readFileSync(filename, 'utf8');
  const regex = new RegExp('<version>.*</version>');
  const prevVersion = regex
    .exec(data)
    .toString()
    .replace('<version>', '')
    .replace('</version>', '');
  const d = new Date();
  let newVersion = `${d.getFullYear()}${('0' + (d.getMonth() + 1)).slice(-2)}${(
    '0' + d.getDate()
  ).slice(-2)}${('0' + (d.getHours() + 1)).slice(-2)}`;
  // if (prevVersion.startsWith(newVersion)) {
  //     newVersion = (+prevVersion + 1);
  // } else {
  //     newVersion = `${newVersion}01`
  // }
  var result = data.replace(regex, `<version>${newVersion}</version>`);
  fs.writeFileSync(filename, result, 'utf8');
  return newVersion;
}

function replace_version_in_config_xml(filename, version) {
  //android-versionCode="202004091" id="com.diggel.app" version="2020.04.09.1012"
  const versionSeperated = `${version.substr(0, 4)}.${version.substr(
    4,
    2
  )}.${version.substr(6, 2)}.${+version.substr(8, 2)}`;
  var data = fs.readFileSync(filename, 'utf8');
  const regexCode = new RegExp('android-versionCode="(.[^"]+)"');
  const regeVersion = new RegExp('app" version="(.[^"]+)"');
  var result = data.replace(regexCode, `android-versionCode="${version}"`);
  var result = result.replace(
    regeVersion,
    `app" version="${versionSeperated}"`
  );
  fs.writeFileSync(filename, result, 'utf8');
}
