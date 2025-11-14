/**
 * Represents a chunk of text with highlight information
 */
export interface TextChunk {
    text: string;
    highlighted: boolean;
}

/**
 * Represents a Fuse.js match object
 */
export interface FuseMatch {
    indices: Array<[number, number]>;
    value?: string;
    key?: string;
}

/**
 * Represents a Fuse.js search result item
 */
export interface FuseResult<T> {
    item: T;
    refIndex: number;
    score?: number;
    matches?: FuseMatch[];
}

/**
 * Processes Fuse.js result object and returns chunks of text with highlight information.
 * Only includes text within 15 characters of any highlighted section.
 *
 * @param fuseResult - A Fuse.js search result object with matches
 * @param contextRadius - Number of characters to include around highlighted sections (default: 15)
 * @returns Array of text chunks with highlighted and non-highlighted segments
 *
 * @example
 * const result = fuse.search("query")[0];
 * const chunks = getHighlightedChunks(result);
 * // Returns chunks with highlighted matches and surrounding context
 */
export function getHighlightedChunks<T = any>(
    fuseResult: FuseResult<T> | undefined,
    contextRadius: number = 15
): TextChunk[] {
    if (!fuseResult?.matches || fuseResult.matches.length === 0) {
        return [];
    }

    // Combine all matches and their text values
    const allChunks: TextChunk[] = [];

    for (const match of fuseResult.matches) {
        const text = match.value;
        if (!text || !match.indices || match.indices.length === 0) {
            continue;
        }

        const chunks = processMatchIndices(match.indices, text, contextRadius);
        allChunks.push(...chunks);
    }

    return allChunks;
}

/**
 * Helper function to process indices for a single match
 */
function processMatchIndices(
    indices: Array<[number, number]>,
    text: string,
    contextRadius: number
): TextChunk[] {
    if (!indices || indices.length === 0 || !text) {
        return [];
    }

    // Sort ranges by start position
    const highlightRanges = [...indices]
        .sort((a, b) => b[1] - b[0] - (a[1] - a[0]))
        .slice(0, 3);

    // Merge overlapping highlight ranges
    const mergedHighlights: Array<[number, number]> = [];
    if (highlightRanges.length === 0) {
        return [];
    }

    let current = highlightRanges[0]!;

    for (let i = 1; i < highlightRanges.length; i++) {
        const next = highlightRanges[i]!;
        if (next[0] <= current[1] + 1) {
            // Overlapping or adjacent, merge them
            current = [current[0], Math.max(current[1], next[1])];
        } else {
            mergedHighlights.push(current);
            current = next;
        }
    }
    mergedHighlights.push(current);

    // Expand ranges to include context (contextRadius characters on each side)
    const expandedRanges: Array<[number, number]> = mergedHighlights.map(
        ([start, end]) => [
            Math.max(0, start - contextRadius),
            Math.min(text.length - 1, end + contextRadius),
        ]
    );

    // Merge overlapping expanded ranges
    const mergedExpandedRanges: Array<[number, number]> = [];
    current = expandedRanges[0]!;

    for (let i = 1; i < expandedRanges.length; i++) {
        const next = expandedRanges[i]!;
        if (next[0] <= current[1] + 1) {
            current = [current[0], Math.max(current[1], next[1])];
        } else {
            mergedExpandedRanges.push(current);
            current = next;
        }
    }
    mergedExpandedRanges.push(current);

    // Build chunks for each expanded range
    const chunks: TextChunk[] = [];

    for (const [rangeStart, rangeEnd] of mergedExpandedRanges) {
        // Find all highlights within this range
        const relevantHighlights = mergedHighlights.filter(
            ([hStart, hEnd]) => hEnd >= rangeStart && hStart <= rangeEnd
        );

        let currentPos = rangeStart;

        for (const [hStart, hEnd] of relevantHighlights) {
            // Add non-highlighted text before this highlight (if any)
            if (currentPos < hStart) {
                chunks.push({
                    text: text.substring(currentPos, hStart),
                    highlighted: false,
                });
            }

            // Add highlighted text
            chunks.push({
                text: text.substring(hStart, hEnd + 1),
                highlighted: true,
            });

            currentPos = hEnd + 1;
        }

        // Add any remaining non-highlighted text in this range
        if (currentPos <= rangeEnd) {
            chunks.push({
                text: text.substring(currentPos, rangeEnd + 1),
                highlighted: false,
            });
        }

        // Add ellipsis between ranges (except after the last range)
        if (
            rangeEnd < text.length - 1 &&
            mergedExpandedRanges.indexOf([rangeStart, rangeEnd]) <
                mergedExpandedRanges.length - 1
        ) {
            chunks.push({
                text: "...",
                highlighted: false,
            });
        }
    }

    // Add ellipsis at the start if we don't start at position 0
    const firstRange = mergedExpandedRanges[0];
    if (firstRange && firstRange[0] > 0) {
        chunks.unshift({
            text: "...",
            highlighted: false,
        });
    }

    // Add ellipsis at the end if we don't end at the last character
    const lastRange = mergedExpandedRanges[mergedExpandedRanges.length - 1];
    if (lastRange && lastRange[1] < text.length - 1) {
        chunks.push({
            text: "...",
            highlighted: false,
        });
    }

    return chunks;
}
