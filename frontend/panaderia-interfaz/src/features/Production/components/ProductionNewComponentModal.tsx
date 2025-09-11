import { Glass, Plus, UpDown, Xmark } from "../../../assets/GeneralIcons/Index";
import { useProductionContext } from "@/context/ProductionContext";
import { useComponentesProductionSearchMutation } from "../hooks/mutations/mutations.ts";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner.tsx";
import Button from "@/components/Button";
import React, { useEffect, useState } from "react";
import '@/styles/animations.css';

import { ProductionSearchListContent } from "./ProductionSearchContent.tsx";

export const ProductionNewComponentModal = () => {

  const { 
    showNewComponentModal, 
    setShowNewComponentModal, 
    isClosingModal, 
    setIsClosingModal, 
    componentSearchList, 
    setComponentSearchList, 
    showComponentSearch, 
    setShowComponentSearch,
    newComponentSelected
  } = useProductionContext();

  const [ isClosingSearch , setIsClosingSearch] = useState(false)
  const [ error, setError ] = useState(false)

  const {
      mutateAsync: componentesProductionSearchMutation,
      isPending: isComponenteSearchPending,
  } = useComponentesProductionSearchMutation();

  const handleClose = () => {
    setIsClosingModal(true);
  }

  const handleAnimationEnd = () => {
    if (isClosingModal) {
      setIsClosingModal(false);
      setShowNewComponentModal(false);
    }
  }

  useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") handleClose();
      };
  
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

  const handleBackdropClick = (element: React.MouseEvent<HTMLDivElement>) => {
    if (element.target === element.currentTarget) handleClose();
  };

  const handleOnSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === '' ) {
      setComponentSearchList([])
      return;
    }
    componentesProductionSearchMutation(event.target.value);
  };


  if (!showNewComponentModal) return <></>;

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-(--z-index-over-header-bar) ${isClosingModal ? "animate-fadeOutModal" : "animate-fadeInModal"}`}
      onClick={handleBackdropClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`space-y-6 px-8 py-10 border border-gray-200 rounded-lg bg-white mt-6 shadow-md relative w-7/12 font-[Roboto] ${isClosingModal ? "animate-fadeOut" : "animate-fadeIn"}`}>
        <button className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-150" onClick={() => handleClose()}>
          <Xmark/>
        </button>

        <div className="text-gray-800 font-bold">
          <Plus className="inline-block mr-2" />
          Selecciona un producto para ver sus componentes
        </div>

        <div className="mt-4 flex flex-col gap-2 relative">
          <div>Componente: </div>
          <div 
            onClick={() => {
              if (!showComponentSearch) {
                setShowComponentSearch(true)
              } else {
                setIsClosingSearch(true)
              }
            }}
            className="flex items-center justify-between border border-gray-200 p-2 cursor-pointer rounded-md hover:bg-blue-500 hover:text-white hover:border-transparent transition-colors duration-150">
            <div>
              {newComponentSelected ? newComponentSelected.nombre : "Componente Seleccionado"}
            </div>
            <UpDown />
          </div>

          { showComponentSearch &&
            <div 
            onAnimationEnd={() => {
              if (isClosingSearch) {
                  setShowComponentSearch(false)
                  setIsClosingSearch(false)
                  setComponentSearchList([])
                }
              }
            }
            className={`absolute top-[106%] border border-gray-200 w-full rounded-md bg-white shadow-md ${ isClosingSearch ? "animate-fadeOut" : "animate-fadeIn" }`}>

              <div className="w-full border-b border-gray-200 flex gap-2 items-center p-3">
                <Glass className="size-5 text-gray-500" />
                <input 
                  onChange={handleOnSearch}
                  type="text" placeholder="Busca componente por nombre..." className="w-full outline-none border-none"/>
              </div>
              <div className="max-h-[180px] overflow-y-auto">
                { 
                isComponenteSearchPending ? (
                  <PendingTubeSpinner size={10} extraClass="p-1" />
                ) : 
                componentSearchList.length > 0 ? (
                  componentSearchList.map((item, index) => (
                    <ProductionSearchListContent
                        key={index}
                        category={Object.keys(item)[0]}
                        items={Object.values(item)[0]}
                      />
                        ))
                ) : (
                  <div className="px-4 py-2 text-gray-800 ">...</div>
                )}
                
              </div>
            </div>
          }
          </div>
        { newComponentSelected && (
          <>
            <div className="p-3 bg-gray-100 rounded-md">
              <div className="border border-gray-400 text-gray-500 p-1 rounded-2xl w-fit text-xs font-semibold">
                {newComponentSelected.tipo}
              </div>
              <div className="mt-2">
                <div className="font-medium text-md">
                  {newComponentSelected.nombre}
                </div>
                <div className="text-gray-600 text-sm">
                  stock disponible: {newComponentSelected.stock} {newComponentSelected.unidad_medida}
                </div>
              </div>
          </div>
  
            <div className="space-y-1">
              <div >
                Cantidad a usar ({newComponentSelected.unidad_medida}): 
              </div>
              <input 
                type="number" 
                className="border border-gray-200 p-2 rounded-md w-full focus:outline-blue-500"
                onChange={
                  (event)=> {
                  const value = parseFloat(event.target.value);
                  if (isNaN(value) || value === 0) return;

                  if (value > newComponentSelected.stock) setError(true)
                  else if ( error && value < newComponentSelected.stock) setError(false)
                }}
              />
              { error && (
                <div className="text-red-500 text-sm mt-1">
                  Cantidad máxima disponible: {newComponentSelected.stock} {newComponentSelected.unidad_medida}
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="flex justify-end gap-3">
            <Button type="cancel" onClick={() => setShowNewComponentModal(false)}>Cancelar</Button>
            <Button type="submit" onClick={()=> {}}>Agregar a Producción</Button>
        </div>
      </div>
    </div>
  );
}