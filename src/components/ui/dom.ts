export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Partial<Record<string, string>> = {},
  children: (Node | string)[] = []
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined) continue;
    if (k === 'class') e.className = v;
    else e.setAttribute(k, v);
  }
  for (const c of children) e.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return e;
}

export function clear(node: HTMLElement): void { while (node.firstChild) node.removeChild(node.firstChild); }
