## Prerequisites

- You need to have cordova installed locally: `npm i -g cordova`
- To run the app in an emulator it's best to use AVD Manager of Android Studio.

## Build and run

- emulator `npm run emulator`.

OSX Installation ANDROID SDK

sdkmanager "platforms;android-29"
sdkmanager "build-tools;29.0.2"

export ANDROID_SDK_ROOT=~/Android
export PATH=$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$PATH
export PATH=$ANDROID_SDK_ROOT/platform-tools:$PATH
export PATH=$ANDROID_SDK_ROOT/tools:$PATH
export PATH=$ANDROID_SDK_ROOT:$PATH

Users/patrickklein/Android

- cmdline-tools
  |- latest

https://stackoverflow.com/questions/60440509/android-command-line-tools-sdkmanager-always-shows-warning-could-not-create-se
