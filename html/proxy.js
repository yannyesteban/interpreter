let x = document.getElementById("country");
let view = new Proxy(x, {
    set: function (obj, prop, newval) {
        console.log(prop, newval, obj[prop]);

        obj[prop] = newval;

        // Indica éxito
        return true;
    },
});

view.value = "";
