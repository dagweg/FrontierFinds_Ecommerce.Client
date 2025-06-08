export interface AuthenticationResult {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly token: string;
}

export interface AddressResult {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ProfileImageResult {
  url: string;
  objectIdentifier: string;
}

export interface UserResult {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: AddressResult;
  accountVerified: boolean;
  profileImage: ProfileImageResult | null;
}
