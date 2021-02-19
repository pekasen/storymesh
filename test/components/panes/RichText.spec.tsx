import { assert } from "chai";
import { JSDOM } from "jsdom";
import { h, render} from "preact";
import { SideBar } from "../../../src";
import { RichTextMenuItem } from "../../../src/components/panes/RichText";

const html = '<html lang="en"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Document</title></head><body><div id="preact-root"></div></body></html>';

describe("RichTextMenuItem", () => {

    let jsdom: JSDOM;
    before(async function () {
        jsdom = new JSDOM(html);
        await new Promise((resolve) => {
            global.document = jsdom.window.document;
            jsdom.window.addEventListener("load", resolve);
        });
    });
    
    it("should instantiate with an empty items array", (done) => {
        const test = <SideBar items={[{
            type: RichTextMenuItem,
            label: "Test",
            options: {}
        }]} />;

        const root  = jsdom.window.document.getElementById("preact-root");
        if (root !== null && jsdom.window && jsdom.window.document) {
            render(test, root);
            
            setTimeout(() => {
                console.log(document.body.childNodes);
                assert.equal(
                    jsdom.window.document.getElementsByClassName("editor").length, 1
                );
                done();
            }, 1550)
        }
    });
});
