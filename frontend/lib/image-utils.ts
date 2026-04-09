export function shouldBypassImageOptimization(src?: string | null): boolean {
  if (!src) {
    return false
  }

  return src.startsWith("data:") || src.startsWith("blob:")
}