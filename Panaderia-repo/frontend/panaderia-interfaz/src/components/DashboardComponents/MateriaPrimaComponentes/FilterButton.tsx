import { fetchCategoriasMateriaPrima, fetchUnidadesMedida } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import type { MateriaPrimaList } from "@/lib/types";

type UnidadMedida = {
    id: number;
    nombre_completo: string;
    abreviatura: string;
}

type CategoriaMateriaPrima = {
    id: number;
    nombre_categoria: string;
    descripcion: string | null;
}

export default function FilterButton() {
    const [categorias, setCategorias] = useState<CategoriaMateriaPrima[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

    const { listaMateriaPrimaCached, setListaMateriaPrimaFiltered, 
        MPFilteredInputSearchApplied,
        listaMateriaPrimaFilteredInputSearch,
        setFilteredApplied, filteredApplied,
        setInputfilterDoubleApplied,
    } = useAppContext();

    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showFilterContent, setShowFilterContent] = useState<boolean>(false);
    const [showCategorias, setShowCategorias] = useState<boolean | null>(null);
    const [showUnidadesMedida, setShowUnidadesMedida] = useState<boolean | null>(null);
    const [showFechaCreacion, setShowFechaCreacion] = useState<boolean | null>(null);
    const [isDateInputActive, setIsDateInputActive] = useState(false);

    const filterButtonRef = useRef<HTMLDivElement>(null);

    // Data fetching effect
    useEffect(() => {
        const fetchData = async () => {
            const [categorias, unidades] = await Promise.all([
                fetchCategoriasMateriaPrima(),
                fetchUnidadesMedida()
            ]);
            setCategorias(categorias);
            setUnidadesMedida(unidades);
        };
        fetchData();
    }, []);

    // Click outside handler
    useEffect(() => {
        if (!showFilter) return; // Only add listener when filter is shown

        const handleClickOutside = (event: MouseEvent) => {
            if (filterButtonRef.current && !filterButtonRef.current.contains(event.target as Node)) {
                setShowFilter(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showFilter]); // Only re-run when showFilter changes

const filtrarCategorias = (id: number) => {
        const categoria = categorias.find(categoria => categoria.id === id);
        let listaFiltrada: MateriaPrimaList[] = [];
        if (categoria) {

            if (MPFilteredInputSearchApplied) {
                listaFiltrada = listaMateriaPrimaFilteredInputSearch.filter(materiaPrima => materiaPrima.category === categoria.nombre_categoria);
                setInputfilterDoubleApplied(true);
            } else {
                listaFiltrada = listaMateriaPrimaCached.filter(materiaPrima => materiaPrima.category === categoria.nombre_categoria);
            }

            setListaMateriaPrimaFiltered(listaFiltrada);
            setFilteredApplied(true);
            setShowFilter(false);
        }
    }

    const filtrarUnidadesMedida = (id: number) => {
        const unidadMedida = unidadesMedida.find(unidadMedida => unidadMedida.id === id);
        let listaFiltrada: MateriaPrimaList[] = [];
        if (unidadMedida) {

            if (MPFilteredInputSearchApplied) {
                listaFiltrada = listaMateriaPrimaFilteredInputSearch.filter(materiaPrima => materiaPrima.unit === unidadMedida.nombre_completo);
                setInputfilterDoubleApplied(true);
            } else {
                listaFiltrada = listaMateriaPrimaCached.filter(materiaPrima => materiaPrima.unit === unidadMedida.nombre_completo);
            }

            setListaMateriaPrimaFiltered(listaFiltrada);
            setFilteredApplied(true);
            setShowFilter(false);
        } 
    }

    const printCategorias = () => {
        const elementos = <>
            {categorias.map((categoria, index) => (
                <li key={index} onClick={() => filtrarCategorias(categoria.id)}
                className="flex items-center gap-2 py-2 px-2 font-semibold font-[Roboto] hover:bg-gray-200 cursor-pointer rounded-md">
                    {categoria.nombre_categoria}
                </li>
            ))}
        </>
        return elementos;
    }

    const printUnidadesMedida = () => {
        const elementos = <>
            {unidadesMedida.map((categoria, index) => (
                <li key={index} onClick={() => filtrarUnidadesMedida(categoria.id)}
                    className="flex items-center gap-2 py-2 px-2 font-semibold font-[Roboto] hover:bg-gray-200 cursor-pointer rounded-md">
                    {categoria.nombre_completo}
                </li>
            ))}
        </>
        return elementos;
    }

    const filtrarFechaCreacion = () => {
        const fechaDesde = document.getElementById("fechaDesde") as HTMLInputElement || null;
        const fechaHasta = document.getElementById("fechaHasta") as HTMLInputElement || null;
        let listaFiltrada: MateriaPrimaList[] = [];

        const fechaDesdeValue = fechaDesde?.value ? new Date(fechaDesde.value) : null;
        const fechaHastaValue = fechaHasta?.value ? new Date(fechaHasta.value) : null;

        const fechaFiltrada = (fechaCreacion: Date) => {
                if (fechaDesdeValue && fechaHastaValue) {

                    return fechaCreacion >= fechaDesdeValue && fechaCreacion <= fechaHastaValue;
                } else if (fechaDesdeValue && !fechaHastaValue) {

                    return fechaCreacion >= fechaDesdeValue;
                } else if (!fechaDesdeValue && fechaHastaValue) {

                    return fechaCreacion <= fechaHastaValue;
                }
        }

        if (MPFilteredInputSearchApplied) {

            listaFiltrada = listaMateriaPrimaFilteredInputSearch.filter((materiaprima)=>{
                const fechaCreacion = new Date(materiaprima.creationDate);
                return fechaFiltrada(fechaCreacion);
            })
        } else {

            listaFiltrada = listaMateriaPrimaCached.filter((materiaprima)=>{
                const fechaCreacion = new Date(materiaprima.creationDate);
                return fechaFiltrada(fechaCreacion);
            })
        }

        setListaMateriaPrimaFiltered(listaFiltrada);
        setFilteredApplied(true);
        setShowFilter(false);
        
    }

    const printFechaCreacion = () => {
        const elementos = <>
            <div className="flex flex-col gap-6 p-2 font-[Roboto] rounded-md">
                <div className="flex flex-col gap-7">
                    <div>
                        <label htmlFor="fechaDesde" className="font-semibold">Desde: </label>
                        <div>
                            <input 
                                className="border-3 w-full border-gray-300 rounded-md p-1 cursor-pointer focus:outline-blue-500 focus:outline-3" 
                                id="fechaDesde" 
                                type="date"
                                onFocus={() => setIsDateInputActive(true)}
                                onBlur={() => setIsDateInputActive(false)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="fechaHasta" className="font-semibold">Hasta: </label>
                        <div>
                            <input 
                                className="border-3 w-full border-gray-300 rounded-md p-1 cursor-pointer focus:outline-blue-500 focus:outline-3" 
                                id="fechaHasta" 
                                type="date"
                                onFocus={() => setIsDateInputActive(true)}
                                onBlur={() => setIsDateInputActive(false)}
                            />
                        </div>
                    </div>
                </div>
                <button onClick={filtrarFechaCreacion} className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">
                    Filtrar
                </button>
            </div>
        </>
        return elementos;
    }

    const mouseEnterCategorias = () => {
        setShowFilterContent(true);
        setShowCategorias(true);
        setShowUnidadesMedida(false);
        setShowFechaCreacion(false);
    }

    const mouseEnterUnidadesMedida = () => {
        setShowFilterContent(true);
        setShowUnidadesMedida(true);
        setShowCategorias(false);
        setShowFechaCreacion(false);
    }

    const mouseEnterFechaCreacion = () => {
        setShowFilterContent(true);
        setShowFechaCreacion(true);
        setShowCategorias(false);
        setShowUnidadesMedida(false);
    }

    const resetearFiltros = () => {
        setListaMateriaPrimaFiltered([]);
        setInputfilterDoubleApplied(false);
        setFilteredApplied(false);
        setShowFilter(false);
        setInputfilterDoubleApplied(false);
        setIsDateInputActive(false);
    }

    return (
        <div ref={filterButtonRef} 
            onMouseLeave={(e) => {
                if (!isDateInputActive) {
                    const relatedTarget = e.relatedTarget as Node | null;
                    if (!relatedTarget || !filterButtonRef.current?.contains(relatedTarget)) {
                        setShowFilterContent(false);
                    }
                }
            }} 
            className="relative">
            <button
                type="button"
                className="flex gap-2 items-center bg-blue-500 cursor-pointer transition-colors duration-200 p-2 rounded-md hover:bg-blue-600 font-semibold font-[Roboto] text-white"
                onClick={() => setShowFilter(prev => !prev)}
            >
                <img src="/DashboardAssets/Menu.svg" alt="Menu" />
                Filtros
            </button>

            {showFilter && (
                <div className="absolute top-12 left-[50%] translate-x-[-75%]">
                    {showFilterContent && (
                        <ul className={`absolute top-0 right-0 translate-x-[-45%] w-55 p-2 border bg-white rounded-md shadow-2xl border-gray-300`}>
                            {showCategorias && printCategorias()}
                            {showUnidadesMedida && printUnidadesMedida()}
                            {showFechaCreacion && printFechaCreacion()}
                        </ul>
                    )}

                    <ul className="absolute top-0 left-0 translate-x-[-50%] flex flex-col gap-2 p-2 bg-white rounded-md shadow-2xl w-50 border border-gray-300">
                        <li onMouseEnter={mouseEnterCategorias} className="flex items-center gap-2 p-2 font-semibold font-[Roboto] hover:bg-gray-200 cursor-pointer rounded-md">
                            <img src="/DashboardAssets/FilledLeftArrow.svg" alt="Menu" />
                            Categoría
                        </li>
                        <li onMouseEnter={mouseEnterUnidadesMedida} className="flex items-center gap-2 p-2 font-semibold font-[Roboto] hover:bg-gray-200 cursor-pointer rounded-md">
                            <img src="/DashboardAssets/FilledLeftArrow.svg" alt="Menu" />
                            Unidad de medida
                        </li>
                        <li onMouseEnter={mouseEnterFechaCreacion} className="flex items-center gap-2 p-2 font-semibold font-[Roboto] hover:bg-gray-200 cursor-pointer rounded-md">
                            <img className="size-6" src="/DashboardAssets/Filtro.svg" alt="Menu" />
                            Fecha de creación
                        </li>
                        <li onClick={() => {
                            if (filteredApplied) {
                                resetearFiltros();
                            }
                        }}
                        className={`flex items-center gap-2 p-2 font-semibold font-[Roboto] hover:bg-gray-200 rounded-md ${filteredApplied ? 'text-black cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}>
                            Resetear filtros
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}