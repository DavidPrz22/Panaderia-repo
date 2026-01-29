import { useEffect, useReducer, useMemo } from "react";

import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import {
  EditarIcon,
  BorrarIcon,
  CerrarIcon,
  PlussignIcon,
} from "@/assets/DashboardAssets";
import { TubeSpinner } from "@/assets";
import { Paginator } from "@/components/Paginator";

import Button from "../../../components/Button";
import Title from "@/components/Title";
import { LotesTable } from "./Lotes/LotesTable";
import { DeleteComponent } from "./DeleteComponent";
import MateriaPrimaFormShared from "./MateriaPrimaFormShared";
import { LotesMateriaPrimaFormShared } from "./Lotes/LotesMateriaPrimaFormShared";
import { LotesMateriaPrimaDetalles } from "./Lotes/LotesMateriaPrimaDetalles";

import { useDeleteMateriaPrimaMutation } from "../hooks/mutations/materiaPrimaMutations";
import { useLotesMateriaPrimaQuery } from "../hooks/queries/queries";
import { TitleDetails } from "@/components/TitleDetails";
import { DetailsTable } from "./DetailsTable";

import { useAuth } from "@/context/AuthContext";
import { userHasPermission } from "@/features/Authentication/lib/utils";


export const MaterialPrimaDetalles = () => {
  const {
    showMateriaprimaDetalles,
    setShowMateriaprimaDetalles,
    materiaprimaId,
    materiaprimaDetalles,
    setMateriaprimaDetalles,
    registroDelete,
    setRegistroDelete,
    updateRegistro,
    setUpdateRegistro,
    showLotesForm,
    setShowLotesForm,
    lotesForm,
    setLotesForm,
    showLotesMateriaPrimaDetalles,
  } = useMateriaPrimaContext();

  const { user } = useAuth();
  console.log(materiaprimaDetalles);
  const { mutateAsync: deleteMateriaPrima, isPending } =
    useDeleteMateriaPrimaMutation(handleClose, materiaprimaId!);

  const {
    data: lotesPagination,
    fetchNextPage,
    hasNextPage,
    isFetching: isLoadingLotes,
    isFetched: isFetchedLotes
  } = useLotesMateriaPrimaQuery(materiaprimaId, showMateriaprimaDetalles);

  type PaginatorActions = "next" | "previous" | "base";

  const [page, setPage] = useReducer(
    (state: number, action: { type: PaginatorActions; payload?: number }) => {
      switch (action.type) {
        case "next":
          if (lotesPagination) {
            // Check if we have more pages already fetched or need to fetch
            // logic: if state < pages.length - 1, just increment
            // if state == pages.length - 1 and hasNextPage, fetch and increment (after fetch? infinite query handles fetch)
            // Ideally we wait for fetch. But useInfiniteQuery appends to pages.

            if (state < lotesPagination.pages.length - 1) return state + 1;
            if (hasNextPage) fetchNextPage();
            return state + 1;
          }
          return state;

        case "previous":
          return state - 1;

        case "base":
          if (lotesPagination) {
            if (
              action.payload! > lotesPagination.pages.length - 1 ||
              action.payload! < 0
            ) {
              if (hasNextPage) fetchNextPage();
              if (action.payload! > lotesPagination.pages.length) {
                // if jumping far ahead, infinite query might need to fetch multiple times?
                // Standard paginator usually jumps to specific page. Infinite query is linear.
                // But here we use infinite query to simulate pagination.
                // Django returns "next" url with page number. useInfiniteQuery uses it.
                // For jump to page X, we can't easily do it with Infinite Query unless we fetch all intermediate pages.
                // BUT the Paginator component allows clicking specific pages.
                // If user clicks Page 5, and we only have Page 1, we can't jump easily with infinite query.
                // The plan assumes sequential or we accept fetching.
                // If Paginator shows available pages based on `count`, clicking Page 5 implies we want Page 5.
                // Getting Page 5 with InfiniteQuery requires fetching 2, 3, 4.

                // However, for this task, I'll stick to the plan's logic which says:
                // "return state + 1" for base case if out of bounds? That looks weird in the plan.
                // Plan line 191: `return state + 1;`

                // Let's implement the reducer as per plan.
                return state + 1;
              }
            }
            return action.payload!;
          }
          return state;

        default:
          return state;
      }
    },
    0
  );

  useEffect(() => {
    const lotesTable = lotesPagination?.pages?.[page]?.results || [];
    setLotesForm(lotesTable);
  }, [lotesPagination, page, setLotesForm]);

  const pages_count = useMemo(() => {
    if (!lotesPagination?.pages?.[0]) return 0;
    const result_count = lotesPagination.pages[0].count || 0;
    // Assuming page size is 15 as per backend.
    // Or derive from results length? results.length might be < 15 on last page.
    const entry_per_page = 15;
    return Math.ceil(result_count / entry_per_page);
  }, [isFetchedLotes, lotesPagination]);

  if (!showMateriaprimaDetalles) return <></>;

  function handleClose() {
    setShowMateriaprimaDetalles(false);
    setMateriaprimaDetalles(null);
    setUpdateRegistro(false);
  }

  const handleCloseUpdate = () => {
    setUpdateRegistro(false);
  };

  const userCanEdit = userHasPermission(user!, 'materias_primas', 'edit')
  const userCanDelete = userHasPermission(user!, 'materias_primas', 'delete')
  const userCanAddLot = userHasPermission(user!, 'materias_primas', 'view')

  if (showLotesMateriaPrimaDetalles) {
    return <LotesMateriaPrimaDetalles />;
  }

  if (showLotesForm) {
    return (
      <LotesMateriaPrimaFormShared
        title="Nuevo Lote"
        onClose={() => {
          setShowLotesForm(false);
          setShowMateriaprimaDetalles(true);
        }}
        onSubmitSuccess={() => {
          setShowLotesForm(false);
          setShowMateriaprimaDetalles(true);
        }}
      />
    );
  }

  if (updateRegistro && materiaprimaDetalles) {
    return (
      <MateriaPrimaFormShared
        isUpdate={true}
        initialData={materiaprimaDetalles}
        title="Editar Materia Prima"
        onClose={handleCloseUpdate}
        onSubmitSuccess={() => {
          handleClose();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 mx-8 border border-gray-200 p-5 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center">
        <Title>{materiaprimaDetalles?.nombre || "-"}</Title>
        <div className="flex gap-2">
          {userCanEdit && (
            <Button type="edit" onClick={() => setUpdateRegistro(true)}>
              <div className="flex items-center gap-2">
                Editar
                <img src={EditarIcon} alt="Editar" />
              </div>
            </Button>
          )}

          {userCanDelete && (
            <Button
              type="delete"
              onClick={() => {
                setRegistroDelete(true);
              }}
            >
              <div className="flex items-center gap-2">
                Eliminar
                <img src={BorrarIcon} alt="Eliminar" />
              </div>
            </Button>
          )}
          <div className="ml-6">
            <Button type="close" onClick={handleClose}>
              <img src={CerrarIcon} alt="Cerrar" />
            </Button>
          </div>
        </div>
      </div>

      {registroDelete && materiaprimaId !== null && (
        <DeleteComponent
          deleteFunction={() => deleteMateriaPrima(materiaprimaId!)}
          isLoading={isPending}
        />
      )}
      <div className="flex flex-col gap-6">
        <TitleDetails>Detalles</TitleDetails>
        {materiaprimaDetalles && (
          <DetailsTable materiaprimaDetalles={materiaprimaDetalles} />
        )}
      </div>

      <div className="flex flex-col gap-4 mt-5 h-full">
        <div className="flex justify-between items-center pr-5">
          <Title extraClass="text-blue-600">Lotes de materia prima</Title>
          {userCanAddLot && (
            <Button
              type="add"
              onClick={() => {
                setShowLotesForm(true);
              }}
            >
              <div className="flex items-center gap-2">
                Agregar Lote
                <img
                  className="p-0.5 border border-white rounded-full size-7"
                  src={PlussignIcon}
                  alt="agregar"
                />
              </div>
            </Button>
          )}
        </div>
        {isLoadingLotes ? (
          <div className="flex justify-center items-center h-full rounded-md border border-gray-300">
            <img src={TubeSpinner} alt="Cargando..." className="size-28" />
          </div>
        ) : lotesForm.length > 0 ? (
          <>
            <LotesTable lotes={lotesForm} />
            {pages_count > 1 && (
              <Paginator
                previousPage={page > 0}
                nextPage={hasNextPage || page < pages_count - 1}
                pages={Array.from({ length: pages_count }, (_, i) => i)}
                currentPage={page}
                onClickPrev={() => setPage({ type: "previous" })}
                onClickPage={(p) => setPage({ type: "base", payload: p })}
                onClickNext={() => setPage({ type: "next" })}
              />
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-full rounded-md border border-gray-300">
            <p className="text-lg text-gray-500 font-bold font-[Roboto] p-3">
              No hay lotes registrados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
