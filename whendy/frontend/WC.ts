export interface WCModule {
    src: string;
    name: string;
    wc: string;
}

export async function LoadModules(modules: WCModule[]) {
    for (const module of modules) {
        if (customElements.get(module.wc)) {
            continue;
        }

        await import(module.src)
            .then(() => {})
            .catch((error) => {
                console.log(error);
            });
    }
}
