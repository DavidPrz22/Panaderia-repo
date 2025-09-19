import React from "react";
import type { KeyboardEvent } from "react";
import type { MateriaPrimaList } from "@/features/MateriaPrima/types/types";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import { XIcon, SearchIcon } from "@/assets/DashboardAssets";

export default function SearchInput() {
  const {
    searchInputRef,
    listaMateriaPrimaCached,
    listaMateriaPrimaFiltered,
    MPFilteredInputSearchApplied,
    filteredApplied,
    inputfilterDoubleApplied,
    setListaMateriaPrimaFiltered,
    setListaMateriaPrimaFilteredInputSearch,
    setMPFilteredInputSearchApplied,
    setFilteredApplied,
    setInputfilterDoubleApplied,
  } = useMateriaPrimaContext();

  const handleSearchInputChange = (
    e: KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    if ("key" in e && e.key !== "Enter") return;

    const searchValue = searchInputRef.current?.value;

    if (searchValue === "") {
      setListaMateriaPrimaFilteredInputSearch([]);
      setMPFilteredInputSearchApplied(false);
      return;
    }

    let filteredMateriaPrimaByName: MateriaPrimaList[] = [];

    if (filteredApplied) {
      filteredMateriaPrimaByName = listaMateriaPrimaFiltered.filter(
        (materiaprima) =>
          materiaprima.name
            .toLowerCase()
            .includes(searchValue?.toLowerCase() || ""),
      );
    } else if (listaMateriaPrimaCached.length > 0) {
      filteredMateriaPrimaByName = listaMateriaPrimaCached.filter(
        (materiaprima) =>
          materiaprima.name
            .toLowerCase()
            .includes(searchValue?.toLowerCase() || ""),
      );
    }

    if (inputfilterDoubleApplied) {
      setListaMateriaPrimaFiltered(filteredMateriaPrimaByName);
    } else {
      setListaMateriaPrimaFilteredInputSearch(filteredMateriaPrimaByName);
    }
    setMPFilteredInputSearchApplied(true);
  };

  const handleResetSearch = () => {
    if (inputfilterDoubleApplied) {
      // resetear filtros de categorias y unidades de medida en caso de que se haya aplicado un filtro doble
      setListaMateriaPrimaFiltered([]);
      setInputfilterDoubleApplied(false);
      setFilteredApplied(false);
    }
    setListaMateriaPrimaFilteredInputSearch([]);
    setMPFilteredInputSearchApplied(false);
    searchInputRef.current!.value = "";
  };

  return (
    <div className="w-[400px] shadow-sm bg-white rounded-full flex items-center justify-between gap-4 p-1 relative border border-gray-200">
      <div className="flex-1 pl-4">
        <input
          id="searchInput"
          type="text"
          placeholder="Buscar materia prima..."
          className="font-semibold font-[Roboto] outline-none w-full"
          ref={searchInputRef}
          onKeyDown={handleSearchInputChange}
        />
      </div>
      {MPFilteredInputSearchApplied && (
        <button
          onClick={handleResetSearch}
          className="absolute right-[13%] flex items-center justify-center p-0.5 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 "
        >
          <img className="size-4" src={XIcon} alt="X" />
        </button>
      )}

      <button
        className="bg-blue-500 cursor-pointer transition-colors duration-200 p-2 rounded-full hover:bg-blue-600"
        onClick={handleSearchInputChange}
      >
        <img src={SearchIcon} alt="Search" />
      </button>
    </div>
  );
}
