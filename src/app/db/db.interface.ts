export interface IAdmin {
  name: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;
}

export enum Role {
  ADMIN,
  USER,
  SUPER_ADMIN,
  TEACHER,
}
