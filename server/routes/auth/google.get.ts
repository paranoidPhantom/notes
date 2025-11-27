export default defineOAuthGoogleEventHandler({
    async onSuccess(event, { user }) {
        await setUserSession(event, {
            user: {
                googleId: user.sub,
                avatarUrl: user.picture,
                name: `${user.given_name} ${user.family_name ?? ""}`.trim(),
            },
        });
        return sendRedirect(event, "/");
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error("Google OAuth error:", error);
        return sendRedirect(event, "/");
    },
});
