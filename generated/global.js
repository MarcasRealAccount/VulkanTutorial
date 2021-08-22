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
let infoResponse;
let info = {};
let tutorialsResponse;
let tutorials = {};
let samplesResponse;
let samples = {};
let selectedExtensionResponse;
let selectedExtension = "";
function loadGlobalConfigs() {
    return __awaiter(this, void 0, void 0, function* () {
        infoResponse = fetch("info.json").then(response => {
            if (response.ok)
                return response.json();
            else
                return Promise.reject();
        });
        infoResponse.then(json => { info = json; });
        yield infoResponse;
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
    });
}
function updateSelectedExtension() {
    return __awaiter(this, void 0, void 0, function* () {
        yield infoResponse;
        selectedExtensionResponse = new Promise((resolve, reject) => {
            let searchParams = new URLSearchParams(window.location.search);
            let givenExtension = searchParams.get("extension");
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
            resolve(selectedExtension);
        });
    });
}
loadGlobalConfigs();
window.addEventListener('hashchange', function () {
    updateSelectedExtension();
}, false);
document.addEventListener('DOMContentLoaded', function () {
    updateSelectedExtension();
}, false);
//# sourceMappingURL=global.js.map