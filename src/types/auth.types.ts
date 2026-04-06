export interface TokenPair {
  accessToken:  string;
  isFirstLogin: boolean;
  // refreshToken lives in an httpOnly cookie — never exposed to JS
}

export interface RegisterResult {
  email:           string;
  devVerifyToken?: string;
}
