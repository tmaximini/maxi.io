---
order: 2
path: '/getting-started-with-crosswalk-for-ionic-framework'
title: 'Getting started with crosswalk for Ionic Framework'
subtitle: 'How to use the drop in replacement for the Android webview'
published: true
date: '20150123'
year: 2015
tags:
  - Angular
type: 'post'
---

## What is Crosswalk?

Crosswalk (a.k.a xwalk) is an drop-in replacement for hybrid mobile apps on Android. It replaces the default Android Webview with a specified version of a current Chrome browser and helps making your Webapps more performant and predictable. Crosswalk was created by Intel, is completly [Open-Source](https://github.com/crosswalk-project/crosswalk) and is widely used and maintained by Google for their [Mobile Chrome Apps](https://github.com/MobileChromeApps/mobile-chrome-apps).
In the last months it was also picked up as the go-to alternative for Ionic developers that suffered from missing features or lacking performance on Android devices.

This did not go unnoticed by the Ionic core developers, so that they now [included the option to add Crosswalk to your project directly into their CLI](http://ionicframework.com/blog/crosswalk-comes-to-ionic). Great stuff!

In this post I show you how to get up and running with Crosswalk in your Ionic project.

## Requirements

To use Crosswalk for your Android build, you must have the the [Android SDK](http://developer.android.com/sdk/index.html) installed and set up your machine. You can only target devices with Android version > 4.0.

There are [different versions of Crosswalk](https://crosswalk-project.org/documentation/downloads.html), with version 10 being the current stable shipping with Chromium 39. This is also the version that I will use in this tutorial.

To be able to use Crosswalk 10, I found I needed to be on cordova v3.6 (`npm install -g cordova@~3.6`), while for Crosswalk 9 I still needed to use cordova 3.5. Luckily, there is #crosswalk on Freenode IRC with a bunch of friendly and helpful people if you run into trouble.

## Method 1: The 'old' way

I will briefly explain how you'd go about adding Crosswalk to your project without using the Ionic CLI to show what parts of your cordova application actually are replaced when using it. Note that this technique should work in all Cordova projects, not only in Ionic.

First you go the [xwalk downloads page](https://crosswalk-project.org/documentation/downloads.html) and grab the Cordova Android Version. I have a Nexus5 phone so I download the one for the ARM platform. The unzipped folder should look like this:

![Crosswalk unzipped](xwalk_unzipped.png 'Crosswalk Cordova unzipped')

If you don't have android added yet to your project, do it now (`ionic platform add android`). Now you just replace the contents of `<your_project>/platforms/android/CordovaLib/` with the contents of the `framework` folder that we just unzipped and you copy the VERSION file to `<your_project>/platforms/android/`.

```bash
cp -r ~/Downloads/crosswalk-cordova-10.39.235.9-arm/framework/\* platforms/android/CordovaLib
```

Next you cd into `<your_project>/platforms/android/CordovaLib/` and run the following two commands:

```bash
android update project --subprojects --path . --target "android-19"
```

```bash
ant debug
```

If you are like me and you don't have ant installed the first time around, just install it. If you're on a Mac, homebrew works great for that.

That's already all there is to it, now you can confirm that it is working by running `ionic run android` and visiting [chrome://inspect/#devices](chrome://inspect/#devices) in your (chrome) browser:

![Crosswalk confirmed](xwalk_confirmed.png)

That's crosswalk 10 with Chrome 39 at work right there. Yay!

## Method 2: The ionic way

As I mentioned, the Ionic team added Crosswalk to their CLI recently, so installing it into our apps should be even easier now! Just make sure you updated your ionic CLI to at least version 1.3.2 (`npm update -g ionic`). I'll just go ahead and remove the whole android platform from our test project and add it again, so we can start fresh.
{% highlight bash %}
ionic platform remove android
ionic platform add android
{% endhighlight %}

Then let's see what browsers are available:

![Ionic browser list](ionic_browser_list.png)

Version 10.x looks fine, so we run `ionic browser add crosswalk@10.39.235.15` and let ionic do its magic. This will download all required files into our project. If you now build again a version on your phone (`ionic run android`) you will notice slightly different output, because ionic uses [Gradle](https://www.gradle.org/) to build the Crosswalk version.

It worked instantly in my test project, which is very cool! Big kudos to the Ionic team for adding this and making it so comfortable to get Crosswalk into our projects.

## Caveats

#### App crashes on start right after build

This is usually a permission problem. Make sure you have all the needed permissions set in `platforms/android/AndroidManifest.xml`.

```xml
<!-- you'll most likely always need these -->

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- these you might need depending on what you are doing -->

<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.VIBRATE" />
```

#### SSL Certificate Error Popup

If your app makes requests against an HTTPS endpoint, you might get an error popup saying 'SSL certificate error' when using Crosswalk.

![SSL certificate error](ssl_error.png)

This happened in our last app, although our certificate was perfectly fine. In Crosswalk 10 they added an `onReceivedSslError` event handler that you can hack in order to suppress this popup. After debugging this a long time, I finally managed to work around this error. I can however only explain it for the first method, as the Ionic CLI Xwalk files are bit different from the downloaded ones described above (That's why I stick with method 1 for now).

Open the file `CordovaWebViewClient.java` `/android/CordovaLib/src/org/apache/cordova/` and find the `onReceivedSslError` method. Then change this method to the following (If you are on crosswalk 10.x and this method is not in the file, just add the entire method):

```java
public void onReceivedSslError(XWalkView view, ValueCallback<Boolean> callback, SslError error) {
final String packageName = this.cordova.getActivity().getPackageName();
final PackageManager pm = this.cordova.getActivity().getPackageManager();

        ApplicationInfo appInfo;
        try {
            appInfo = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA);
            if ((appInfo.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0) {
                // debug = true
                callback.onReceiveValue(true);
                return;
            } else {
                // debug = false
                callback.onReceiveValue(true);
            }
        } catch (NameNotFoundException e) {
            // When it doubt, lock it out!
            callback.onReceiveValue(true);
        }
    }
```

Disclaimer: This might impact the security of your application. Only do this if you can 100% trust your HTTPS API and you just want to get rid of this annoying Popup Error. Basically what I am doing here is just sending `callback.onReceiveValue(true)` in all cases, which has the same effect as if the user would have clicked Ok in this popup, but without displaying it.

## Conclusion

If you are building cordova apps and you are targeting the Android platform, you should definitely consider using Crosswalk, especially when you are using the Ionic Framework as they made it incredibly simple to add Crosswalk to your project. Your apps can gain around 10x Javascript performance and will be much more predictable between different Android versions.

With the current stable version being already at Chrome 39, we are also only [one step away from having service workers for powerful offline capabilites](http://blog.chromium.org/2014/12/chrome-40-beta-powerful-offline-and.html) at our hand, which is something web and hybrid applications traditionally lacked.

The only drawback so far is that it will increase your app's size around 10-15 MB, as you are shipping the whole Chromium browser packaged inside your app. But that is a fair trade-off, considering the amount of headache it will save you on the way.

Anyway, enjoy Crosswalk!

![Crosswalk](crosswalk.jpg)
