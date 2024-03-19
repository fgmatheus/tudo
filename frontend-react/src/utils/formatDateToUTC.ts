export function formatDateToUTC(date: string) {
  const formattedDate = new Date(date);
  const offset = formattedDate.getTimezoneOffset(); // Obtém o offset em minutos
  formattedDate.setMinutes(formattedDate.getMinutes() + offset); // Ajusta para UTC+0
  return formattedDate.toISOString().slice(0, 19) + "Z"; // Retorna a data no formato UTC+0
}
