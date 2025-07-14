export const errorTranslations: { [key: string]: string } = {
    // User authentication related
    "user with this username already exists.": "Ya existe un usuario con este nombre de usuario.",
    "This field may not be blank.": "Este campo no puede estar en blanco.",
    "Enter a valid email address.": "Introduce una dirección de correo electrónico válida.",
    "user with this email already exists.": "Ya existe un usuario con este correo electrónico.",
    "The two password fields didn't match.": "Las contraseñas no coinciden.",
    "Password must be at least 8 characters long.": "La contraseña debe tener al menos 8 caracteres.",
    "This password is too common.": "Esta contraseña es demasiado común.",
    "Users with this Rol are not allowed.": "No se permiten usuarios con este Rol.",
    "Ensure this field has no more than 150 characters.": "Asegúrese de que este campo no tenga más de 150 caracteres.",
    "Username must contain only letters, numbers, and @/./+/-/_ characters.": "El nombre de usuario solo puede contener letras, números y los caracteres @/./+/-/_.",
    "This field is required.": "Este campo es requerido.",
    "Enter a valid value.": "Introduce un valor válido.",
    // Materia Prima related
    "materias primas with this nombre already exists.": "Ya existe una materia prima con este nombre.",
    "materias primas with this SKU already exists.": "Ya existe una materia prima con este SKU.",
    "A valid number is required.": "Se requiere un número válido.",
    "Invalid pk value.": "Valor de ID inválido.",
    'Invalid pk "0" - object does not exist.': "Selecciona una categoría.",
};

export const translateApiError = (englishError: string): string => {
    return errorTranslations[englishError] || englishError;
}; 