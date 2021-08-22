let activePageResponse: Promise<string> | null;
let activePageDir: string = "";
let activePageInfo: any = {};

async function getCodeExample(codeExample: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        resolve("Hey");
    });
}

async function updatePageCodeExamples() {
    await activePageResponse;

    let codeExamples = document.querySelectorAll("div.code-example");
    for (let i: number = 0, len: number = codeExamples.length; i < len; ++i) {
        let codeExample = codeExamples[i];
        let html = "<ul class=\"nav nav-tabs\">";

        for (let j: number = 0, jlen: number = info.availableExtensions.length; j < jlen; ++j) {
            let extension = info.availableExtensions[j];
            html += "<li class=\"nav-item\"><button class=\"btn nav-link";
            if (extension.id === selectedExtension) html += " active";
            html += "\"";
            if (extension.id === selectedExtension) html += " aria-current=\"page\"";
            html += " data-code-extension=\"" + extension.id + "\">" + extension.visibleName + "</button></li>";
        }

        html += "</ul><div class=\"code-example-code\" id=\"" + codeExample.id + "-code\">Loading</div>";

        codeExample.innerHTML = html;

        let buttons = codeExample.querySelectorAll("ul li button");
        for (let j: number = 0, jlen: number = buttons.length; j < jlen; ++j) {
            let button = buttons[j];
            button.addEventListener("click", () => {
                let searchParams = new URLSearchParams(window.location.search);
                let newExtension = button.getAttribute("data-code-extension");
                if (newExtension == null) return;
                if (searchParams.get("extension") !== newExtension) {
                    searchParams.set("extension", newExtension);
                    window.location.search = searchParams.toString();
                }
            }, false);
        }

        let codeDiv = codeExample.querySelector("#" + codeExample.id + "-code");

        if (codeDiv != null) {
            getCodeExample(codeExample.id.replace(/-/g, "/") + "/").then(code => {
                (codeDiv as Element).innerHTML = code;
            });
        }
    }
}

async function updateActivePage() {
    await selectedExtensionResponse;
    activePageResponse = new Promise<string>(async (resolve, reject) => {
        activePageDir = window.location.hash.substr(1).replace(/-/g, "/") + "/";
        if (activePageDir === "/") activePageDir = "home/";

        let pageInfoPath = activePageDir + "info.json";
        let pageInfoResponse = new Promise<void>(async (resolve, reject) => {
            fetch(pageInfoPath).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject();
                }
            }).then(json => {
                activePageInfo = json;
                resolve();
            }, async error => {
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
            });
        });

        await pageInfoResponse;
        if (activePageInfo.page != null) {
            let pageResponse = new Promise<void>(async (resolve, reject) => {
                fetch(activePageDir + "/" + activePageInfo.page).then(response => {
                    if (response.ok)
                        return response.text();
                    else
                        return Promise.reject();
                }).then(text => {
                    let pageContent = document.querySelector("div#page-content");
                    if (pageContent == null) return;
                    pageContent.innerHTML = text;
                    resolve();
                }, async error => {
                    // Load 404 error page.
                    activePageDir = "error/404/";
                    pageInfoPath = activePageDir + "info.json";
                    let pageInfoResponse = new Promise<void>((resolve, reject) => {
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

                    await pageInfoResponse;
                    if (activePageInfo.page != null) {
                        let pageResponse = fetch(activePageDir + "/" + activePageInfo.page).then(response => {
                            if (response.ok)
                                return response.text();
                            else
                                return Promise.reject();
                        });
                        pageResponse.then(text => {
                            let pageContent = document.querySelector("div#page-content");
                            if (pageContent == null) return;
                            pageContent.innerHTML = text;
                            resolve();
                        }, error => {
                            // If all else fails, just write "404 Page not found!" to the page-content div
                            let pageContent = document.querySelector("div#page-content");
                            if (pageContent == null) return;
                            pageContent.textContent = "404 Page not found!";
                            resolve();
                        });
                    }
                });
            });
            await pageResponse;
        }
        resolve(activePageDir);
    });
    updatePageCodeExamples();
}

window.addEventListener('hashchange', () => {
    updateActivePage();
}, false);

document.addEventListener('DOMContentLoaded', () => {
    updateActivePage();
}, false);