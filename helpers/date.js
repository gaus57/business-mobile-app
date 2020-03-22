/**
 *
 * @param {int} time
 * @returns {string}
 */
export function dateText(time) {
  return (new Date(time)).toLocaleDateString()
}

/**
 *
 * @param {int} time
 * @returns {string}
 */
export function timeText(time) {
  return (new Date(time)).toLocaleTimeString()
}

/**
 *
 * @param {int} time
 * @returns {string}
 */
export function dateTimeText(time) {
  return `${dateText(time)} ${timeText(time)}`
}
