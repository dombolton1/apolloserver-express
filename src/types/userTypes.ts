export type User = {
  id: string;
  username: string;
};

export type UserWithToken = User & {
  token: string;
};

export type UserArgs = {
  username: string;
  password: string;
};