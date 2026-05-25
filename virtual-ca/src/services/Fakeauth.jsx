// Fake Auth System (Frontend only)

export const signup = (data) => {
  localStorage.setItem("user", JSON.stringify(data));
  return Promise.resolve(data);
};

export const login = (phone) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.phone === phone) {
    localStorage.setItem("isLoggedIn", "true");
    return Promise.resolve(user);
  } else {
    return Promise.reject("User not found");
  }
};

export const logout = () => {
  localStorage.removeItem("isLoggedIn");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};