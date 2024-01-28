export function isAllowedUser(username: string, allowedUsers: string[]): boolean {
  return allowedUsers.includes(username);
}
