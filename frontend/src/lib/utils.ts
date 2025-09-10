export const countries = [
    'Philippines',
    'Singapore',
    'United States',
    'Canada',
    'Australia',
    'United Kingdom',
    'Japan',
]

export const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email)
