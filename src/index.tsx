import { PPReg, start, VReg } from 'storygraph'
import { PlugInExports } from 'storymesh-plugin-base' 
import { render } from 'preact';
import { App } from './App';


export function display(file: string, mount_id: string) : any {
    let ret

    fetch(file)
        .then(r => {
            const re = r.json()
            console.log(re)
            return re
        })
        .then(j => {
            ret =  start()
            PPReg.instance().set(PlugInExports.name, PlugInExports)
            VReg.load(j)
            console.log(ret)
            const v = VReg.instance()
            if (v.entrypoint) {
                const toplvlobj = v.get(v.entrypoint);
                if (!toplvlobj) throw('Top-levl object is undefined.')
                console.log('Attempting render of:', App)

                render(
                    <App />,
                    document.getElementById('storymesh-entrypoint') as Element
                )
            }
        });

    return ret
}

// display('story.json')