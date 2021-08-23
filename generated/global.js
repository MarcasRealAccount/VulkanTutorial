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
let infoPromise;
let optionsPromise;
let selectedExtensionPromise;
let info = {};
let previousOpenedPage = null;
let openedPage = null;
let options = [];
let selectedExtension = "";
function updateHashString() {
    let hash = "#" + openedPage + "?";
    for (let i = 0, len = options.length; i < len; ++i) {
        if (i > 0)
            hash += "&";
        let option = options[i];
        hash += option.name;
        if (option.value != null)
            hash += "=" + option.value;
    }
    window.location.hash = hash;
}
function parseOptionsFromHashString() {
    optionsPromise = new Promise((resolve, reject) => {
        previousOpenedPage = openedPage;
        let hash = window.location.hash;
        let hashOptions = hash.substr(1).split(/\?|&/g);
        if (hashOptions.length > 0)
            openedPage = hashOptions[0];
        options = [];
        if (hashOptions.length > 1) {
            for (let i = 1, len = hashOptions.length; i < len; ++i) {
                let hashOption = hashOptions[i];
                let keyValue = hashOption.split("=");
                let name = keyValue[0];
                let value = null;
                if (keyValue.length > 1)
                    value = keyValue[1];
                options.push({ name, value });
            }
        }
        resolve();
    });
}
function setOptionValue(name, value) {
    for (let i = 0, len = options.length; i < len; ++i) {
        let option = options[i];
        if (option.name === name) {
            option.value = value;
            updateHashString();
            return;
        }
    }
    options.push({ name, value });
    updateHashString();
}
function getOptionValue(name) {
    for (let i = 0, len = options.length; i < len; ++i) {
        let option = options[i];
        if (option.name === name) {
            if (option.value == null)
                return "";
            else
                return option.value;
        }
    }
    return null;
}
function getPageVisibleName_(pageId, page) {
    if (page.subPages != null) {
        for (let i = 0, len = page.subPages.length; i < len; ++i) {
            let res = getPageVisibleName_(pageId.substr(pageId.indexOf("-") + 1), page.subPages[i]);
            if (res != null)
                return res;
        }
    }
    else if (page.id === pageId) {
        return page.visibleName;
    }
    return null;
}
function getPageVisibleName(pageId) {
    if (pageId === "")
        return "Home";
    let pages = info.pages;
    for (let i = 0, len = pages.length; i < len; ++i) {
        let res = getPageVisibleName_(pageId, pages[i]);
        if (res != null)
            return res;
    }
    return null;
}
function getSubPagesStrings(page) {
    let pageStrings = [];
    let subPages = page.subPages;
    if (subPages != null) {
        if (subPages.constructor === [].constructor)
            for (let i = 0, len = subPages.length; i < len; ++i)
                pageStrings.concat(getSubPagesStrings(subPages[i]));
        else if (subPages.constructor === "".constructor)
            pageStrings.push(subPages);
    }
    return pageStrings;
}
function getPages(pagesDir, fileName) {
    return new Promise((resolve, reject) => {
        fetch(pagesDir + fileName).then(response => {
            if (response.ok)
                return response.json();
            else
                return Promise.reject();
        }).then((json) => __awaiter(this, void 0, void 0, function* () {
            let pages = json.pages;
            if (pages == null) {
                resolve(json);
                return;
            }
            for (let i = 0, len = pages.length; i < len; ++i) {
                let page = pages[i];
                let pageStrings = getSubPagesStrings(page);
                for (let j = 0, jlen = pageStrings.length; j < jlen; ++j) {
                    let pageString = pageStrings[j];
                    let matches = pageString.match(/(.*\/)(.*)/);
                    if (matches == null || matches.length < 3) {
                        page.subPages = null;
                        continue;
                    }
                    page.subPages = (yield getPages(pagesDir + matches[1], matches[2])).pages;
                }
            }
            resolve(json);
        }), error => {
            resolve({});
        });
    });
}
function loadGlobalConfigs() {
    infoPromise = new Promise((resolve, reject) => {
        fetch("info.json").then(response => {
            if (response.ok)
                return response.json();
            else
                return Promise.reject();
        }).then((json) => __awaiter(this, void 0, void 0, function* () {
            info = json;
            let pages = info.pages;
            if (pages == null) {
                resolve();
                return;
            }
            for (let i = 0, len = pages.length; i < len; ++i) {
                let page = pages[i];
                let pageStrings = getSubPagesStrings(page);
                for (let j = 0, jlen = pageStrings.length; j < jlen; ++j) {
                    let pageString = pageStrings[j];
                    let matches = pageString.match(/(.*\/)(.*)/);
                    if (matches == null || matches.length < 3) {
                        page.subPages = null;
                        continue;
                    }
                    page.subPages = (yield getPages(matches[1], matches[2])).pages;
                }
            }
            resolve();
        }), error => {
            info = {};
            resolve();
        });
    });
}
function updateSelectedExtension() {
    selectedExtensionPromise = new Promise((resolve, reject) => {
        optionsPromise.then(() => {
            infoPromise.then(() => {
                let givenExtension = getOptionValue("extension");
                if (givenExtension != null) {
                    let found = false;
                    for (let i = 0, len = info.availableExtensions.length; i < len; ++i) {
                        let ext = info.availableExtensions[i];
                        if (ext.id === givenExtension) {
                            found = true;
                            break;
                        }
                    }
                    if (found)
                        selectedExtension = givenExtension;
                    else
                        selectedExtension = info.defaultExtension;
                }
                else {
                    selectedExtension = info.defaultExtension;
                }
                resolve();
            });
        });
    });
}
loadGlobalConfigs();
window.addEventListener('hashchange', function () {
    parseOptionsFromHashString();
    updateSelectedExtension();
}, false);
document.addEventListener('DOMContentLoaded', function () {
    parseOptionsFromHashString();
    updateSelectedExtension();
}, false);
//# sourceMappingURL=global.js.map