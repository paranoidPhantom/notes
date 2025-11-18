import { asSitemapUrl, defineSitemapEventHandler } from "#imports";

export default defineSitemapEventHandler(async (event) => {
    const items = await queryCollection(event, "content").all();
    return items
        .filter((c) => !c.path.endsWith(".navigation"))
        .map((c) => {
            return asSitemapUrl({
                loc: c.path,
                lastmod: c.updatedAt,
            });
        });
});
