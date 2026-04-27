export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginReq {
  username: string;
  password: string;
}

export interface LoginResp {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenReq {
  refreshToken: string;
}

export interface RefreshTokenResp {
  accessToken: string;
  refreshToken?: string;
}