import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createCliente, updateCliente } from '@/features/Ventas/Clientes/api/api';
import { ClientesInputSchema, formatRif } from '@/features/Ventas/Clientes/schemas/schemas';
import { useQueryClient } from '@tanstack/react-query';
import { useClientContext } from '@/context/ClientContext';

export default function AggClientes({ onClear }: { onClear?: (v: any) => void } = {}): React.ReactElement {
	const { open, setOpen, loading, setLoading, error, setError, success, setSuccess, clientToEdit, setClientToEdit } = useClientContext();

	const queryClient = useQueryClient();

	// local form state
	const [nombre, setNombre] = useState('');
	const [apellido, setApellido] = useState('');
	const [telefono, setTelefono] = useState('');
	const [email, setEmail] = useState('');
	const [rifType, setRifType] = useState('V');
	const [rifNumber, setRifNumber] = useState('');
	const [notas, setNotas] = useState('');

	// timeout ref to clear on unmount
	const timeoutRef = useRef<number | null>(null);

	useEffect(() => {
		if (clientToEdit) {
			setNombre(clientToEdit.nombre_cliente);
			setApellido(clientToEdit.apellido_cliente);
			setTelefono(clientToEdit.telefono || '');
			setEmail(clientToEdit.email || '');
			const [type, ...numberParts] = (clientToEdit.rif_cedula || 'V-').split('-');
			setRifType(type);
			setRifNumber(numberParts.join('-'));
			setNotas(clientToEdit.notas || '');
		}
	}, [clientToEdit]);

	const limpiar = useCallback(() => {
		setNombre('');
		setApellido('');
		setTelefono('');
		setEmail('');
		setRifType('V');
		setRifNumber('');
		setNotas('');
		if (onClear) {
			try {
				onClear(null);
			} catch (e) {
				// ignore consumer errors
			}
		}
		setClientToEdit(null);
	}, [onClear, setClientToEdit]);

	// Format phone as 0424-5678965 while typing
	const handleTelefonoChange = (value: string) => {
		const digits = value.replace(/\D/g, '').slice(0, 11); // limit to 11 digits
		let formatted = digits;
		if (digits.length > 4) {
			formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
		}
		setTelefono(formatted);
	};

	const cerrar = () => {
		setOpen(false);
		setLoading(false);
		setError(null);
		setSuccess(false);
		limpiar();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// assemble payload and validate against centralized schema
		const rif_cedula = formatRif(rifType, rifNumber);
		const payload = {
			nombre_cliente: nombre,
			apellido_cliente: apellido,
			telefono: telefono || undefined,
			email: email || undefined,
			rif_cedula,
			notas: notas || undefined,
		};

		const result = ClientesInputSchema.safeParse(payload);
		if (!result.success) {
			const first = result.error.errors[0];
			setError(first.message || 'Error de validación');
			return;
		}

		setError(null);
		setLoading(true);
		try {
			if (clientToEdit) {
				await updateCliente(clientToEdit.id, result.data);
				setSuccess(true);
			} else {
				const finalPayload = {
					...result.data,
					fecha_registro: new Date().toISOString(),
				};
				await createCliente(finalPayload as any);
				setSuccess(true);
			}
			limpiar();
			queryClient.invalidateQueries({ queryKey: ['clientesList'] });
			timeoutRef.current = window.setTimeout(() => {
				cerrar();
			}, 900) as unknown as number;
		} catch (err: any) {
			setError(err?.message || (clientToEdit ? 'Error actualizando cliente' : 'Error creando cliente'));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-lg font-semibold">{clientToEdit ? 'Editar Cliente' : 'Registrar Cliente'}</h2>
							<button onClick={cerrar} className="text-gray-600 hover:text-gray-800">✕</button>
						</div>

						<form onSubmit={handleSubmit} className="space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="border px-3 py-2 rounded w-full" required />
								<input value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Apellido" className="border px-3 py-2 rounded w-full" required />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<input
									value={telefono}
									onChange={e => handleTelefonoChange(e.target.value)}
									placeholder="0424-5678965"
									inputMode="numeric"
									className="border px-3 py-2 rounded w-full"
									maxLength={12}
								/>
								<input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="border px-3 py-2 rounded w-full" />
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div className="flex gap-2">
									<select value={rifType} onChange={e => setRifType(e.target.value)} className="border px-3 py-2 rounded">
										<option value="V">V</option>
										<option value="J">J</option>
										<option value="G">G</option>
									</select>
									<input value={rifNumber} onChange={e => setRifNumber(e.target.value.replace(/\D/g, ''))} placeholder="Número de RIF/Cédula" className="border px-3 py-2 rounded w-full" required />
								</div>
								<input value={new Date().toLocaleDateString()} disabled className="border px-3 py-2 rounded w-full bg-gray-50" />
							</div>

							<div>
								<textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas" className="border px-3 py-2 rounded w-full" rows={3} />
							</div>

							{error && <div className="text-red-600">{error}</div>}
							{success && <div className="text-green-600">{clientToEdit ? 'Cliente actualizado con éxito' : 'Cliente creado con éxito'}</div>}

							<div className="flex justify-end gap-3">
								<button type="button" onClick={cerrar} className="px-4 py-2 bg-white border rounded">Cancelar</button>
								<button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
									{loading ? (clientToEdit ? 'Actualizando...' : 'Registrando...') : (clientToEdit ? 'Actualizar' : 'Registrar')}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}