export const whenDefined = customElements.whenDefined;

export const getParentElement = (child, parentTag: string) => {

    let parent = child.parentNode;

    while (parent !== null) {
        if (parent.tagName === parentTag.toLocaleUpperCase()) {

            return parent;
        }
        parent = parent.parentNode;
    }

    return null;
}

export const fire = (element, name, detail) => {
    const event = new CustomEvent(name, {
        detail
    });

    element.dispatchEvent(event);
}

export const whenApp = (child)=>{
    return new Promise((resolve, reject)=>{
        customElements.whenDefined("wh-app").then(() => {
           
            const app = getParentElement(child, "wh-app");

            if(app){
                resolve(app);
            }
            reject('error')
            
        });
    });
}

export const whenElement = (parent, element)=>{
    return new Promise((resolve, reject)=>{
        customElements.whenDefined(element).then(() => {
            const e = parent.querySelector(element);

            if(e){
                resolve(e);
            }
            reject(null);
            
        });
    });
}

