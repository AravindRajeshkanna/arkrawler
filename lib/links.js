/**
 * Extracts unique absolute (http/https) links from a crawled page's Cheerio
 * instance. Kept dependency-free (only needs the `$` handed to us) so it can
 * be unit tested without a live crawl or Redis connection.
 */
export function extractAbsoluteLinks($) {
    const links = new Set();
    $("a[href^='http']").each(function extractHref() {
        const href = $(this).attr('href');
        if (href) {
            links.add(href);
        }
    });
    return [...links];
}
