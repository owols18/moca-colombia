// For native anchors/location only. next/link adds basePath automatically.
export function publicHref(href: string | undefined) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!href || !basePath || !href.startsWith("/") || href.startsWith("//") ||
    href === basePath || href.startsWith(`${basePath}/`)) return href;
  return `${basePath}${href}`;
}
