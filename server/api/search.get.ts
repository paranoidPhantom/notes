import Fuse from "fuse.js";
import { findPageBreadcrumb } from "@nuxt/content/utils";

export default defineEventHandler(async (event) => {
    const { query } = getQuery(event);

    const content = await queryCollectionSearchSections(event, "content");
    const navigation = await queryCollectionNavigation(event, "content");

    const fuse = new Fuse(content, {
        keys: ["content", "title"],
        includeMatches: true,
        includeScore: true,
    });

    const result = fuse.search(query as string);

    return result.slice(0, 5).map((r) => ({
        ...r,
        item: {
            ...r.item,
            titles: [
                ...findPageBreadcrumb(navigation, r.item.id).map(
                    (p) => p.title
                ),
                ...r.item.titles,
            ],
        },
    }));
});
