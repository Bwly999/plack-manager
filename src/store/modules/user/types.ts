export type RoleType = '' | '*' | 'admin' | 'user';
// export interface UserState {
//   name?: string;
//   avatar?: string;
//   job?: string;
//   organization?: string;
//   location?: string;
//   email?: string;
//   introduction?: string;
//   personalWebsite?: string;
//   jobName?: string;
//   organizationName?: string;
//   locationName?: string;
//   phone?: string;
//   registrationDate?: string;
//   accountId?: string;
//   certification?: number;
//   role: RoleType;
//   shopId?: string;
// }

export interface Shop {
  id: string;
  name: string;
  orderIdList: string[];
}
export interface UserState {
  id?: string;
  username?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  shop?: Shop;
  role: RoleType;
}
