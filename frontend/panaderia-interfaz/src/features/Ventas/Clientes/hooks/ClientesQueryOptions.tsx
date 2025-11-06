import { useQuery } from '@tanstack/react-query';
import { searchClientes, getClientes } from '@/features/Ventas/Clientes/api/api';

export const DEBOUNCE_DELAY = 300;

export const clientesSearchOptions = (query: string, enabled: boolean = false) => {
    return useQuery({
        queryKey: ['clientesSearch', query],
        queryFn: () => searchClientes(query),
        enabled: enabled && query.length >= 2,
        staleTime: 1000 * 60 * 5,
        select: (data) => {
            if (!data || !Array.isArray(data)) return { results: [] };
            const lowerQuery = query.toLowerCase();
            const filtered = data.filter((item: any) => {
                if (item.nombre_cliente && item.nombre_cliente.toLowerCase().includes(lowerQuery)) return true;
                if (item.apellido_cliente && item.apellido_cliente.toLowerCase().includes(lowerQuery)) return true;
                if (item.email && item.email.toLowerCase().includes(lowerQuery)) return true;
                if (item.telefono && item.telefono.toLowerCase().includes(lowerQuery)) return true;
                if (item.rif_cedula && item.rif_cedula.toLowerCase().includes(lowerQuery)) return true;
                return false;
            });
            return { results: filtered };
        }
    })
};

export const clientesListOptions = () => {
    return useQuery({
        queryKey: ['clientesList'],
        queryFn: () => getClientes(),
        staleTime: 1000 * 60 * 5,
    });
};

export default {};
