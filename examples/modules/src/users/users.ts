export type User = { id: string; name: string };

export type UsersRepository = {
  find: (userId: string) => Promise<User | undefined>;
};
