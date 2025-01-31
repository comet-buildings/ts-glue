import type { User, UsersRepository } from "./users";

const users = [{ id: crypto.randomUUID(), name: "John" }] as User[];
export const fakeUsersRepository: UsersRepository = {
  find: async (userId) => users.find((user) => user.id === userId),
};
