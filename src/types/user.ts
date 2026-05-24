export type User = {
  name: string;
  email: string;
  phone: string;
  imageProfile: string | null;
  roles: string[];

  address: {
    city: string;
    state: string;
    street: string;
    zip: string;
  };
};