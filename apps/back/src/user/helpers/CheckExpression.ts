export const MatchPass = (password: string): boolean => {
  const regex = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{3,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/,
  );
  return regex.test(password);
};
