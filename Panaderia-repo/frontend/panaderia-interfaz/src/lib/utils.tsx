import {
  API,
  type UnidadMedida,
  type CategoriaMateriaPrima,
  type LoteMateriaPrimaFormSumit,
  type MateriaPrimaListServer,
  type LoteMateriaPrimaFormResponse,
  type emptyLoteMateriaPrima,
} from "./types";

import type {
  TLoginUserSchema,
  TMateriaPrimaSchema,
  TRegisterUserSchema,
} from "./schemas";
import type { Cliente } from "./types";

// lOGIN API CALL
export const handleLogin = async (data: TLoginUserSchema) => {
  const validationResponse = await fetch(
    `${API}/api/users/validate-credentials/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!validationResponse.ok) {
    const errorData = await validationResponse.json();
    console.error(errorData);
    return { errorData, status: validationResponse.status, failed: true };
  }

  const response = await fetch(`${API}/api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    return { errorData, status: response.status, failed: true };
  }

  const dataResponse = await response.json();
  return dataResponse;
};

// REGISTER API CALL
export const handleRegister = async (data: TRegisterUserSchema) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { repeatpassword, ...registerData } = data;
  const response = await fetch(`${API}/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { errorData, status: response.status, failed: true };
  }

  const dataResponse = await response.json();
  return dataResponse;
};

// CACHES MATERIA PRIMA CATEGORIAS Y UNIDADES DE MEDIDA
let unidadesMedidaCache: UnidadMedida[] | null = null;
let categoriasMPCache: CategoriaMateriaPrima[] | null = null;

// UNIDADES DE MEDIDA API CALL
export const fetchUnidadesMedida = async () => {
  if (unidadesMedidaCache) {
    return unidadesMedidaCache;
  }
  const response = await fetch(`${API}/api/unidades-medida/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  const dataResponse = await response.json();
  unidadesMedidaCache = dataResponse;
  return dataResponse;
};

// CATEGORIAS DE MATERIA PRIMA API CALL
export const fetchCategoriasMateriaPrima = async () => {
  if (categoriasMPCache) {
    return categoriasMPCache;
  }

  const response = await fetch(`${API}/api/categorias-materiaprima/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  const dataResponse = await response.json();
  categoriasMPCache = dataResponse;
  return dataResponse;
};

// Function to clear the cache when needed (e.g., after creating new items or on logout)
export function clearCaches(): void {
  unidadesMedidaCache = null;
  categoriasMPCache = null;
}

// APIC CALL FOR MATERIA PRIMA
export const handleMateriaPrima = async (
  data: TMateriaPrimaSchema,
  id?: number
) => {
  const isUpdate = id !== undefined;

  const url = isUpdate
    ? `${API}/api/materiaprima/${id}/`
    : `${API}/api/materiaprima/`;
  const method = isUpdate ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { errorData, status: response.status, failed: true };
  }

  const dataResponse = await response.json();
  return dataResponse;
};

// CACHES MATERIA PRIMA
let materiaprimaListCached: MateriaPrimaListServer[] | null = null;

// API CALL FOR MATERIA PRIMA LIST
export const handleMateriaPrimaList = async () => {
  if (materiaprimaListCached) {
    return materiaprimaListCached;
  }
  console.log("fetching materiaprima list");
  const response = await fetch(`${API}/api/materiaprima/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  const dataResponse = await response.json();
  materiaprimaListCached = dataResponse;
  return dataResponse;
};

// CLEAR CACHE MATERIA PRIMA LIST
export const clearMateriaPrimaListCache = () => {
  materiaprimaListCached = null;
};

// CACHE FOR MATERIA PRIMA PK
const materiaprimaPKCached: MateriaPrimaListServer[] = [];

// CLEAR CACHE MATERIA PRIMA PK
export const clearMateriaPrimaPKCache = () => {
  materiaprimaPKCached.length = 0;
};

// API CALL FOR MATERIA PRIMA LIST
export const handleMateriaPrimaPK = async (pk: number) => {
  if (materiaprimaPKCached.length > 0) {
    const dataAlreadyCached = materiaprimaPKCached.find(
      (item: MateriaPrimaListServer) => item.id === pk
    );
    if (dataAlreadyCached) {
      return materiaprimaPKCached;
    }
  }

  const response = await fetch(`${API}/api/materiaprima/${pk}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  const dataResponse = await response.json();
  materiaprimaPKCached.push(dataResponse);
  return dataResponse;
};

// API CALL FOR DELETE MATERIA PRIMA
export const handleDeleteMateriaPrima = async (pk: number) => {
  const response = await fetch(`${API}/api/materiaprima/${pk}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  // For DELETE requests, we don't expect any content in the response
  if (response.status === 204) {
    return { success: true };
  }
};

// CACHE FOR LOTES MATERIA PRIMA
const lotesMateriaPrimaCached: (
  | LoteMateriaPrimaFormResponse
  | emptyLoteMateriaPrima
)[] = [];

// CLEAR CACHE LOTES MATERIA PRIMA
export const clearLoteMateriaPrimaCache = () => {
  lotesMateriaPrimaCached.length = 0;
};

// API CALL FOR LOTES MATERIA PRIMA LIST
export const handleLotesMateriaPrimaLotes = async (pk?: number) => {
  if (lotesMateriaPrimaCached.length > 0) {
    const dataAlreadyCached = lotesMateriaPrimaCached.find(
      (item: LoteMateriaPrimaFormResponse | emptyLoteMateriaPrima) =>
        item.materia_prima === pk
    );

    if (dataAlreadyCached) {
      return lotesMateriaPrimaCached;
    }
  }
  const url = pk
    ? `${API}/api/lotesmateriaprima/?materia_prima=${pk}`
    : `${API}/api/lotesmateriaprima/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }
  const dataResponse = await response.json();

  if (dataResponse.length > 0) {
    lotesMateriaPrimaCached.push(...dataResponse);
    return dataResponse;
  }

  if (pk) {
    lotesMateriaPrimaCached.push({ materia_prima: pk, empty: true });
  }

  return null;
};

// API CALL FOR CREATE LOTE MATERIA PRIMA
export const handleCreateUpdateLoteMateriaPrima = async (
  data: LoteMateriaPrimaFormSumit,
  id?: number
) => {
  const isUpdate = id !== undefined;

  const url = isUpdate
    ? `${API}/api/lotesmateriaprima/${id}/`
    : `${API}/api/lotesmateriaprima/`;
  const method = isUpdate ? "PUT" : "POST";

  // Format dates to YYYY-MM-DD
  const formattedData = {
    ...data,
    fecha_recepcion: data.fecha_recepcion.toISOString().split("T")[0],
    fecha_caducidad: data.fecha_caducidad.toISOString().split("T")[0],
  };

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formattedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  const dataResponse = await response.json();
  return { dataResponse, success: true };
};

// API CALL FOR PROVEEDORES
export const handleProveedores = async () => {
  const response = await fetch(`${API}/api/proveedores/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }

  const dataResponse = await response.json();
  return dataResponse;
};

// API CALL FOR DELETE LOTE MATERIA PRIMA
export const handleDeleteLoteMateriaPrima = async (pk: number | undefined) => {
  if (!pk) {
    return { success: false };
  }
  const response = await fetch(`${API}/api/lotesmateriaprima/${pk}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }
  return { success: true };
};

// API CALL FOR ACTIVATE LOTE MATERIA PRIMA
export const handleActivateLoteMateriaPrima = async (
  pk: number | undefined
) => {
  if (!pk) {
    return { success: false };
  }
  const response = await fetch(`${API}/api/lotesmateriaprima/${pk}/activate/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }
  return { success: true };
};

// CLIENTES API CALLS

export const handleClientesList = async (): Promise<Cliente[]> => {
  const response = await fetch(`${API}/api/clientes/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Error al obtener clientes");
  return await response.json();
};

export const handleCrearCliente = async (
  data: Omit<Cliente, "id" | "fecha_registro">
) => {
  const response = await fetch(`${API}/api/clientes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear cliente");
  return await response.json();
};

export const handleActualizarCliente = async (
  id: number,
  data: Omit<Cliente, "id" | "fecha_registro">
) => {
  const response = await fetch(`${API}/api/clientes/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar cliente");
  return await response.json();
};

export const handleEliminarCliente = async (id: number) => {
  const response = await fetch(`${API}/api/clientes/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar cliente");
  return true;
};
