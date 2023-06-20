export const loadCss = (url, async) => {
    return new Promise((resolve, reject) => {
        try {
            const myScript = document.createElement("link");
            myScript.setAttribute("href", url);
            myScript.setAttribute("rel", "stylesheet");
            myScript.setAttribute("type", "text/css");
            //myScript.setAttribute("async", async);
            myScript.addEventListener("load", (event) => {
                resolve({
                    status: true,
                });
            });
            myScript.addEventListener("error", (event) => {
                reject({
                    status: false,
                    msg: "error",
                });
            });
            document.body.appendChild(myScript);
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