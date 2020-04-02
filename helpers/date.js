/**
 *
 * @param {int|Date} time
 * @returns {string}
 */
export function dateText(time) {
  const date = time instanceof Date ? time : new Date(time);
  return date.toLocaleDateString().replace(/([\d]{2})\/([\d]{2})\//, '$2.$1.');
}

/**
 *
 * @param {int|Date} time
 * @returns {string}
 */
export function timeText(time) {
  const date = time instanceof Date ? time : new Date(time);
  return date.toLocaleTimeString().replace(/:[\d]+$/, '');
}

/**
 *
 * @param {int} time
 * @returns {string}
 */
export function dateTimeText(time) {
  return `${dateText(time)} ${timeText(time)}`
}

/**
 *
 * @param {Date} date
 * @returns {Date}
 */
export function ceilDate(date) {
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 *
 * @param {Date} date
 * @returns {Date}
 */
export function floorDate(date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 *
 * @param {Date} date
 * @returns {Date}
 */
export function floorMonth(date) {
  date.setDate(1);
  return floorDate(date);
}
