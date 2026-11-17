const blockTags = new Set([
  'address',
  'article',
  'blockquote',
  'br',
  'div',
  'h1',
  'h2',
  'h3',
  'hr',
  'li',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'td',
  'th',
  'tr',
  'ul'
]);

const ignoredTags = new Set([
  'noscript',
  'script',
  'style',
  'template'
]);

function collectText(node, parts) {
  if (node.nodeType === 3) {
    parts.push(node.nodeValue || '');
    return;
  }

  if (node.nodeType !== 1 && node.nodeType !== 11) {
    return;
  }

  const tagName = node.nodeType === 1
    ? node.tagName.toLowerCase()
    : '';

  if (ignoredTags.has(tagName)) {
    return;
  }

  const isBlock = blockTags.has(tagName);

  if (isBlock) {
    parts.push(' ');
  }

  node.childNodes.forEach(child => collectText(child, parts));

  if (isBlock) {
    parts.push(' ');
  }
}

export function htmlToText(html) {
  if (typeof html !== 'string' || !html) {
    return '';
  }

  const template = document.createElement('template');
  template.innerHTML = html;

  const parts = [];
  collectText(template.content, parts);

  return parts.join('').replace(/\s+/g, ' ').trim();
}
