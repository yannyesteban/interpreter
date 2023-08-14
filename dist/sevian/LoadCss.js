export const loadCss = (url, async) => {
    return new Promise((resolve, reject) => {
        try {
            const sheet = document.createElement("link");
            sheet.setAttribute("href", url);
            sheet.setAttribute("rel", "stylesheet");
            sheet.setAttribute("type", "text/css");
            //sheet.setAttribute("async", async);
            sheet.addEventListener("load", (event) => {
                resolve({
                    status: true,
                });
            });
            sheet.addEventListener("error", (event) => {
                reject({
                    status: false,
                    msg: "error",
                });
            });
            document.head.appendChild(sheet);
        }
        catch (error) {
            reject({
                status: false,
                msg: error,
            });
        }
    });
};
//# sourceMappingURL=LoadCss.js.map