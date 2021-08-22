let sidebarInitialisePromise: Promise<void>;
let sidebarActivePromise: Promise<void>;

function getSidebarHTML(page: any, sidebarIdPrefix: string, idPrefix: string): string {
    let sidebarId = sidebarIdPrefix + page.sidebarId;
    let id = idPrefix + page.id;

    let subPages = page.subPages;
    if (subPages != null) {
        let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-" + sidebarId + "\" aria-expanded=\"false\">" + page.visibleName + "</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-" + sidebarId + "\"><ul class=\"list-unstyled ps-0\">";

        for (let i: number = 0, len: number = subPages.length; i < len; ++i)
            html += getSidebarHTML(subPages[i], sidebarId + "-", id + "-");

        html += "</ul></div></li>";
        return html;
    } else {
        return "<li class=\"rounded\"><a class=\"text-decoration-none rounded\" href=\"#" + id + "\" id=\"sidebar-" + sidebarId + "\">" + page.visibleName + "</a></li>";
    }
}

function sidebarInitialise() {
    sidebarInitialisePromise = new Promise<void>((resolve, reject) => {
        infoPromise.then(() => {
            let pages = info.pages;
            if (pages != null) {
                let sidebarHTML: string = "";
                for (let i: number = 0, len: number = pages.length; i < len; ++i)
                    sidebarHTML += getSidebarHTML(pages[i], "", "");

                let sidebarLists = document.querySelectorAll("#sidebar-list");
                for (let i: number = 0, len: number = sidebarLists.length; i < len; ++i) {
                    let sidebarList = sidebarLists[i];
                    sidebarList.innerHTML = sidebarHTML;
                }
            }
            resolve();
        });
    });
    sidebarUpdateActive();
}

function sidebarUpdateActive(): void {
    sidebarActivePromise = new Promise<void>((resolve, reject) => {
        sidebarInitialisePromise.then(() => {
            optionsPromise.then(() => {
                let id = openedPage;
                let sidebarLinks = document.querySelectorAll(".sidebar-dropdown-collapse ul li a[href]");
                let href = "#" + id;
                for (let i: number = 0, len: number = sidebarLinks.length; i < len; ++i) {
                    let sidebarLink = sidebarLinks[i];

                    if (sidebarLink.getAttribute("href") === href) {
                        let current = sidebarLink;
                        let parent: Element | null;
                        while ((parent = current.closest("div.sidebar-dropdown-collapse")) != null) {
                            let parentLI = parent.parentElement;
                            if (parentLI == null) continue;

                            let btn = parentLI.querySelector("button");
                            if (btn == null) continue;
                            btn.classList.remove("collapsed");
                            btn.setAttribute("aria-expanded", "true");

                            parent.classList.add("show");

                            current = parentLI;
                        }
                        sidebarLink.parentElement?.classList.add("opened");
                    } else {
                        sidebarLink.parentElement?.classList.remove("opened");
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