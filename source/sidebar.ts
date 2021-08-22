function getSidebarHTMLFromTutorial(tutorial: any, sidebarIdPrefix: string, idPrefix: string): string {
    let sidebarId = sidebarIdPrefix + tutorial.sidebarId;
    let id = idPrefix + tutorial.id;

    let tuts = tutorial.tutorials;
    if (tuts != null) {
        let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-tutorials-" + sidebarId + "\" aria-expanded=\"false\">" + tutorial.visibleName + "</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-tutorials-" + sidebarId + "\"><ul class=\"list-unstyled ps-0\">";

        for (let i: number = 0, len: number = tuts.length; i < len; ++i)
            html += getSidebarHTMLFromTutorial(tuts[i], sidebarId + "-", id + "-");

        html += "</ul></div></li>";
        return html;
    } else {
        return "<li class=\"rounded\"><a class=\"text-decoration-none rounded\" href=\"#tutorials-" + id + "\" id=\"sidebar-tutorials-" + sidebarId + "\">" + tutorial.visibleName + "</a></li>";
    }
}

function getSidebarHTMLFromSample(sample: any, sidebarIdPrefix: string, idPrefix: string): string {
    let sidebarId = sidebarIdPrefix + sample.sidebarId;
    let id = idPrefix + sample.id;

    let smps = sample.samples;
    if (smps != null) {
        let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-samples-" + sidebarId + "\" aria-expanded=\"false\">" + sample.visibleName + "</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-samples-" + sidebarId + "\"><ul class=\"list-unstyled ps-0\">";

        for (let i: number = 0, len: number = smps.length; i < len; ++i)
            html += getSidebarHTMLFromSample(smps[i], sidebarId + "-", id + "-");

        html += "</ul></div></li>";
        return html;
    } else {
        return "<li class=\"rounded\"><a class=\"text-decoration-none rounded\" href=\"#samples-" + id + "\" id=\"sidebar-samples-" + sidebarId + "\">" + sample.visibleName + "</a></li>";
    }
}

async function sidebarInitialise() {
    let sidebarLists = document.querySelectorAll("#sidebar-list");
    for (let i: number = 0, len: number = sidebarLists.length; i < len; ++i) {
        let sidebarList = sidebarLists[i];

        let html = "<li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-tutorials\" aria-expanded=\"false\">Tutorials</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-tutorials\"><ul class=\"list-unstyled ps-0\">";

        await infoResponse;
        await tutorialsResponse;
        let tuts = tutorials.tutorials;
        for (let i: number = 0, len: number = tuts.length; i < len; ++i)
            html += getSidebarHTMLFromTutorial(tuts[i], "", "");

        html += "</ul></div></li><li><button class=\"btn btn-toggle rounded collapsed sidebar-dropdown text-decoration-none\" data-bs-toggle=\"collapse\" data-bs-target=\"#sidebar-samples\" aria-expanded=\"false\">Samples</button><div class=\"sidebar-dropdown-collapse collapse\" id=\"sidebar-samples\"><ul class=\"list-unstyled ps-0\">";

        await samplesResponse;
        let smps = samples.samples;
        for (let i: number = 0, len: number = smps.length; i < len; ++i)
            html += getSidebarHTMLFromSample(smps[i], "", "");

        html += "</ul></div></li>";

        sidebarList.innerHTML = html;
    }

    sidebarSetActive(window.location.hash.substr(1));
}

function sidebarSetActive(id: string): void {
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
}

window.addEventListener('hashchange', function () {
    sidebarSetActive(window.location.hash.substr(1));
}, false);

document.addEventListener('DOMContentLoaded', function () {
    sidebarInitialise();
}, false);