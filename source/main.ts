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
        new SidebarTab("Instance", "instance", "instance.html"),
        new SidebarTab("Physical Device", "physical-device", "physical-device.html"),
        new SidebarTab("Device", "device", "device.html")
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

function clickCodeExampleTabButton(tabTarget: string, codeExample: Element): void {
    let tabs = codeExample.querySelectorAll("ul li");
    for (let i: number = 0, len: number = tabs.length; i < len; ++i) {
        let tab = tabs[i];
        let tabButton = tab.getElementsByTagName("button")[0];
        let tabButtonTarget = tabButton.getAttribute("data-code-example-id");
        if (tabButtonTarget == null) continue;
        if (tabButtonTarget === tabTarget) {
            tabButton.classList.add("active");
            tabButton.setAttribute("aria-current", "page");
        } else {
            tabButton.classList.remove("active");
            tabButton.removeAttribute("aria-current");
        }
    }

    let divs = codeExample.getElementsByTagName("div");
    for (let i: number = 0, len: number = divs.length; i < len; ++i) {
        let div = divs[i];
        if (div.id === tabTarget) {
            div.classList.remove("d-none");
        } else {
            div.classList.add("d-none");
        }
    }
}

function addCodeExamplesCallbacks(): void {
    let codeExamples = document.getElementsByClassName("code-examples");
    for (let i: number = 0, len: number = codeExamples.length; i < len; ++i) {
        let codeExample = codeExamples[i];
        let tabs = codeExample.querySelectorAll("ul li");
        for (let j: number = 0, jlen: number = tabs.length; j < jlen; ++j) {
            let tab = tabs[j];
            let tabButton = tab.getElementsByTagName("button")[0];
            let tabTarget = tabButton.getAttribute("data-code-example-id");
            if (tabTarget == null) continue;
            tabButton.onclick = () => {
                clickCodeExampleTabButton(tabTarget as string, codeExample);
            };
        }
    }
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
        } else {
            fetch(codePageURL as string)
                .then((response) => response.text())
                .then((html) => {
                    (codePage as HTMLElement).innerHTML = html;
                })
                .catch((error) => {
                    console.warn(error);
                });
        }
        // Add new children to #code-page div
        addCodeExamplesCallbacks();
    }
}

window.addEventListener('hashchange', function () {
    onPageLoaded();
}, false);

document.addEventListener('DOMContentLoaded', function () {
    addSidebarTabs();
    onPageLoaded();
}, false);