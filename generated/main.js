"use strict";
class SidebarTab {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.elements = [];
    }
    setElements(elements) {
        this.elements = elements;
        return this;
    }
}
let sidebarTabs = [
    new SidebarTab("Device Creation", "device-creation").setElements([
        new SidebarTab("Instance", "instance"),
        new SidebarTab("Physical Device", "physical-device"),
        new SidebarTab("Device", "device")
    ]),
    new SidebarTab("Swapchain Creation", "swapchain-creation").setElements([
        new SidebarTab("Swapchain", "swapchain")
    ])
];
function clickCodeExampleTabButton(tabTarget, codeExample) {
    let tabs = codeExample.querySelectorAll("ul li");
    for (let i = 0, len = tabs.length; i < len; ++i) {
        let tab = tabs[i];
        let tabButton = tab.getElementsByTagName("button")[0];
        let tabButtonTarget = tabButton.getAttribute("data-code-example-id");
        if (tabButtonTarget == null)
            continue;
        if (tabButtonTarget === tabTarget) {
            tabButton.classList.add("active");
            tabButton.setAttribute("aria-current", "page");
        }
        else {
            tabButton.classList.remove("active");
            tabButton.removeAttribute("aria-current");
        }
    }
    let divs = codeExample.getElementsByTagName("div");
    for (let i = 0, len = divs.length; i < len; ++i) {
        let div = divs[i];
        if (div.id === tabTarget) {
            div.classList.remove("d-none");
        }
        else {
            div.classList.add("d-none");
        }
    }
}
function addCodeExamplesCallbacks() {
    let codeExamples = document.getElementsByClassName("code-examples");
    for (let i = 0, len = codeExamples.length; i < len; ++i) {
        let codeExample = codeExamples[i];
        let tabs = codeExample.querySelectorAll("ul li");
        for (let j = 0, jlen = tabs.length; j < jlen; ++j) {
            let tab = tabs[j];
            let tabButton = tab.getElementsByTagName("button")[0];
            let tabTarget = tabButton.getAttribute("data-code-example-id");
            if (tabTarget == null)
                continue;
            tabButton.onclick = () => {
                clickCodeExampleTabButton(tabTarget, codeExample);
            };
        }
    }
}
function createSidebarTab(sidebarTab, parentId) {
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
                for (let i = 0, len = sidebarTab.elements.length; i < len; ++i)
                    ul.appendChild(createSidebarTab(sidebarTab.elements[i], parentId != null ? parentId + "-" + sidebarTab.id : sidebarTab.id));
                div.appendChild(ul);
            }
            li.appendChild(div);
        }
        return li;
    }
    else {
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
function addSidebarTabs() {
    let sidebar = document.getElementsByClassName("sidebar")[0];
    let sidebarTabsElement = sidebar.getElementsByClassName("sidebar-tabs")[0];
    for (let i = 0, len = sidebarTabs.length; i < len; ++i)
        sidebarTabsElement.appendChild(createSidebarTab(sidebarTabs[i], null));
}
function onPageLoaded() {
    console.log(window.location.hash);
    // Remove children in #code-page div
    // Add new children to #code-page div
    addCodeExamplesCallbacks();
}
window.addEventListener('hashchange', function () {
    onPageLoaded();
}, false);
document.addEventListener('DOMContentLoaded', function () {
    addSidebarTabs();
    onPageLoaded();
}, false);
/*
 <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed w-100 text-white" data-bs-toggle="collapse" data-bs-target="#device-creation-collapse" aria-expanded="true">
                        Device Creation
                    </button>
                    <div class="collapse show" id="device-creation-collapse">
                        <ul class="d-flex flex-column btn-toggle-nav list-unstyled fw-normal pb-1 small">
                            <li>
                                <button class="btn rounded ps-3 pe-0 pb-0 pt-0 w-100 text-white text-start" id="device-creation-instance-button">
                                    Instance
                                </button>
                            </li>
                            <li>
                                <button class="btn rounded ps-3 pe-0 pb-0 pt-0 w-100 text-white text-start" id="device-creation-physical-device-button">
                                    Physical Device
                                </button>
                            </li>
                            <li>
                                <button class="btn rounded ps-3 pe-0 pb-0 pt-0 w-100 text-white text-start" id="device-creation-device-button">
                                    Device
                                </button>
                            </li>
                        </ul>
                    </div>
                </li>
 */ 
//# sourceMappingURL=main.js.map