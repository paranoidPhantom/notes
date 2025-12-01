export default defineOAuthYandexEventHandler({
    async onSuccess(event, { user }) {
        await setUserSession(event, {
            user: {
                yandexId: user.id,
                avatarUrl: `https://avatars.yandex.net/get-yapic/${user.default_avatar_id}/islands-200`,
                name: user.display_name ?? user.real_name,
            },
        });
        return sendRedirect(event, "/");
    },
    // Optional, will return a json error and 401 status code by default
    onError(event, error) {
        console.error("Yandex OAuth error:", error);
        return sendRedirect(event, "/");
    },
});
