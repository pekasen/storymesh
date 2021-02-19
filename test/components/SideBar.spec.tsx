import { assert } from "chai";
import { JSDOM } from "jsdom";
import { h, render} from "preact";
import { SideBar } from "../../src";
import { ITextMenuItemOptions, TextMenuItem } from "../../src/components/panes/Text";
import { IMenuTemplate } from "../../src/components/SideBar";

const html = '<html lang="en"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Document</title></head><body><div id="preact-root"></div></body></html>';

describe("<SideBar />", () => {

    let jsdom: JSDOM;
    before(async function () {
        jsdom = new JSDOM(html);
        await new Promise((resolve) => {
            global.document = jsdom.window.document;
            jsdom.window.addEventListener("load", resolve);
        });
    });
    
    it("should instantiate with an empty items array", () => {
        const test = <SideBar items={[]} />;
        const root  = jsdom.window.document.getElementById("preact-root");
        if (root !== null && jsdom.window && jsdom.window.document) {
            render(test, root);
            assert.exists(
                jsdom.window.document.getElementById("side-bar")
            )
        }
    });

    it("should accept a IMenuItem", () => {
        const item: IMenuTemplate<string, ITextMenuItemOptions> = {
            label: "Test",
            type: TextMenuItem,
            options: {
                defaultValue: "Test"
            }
        };

        const test = <SideBar items={[item]} />;
        const root  = jsdom.window.document.getElementById("preact-root");
        if (root !== null && jsdom.window && jsdom.window.document) {
            render(test, root);
            assert.equal(
                jsdom.window.document.getElementsByClassName("form-group-item").length, 1
            )
        }
    });
});
