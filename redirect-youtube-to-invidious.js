// ==UserScript==
// @name Redirect Youtube to Invidious
// @namespace https://github.com/LeastSaneDeveloper
// @author LeastSaneDeveloper
// @version 1.0
// @description  Redirects Youtube URLs to a launchpad for selecting an Invidious instance.
// @homepage    https://github.com/LeastSaneDeveloper/Redirect-Youtube-to-Invidious
// @homepageURL https://github.com/LeastSaneDeveloper/Redirect-Youtube-to-Invidious
// @downloadURL https://raw.githubusercontent.com/LeastSaneDeveloper/Redirect-Youtube-to-Invidious/main/redirect-youtube-to-invidious.js
// @updateURL   https://raw.githubusercontent.com/LeastSaneDeveloper/Redirect-Youtube-to-Invidious/main/redirect-youtube-to-invidious.js
// @supportURL  https://github.com/LeastSaneDeveloper/Redirect-Youtube-to-Invidious/issues
// @match *://*.youtube.com/*
// @match *://youtube.com/*
// @match *://youtu.be/*
// @match *://leastsanedeveloper.github.io/redirect-youtube-to-invidious/remove-default-instance/*
// @run-at document-start
// @grant GM.getValue
// @grant GM.setValue
// ==/UserScript==
// if x (location.origin + location.pathname) ended in a /, will it still end in a /? and if x (location.origin + location.pathname) didnt end in a / will it end in a / or not?
(async () => {
    'use strict';
    let defaultInstance = await GM.getValue("defaultInstance", null);
    let queryParams = window.location.search;
    let encodedQueryParams = encodeURIComponent(queryParams);
    let urlExceptForProtocol = window.location.origin + window.location.pathname;
    if (urlExceptForProtocol.endsWith("/")) urlExceptForProtocol.slice(0, -1);
    if (urlExceptForProtocol === "leastsanedeveloper.github.io/redirect-youtube-to-invidious/remove-default-instance") {
        if (!defaultInstance) {
            window.location.replace("https://leastsanedeveloper.github.io/redirect-youtube-to-invidious/there-is-no-default-instance");
        } else {
            await GM.setValue("defaultInstance", null);
            window.location.replace("https://leastsanedeveloper.github.io/redirect-youtube-to-invidious/removed-default-instance");
        }
    } else {
        if (!defaultInstance) {
            window.location.replace("https://leastsanedeveloper.github.io/redirect-youtube-to-invidious?queryParams=" + encodedQueryParams);
        } else {
            window.location.replace(defaultInstance + queryParams);
        }
    }
})();
