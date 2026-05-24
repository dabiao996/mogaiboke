import { resourcesData, type ResourceItem } from "../data/resources";

export type ResourceSummary = ResourceItem;

export function getAllResources() {
  return [...resourcesData].sort((a, b) => {
    if (a.recommended === b.recommended) return a.name.localeCompare(b.name);
    return a.recommended ? -1 : 1;
  });
}

export function getResourceBySlug(slug: string) {
  return getAllResources().find((item) => item.slug === slug) || null;
}

export function getResourceCategories(resources = getAllResources()) {
  const counts = new Map<string, number>();
  resources.forEach((item) => counts.set(item.category, (counts.get(item.category) || 0) + 1));
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

export function getResourceTags(resources = getAllResources()) {
  const counts = new Map<string, number>();
  resources.forEach((item) => item.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1)));
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
