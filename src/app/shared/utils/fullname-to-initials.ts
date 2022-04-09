export function fullNameToInitials(fullName: string): string {
  const [firstName, lastName] = fullName.split(' ');

  return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}
