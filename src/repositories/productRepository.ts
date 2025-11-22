import { response } from "express";
import { Product } from "../entity/Product.entity";
import { BaseRepository } from "./base/BaseRepository";
import { ILike } from "typeorm";

export class productRepository extends BaseRepository<Product> {
    constructor() {
        super(Product)
    }

    async findByValueSearchInput (valueSearchInput: string): Promise<Product | Response | null> {
        if (!valueSearchInput) {
            return response.status(400).json({error: 'Empty query in search input'})
        }

        const [products, totalCount] = await this.findAndCount({
            where: [
                {title: ILike(`%${valueSearchInput}%`)},
                {description: ILike(`%${valueSearchInput}%`)},
            ],
            skip: offset
        })
    }
}