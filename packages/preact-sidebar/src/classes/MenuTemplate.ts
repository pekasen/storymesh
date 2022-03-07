import { IMenuItemRenderer, IMenuTemplate } from "../components/SideBar";

export abstract class MenuTemplate<Value = any, Options = any> implements IMenuTemplate<Value, Options> {
    public abstract type: IMenuItemRenderer;
    public abstract label: string;
    public abstract options: Options;
    public abstract getter?: () => Value;
    public abstract setter?: (arg: Value) => void;
}