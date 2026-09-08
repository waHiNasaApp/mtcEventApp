# Middle Tennessee Council Event App <!-- omit in toc -->

**Last updated August 28, 2026**

> The Github Repository for this project is [here](https://github.com/SAPIENTI0R/mtcEventAppDev).

> The Firebase Console requires the Google Account login and is [here](https://console.firebase.google.com/u/0/project/councilapp3/).

### Table of Contents

- [Core Information](#core-information)
  - [High Level Overview](#high-level-overview)
  - [Updating Content](#updating-content)
  - [Creating a New Event](#creating-a-new-event)
  - [Sending Notifications](#sending-notifications)
  - [Working with the Game](#working-with-the-game)
- [Detailed Documentation](#detailed-documentation)
  - [Software Setup](#software-setup)
    - [Visual Studio Code (VS Code)](#visual-studio-code-vs-code)
    - [NPM, Xcode, Android Studio, and Capacitor](#npm-xcode-android-studio-and-capacitor)
    - [File Setup](#file-setup)
    - [Command Line Notes](#command-line-notes)
  - [Using Capacitor](#using-capacitor)
    - [Plugins](#plugins)
    - [Updating Plugins](#updating-plugins)
    - [App Icons and Splash Screen Icons](#app-icons-and-splash-screen-icons)
    - [App Name](#app-name)
    - [Testing](#testing)
    - [Building and Releasing](#building-and-releasing)
  - [Using Firebase](#using-firebase)
    - [Messaging](#messaging)
    - [Firestore](#firestore)
    - [Functions](#functions)

# Core Information

## High Level Overview

This app is built using the [Capacitor](https://capacitorjs.com/) platform. This platform is used to create native Android and iOS apps from a website template. It links to https://ianrom2.dreamhosters.com using the `server` command in _`capacitor.config.json`_. This enables all the native app integrations like haptics, notifications, and camera access. It also manages the app icons.

The content of the app is managed using the [WordPress](https://wordpress.org/) platform, which powers over 43% of the internet.

Capacitor injects a JavaScript Bridge into each webpage, accessible at `window.Capacitor`, enabling the website to access the native app functions.

The app uses Google's [Firebase](https://firebase.google.com/) for notifications _(Messaging)_ and the interactive game _(Firestore Database, Functions)_.

## Updating Content

Content is managed via the WordPress backend. This setup uses the [Elementor](https://elementor.com) website builder within WordPress to design the pages to look like apps. This also provides an intuitive drag-and-drop visual interface to design the webpages.

After each set of changes, press `Publish` in the top right corner. Once it saves, you should use the `Delete Cache` button in the top bar of the main admin page to ensure that all users will load the newest updates.

## Creating a New Event

## Sending Notifications

Notifications are handled through the [Firebase Console](https://console.firebase.google.com/). After logging in and selecting a project, click on `Messaging` on the left (under the `Run` subheading). Click `New Campaign` --> `Notifications`, then enter in the notification information. Under Target, select `Topic` and then select the event (`Message topic`) from the drop down. Click `Next`, and select when you want to send the message.

Press `Review` and then `Publish` to send/schedule the notification.

## Working with the Game

# Detailed Documentation

## Software Setup

All the software used here is available for free, and much of it is open source. XCode can only be run on MacOS and is required for creating iOS (Apple App Store) apps. Everything else can be used on both Windows and MacOS devices.

### Visual Studio Code (VS Code)

This is published by Microsoft and available [here](https://code.visualstudio.com/download). Once installed, click Extensions on the left side panel and search for WebNative and install it. This plugin offers a GUI to modify the Capacitor project easier without the use of a command line.
To open a folder in VS Code, use `File` --> `Open Folder` or drag the folder onto VS Code. You can save this workspace by using `File` --> `Save Workspace As`. This will make the workspace accessible via a file that you can easily open as well as save the settings in the workspace.

### NPM, Xcode, Android Studio, and Capacitor

Go [here](https://nodejs.org/en/download#:~:text=Or%20get%20a%20prebuilt%20Node%2Ejs) to install the Node Package Manager (NPM). It is easiest to install the prebuilt Node.js version by using the section at the bottom.

Follow [these instructions](https://capacitorjs.com/docs/getting-started/environment-setup) to install Xcode, Xcode Command Line Tools, Android Studio, and the Android SDK.

[This page](https://capacitorjs.com/docs/getting-started) shows how to setup Capacitor from scratch if you are building a new app. This shouldn't be needed if you are copying an app. To set up Capacitor in an app that you already copied into a new folder, follow the below [File Setup](#file-setup) instructions.

### File Setup

Once the above software is setup, clone the Github Repo with `git clone https://github.com/SAPIENTI0R/mtcEventAppDev FOLDER_PATH` in the command line.

Then run `npm i` in the command line to install all needed dependencies.

The project will need a `google-services.json` file that can be found in the Firebase Console. Go to `Settings` and then scroll down to download the file. Put this file into `/android/app`.

// APPLE SETUP INFORMATION

A signing key will be needed to publish apps to the Google Play Store. There is only one of these. It will also come with a Key Store Password. Both of these will be needed to generate app bundles to upload to the Google Play Store.

// MORE INFO HERE ABOUT WHERE THESE ARE

### Command Line Notes

Many steps here will require the use of a command line. This can be done on MacOS using the `Terminal` app and on Windows using the `Command Prompt` app. You can also use `Terminal` --> `New Terminal` in VS Code to enter the command line interface. This will open a command line interface inside the current folder. The table below gives the navigation commands used by the command line interface.

| Action                                      | Windows          | macOS            |
| :------------------------------------------ | :--------------- | :--------------- |
| **List files and folders**                  | `dir`            | `ls`             |
| **Enter a folder**                          | `cd folder_name` | `cd folder_name` |
| **Go up one level in the folder structure** | `cd ..`          | `cd ..`          |
| **Clear the terminal**                      | `cls`            | `clear`          |

## Using Capacitor

### Plugins

These are the Capacitor plugins that are used by the app. Most of them are official first-party plugins, but the Firebase ones are from [this](https://github.com/capawesome-team/capacitor-firebase/tree/main) Github repo.

The documentation for the first-party plugins is available [here](https://capacitorjs.com/docs/apis).

| Plugin                             | Use                                                       | Javascript Access (window.Capacitor.Plugins) |
| :--------------------------------- | :-------------------------------------------------------- | :------------------------------------------- |
| **@capacitor-firebase/functions**  | Calling the Firebase Functions that operate the game      | `.FirebaseFunctions`                         |
| **@capacitor-firebase/messaging**  | Push notifications and topic subscriptions                | `.FirebaseMessaging`                         |
| **@capacitor/app**                 | Detecting changes in app state                            | `.App`                                       |
| **@capacitor/barcode-scanner**     | Scanning barcodes for the game                            | `.CapacitorBarcodeScanner`                   |
| **@capacitor/browser**             | Opening links, particularly to files                      | `.Browser`                                   |
| **@capacitor/dialog**              | Sending dialog popup messages, mostly for debugging       | `.Dialog`                                    |
| **@capacitor/geolocation**         | Used for the map                                                    | `.Geolocation`                               |
| **@capacitor/haptics**             | Haptic feedback, used after a successful barcode scan     | `.Haptics`                                   |
| **@capacitor/toast**               | Sends toast messages. Used in the game and for debugging` | `.Toast`                                     |
| **@capacitor/local-notifications** | Unused                                                    | `.`                                          |
| **@capacitor/splash-screen**       | Provides the splash screen at startup                     | Not used in JavaScript                       |

### Updating Plugins

Plugins can be updated using the command line interface, but the easiest way is to use the WebNative VS Code Extension.

Click on the extension in the left panel (WN) and click on `Packages`. Available updates are shown in the format: `NAME #.#.# --> #.#.#`. To update all the packages at once, hover where it says `@capacitor` and click the lightbulb icon. Then click `Upgrade` in the window that pops up.

The same process can be used for the plugins (`@capacitor-firebase` and `@capacitor`) which are below.

_Alternatively, you can run `npm update` in the terminal to update all packages at once._

You will then need to press `Sync` (under `Projects`) to sync the updates to their respective platform folders.

_Alternatively, you can run `npx cap sync` in the terminal to sync the updates._

Then follow the [Building and Releasing](#building-and-releasing) directions below.

### App Icons and Splash Screen Icons

App icon and spash screen icons are generated with the WebNative plugin. The files for this are stored in [/resources](/resources). These should be `.png` files. These can be replaced with new icons when desired.

A description of the needed icon files is in the table below.

| Image              | File Name                     | Description                       | Size                         |
| :----------------- | :---------------------------- | :-------------------------------- | :--------------------------- |
| Splash Screen      | `splash.png`                  | Android and iOS                   | 2732x2732 px                 |
| Splash Screen Dark | `splash-dark.png`             | Android and iOS in Dark Mode      | 2732x2732 px                 |
| Icon               | `icon.png`                    | App icon for Android and iOS      | 1024x1024 px                 |
| Icon Foreground    | `android/icon-foreground.png` | App icon for Android Material You | at least 432x432 px (square) |
| Icon Background    | `android/icon-background.png` | App icon for Android Material You | at least 432x432 px (square) |

To generate these icons, click on the WebNative extension in the left panel (WN) and click `Configuration`. Then click `Rebuild` next to `Splash Screen and Icon`. Wait for this to finish, then sync the files with the `Sync` button or `npx cap sync`. Then, follow the [Building and Releasing](#building-and-releasing) directions below.

Android has a built-in icon manager that is described [here](https://developer.android.com/studio/write/create-app-icons) and is better for updating the android icon.

### App Name
To change the name of the app when installed on Android, like the display name on the homescreen, go to [android\app\src\main\res\values\strings.xml](android\app\src\main\res\values\strings.xml) and edit the `app_name` and `title_activity_main` lines. Then, follow the [Building and Releasing](#building-and-releasing) directions below.

// APPLE INSTRUCTIONS

If you want to change the name on the Google Play Store // INSTRUCTIONS

If you want to change the name on the Apple App Store // INSTRUCTIONS

### Testing

### Building and Releasing
 - Android
   - Bump version number in /android/app/build.gradle
   - Open in Android Studio
   - Top left hamburger menu
   - Build --> Generate Signed Bundle or APK
   - Instructions on how to add in password and key location
   - Build it, then find the locate button in the bottom right notification
   - Upload that to Google Play Dev
   - Other steps
 - iOS

## Using Firebase

Firebase is Google's mobile and app development platform. It is used for push notifications (Android and iOS), the game, and _______?

`cd firebase`

`firebase login --reauth`

`firebase emulators:start`

### Messaging

### Firestore

### Functions

`firebase deploy --only functions`
