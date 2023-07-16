import {IndexRepository} from "./IndexRepository";
import {TableConfig} from "./TableConfig";
import {init} from "ts-indexdb";

export type C<T extends string | number | boolean = string | number | boolean> = T extends string ? "like" | "left like" | "right like" | "=" :
    T extends number ? "<" | "<=" | "=" | ">" | ">=" :
        T extends boolean ? "=" :
            never;

export type Condition<T extends { id: number } & { [key: string]: string | number | boolean }> = {
    [key in keyof T]?: {
        condition: C<T[key]>;
        value: T[key];
    }
}

export async function initDb() {

    await init({
        dbName: "list_table",        // database name
        version: 2,             // version number
        tables: [
            {
                tableName: "t_table_config",         // table name
                option: {keyPath: "id", autoIncrement: true}, // specify the primary key as "id"
                indexs: [    // database indexes
                    {
                        key: "id",
                        option: {
                            unique: true
                        }
                    },
                    {
                        key: "name",
                    },
                ]
            },
            {
                tableName: "t_table_data",         // table name
                option: {keyPath: "id", autoIncrement: true}, // specify the primary key as "id"
                indexs: [    // database indexes
                    {
                        key: "id",
                        option: {
                            unique: true
                        }
                    },
                ]
            }
        ]
    })
}


export function matchAll<T extends { id: number }>(item: T, params: Condition<T>) {
    let flag = true;
    for (let key in params) {
        switch (params[key]!.condition as C) {
            case "=":
                flag = item[key] === params[key]!.value;
                break;
            case "<":
                flag = item[key] < params[key]!.value;
                break;
            case "<=":
                flag = item[key] <= params[key]!.value;
                break;
            case ">":
                flag = item[key] > params[key]!.value;
                break;
            case ">=":
                flag = item[key] >= params[key]!.value;
                break;
            case "left like":
                flag = (item[key] as string).startsWith(params[key]!.value as string);
                break;
            case "like":
                flag = (item[key] as string).includes(params[key]!.value as string);
                break;
            case "right like":
                flag = (item[key] as string).endsWith(params[key]!.value as string);
                break;
        }
        if (!flag) {
            break
        }
    }
    return flag;
}

export const tableConfigRepo = new IndexRepository<TableConfig>("t_table_config");

export const tableDataRepo = new IndexRepository<TableConfig>("t_table_data");