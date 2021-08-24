"use strict";
let sidebarInitialisePromise;
let sidebarActivePromise;
function getSidebarHTML(page, sidebarIdPrefix, idPrefix) {
    let sidebarId = sidebarIdPrefix + page.sidebarId;
    let id = idPrefix + page.id;
    let subPages = page.subPages;
    if (subPages != null) {
        let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-" + sidebarId + "\" aria-expanded=\"false\">" + page.visibleName + "</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-" + sidebarId + "\"><ul class=\"list-unstyled ps-0\">";
        for (let i = 0, len = subPages.length; i < len; ++i)
            html += getSidebarHTML(subPages[i], sidebarId + "-", id + "-");
        html += "</ul></div></li>";
        return html;
    }
    else {
        return "<li class=\"rounded\"><button class=\"btn text-decoration-none rounded page-button\" href=\"" + id + "\" id=\"sidebar-" + sidebarId + "\">" + page.visibleName + "</button></li>";
    }
}
function sidebarInitialise() {
    sidebarInitialisePromise = new Promise((resolve, reject) => {
        infoPromise.then(() => {
            let pages = info.pages;
            if (pages != null) {
                let sidebarHTML = "";
                for (let i = 0, len = pages.length; i < len; ++i)
                    sidebarHTML += getSidebarHTML(pages[i], "", "");
                let sidebarLists = document.querySelectorAll("#sidebar-list");
                for (let i = 0, len = sidebarLists.length; i < len; ++i) {
                    let sidebarList = sidebarLists[i];
                    sidebarList.innerHTML = sidebarHTML;
                    let buttons = sidebarList.querySelectorAll("button.page-button");
                    for (let j = 0, jlen = buttons.length; j < jlen; ++j) {
                        let button = buttons[j];
                        button.addEventListener("click", () => {
                            let href = button.getAttribute("href");
                            if (href != null)
                                setOpenedPage(href);
                        });
                    }
                }
            }
            resolve();
        });
    });
    sidebarUpdateActive();
}
function sidebarUpdateActive() {
    sidebarActivePromise = new Promise((resolve, reject) => {
        sidebarInitialisePromise.then(() => {
            optionsPromise.then(() => {
                var _a, _b;
                let id = openedPage;
                let sidebarLinks = document.querySelectorAll(".sidebar-dropdown-collapse ul li button[href]");
                for (let i = 0, len = sidebarLinks.length; i < len; ++i) {
                    let sidebarLink = sidebarLinks[i];
                    if (sidebarLink.getAttribute("href") === id) {
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
                resolve();
            });
        });
    });
}
window.addEventListener('hashchange', function () {
    sidebarUpdateActive();
}, false);
document.addEventListener('DOMContentLoaded', function () {
    sidebarInitialise();
}, false);
//# sourceMappingURL=sidebar.js.map