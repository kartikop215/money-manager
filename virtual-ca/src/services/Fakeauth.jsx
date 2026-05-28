export const isAuthenticated = () => {

  const token =
    localStorage.getItem("token");

  console.log("AUTH TOKEN:", token);

  return (
    token &&
    token !== "undefined" &&
    token !== "null"
  );
};

export const logout = () => {

  localStorage.clear();
};