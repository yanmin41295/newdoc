import {getInstance} from "ts-indexdb";
import {Repository} from "./Repository";
import {C, Condition, matchAll} from "./condition";


export class IndexRepository<T extends { id: number }> implements Repository<T> {
    private readonly tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    /**
     * 通过主键查询
     * @param id 主键id值
     */
    async findById(id: number) {
        return await getInstance().query_by_primaryKey<T>({
            tableName: this.tableName,
            value: id,
        });
    }

    async findByIds(ids: number[]) {
        let data = await getInstance().query<T>({
            tableName: this.tableName,
            condition: item => ids.includes(item.id)
        });
        data.sort((a, b) => a.id - b.id)
        return data;
    }

    /**
     * 查询所有
     */
    async findAll(param: Condition<T>) {
        let data = await getInstance().query<T>({
            tableName: this.tableName,
            condition: item => matchAll(item, param),
        });
        data.sort((a, b) => a.id - b.id)
        return data;
    }

    async findPage(param: Condition<T>, page: { pageSize: number, pageNum: number }) {
        let data = await this.findAll(param);
        let start = (page.pageNum - 1) * page.pageSize;
        let end = page.pageSize * page.pageNum - 1;
        let result = {
            count: data.length,
            page: [] as T[]
        };
        if (data.length >= end) {
            result.page = data.slice(start, end + 1);
        } else if (data.length > start) {
            result.page = data.slice(start, data.length);
        }
        return result;
    }


    /**
     * 通过主键更新
     * @param data 要更新的实体
     */
    async save(data: T | Partial<Exclude<T, "id">>) {
        if ("id" in data && data["id"]) {
            console.log("update ", data)
            await getInstance().update<T>({
                tableName: this.tableName,
                condition: item => item.id === data.id,
                handle: row => {
                    for (let dataKey in data) {
                        // @ts-ignore
                        row[dataKey] = data[dataKey];
                    }
                    return row;
                }
            });
        } else {
            console.log("insert ", data)
            delete data["id"];
            delete data["$id"]
            console.log("save ", data)
            await getInstance().insert({
                tableName: this.tableName,
                data
            });
        }

    }


    async batchSave(data: T[]) {
        for (let datum of data) {
            await this.save(datum)
        }
    }

    async batchUpdate(data: Partial<Exclude<T, 'id'>>, param?: Condition<T>) {

    }

    async deleteById(id: number) {
        await getInstance().delete_by_primaryKey<T>({
            tableName: this.tableName,
            value: id
        })
    }


    async deleteByIds(ids: number[]) {
        await getInstance().delete<T>({
            tableName: this.tableName,
            condition: item => ids.includes(item.id)
        })
    }

    async batchDelete(param: Condition<T>) {
        await getInstance().delete<T>({
            tableName: this.tableName,
            condition: item => matchAll(item, param),
        })
    }

}