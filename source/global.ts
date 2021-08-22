let infoPromise: Promise<void>;
let optionsPromise: Promise<void>;
let selectedExtensionPromise: Promise<void>;

let info: any = {};
let previousOpenedPage: string | null = null;
let openedPage: string | null = null;
let options: { name: string, value: string | null }[] = [];
let selectedExtension: string = "";

function updateHashString() {
    let hash = "#" + openedPage + "?";
    for (let i: number = 0, len: number = options.length; i < len; ++i) {
        if (i > 0) hash += "&";
        let option = options[i];
        hash += option.name;
        if (option.value != null) hash += "=" + option.value;
    }
    window.location.hash = hash;
}

function parseOptionsFromHashString() {
    optionsPromise = new Promise<void>((resolve, reject) => {
        previousOpenedPage = openedPage;
        let hash = window.location.hash;
        let hashOptions = hash.substr(1).split(/\?|&/g);
        if (hashOptions.length > 0) openedPage = hashOptions[0];
        options = [];
        if (hashOptions.length > 1) {
            for (let i: number = 1, len: number = hashOptions.length; i < len; ++i) {
                let hashOption = hashOptions[i];
                let keyValue = hashOption.split("=");
                let name = keyValue[0];
                let value: string | null = null;
                if (keyValue.length > 1) value = keyValue[1];
                options.push({ name, value });
            }
        }
        resolve();
    });
}

function setOptionValue(name: string, value: string | null) {
    for (let i: number = 0, len: number = options.length; i < len; ++i) {
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

function getOptionValue(name: string): string | null {
    for (let i: number = 0, len: number = options.length; i < len; ++i) {
        let option = options[i];
        if (option.name === name) {
            if (option.value == null) return "";
            else return option.value;
        }
    }
    return null;
}

function getPageVisibleName_(pageId: string, page: any): string | null {
    if (page.subPages != null) {
        for (let i: number = 0, len: number = page.subPages.length; i < len; ++i) {
            let res = getPageVisibleName_(pageId.substr(pageId.indexOf("-")), page.subPages[i]);
            if (res != null) return res;
        }
    } else if (page.id === pageId) {
        return page.visibleName;
    }
    return null;
}

function getPageVisibleName(pageId: string): string | null {
    let pages = info.pages;
    for (let i: number = 0, len: number = pages.length; i < len; ++i) {
        let res = getPageVisibleName_(pageId, pages[i]);
        if (res != null) return res;
    }
    return null;
}

function getSubPagesStrings(page: any): string[] {
    let pageStrings: string[] = [];
    let subPages = page.subPages;
    if (subPages != null) {
        if (subPages.constructor === [].constructor)
            for (let i: number = 0, len: number = subPages.length; i < len; ++i)
                pageStrings.concat(getSubPagesStrings(subPages[i]));
        else if (subPages.constructor === "".constructor)
            pageStrings.push(subPages);
    }
    return pageStrings;
}

function getPages(pagesDir: string, fileName: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        fetch(pagesDir + fileName).then(response => {
            if (response.ok) return response.json();
            else return Promise.reject();
        }).then(async json => {
            let pages = json.pages;
            if (pages == null) {
                resolve(json);
                return;
            }

            for (let i: number = 0, len: number = pages.length; i < len; ++i) {
                let page = pages[i];
                let pageStrings = getSubPagesStrings(page);
                for (let j: number = 0, jlen: number = pageStrings.length; j < jlen; ++j) {
                    let pageString = pageStrings[j];
                    let matches = pageString.match(/(.*\/)(.*)/g);
                    if (matches == null || matches.length < 3) {
                        page.subPages = null;
                        continue;
                    }
                    page.subPages = (await getPages(pagesDir + matches[1], matches[2])).pages;
                }
            }

            resolve(json);
        }, error => {
            resolve({});
        });
    });
}

function loadGlobalConfigs() {
    infoPromise = new Promise<void>((resolve, reject) => {
        fetch("info.json").then(response => {
            if (response.ok)
                return response.json();
            else
                return Promise.reject();
        }).then(async json => {
            info = json;
            let pages = info.pages;
            if (pages == null) {
                resolve();
                return;
            }

            for (let i: number = 0, len: number = pages.length; i < len; ++i) {
                let page = pages[i];
                let pageStrings = getSubPagesStrings(page);
                for (let j: number = 0, jlen: number = pageStrings.length; j < jlen; ++j) {
                    let pageString = pageStrings[j];
                    console.log(pageString);
                    let matches = pageString.match(/(.*\/)(.*)/g);
                    console.log(matches);
                    if (matches == null || matches.length < 2) {
                        page.subPages = null;
                        continue;
                    }
                    page.subPages = (await getPages(matches[0], matches[1])).pages;
                }
            }

            resolve();
        }, error => {
            info = {};
            resolve();
        });
    });
}

function updateSelectedExtension() {
    selectedExtensionPromise = new Promise<void>((resolve, reject) => {
        optionsPromise.then(() => {
            infoPromise.then(() => {
                let givenExtension = getOptionValue("extension");
                if (givenExtension != null) {
                    let found: boolean = false;
                    for (let i: number = 0, len = info.availableExtensions.length; i < len; ++i) {
                        let ext = info.availableExtensions[i];
                        if (ext.id === givenExtension) {
                            found = true;
                            break;
                        }
                    }

                    if (found) selectedExtension = givenExtension as string;
                    else selectedExtension = info.defaultExtension;
                } else {
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