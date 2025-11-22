import { Repository, FindOptionsWhere, DeepPartial, ObjectLiteral } from "typeorm";
import { myDataSource } from "../../data-source";

export abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
    constructor(private entityClass: new () => T) {
        super(
            entityClass,
            myDataSource.manager,
            myDataSource.manager.queryRunner
        )
    }

    async findById(id: number | string): Promise<T | null> {
        return this.findOne({where: {id}} as any)
    }

    async findByIdOrFail(id: number | string): Promise<T> {
        const entity = await this.findById(id)
        if (!entity) {
            throw new Error(`${this.entityClass.name} with id ${id} not found`)
        }
        return entity
    }

    async createEntity(data: DeepPartial<T>): Promise<T> {
        const entity = this.create(data)
        return this.save(entity)
    }

    async updateEntity (id: number | string, data: DeepPartial<T>): Promise<T> {
        const entity = await this.findByIdOrFail(id)
        Object.assign(entity, data)
        return this.findByIdOrFail(id)
    }

    async softDeleteEntity(id: number | string): Promise<void> {
        await this.softDelete(id)
    }

    async deleteEntity(id: number | string): Promise<void> {
        await this.delete(id)
    }

    async restoreEntity(id: number | string): Promise<void> {
        await this.restore(id)
    } 
}