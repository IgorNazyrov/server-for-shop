import { User } from "../entity/User.entity";
import { BaseRepository } from "./base/BaseRepository";

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super(User)
    }

    async findByEmail (email: string): Promise<User | null> {
        return this.findOne({where: { email }})
    }

    
}