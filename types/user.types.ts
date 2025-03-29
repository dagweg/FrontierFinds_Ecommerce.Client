interface AuthenticationResult {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly token: string;
}

type AddressResult = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

type ProfileImageResult = {
  url: string;
  objectIdentifier: string;
} | null; //  Allow null, as per original data

type UserResult = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: AddressResult;
  accountVerified: boolean;
  profileImage: ProfileImageResult;
};
