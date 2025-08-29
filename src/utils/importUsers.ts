import { myDataSource } from "../data-source";
import { User } from "../entity/User.entity";
import { genSalt, hash } from "bcrypt";

async function importUsers(reviewerName: string, reviewerEmail: string) {
  try {
    const usersRepository = myDataSource.getRepository(User);
    const existingUser = await usersRepository.findOne({
      where: { email: reviewerEmail },
    });

    if (existingUser) {
      console.log(`This user already exist: ${reviewerEmail}`);
      return existingUser;
    }

    if (!process.env.SYSTEM_PASSWORD) {
      throw new Error("process.env.SYSTEM_PASSWORD equal undefined");
    }

    const salt = await genSalt(10);
    const user = new User();
    user.username = reviewerName;
    user.passwordHash = await hash(process.env.SYSTEM_PASSWORD, salt);
    user.email = reviewerEmail;
    user.lastLogin = new Date();

    await usersRepository.save(user);
    console.log(`imported: ${user.email}`);
    return user;
  } catch (err) {
    console.error("Error in import user: ", err);
  }
}

export { importUsers };
