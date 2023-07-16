import {Condition} from "./condition";

export interface Repository<T extends { id: number }> {

    /**
     * 通过主键查询
     * @param id 主键id值
     */
    findById(id: number): Promise<T>

    findByIds(id: number[]): Promise<T[]>

    /**
     * 查询所有
     */
    findAll(param: Condition<T>): Promise<T[]>

    /**
     * 查询所有
     */
    findPage(param: Condition<T>, page: { pageSize: number, pageNum: number }): Promise<{
        count: number, page: T[]
    }>

    /**
     * 通过主键更新
     * @param data 要更新的实体
     */
    save(data: T | Partial<Exclude<T, "id">>): void;

    batchSave(data: T[]): void;

    batchUpdate(data: Partial<Exclude<T, 'id'>>, param?: Condition<T>): void;

    deleteById(id: number): void;

    deleteByIds(ids: number[]): void;

    batchDelete(param: Condition<T>): void;
}