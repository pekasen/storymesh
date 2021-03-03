import { h, JSX } from "preact";
import { MenuTemplate } from "../../classes/MenuTemplate";
import { IMenuTemplate } from "../SideBar";

export interface IColumnSpecification<Value, Property extends keyof Value> {
    name: string
    type: string | ((arg: Value, spec: IColumnSpecification<Value, Property>) => MenuTemplate)
    editable: boolean
    property: Property
    setter?: (arg: Value[Property], property: Property, value: Value) => void
}

export interface ITableOptions<Value> {
    columns: IColumnSpecification<Value, keyof Value>[];
}

// Define a few Alias function
// const TableRow: FunctionalComponent = ({ children }) => (
//     <tr>{children}</tr>
// )

// const TableDataCell: FunctionalComponent = ({ children }) => (
//     <td>{children}</td>
// )

export function TableMenuItem<Value> (item: IMenuTemplate<Value[], ITableOptions<Value>>): JSX.Element {
    if (item.getter === undefined) return <div></div>

    return <div class="form-group-item table-item">
        <label>{item.label}</label>
        <table>
            <Header />
            <tbody>
            {
                item.getter().map((value) => {
                    return <tr>
                        {
                            item.options?.columns.map(column => {
                                const val = value[column.property];

                                // utilize MenuTemplate passed into column
                                if (typeof column.type  === "function") {
                                    console.log("constructor", column.type);
                                    const item = column.type(value, column);
                                    return <td>{
                                        (item.type(item))
                                    }</td>
                                }

                                if (typeof val === "string") {
                                    return <td onInput={(event: Event) =>{
                                        if (column.editable !== undefined &&  column.editable && column.setter !== undefined) {
                                            column.setter(
                                                (event.target as HTMLTableDataCellElement).innerText as unknown as Value[keyof Value],
                                                column.property,
                                                value
                                            );
                                        }
                                    }}>{val}</td>
                                }
                            })
                        }
                    </tr>             
                })
            }
            </tbody>
        </table>
    </div>

    function Header() {
        return <thead>
            <tr>
                {item.options?.columns.map(column => (
                    <th>{column.name}</th>
                ))}
            </tr>
        </thead>;
    }
}

export class Table<Value> extends MenuTemplate<Value[], ITableOptions<Value>> {
    public type = TableMenuItem;
    public label: string;
    public options: ITableOptions<Value>;
    public getter: () => Value[];
    public setter: undefined;

    constructor(label: string, options: ITableOptions<Value>, getter: () => Value[]) {
        super();
        this.label = label;
        this.options = options;
        this.getter = getter;
    }
}
