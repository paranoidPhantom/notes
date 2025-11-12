import { defineTransformer } from "@nuxt/content";

export default defineTransformer({
    name: "split-latex",
    extensions: [".md"], // File extensions to apply this transformer to
    transform(file) {
        function addBreaksAfterMjx(node: any, depth: number = 0): any {
            if (!Array.isArray(node) || depth > 4) return node;

            // Check if array has mjx-hidden marker and remove it
            let startIndex = 0;
            if (
                node.length > 2 &&
                typeof node[2] === "string" &&
                node[2].startsWith("mjx-hidden")
            ) {
                startIndex = 1;
                // Return early without adding breaks if mjx-hidden is present
                return node
                    .slice(1)
                    .map((el: any) => addBreaksAfterMjx(el, depth + 1));
            }

            const result: any[] = [];
            for (let i = 0; i < node.length; i++) {
                const element = node[i];

                if (Array.isArray(element)) {
                    // Check if this is an mjx-container before recursing
                    const isMjxContainer = element[0] === "mjx-container";

                    // Recurse into the element
                    result.push(addBreaksAfterMjx(element, depth + 1));

                    // If this element is an mjx-container, check if next element is also mjx-container or text starting with \n
                    if (isMjxContainer) {
                        const nextElement = node[i + 1];
                        const isNextMjx =
                            Array.isArray(nextElement) &&
                            nextElement[0] === "mjx-container";
                        const isNextTextWithNewline =
                            typeof nextElement === "string" &&
                            nextElement.startsWith("\n");

                        if (isNextMjx || isNextTextWithNewline) {
                            result.push(["br", {}]);
                        }
                    }
                } else {
                    result.push(element);
                }
            }

            return result;
        }

        if (Array.isArray(file.body?.value)) {
            file.body.value = addBreaksAfterMjx(file.body.value);
        }

        return file;
    },
});
