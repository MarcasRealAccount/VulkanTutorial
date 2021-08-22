let infoResponse: Promise<any>;
let info: any = {};
let tutorialsResponse: Promise<any>;
let tutorials: any = {};
let samplesResponse: Promise<any>;
let samples: any = {};

let selectedExtensionResponse: Promise<string>;
let selectedExtension: string = "";

async function loadGlobalConfigs() {
    infoResponse = fetch("info.json").then(response => {
        if (response.ok)
            return response.json();
        else
            return Promise.reject();
    });
    infoResponse.then(json => { info = json; });

    await infoResponse;
    selectedExtension = info.defaultExtension;
    tutorialsResponse = fetch(info.tutorialsLocation).then(response => {
        if (response.ok)
            return response.json();
        else
            return Promise.reject();
    });
    samplesResponse = fetch(info.samplesLocation).then(response => {
        if (response.ok)
            return response.json();
        else
            return Promise.reject();
    });

    tutorialsResponse.then(json => { tutorials = json; });
    samplesResponse.then(json => { samples = json; });
}

async function updateSelectedExtension() {
    await infoResponse;
    selectedExtensionResponse = new Promise<string>((resolve, reject) => {
        let searchParams = new URLSearchParams(window.location.search);
        let givenExtension = searchParams.get("extension");
        if (givenExtension != null) {
            let found: boolean = false;
            for (let i: number = 0, len = info.availableExtensions.length; i < len; ++i) {
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
        } else {
            selectedExtension = info.defaultExtension;
        }
        resolve(selectedExtension);
    });
}

loadGlobalConfigs();

window.addEventListener('hashchange', function () {
    updateSelectedExtension();
}, false);

document.addEventListener('DOMContentLoaded', function () {
    updateSelectedExtension();
}, false);