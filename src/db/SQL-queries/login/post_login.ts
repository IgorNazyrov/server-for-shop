export const POST_LOGIN = `
SELECT * FROM users
WHERE email = $1
`