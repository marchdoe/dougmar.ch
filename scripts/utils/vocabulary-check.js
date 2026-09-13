/**
 * The check every enumerated declaration block shares: each field present
 * and inside its vocabulary, with one error per miss that names the field,
 * the value and the values allowed. type-grammar.js, motion-grammar.js and
 * header-grammar.js each carried a copy (#506 added the third).
 *
 * @param {Record<string, unknown>} decl a parsed block
 * @param {Record<string, string[]>} fields field name to allowed values
 * @returns {string[]} errors, empty when every field passes
 */
export function checkVocabulary(decl, fields) {
  const errors = []
  for (const [field, allowed] of Object.entries(fields)) {
    const value = decl[field]
    if (value === undefined || value === null || value === '') {
      errors.push(`missing field: ${field}`)
    } else if (!allowed.includes(value)) {
      errors.push(`invalid ${field}: "${value}" (expected one of: ${allowed.join(', ')})`)
    }
  }
  return errors
}
