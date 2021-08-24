"use strict";
let activePagePromise;
let activePageTitlePromise;
let activePageInitialiseExamplesPromise;
let activePageCodeExamplesPromise;
let openedPageDir = "";
let openedPageInfo = {};
function makeHTMLCompatible(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function convertCodeExampleToTable(codeExample) {
    let codeExampleLines = codeExample.split("\n");
    let html = "<table class=\"code-example-table\" cellpadding=\"0\"><tbody>";
    for (let i = 0, len = codeExampleLines.length; i < len; ++i)
        html += "<tr><td id=\"L" + i + "\" class=\"code-example-line-nr\">" + i + "</td><td id=\"LC" + i + "\" class=\"code-example-line\">" + makeHTMLCompatible(codeExampleLines[i]) + "</td></tr>";
    html += "</tbody></table>";
    return html;
}
function getCodeExample(codeExample) {
    return new Promise((resolve, reject) => {
        fetch(openedPageDir + "examples/" + codeExample).then(response => {
            if (response.ok)
                return response.text();
            else
                return Promise.reject();
        }).then(codeExample => {
            resolve(convertCodeExampleToTable(codeExample));
        }, error => {
            resolve("404 Could not load code example");
        });
    });
}
function updatePageTitle() {
    let pageTitleSpan = document.querySelector("span#page-title");
    activePagePromise.then(() => {
        optionsPromise.then(() => {
            if (pageTitleSpan == null)
                return;
            let pageName = getPageVisibleName(openedPage);
            if (pageName == null)
                pageName = "400 Bad request";
            pageTitleSpan.textContent = pageName;
        }, error => {
        });
    }, error => {
    });
}
function activePageInitialiseExamples() {
    activePageInitialiseExamplesPromise = new Promise((resolve, reject) => {
        activePagePromise.then(() => {
            let codeExamples = document.querySelectorAll("div.code-example");
            for (let i = 0, len = codeExamples.length; i < len; ++i) {
                let codeExample = codeExamples[i];
                let html = "<ul class=\"nav nav-tabs\">";
                for (let j = 0, jlen = info.availableExtensions.length; j < jlen; ++j) {
                    let extension = info.availableExtensions[j];
                    html += "<li class=\"nav-item\"><button class=\"btn nav-link";
                    if (j == jlen - 1)
                        html += " border-radius-bottom-left-0";
                    else
                        html += " border-radius-bottom-right-0 border-radius-bottom-left-0";
                    html += "\" data-code-extension=\"" + extension.id + "\">" + extension.visibleName + "</button></li>";
                }
                html += "</ul><div class=\"code-example-code\" id=\"" + codeExample.id + "-code\">Loading</div>";
                codeExample.innerHTML = html;
                let buttons = codeExample.querySelectorAll("ul li button");
                for (let j = 0, jlen = buttons.length; j < jlen; ++j) {
                    let button = buttons[j];
                    button.addEventListener("click", () => {
                        let newExtension = button.getAttribute("data-code-extension");
                        if (newExtension == null)
                            return;
                        setOptionValue("extension", newExtension);
                    }, false);
                }
            }
            resolve();
        }, error => {
            resolve();
        });
    });
}
function updatePageCodeExamples_() {
    let codeExamples = document.querySelectorAll("div.code-example");
    for (let i = 0, len = codeExamples.length; i < len; ++i) {
        let codeExample = codeExamples[i];
        let extensions = codeExample.querySelectorAll("ul.nav li.nav-item button.nav-link");
        for (let j = 0, jlen = extensions.length; j < jlen; ++j) {
            let extension = extensions[j];
            if (extension.getAttribute("data-code-extension") === selectedExtension) {
                extension.classList.add("active");
                extension.setAttribute("aria-current", "page");
            }
            else {
                extension.classList.remove("active");
                extension.removeAttribute("aria-current");
            }
        }
        let codeDiv = codeExample.querySelector("#" + codeExample.id + "-code");
        if (codeDiv != null) {
            getCodeExample(codeExample.id + "." + selectedExtension).then(code => {
                codeDiv.innerHTML = code;
            });
        }
    }
}
function updatePageCodeExamples() {
    activePageCodeExamplesPromise = new Promise((resolve, reject) => {
        activePageInitialiseExamplesPromise.then(() => {
            updatePageCodeExamples_();
            resolve();
        }, error => {
            updatePageCodeExamples_();
            resolve();
        });
    });
}
function updateActivePage() {
    activePagePromise = new Promise((resolve, reject) => {
        selectedExtensionPromise.then(() => {
            updatePageTitle();
            activePageInitialiseExamples();
            updatePageCodeExamples();
            if (previousOpenedPage === openedPage) {
                reject();
                return;
            }
            let title = document.querySelector("html head title");
            if (title != null) {
                let pageName = getPageVisibleName(openedPage);
                if (pageName == null)
                    pageName = "400 Bad request";
                title.textContent = "Vulkan Tutorial - " + pageName;
            }
            let pageContent = document.querySelector("div#page-content");
            if (pageContent == null) {
                resolve();
                return;
            }
            openedPageDir = (openedPage === null || openedPage === void 0 ? void 0 : openedPage.replace(/-/g, "/")) + "/";
            if (openedPageDir === "/")
                openedPageDir = "home/";
            let pageInfoPath = openedPageDir + "info.json";
            new Promise((resolve, reject) => {
                fetch(pageInfoPath).then(response => {
                    if (response.ok)
                        return response.json();
                    else
                        return Promise.reject();
                }).then(json => {
                    openedPageInfo = json;
                    resolve();
                }, error => {
                    // Load 404 error page.
                    openedPageDir = "error/404/";
                    pageInfoPath = openedPageDir + "info.json";
                    fetch(pageInfoPath).then(response => {
                        if (response.ok)
                            return response.json();
                        else
                            return Promise.reject();
                    }).then(json => {
                        openedPageInfo = json;
                        resolve();
                    }, error => {
                        openedPageInfo = {};
                        resolve();
                    });
                });
            }).then(() => {
                if (openedPageInfo.page != null) {
                    fetch(openedPageDir + openedPageInfo.page).then(response => {
                        if (response.ok)
                            return response.text();
                        else
                            return Promise.reject();
                    }).then(text => {
                        pageContent.innerHTML = text;
                        resolve();
                    }, error => {
                        if (openedPageDir !== "error/404/") {
                            // Load 404 error page.
                            openedPageDir = "error/404/";
                            pageInfoPath = openedPageDir + "info.json";
                            fetch(pageInfoPath).then(response => {
                                if (response.ok)
                                    return response.json();
                                else
                                    return Promise.reject();
                            }).then(json => {
                                if (openedPageInfo.page != null) {
                                    fetch(openedPageDir + openedPageInfo.page).then(response => {
                                        if (response.ok)
                                            return response.text();
                                        else
                                            return Promise.reject();
                                    }).then(text => {
                                        pageContent.innerHTML = text;
                                        resolve();
                                    }, error => {
                                        // If all else fails just write "404 Page not found!"
                                        pageContent.textContent = "404 Page not found!";
                                        resolve();
                                    });
                                }
                            }, error => {
                                // If all else fails just write "404 Page not found!"
                                pageContent.textContent = "404 Page not found!";
                                resolve();
                            });
                        }
                        else {
                            // If all else fails just write "404 Page not found!"
                            pageContent.textContent = "404 Page not found!";
                            resolve();
                        }
                    });
                }
            });
        });
    });
}
window.addEventListener('hashchange', () => {
    updateActivePage();
}, false);
document.addEventListener('DOMContentLoaded', () => {
    updateActivePage();
}, false);
//# sourceMappingURL=page.js.map