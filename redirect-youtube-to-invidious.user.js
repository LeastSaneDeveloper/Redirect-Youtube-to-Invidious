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
// @match *://www.youtube.com/*
// @match *://youtube.com/*
// @match *://youtu.be/*
// @match *://leastsanedeveloper.github.io/redirect-youtube-to-invidious/remove-default-instance/*
// @match *://leastsanedeveloper.github.io/redirect-youtube-to-invidious/set-default-instance/*
// @match *://redirect.invidious.io/*
// @run-at document-start
// @grant GM.getValue
// @grant GM.setValue
// ==/UserScript==

(async () => {
    // NOTE: I switched to Zed Editor so the code formatting is a bit weird now

    "use strict";
    let defaultInstance = await GM.getValue("defaultInstance", null);
    let hostName = window.location.hostname;
    let everythingAfterHostname =
        window.location.pathname +
        window.location.search +
        window.location.hash;
    let cleanURL = hostName + window.location.pathname;
    const queryParams = new URLSearchParams(window.location.search);
    if (cleanURL.endsWith("/")) cleanURL = cleanURL.slice(0, -1);
    if (
        cleanURL ===
        "leastsanedeveloper.github.io/redirect-youtube-to-invidious/remove-default-instance"
    ) {
        if (!defaultInstance) {
            window.location.replace(
                "https://leastsanedeveloper.github.io/experiments/status?message=" +
                    encodeURIComponent(
                        "There is no default instance to remove!",
                    ),
            );
        } else {
            await GM.setValue("defaultInstance", null);
            window.location.replace(
                "https://leastsanedeveloper.github.io/experiments/status?message=" +
                    encodeURIComponent(
                        "Removed default instance successfully.",
                    ),
            );
        }
    } else if (
        cleanURL ===
        "leastsanedeveloper.github.io/redirect-youtube-to-invidious/set-default-instance"
    ) {
        const newInstance = queryParams.get("to");
        if (!newInstance) {
            window.location.replace(
                "https://leastsanedeveloper.github.io/experiments/status?message=" +
                    encodeURIComponent("Missing 'to' parameter."),
            );
            return;
        }
        await GM.setValue("defaultInstance", newInstance);
        window.location.replace(
            "https://leastsanedeveloper.github.io/experiments/status?message=" +
                encodeURIComponent("Default instance set successfully."),
        );
    } else if (hostName === "redirect.invidious.io") {
        const tBody = document.getElementById("instances-tbody");

        const processRow = (node) => {
            if (node.nodeType === 1 && node.nodeName.toLowerCase() === "tr") {
                let a = node.querySelector("a");
                if (!a) return;
                let newHref = new URL(a.href);
                newHref.searchParams.set("quality", "dash");
                newHref.searchParams.set("quality_dash", "1080");
                a.href = newHref.toString();
            }
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(processRow);
            });
        });

        tBody.querySelectorAll("tr").forEach(processRow);
        observer.observe(tBody, { childList: true, subtree: false });
    } else {
        if (!defaultInstance) {
            window.location.replace(
                "https://redirect.invidious.io" + everythingAfterHostname,
            );
        } else {
            window.location.replace(defaultInstance + everythingAfterHostname);
        }
    }
})();
