interface CurrentUser {
  email: string;
  id: string;
}

interface CurrentUserResponse {
  currentUser: CurrentUser | null;
}

interface SignInRequestBody {
  email: string;
  password: string;
}

interface SignInResponse {
  email: string;
  id: string;
}

interface SignUpRequestBody {
  email: string;
  password: string;
}

interface SignUpResponse {
  email: string;
  id: string;
}

interface SignOutRequestBody {}

interface SignOutResponse {}
