import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../hooks/mutations";

export const ProfileSettingsPanel = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
  } = useUpdateProfileMutation();
  const {
    mutate: changePassword,
    isPending: isChangingPassword,
  } = useChangePasswordMutation();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !email) return;

    updateProfile({
      full_name: fullName,
      username,
      email,
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }

    setPasswordError(null);

    changePassword(
      {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-6 font-[Roboto]">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Configuración de Perfil
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Actualiza tu información personal y gestiona la seguridad de tu cuenta.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {/* Información General */}
          <Card className="border border-gray-300 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={handleSaveProfile}
                noValidate
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name">Nombre completo</Label>
                    <Input
                      id="full_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-gray-50 focus-visible:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Nombre de usuario</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="bg-gray-50 focus-visible:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-50 focus-visible:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="rol">Rol</Label>
                    <Input
                      id="rol"
                      value={user?.rol ?? ""}
                      disabled
                      className="bg-gray-100 text-gray-700"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Seguridad */}
          <Card className="border border-gray-300 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Seguridad (Cambiar Contraseña)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={handleChangePassword}
                noValidate
              >
                <div className="space-y-1.5">
                  <Label htmlFor="current_password">Contraseña actual</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-gray-50 focus-visible:ring-blue-200"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="new_password">Nueva contraseña</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-gray-50 focus-visible:ring-blue-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm_password">
                      Confirmar nueva contraseña
                    </Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-50 focus-visible:ring-blue-200"
                    />
                  </div>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-600">{passwordError}</p>
                )}
                <div className="flex justify-end mt-4">
                  <Button
                    type="submit"
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword
                      ? "Actualizando contraseña..."
                      : "Actualizar contraseña"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};