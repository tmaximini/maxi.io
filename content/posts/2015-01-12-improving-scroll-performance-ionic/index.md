---
order: 3
path: '/improving-scroll-performance-for-lists-ionic-framework'
title: 'Improving scroll performance for lists in Ionic Framework'
subtitle: 'Prevent your users from a laggy scrolling experience'
published: true
date: '20150112'
type: 'post'
tags:
  - angular
year: 2015
---

## Hybrid mobile applications

I recently spend a good amount of time developing an application using the [Ionic Framework](http://ionicframework.com/). In this post I am going to share my experiences and the things I learned on the way.

In case you don't know, Ionic is a framework that sits on top of [Angular.js](https://angularjs.org/) that is designed to let you write mobile hybrid apps. Mobile hybrid applications are applications entirely written in HTML5, CSS and Javascript and then get packaged into an installable, hopefully native looking application that can be distributed via the different App Stores.
Despite only being 1 year old, there have been already 320.000 apps been created with Ionic ([Source](http://ionicframework.com/blog/ionic-one-year-review/)).
The difference is that hybrid applications live entirely inside a _WebView_ of the device's operating system.
This means that these applications will be affected by the different browser versions, OS versions and by the performance of the devices they are installed on. Both [iOS](http://nshipster.com/wkwebkit/) and [Android](https://developer.chrome.com/multidevice/webview/overview) are catching up though with the features and the performance of their WebViews, which is a good thing.

While Ionic is still a relatively young framework (currently in 1.0.0-beta14 at the time of this writing), hybrid mobile apps have been around for a long time by now. The problem with these apps is that they often feel clunky and slow compared to well-known native apps.
The main reason for that is not always bad browsers or old hardware but too often it is unperformant and badly optmized code. There are a lot of things to consider when writing performant web applications, especially for lower end devices. We'll get to that in a minute.

## Ionic, just UI?

When you talk to people about Ionic, they will probably tell you something in the veins of "iOS7.css" or "that's just an UI Layer around Angular". Which is kind of true as a huge part of Ionic is about giving you a beautiful, iOS7'ish look. Basically it is an opinionated collection of Angular directives and css classes that cover a lot of use cases when building an app. [Swipeable boxes](http://ionicframework.com/docs/api/directive/ionSlideBox/), [pull-to-refresh lists](http://ionicframework.com/docs/api/directive/ionRefresher/), [tab navigations](http://ionicframework.com/docs/api/directive/ionTabs/) [etc](http://ionicframework.com/docs/api/directive/ionSideMenus/). You name it.
What I especially like about Ionic so far is its [excellent documentation](http://ionicframework.com/docs/), the amount of [learning resources](http://learn.ionicframework.com/), the cli tooling and the active community (#ionic at Freenode).

## Scroll performance

One of the big letdowns with Ionic has been the scroll performance. Everything worked great developing on my desktop browser emulating mobile devices, but as soon as we compiled the app on the phone it _lagged_. The lag was real.
The problem with Ionic lists is, that by default Ionic uses a Javascript based scrolling mechanism, which calculates the scroll position in a view and animates it whenever the view is scrolled. While this looks really good and solves a lot of compatibility issues between different devices and browsers it certainly is a huge performance issue with longer list. For us, lists with around 25-50 items and some images already rendered close to unusable on iPhone4 and 4s. Imagine you'd want to make some timeline app such as Twitter.
As stated by the core team members, [Ionic is targeted towards newer devices](https://github.com/driftyco/ionic/issues/287#issuecomment-30441099), which makes totally sense from a deveoping point of view. The problem is you can not convince your customer's that the app can only run on newer devices, it should run performant on older devices as well.

As far as I can tell there are two main solutions for the scrolling performance problem:

1. Using [collection-repeat](http://ionicframework.com/docs/api/directive/collectionRepeat/) instead ng-repeat
2. Using native scroll

We will take a look at both of these now.

### collection-repeat

Quoting the docs here:

> collection-repeat is a directive that allows you to render lists with thousands of items in them, and experience little to no performance penalty.

This sounds pretty awesome. And it is really awesome too: The idea behind collection-repeat is that it renders only the items that are currently visible inside the viewport, so if you have 2000 items but only 10 items fit into your screen than 10 items will be rendered instead of 2000 (The problem with the performance of huge lists is usually the _painting_ in the browser). The problem with collection-repeat however is that the items need to be of the same height (more or less at least, as collection-item-height takes an expression and thus also could be a function). So basically _it makes a responsive layout impossible_, assuming you want to use 100% width and height: auto; or something like this.

```html
<div class="contact-list">
  <div
    ng-repeat="person in contacts | filter:{name: searchModel.name}"
    class="item item-icon-right"
    ng-class="{'selected': option.active}"
    ng-click="showDetails(person)"
  >
    <span ng-bind="::person.name"></span>
  </div>
</div>
```

It is very useful though for items of the same fixed height, such as simple lists.

### Native scrolling

Native scrolling means we tell Ionic not to use its [\$ionicScrollDelegate](http://ionicframework.com/docs/api/service/$ionicScrollDelegate/) service for scrolling, but instead fall back to the browser's own scrolling behaviour. As scrolling is one of the most basic features of any browser, this usually means we get a great performance across all devices.
There are a few drawbacks from this solution though:

- Scroll behaviour might differentiate quite a bit between different browsers and operating systems. This bit us a few times, especially with iOS being weird with firing scroll events. See [this blog post by TJ VanToll](http://developer.telerik.com/featured/scroll-event-change-ios-8-big-deal/) for more information on iOS scroll behaviour.
- By default, no scrollbar is visible (Can be overwritten by CSS).
- Infinite Scroll and Pull to refresh won't work, we had to write our own solution for both.

To activate native scrolling in Ionic, you just the the `"overflow-scroll = true"` option on [IonContent](http://ionicframework.com/docs/api/directive/ionContent/). It is super performant and was the only valid solution in our case, as we wanted to support also older devices.

Infinite scroll could for example easily be implemented like this, with `wrapperEl` being your overflow-scroll IonContent element and `listEl` being the inner stream container, that would contain your ng-repeated list that you want to load new items into.

```javascript
/**
 * captures all scroll events and checks offset from top and distance from bottom
 * if we are as close as OFFSET to bottom, we start loading the next page
 */
var OFFSET = 200; // how many px from bottom should we start loading
wrapperEl.addEventListener(
  'scroll',
  function() {
    var listRect = listEL.getBoundingClientRect();
    var wrapRect = wrapperEl.getBoundingClientRect();
    if (listRect.bottom - OFFSET < wrapRect.height) {
      scope.nextPage();
    }
  },
  false,
);
```

Although iOS momentum scrolling does not send continous scroll events after your touch move ended, it will send one more scroll event when the momentum scroll finishes, which is enough for this solution to check again and trigger the infinite scroll.

### Conclusion

Ionic does a great job at delivering excellent CSS and great directives that enable developers to build good looking with ease. For larger lists or more complex views we might hit performance bottlenecks quickly. In this case native scrolling is the best option for performance gains. These gains however come at the costs of browser and OS inconsistencies and not being able to use certain built-in features of Ionic and having to re-implement those yourself more or less from scratch.

## UPDATE 03/2015

The Ionic Team itself are acknowledging the downsides of Javascript-based scrolling and are working on rewriting their scrolling system based on native scrolling. You should follow [this thread](http://forum.ionicframework.com/t/native-scrolling-android-testers-wanted/17059) for more information. Also, native scrolling can now be set globally like this:

```javascript
angular
  .module('ionicApp', ['ionic'])
  .config(function($ionicConfigProvider) {
    if (!ionic.Platform.isIOS()) {
      $ionicConfigProvider.scrolling.jsScrolling(false);
    }
  });
```

instead of setting `overflow-scroll="true"` on each `ion-content` element.
