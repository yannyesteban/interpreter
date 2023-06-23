const deviceMode = +getComputedStyle(document.body).getPropertyValue("--device_mode").replace(/\W/g, "");
export const MediaQuery = {
    resolution: deviceMode,
    isLowResolution: function () {
        const clientWidth = document.documentElement.clientWidth;
        if (clientWidth < deviceMode) {
            return true;
        }
        return false;
    }
};
console.log(deviceMode);
const mediaQuery = window.matchMedia(`(max-width: ${deviceMode}px)`);
mediaQuery.addEventListener("change", (e) => {
    const mediaEvent = new CustomEvent("media-query-changed", {
        detail: {
            lowScreen: e.matches
        },
    });
    window.dispatchEvent(mediaEvent);
    console.log("media change", e);
});
//# sourceMappingURL=MediaQuery.js.map