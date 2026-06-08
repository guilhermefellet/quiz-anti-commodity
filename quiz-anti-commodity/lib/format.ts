/**
 * Extrai o primeiro nome de um nome completo e aplica capitalização:
 * primeira letra maiúscula, restante minúscula. Usa locale pt-BR para
 * preservar corretamente caracteres acentuados.
 *
 * Exemplos:
 *   "joão silva"  -> "João"
 *   "JOÃO SILVA"  -> "João"
 *   "  maria  "   -> "Maria"
 *   "ana paula"   -> "Ana"
 *   "ÁLVARO"      -> "Álvaro"
 */
export function capitalizeFirstName(fullName: string): string {
  if (!fullName) {
    return "";
  }

  const trimmed = fullName.trim();
  if (!trimmed) {
    return "";
  }

  const firstToken = trimmed.split(/\s+/)[0];
  if (!firstToken) {
    return "";
  }

  const lower = firstToken.toLocaleLowerCase("pt-BR");
  const firstChar = lower.charAt(0).toLocaleUpperCase("pt-BR");
  const rest = lower.slice(1);

  return `${firstChar}${rest}`;
}
