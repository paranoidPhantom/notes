import Fuse from "fuse.js";

export default defineEventHandler(async (event) => {
    const { query } = getQuery(event);

    const content = await queryCollectionSearchSections(event, "content");

    const fuse = new Fuse(content, {
        keys: ["content", "title"],
        includeMatches: true,
        includeScore: true,
    });

    const result = fuse.search(query as string);

    return result.slice(0, 5);
});
