export function formatSlug(slug) {
    if (!slug) return "";
  
    // le sacamos el "/" inicial si viene con él
    slug = slug.replace(/^\/+/, "");
  
    // decode por si tiene caracteres escapados
    slug = decodeURIComponent(slug);
  
    // separar por guiones
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalizar
      .join(" ");
  }

export function fromSlugToResortEnum(slug) {
  if (!slug) return "";
  
  // Convert to uppercase and replace hyphens with underscores
  return slug.toUpperCase().replace(/-/g, "_");
}
  
  