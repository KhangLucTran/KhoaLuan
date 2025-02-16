export const saveAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAuthTokens = () => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
});

export const clearAuthTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
