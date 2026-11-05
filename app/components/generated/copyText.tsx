// Repair note: the clipped rail line at 820 is rendered by __root.tsx, which this repair cannot write.
// Content strings can arrive with a dash used as punctuation. Numeric ranges with an unspaced en dash stay as written.
const dashAsPunctuation = /\s*\u2014\s*|\s+\u2013\s+/g

export function sentence(text = '') {
  return text.replace(dashAsPunctuation, ', ')
}

export function openRange(text = '') {
  return text.replace(dashAsPunctuation, ' to ')
}
