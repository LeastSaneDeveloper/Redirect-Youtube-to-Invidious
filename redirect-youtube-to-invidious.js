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
// @match *://www.youtube.com/watch*
// @match *://youtube.com/watch*
// @match *://youtu.be/*
// @match *://leastsanedeveloper.github.io/redirect-youtube-to-invidious/remove-default-instance/*
// @match *://leastsanedeveloper.github.io/redirect-youtube-to-invidious/set-default-instance/*
// @run-at document-start
// @grant GM.getValue
// @grant GM.setValue
// ==/UserScript==

(async () => {
    'use strict';
    let defaultInstance = await GM.getValue("defaultInstance", null);
    let rawQueryParams = window.location.search;
    let encodedQueryParams = encodeURIComponent(rawQueryParams);
    let queryParams = new URLSearchParams(rawQuerarams);
    let cleanURL = window.location.origin + window.location.pathname;
    if (cleanURL.endsWith("/")) cleanURL.slice(0, -1);
    if (cleanURL === "leastsanedeveloper.github.io/redirect-youtube-to-invidious/remove-default-instance") {
        if (!defaultInstance) {
            window.location.replace("https://leastsanedeveloper.github.io/redirect-youtube-to-invidious/there-is-no-default-instance");
        } else {
            await GM.setValue("defaultInstance", null);
            window.location.replace("https://leastsanedeveloper.github.io/redirect-youtube-to-invidious/removed-default-instance");
        }
    } else if (cleanURL === "leastsanedeveloper.github.io/redirect-youtube-to-invidious/set-default-instance") {
        await GM.setValue("defaultInstance", queryPaeams.get("to"));
        window.location.replace("https://leastsanedeveloper.github.io/redirect-youtube-to-invidious/default-instance-set");
    } else {
        if (!defaultInstance) {
            window.location.replace(`https://leastsanedeveloper.github.io/redirect-youtube-to-invidious?queryParams={encodedQueryParams}`);
        } else {
            window.location.replace(defaultInstance + rawQueryParams);
        }
    }
})();
