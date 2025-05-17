export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === "/login") return;

  const { fetchUser, setUser } = useDirectusAuth();
  const user = useDirectusUser();
  const { expires, refreshTokens } = useDirectusToken();

  try {
    const currentTime = Date.now();
    const expiresTime = expires.value;
    const remainingTime = expiresTime - currentTime;

    if (remainingTime <= 60000) {
      await refreshTokens();
    }
  } catch (e) {
    return navigateTo("/login");
  }

  if (!user.value) {
    const fetchedUser = await fetchUser();
    setUser(fetchedUser.value);
    
    if (!fetchedUser) {
      return navigateTo("/login");
    }
  }
});