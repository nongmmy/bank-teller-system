export type User = {
  id: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'USER';
};
