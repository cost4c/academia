export const validarAluno = ({ nome, email, idade }) => {
  if (!nome || nome.length < 3) return "Nome deve ter pelo menos 3 caracteres";
  if (!email || !email.includes("@")) return "Email inválido";
  if (!idade || idade <= 0) return "Idade deve ser maior que 0";
  return null;
};
