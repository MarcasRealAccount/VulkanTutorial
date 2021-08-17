class SidebarTab {
    name: string;
    id: string;
    filepath: string;
    elements: SidebarTab[];

    constructor(name: string, id: string, filepath: string) {
        this.name = name;
        this.id = id;
        this.filepath = filepath;
        this.elements = [];
    }

    setElements(elements: SidebarTab[]): SidebarTab {
        this.elements = elements;
        return this;
    }
}

let sidebarTabs: SidebarTab[] = [
    new SidebarTab("Device Creation", "device-creation", "device-creation/").setElements([
        new SidebarTab("Instance", "instance", "instance"),
        new SidebarTab("Physical Device", "physical-device", "physical-device"),
        new SidebarTab("Device", "device", "device")
    ]),
    new SidebarTab("Swapchain Creation", "swapchain-creation", "swapchain-creation/").setElements([
        new SidebarTab("Swapchain", "swapchain", "swapchain")
    ])
];

function tryGetCodePage(codepage: string, tab: SidebarTab): string | null {
    if (tab.elements.length > 0) {
        if (codepage.startsWith(tab.id)) {
            let otherPart = codepage.substr(tab.id.length + 1);

            for (let i: number = 0, len: number = tab.elements.length; i < len; ++i) {
                let result = tryGetCodePage(otherPart, tab.elements[i]);
                if (result != null)
                    return tab.filepath + result;
            }
        }
    } else if (tab.id === codepage) {
        return tab.filepath;
    }

    return null;
}

function getCodePage(codepage: string): string | null {
    for (let i: number = 0, len: number = sidebarTabs.length; i < len; ++i) {
        let result = tryGetCodePage(codepage, sidebarTabs[i]);
        if (result != null)
            return result;
    }
    return null;
}

function clickCodeExampleTabButton(tabExtension: string, codeExample: Element, index: number): void {
    let tabs = codeExample.querySelectorAll("ul li");
    for (let i: number = 0, len: number = tabs.length; i < len; ++i) {
        let tab = tabs[i];
        let tabButton = tab.getElementsByTagName("button")[0];
        let tabButtonExtension = tabButton.getAttribute("data-code-extension");
        if (tabButtonExtension == null) continue;
        if (tabButtonExtension === tabExtension) {
            tabButton.classList.add("active");
            tabButton.setAttribute("aria-current", "page");
        } else {
            tabButton.classList.remove("active");
            tabButton.removeAttribute("aria-current");
        }
    }

    let pres = codeExample.getElementsByTagName("pre");
    for (let i: number = 0, len: number = pres.length; i < len; ++i) {
        let pre = pres[i];
        if (pre.id === "code") {
            let codePageURL = getCodePage(window.location.hash.substr(1));
            if (codePageURL == null) {
                // Show 404 page
                pre.textContent = "404 Code not found!";
            } else {
                codePageURL += "-example" + index + "." + tabExtension + window.location.search;
                let response = fetch(codePageURL as string).then(response => {
                    if (response.ok)
                        return response.text()
                    else
                        return Promise.reject();
                });

                response.then(html => {
                    pre.textContent = html;
                }, error => {
                    // Show 404 page
                    pre.textContent = "404 Code not found!";
                });
            }
        }
    }
}

function addCodeExamples(): void {
    let codeExamples = document.getElementsByClassName("code-examples");
    for (let i: number = 0, len: number = codeExamples.length; i < len; ++i) {
        let codeExample = codeExamples[i];
        let tabs = codeExample.querySelectorAll("ul li");
        let firstExtension: string | null = null;
        for (let j: number = 0, jlen: number = tabs.length; j < jlen; ++j) {
            let tab = tabs[j];
            let tabButton = tab.getElementsByTagName("button")[0];
            let tabExtension = tabButton.getAttribute("data-code-extension");
            if (tabExtension == null) continue;
            if (firstExtension == null) firstExtension = tabExtension;
            tabButton.onclick = () => {
                clickCodeExampleTabButton(tabExtension as string, codeExample, i + 1);
            };
        }
        if (firstExtension != null)
            clickCodeExampleTabButton(firstExtension, codeExample, i + 1);
    }
    console.log("WUT");
}

function createSidebarTab(sidebarTab: SidebarTab, parentId: string | null): Node {
    if (sidebarTab.elements.length > 0) {
        let li = document.createElement("li");
        li.classList.add("mb-1");
        {
            let button = document.createElement("button");
            button.classList.add("btn", "btn-toggle", "align-items-center", "rounded", "collapsed", "w-100", "text-white");
            button.setAttribute("data-bs-toggle", "collapse");
            button.setAttribute("data-bs-target", "#" + (parentId != null ? parentId + "-" + sidebarTab.id : sidebarTab.id) + "-collapse");
            button.setAttribute("aria-expanded", "false");
            button.textContent = sidebarTab.name;
            li.appendChild(button);
        }
        {
            let div = document.createElement("div");
            div.classList.add("collapse");
            div.id = (parentId != null ? parentId + "-" + sidebarTab.id : sidebarTab.id) + "-collapse";
            {
                let ul = document.createElement("ul");
                ul.classList.add("d-flex", "flex-column", "btn-toggle-nav", "list-unstyled", "fw-normal", "pb-1", "small");
                for (let i: number = 0, len: number = sidebarTab.elements.length; i < len; ++i)
                    ul.appendChild(createSidebarTab(sidebarTab.elements[i], parentId != null ? parentId + "-" + sidebarTab.id : sidebarTab.id));
                div.appendChild(ul);
            }
            li.appendChild(div);
        }
        return li;
    } else {
        let li = document.createElement("li");
        {
            let a = document.createElement("a");
            a.classList.add("btn", "rounded", "ps-3", "pe-0", "pb-0", "pt-0", "w-100", "text-white", "text-start");
            a.id = parentId != null ? parentId + "-" + sidebarTab.id : sidebarTab.id;
            a.setAttribute("href", "#" + a.id);
            a.textContent = sidebarTab.name;
            li.appendChild(a);
        }
        return li;
    }
}

function addSidebarTabs(): void {
    let sidebar = document.getElementsByClassName("sidebar")[0];
    let sidebarTabsElement = sidebar.getElementsByClassName("sidebar-tabs")[0];
    for (let i: number = 0, len: number = sidebarTabs.length; i < len; ++i)
        sidebarTabsElement.appendChild(createSidebarTab(sidebarTabs[i], null));
}

function onPageLoaded(): void {
    let codePage = document.getElementById("code-page");
    if (codePage == null) {
        // Print error message when #code-page div is somehow missing
        console.error("#code-page div missing, please create a git issue if this message is not already there!");
    } else {
        // Remove children in #code-page div
        codePage.textContent = "";
        let codePageURL = getCodePage(window.location.hash.substr(1));
        if (codePageURL == null) {
            // Show 404 page
            (codePage as HTMLElement).innerHTML = "404 Page not found!";
        } else {
            codePageURL += ".html" + window.location.search;
            let response = fetch(codePageURL as string).then(response => {
                if (response.ok)
                    return response.text()
                else
                    return Promise.reject();
            });

            response.then(html => {
                (codePage as HTMLElement).innerHTML = html;
                addCodeExamples();
            }, error => {
                // Show 404 page
                (codePage as HTMLElement).innerHTML = "404 Page not found!";
            });
        }
    }
}

window.addEventListener('hashchange', function () {
    onPageLoaded();
}, false);

document.addEventListener('DOMContentLoaded', function () {
    addSidebarTabs();
    onPageLoaded();
}, false);