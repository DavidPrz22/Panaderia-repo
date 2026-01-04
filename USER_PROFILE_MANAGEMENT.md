# Feature: User Profile Management

## Overview
The User Profile Management feature allows authenticated users to view their account information and update sensitive data such as their username, email, and password. This feature enhances security and personalization within the Panaderia System.

## Requirements

### 1. User Information Display
- Users can view their current profile details:
    - **Full Name** (Editable)
    - **Username** (Editable)
    - **Email** (Editable)
    - **Role** (Read-only, assigned by admin)

### 2. Profile Updates
- **Username Change**: Allow users to update their username, ensuring it remains unique across the system.
- **Email Change**: Allow users to update their email address with validation.
- **Password Modification**: A secure way to update the account password, requiring the current password for verification.
- **Feedback**: Provide success/error notifications (Toasts) when updates are performed.

### 3. Header Dropdown (Quick Access)
- The header's `HeaderUserButton` is enhanced with a dropdown/popup.
- **Quick Display**: Shows the user's Full Name, Email, and Role.
- **Actions**:
    - **"Configuración de Perfil"**: Redirects to the full management panel.
    - **"Cerrar Sesión"**: Quick access to log out.

### 4. Management Panel
- A dedicated view/panel accessible via the dropdown.
- Divided into sections: "Información General" and "Seguridad (Cambiar Contraseña)".
- Uses **Shadcn UI** components (Card, Input, Button, Label) for a premium look and feel.

## Technical Specification

### Current Implementation Context
- **Backend Model**: Based on the `User` model in `apps.users.models.User`, which tracks `username`, `email`, `full_name`, and `rol`.
- **Authentication**: Managed via JWT (vía `AuthContext` on the frontend).
- **Frontend State**: The `user` object is globally available in `AuthContext.tsx`.

### Proposed Backend Endpoints
- `GET /api/users/me/`: Retrieve current user data (can reuse login/refresh payload or create specific endpoint).
- `PATCH /api/users/me/`: Update profile details (Full name, username, email).
- `POST /api/users/me/set_password/`: Specific endpoint for changing password.

### Frontend Architecture
- **Feature Location**: `src/features/UserProfile/`
- **Mutations**: 
    - `useUpdateProfileMutation`: For general info changes.
    - `useChangePasswordMutation`: Specifically for password logic.
- **UI Components**:
    - `ProfileDropdownMenu.tsx`: To be integrated into `HeaderUserButton.tsx`.
    - `ProfileSettingsPanel.tsx`: The main management interface.
