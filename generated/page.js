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
let activePageResponse;
let activePageDir = "";
let activePageInfo = {};
function getCodeExample(codeExample) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            resolve("Hey");
        });
    });
}
function updatePageCodeExamples() {
    return __awaiter(this, void 0, void 0, function* () {
        yield activePageResponse;
        let codeExamples = document.querySelectorAll("div.code-example");
        for (let i = 0, len = codeExamples.length; i < len; ++i) {
            let codeExample = codeExamples[i];
            let html = "<ul class=\"nav nav-tabs\">";
            for (let j = 0, jlen = info.availableExtensions.length; j < jlen; ++j) {
                let extension = info.availableExtensions[j];
                html += "<li class=\"nav-item\"><button class=\"btn nav-link";
                if (extension.id === selectedExtension)
                    html += " active";
                html += "\"";
                if (extension.id === selectedExtension)
                    html += " aria-current=\"page\"";
                html += " data-code-extension=\"" + extension.id + "\">" + extension.visibleName + "</button></li>";
            }
            html += "</ul><div class=\"code-example-code\" id=\"" + codeExample.id + "-code\">Loading</div>";
            codeExample.innerHTML = html;
            let buttons = codeExample.querySelectorAll("ul li button");
            for (let j = 0, jlen = buttons.length; j < jlen; ++j) {
                let button = buttons[j];
                button.addEventListener("click", () => {
                    let searchParams = new URLSearchParams(window.location.search);
                    let newExtension = button.getAttribute("data-code-extension");
                    if (newExtension == null)
                        return;
                    if (searchParams.get("extension") !== newExtension) {
                        searchParams.set("extension", newExtension);
                        window.location.search = searchParams.toString();
                    }
                }, false);
            }
            let codeDiv = codeExample.querySelector("#" + codeExample.id + "-code");
            if (codeDiv != null) {
                getCodeExample(codeExample.id.replace(/-/g, "/") + "/").then(code => {
                    codeDiv.innerHTML = code;
                });
            }
        }
    });
}
function updateActivePage() {
    return __awaiter(this, void 0, void 0, function* () {
        yield selectedExtensionResponse;
        activePageResponse = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            activePageDir = window.location.hash.substr(1).replace(/-/g, "/") + "/";
            if (activePageDir === "/")
                activePageDir = "home/";
            let pageInfoPath = activePageDir + "info.json";
            let pageInfoResponse = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                fetch(pageInfoPath).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    else {
                        return Promise.reject();
                    }
                }).then(json => {
                    activePageInfo = json;
                    resolve();
                }, (error) => __awaiter(this, void 0, void 0, function* () {
                    // Load 404 error page.
                    activePageDir = "error/404/";
                    pageInfoPath = activePageDir + "info.json";
                    fetch(pageInfoPath).then(response => {
                        if (response.ok)
                            return response.json();
                        else
                            return Promise.reject();
                    }).then(json => {
                        activePageInfo = json;
                        resolve();
                    }, error => {
                        activePageInfo = {};
                        resolve();
                    });
                }));
            }));
            yield pageInfoResponse;
            if (activePageInfo.page != null) {
                let pageResponse = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    fetch(activePageDir + "/" + activePageInfo.page).then(response => {
                        if (response.ok)
                            return response.text();
                        else
                            return Promise.reject();
                    }).then(text => {
                        let pageContent = document.querySelector("div#page-content");
                        if (pageContent == null)
                            return;
                        pageContent.innerHTML = text;
                        resolve();
                    }, (error) => __awaiter(this, void 0, void 0, function* () {
                        // Load 404 error page.
                        activePageDir = "error/404/";
                        pageInfoPath = activePageDir + "info.json";
                        let pageInfoResponse = new Promise((resolve, reject) => {
                            fetch(pageInfoPath).then(response => {
                                if (response.ok)
                                    return response.json();
                                else
                                    return Promise.reject();
                            }).then(json => {
                                activePageInfo = json;
                                resolve();
                            }, error => {
                                activePageInfo = {};
                                resolve();
                            });
                        });
                        yield pageInfoResponse;
                        if (activePageInfo.page != null) {
                            let pageResponse = fetch(activePageDir + "/" + activePageInfo.page).then(response => {
                                if (response.ok)
                                    return response.text();
                                else
                                    return Promise.reject();
                            });
                            pageResponse.then(text => {
                                let pageContent = document.querySelector("div#page-content");
                                if (pageContent == null)
                                    return;
                                pageContent.innerHTML = text;
                                resolve();
                            }, error => {
                                // If all else fails, just write "404 Page not found!" to the page-content div
                                let pageContent = document.querySelector("div#page-content");
                                if (pageContent == null)
                                    return;
                                pageContent.textContent = "404 Page not found!";
                                resolve();
                            });
                        }
                    }));
                }));
                yield pageResponse;
            }
            resolve(activePageDir);
        }));
        updatePageCodeExamples();
    });
}
window.addEventListener('hashchange', () => {
    updateActivePage();
}, false);
document.addEventListener('DOMContentLoaded', () => {
    updateActivePage();
}, false);
//# sourceMappingURL=page.js.map