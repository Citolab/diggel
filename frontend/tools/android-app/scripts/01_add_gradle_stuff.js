const fs = require('fs');
const path = require('path');

module.exports = function (ctx) {
  const projectRoot = path.join(ctx.opts.projectRoot);
  const gradleFile = path.join(projectRoot, 'build-extras.gradle');
  console.info(`start copying build-extras.gradle from ${gradleFile}`);
  fs.mkdirSync(path.join(projectRoot, 'platforms/android'), {
    recursive: true,
  });
  fs.copyFileSync(
    gradleFile,
    path.join(projectRoot, 'platforms/android/build-extras.gradle')
  );
  console.info(
    `successfully copied gradle extrass to ${path.join(
      projectRoot,
      'platforms/android/build-extras.gradle'
    )}`
  );

  const gradleProps = path.join(projectRoot, 'gradle.properties');
  console.info(`start copying gradle.properties from ${gradleProps}`);
  fs.mkdirSync(path.join(projectRoot, 'platforms/android'), {
    recursive: true,
  });
  fs.copyFileSync(
    gradleProps,
    path.join(projectRoot, 'platforms/android/gradle.properties')
  );
  console.info(
    `successfully copied gradle.properties to ${path.join(
      projectRoot,
      'platforms/android/gradle.properties'
    )}`
  );
};
