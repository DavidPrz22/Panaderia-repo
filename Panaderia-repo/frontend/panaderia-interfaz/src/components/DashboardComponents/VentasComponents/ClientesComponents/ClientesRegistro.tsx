import React, { useState, useEffect } from "react";
import type { Cliente } from "@/lib/types";

type ClienteForm = Omit<Cliente, "id" | "fecha_registro">;

interface ClientesRegistroProps {
  onSubmit: (data: ClienteForm) => void;
  clienteInicial?: ClienteForm | null;
  onCancel: () => void;
  disabled?: boolean;
}

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateTelefono = (telefono: string) => {
  return /^[0-9]{7,15}$/.test(telefono);
};

const validateRifCedula = (valor: string) => {
  return /^[VJEGP][0-9]{7,9}$/.test(valor.toUpperCase());
};

const ClientesRegistro: React.FC<ClientesRegistroProps> = ({
  onSubmit,
  clienteInicial,
  onCancel,
  disabled = false,
}) => {
  const [formData, setFormData] = useState<ClienteForm>({
    nombre_cliente: "",
    apellido_cliente: "",
    telefono: "",
    email: "",
    rif_cedula: "",
    notas: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ClienteForm, string>>
  >({});

  useEffect(() => {
    if (clienteInicial) {
      setFormData(clienteInicial);
    }
  }, [clienteInicial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // Limpiar error al escribir
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof ClienteForm, string>> = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido.";
    }
    if (!validateTelefono(formData.telefono)) {
      newErrors.telefono =
        "Ingrese un número de teléfono válido (solo números, mínimo 7 dígitos).";
    }
    if (!validateRifCedula(formData.rif_cedula)) {
      newErrors.rif_cedula =
        "Ingrese un RIF o cédula válido (ej: V12345678, J123456789).";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="nombre_cliente"
        value={formData.nombre_cliente}
        onChange={handleChange}
        required
        placeholder="Nombre"
        className="block w-full border rounded px-2 py-1"
      />
      <input
        name="apellido_cliente"
        value={formData.apellido_cliente}
        onChange={handleChange}
        required
        placeholder="Apellido"
        className="block w-full border rounded px-2 py-1"
      />
      <input
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        placeholder="Teléfono"
        className="block w-full border rounded px-2 py-1"
      />
      {errors.telefono && (
        <div className="text-red-500 text-sm">{errors.telefono}</div>
      )}
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="block w-full border rounded px-2 py-1"
      />
      {errors.email && (
        <div className="text-red-500 text-sm">{errors.email}</div>
      )}
      <input
        name="rif_cedula"
        value={formData.rif_cedula}
        onChange={handleChange}
        placeholder="RIF/Cédula"
        className="block w-full border rounded px-2 py-1"
      />
      {errors.rif_cedula && (
        <div className="text-red-500 text-sm">{errors.rif_cedula}</div>
      )}
      <input
        name="notas"
        value={formData.notas}
        onChange={handleChange}
        placeholder="Notas"
        className="block w-full border rounded px-2 py-1"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={disabled}
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
          disabled={disabled}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClientesRegistro;
