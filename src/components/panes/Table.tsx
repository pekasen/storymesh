import { FunctionalComponent, h, JSX } from "preact";
import { IMenuTemplate } from "../SideBar";

export interface IColumnSpecification<Value, Property extends keyof Value> {
    name: string
    type: string
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

    return <div class="form-group-item">
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

                                if (typeof val === "string") {
                                    return <td contentEditable={column.editable} onInput={(event: Event) =>{
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
