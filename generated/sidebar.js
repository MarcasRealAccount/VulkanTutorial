"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getSidebarHTMLFromTutorial(tutorial, sidebarIdPrefix, idPrefix) {
    let sidebarId = sidebarIdPrefix + tutorial.sidebarId;
    let id = idPrefix + tutorial.id;
    let tuts = tutorial.tutorials;
    if (tuts != null) {
        let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-tutorials-" + sidebarId + "\" aria-expanded=\"false\">" + tutorial.visibleName + "</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-tutorials-" + sidebarId + "\"><ul class=\"list-unstyled ps-0\">";
        for (let i = 0, len = tuts.length; i < len; ++i)
            html += getSidebarHTMLFromTutorial(tuts[i], sidebarId + "-", id + "-");
        html += "</ul></div></li>";
        return html;
    }
    else {
        return "<li class=\"rounded\"><a class=\"text-decoration-none rounded\" href=\"#tutorials-" + id + "\" id=\"sidebar-tutorials-" + sidebarId + "\">" + tutorial.visibleName + "</a></li>";
    }
}
function getSidebarHTMLFromSample(sample, sidebarIdPrefix, idPrefix) {
    let sidebarId = sidebarIdPrefix + sample.sidebarId;
    let id = idPrefix + sample.id;
    let smps = sample.samples;
    if (smps != null) {
        let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-samples-" + sidebarId + "\" aria-expanded=\"false\">" + sample.visibleName + "</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-samples-" + sidebarId + "\"><ul class=\"list-unstyled ps-0\">";
        for (let i = 0, len = smps.length; i < len; ++i)
            html += getSidebarHTMLFromSample(smps[i], sidebarId + "-", id + "-");
        html += "</ul></div></li>";
        return html;
    }
    else {
        return "<li class=\"rounded\"><a class=\"text-decoration-none rounded\" href=\"#samples-" + id + "\" id=\"sidebar-samples-" + sidebarId + "\">" + sample.visibleName + "</a></li>";
    }
}
function sidebarInitialise() {
    return __awaiter(this, void 0, void 0, function* () {
        let sidebarLists = document.querySelectorAll("#sidebar-list");
        for (let i = 0, len = sidebarLists.length; i < len; ++i) {
            let sidebarList = sidebarLists[i];
            let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-tutorials\" aria-expanded=\"false\">Tutorials</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-tutorials\"><ul class=\"list-unstyled ps-0\">";
            yield infoResponse;
            yield tutorialsResponse;
            let tuts = tutorials.tutorials;
            for (let i = 0, len = tuts.length; i < len; ++i)
                html += getSidebarHTMLFromTutorial(tuts[i], "", "");
            html += "</ul></div></li><li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-samples\" aria-expanded=\"false\">Samples</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-samples\"><ul class=\"list-unstyled ps-0\">";
            yield samplesResponse;
            let smps = samples.samples;
            for (let i = 0, len = smps.length; i < len; ++i)
                html += getSidebarHTMLFromSample(smps[i], "", "");
            html += "</ul></div></li>";
            sidebarList.innerHTML = html;
        }
        sidebarSetActive(window.location.hash.substr(1));
    });
}
function sidebarSetActive(id) {
    var _a, _b;
    let sidebarLinks = document.querySelectorAll(".sidebar-dropdown-collapse ul li a[href]");
    let href = "#" + id;
    for (let i = 0, len = sidebarLinks.length; i < len; ++i) {
        let sidebarLink = sidebarLinks[i];
        if (sidebarLink.getAttribute("href") === href) {
            let current = sidebarLink;
            let parent;
            while ((parent = current.closest("div.sidebar-dropdown-collapse")) != null) {
                let parentLI = parent.parentElement;
                if (parentLI == null)
                    continue;
                let btn = parentLI.querySelector("button");
                if (btn == null)
                    continue;
                btn.classList.remove("collapsed");
                btn.setAttribute("aria-expanded", "true");
                parent.classList.add("show");
                current = parentLI;
            }
            (_a = sidebarLink.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("opened");
        }
        else {
            (_b = sidebarLink.parentElement) === null || _b === void 0 ? void 0 : _b.classList.remove("opened");
        }
    }
}
window.addEventListener('hashchange', function () {
    sidebarSetActive(window.location.hash.substr(1));
}, false);
document.addEventListener('DOMContentLoaded', function () {
    sidebarInitialise();
}, false);
//# sourceMappingURL=sidebar.js.map