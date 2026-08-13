/**
 * Retorna uma data futura em dia útil (segunda a sexta).
 * @param {number} daysAhead - Quantidade de dias à frente para começar a busca.
 * @returns {string} Data no formato YYYY-MM-DD
 */
function getNextWeekday(daysAhead = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().split('T')[0];
}

/**
 * Retorna a data do próximo sábado.
 * @returns {string} Data no formato YYYY-MM-DD
 */
function getNextSaturday() {
  const date = new Date();
  date.setDate(date.getDate() + ((6 - date.getDay() + 7) % 7 || 7));
  return date.toISOString().split('T')[0];
}

/**
 * Retorna a data do próximo domingo.
 * @returns {string} Data no formato YYYY-MM-DD
 */
function getNextSunday() {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7 || 7));
  return date.toISOString().split('T')[0];
}

module.exports = { getNextWeekday, getNextSaturday, getNextSunday };
