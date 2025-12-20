import { cn } from "@/lib/utils";
import { useCategoriasQuery } from "../hooks/queries/queries";
import { usePOSContext } from "@/context/POSContext";
import { SkeletonTag } from "@/components/SkeletonTag";

export function CategoryFilter() {
  const { data, isPending } = useCategoriasQuery();
  const categorias = data?.categorias || { todos:[], final:[], reventa:[] };

  const { tipoProductoSeleccionado, categoriaSeleccionada, setCategoriaSeleccionada } = usePOSContext();
  const categoriasMostrar = categorias[tipoProductoSeleccionado];

  return (

    <div className="flex flex-wrap gap-2 font-[Roboto]">
      <button
        onClick={() => {
          setCategoriaSeleccionada(null);
        }}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm transition-all duration-150 cursor-pointer",
          categoriaSeleccionada === null
            ? "bg-blue-900 text-white"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        )}
      >
        Todos
      </button>

      { isPending ? 
        <>
          {
            Array.from({length:6}).map((_, index) => (
              <SkeletonTag key={index} width={100}/>
            ))
          }
        </>
      : categoriasMostrar.map((categoria, index) => (
        <button
          key={index}
          onClick={() => {
            setCategoriaSeleccionada(categoria);
          }}
          className={cn(  
            "rounded-full px-4 py-1.5 text-sm transition-all duration-150 cursor-pointer",
            categoriaSeleccionada === categoria
              ? "bg-blue-900 text-white"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
}
