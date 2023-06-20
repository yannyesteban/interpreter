export const loadScript = (url, options) => {
    return new Promise((resolve, reject) => {
        try {
            const myScript = document.createElement("script");
            //const key = "AIzaSyDZ4BkTZxNRh8GZTqmgGfDI4c2PgcbSuMM";
            //const url = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&libraries=&v=weekly`;
            myScript.setAttribute("src", url); //"../../build/test/google/index.js"
            myScript.setAttribute("async", options.async || false);
            myScript.setAttribute("type", options.type || "");
            myScript.addEventListener("load", (event) => {
                resolve({
                    status: true
                });
            });
            myScript.addEventListener("error", (event) => {
                reject({
                    status: false,
                    msg: "error"
                });
            });
            document.body.appendChild(myScript);
        }
        catch (error) {
            reject({
                status: false,
                msg: error
            });
        }
    });
};
//# sourceMappingURL=LoadScript.js.map