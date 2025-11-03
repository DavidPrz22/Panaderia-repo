import { useProductionContext } from "@/context/ProductionContext";
import { DotMenuIcon, CerrarIcon } from "@/assets/DashboardAssets";
import Button from "@/components/Button";
import Title from "@/components/Title";
import { ProductionRecord } from "./ProductionRecord";

export const ProductionRegistrosContainer = () => {
  const productosElaborados = [
    {
      id: "p1",
      nombre: "Pan Integral",
      descripcion: "Pan de harina integral recién horneado",
      unidad_medida: "unidades",
    },
    {
      id: "p2",
      nombre: "Torta de Chocolate",
      descripcion: "Pastel de chocolate esponjoso con cobertura",
      unidad_medida: "tortas",
    },
    {
      id: "p3",
      nombre: "Croissants",
      descripcion: "Croissants de mantequilla laminados",
      unidad_medida: "unidades",
    },
  ];
  // Mock data for registered productions
  const registeredProductions = [
    {
      id: "1",
      fecha_produccion: "2024-01-15",
      fecha_vencimiento: "2024-01-22",
      producto: productosElaborados[0], // Pan Integral
      cantidad_producida: 24,
      estado: "completada",
      componentes_utilizados: [
        { nombre: "Harina integral", cantidad: 2400, unidad: "g" },
        { nombre: "Agua", cantidad: 1200, unidad: "ml" },
        { nombre: "Levadura", cantidad: 48, unidad: "g" },
        { nombre: "Sal", cantidad: 24, unidad: "g" },
      ],
      registrado_por: "Admin",
    },
    {
      id: "2",
      fecha_produccion: "2024-01-14",
      fecha_vencimiento: "2024-01-21",
      producto: productosElaborados[1], // Torta de Chocolate
      cantidad_producida: 2,
      estado: "completada",
      componentes_utilizados: [
        { nombre: "Harina de trigo", cantidad: 800, unidad: "g" },
        { nombre: "Azúcar", cantidad: 600, unidad: "g" },
        { nombre: "Huevos", cantidad: 8, unidad: "unidad" },
        { nombre: "Chocolate", cantidad: 400, unidad: "g" },
        { nombre: "Mantequilla", cantidad: 200, unidad: "g" },
      ],
      registrado_por: "Chef María",
    },
    {
      id: "3",
      fecha_produccion: "2024-01-13",
      fecha_vencimiento: "2024-01-15",
      producto: productosElaborados[2], // Croissants
      cantidad_producida: 36,
      estado: "en_proceso",
      componentes_utilizados: [
        { nombre: "Harina de trigo", cantidad: 1800, unidad: "g" },
        { nombre: "Mantequilla", cantidad: 900, unidad: "g" },
      ],
      registrado_por: "Panadero Juan",
    },
    {
      id: "4",
      fecha_produccion: "2024-01-12",
      fecha_vencimiento: "2024-01-19",
      producto: productosElaborados[0], // Pan Integral
      cantidad_producida: 12,
      estado: "completada",
      componentes_utilizados: [
        { nombre: "Harina integral", cantidad: 1200, unidad: "g" },
        { nombre: "Agua", cantidad: 600, unidad: "ml" },
        { nombre: "Levadura", cantidad: 24, unidad: "g" },
        { nombre: "Sal", cantidad: 12, unidad: "g" },
      ],
      registrado_por: "Admin",
    },
  ];

  const { setIsClosingModal, isClosingModal } = useProductionContext();

  return (
    <div
      className={`w-[80%] h-[85%] max-h-[85%] p-6 bg-white shadow-lg overflow-auto relative rounded-lg ${isClosingModal ? "animate-fadeOut" : "animate-fadeIn"}`}
    >
      <div className="absolute right-3 top-3 ">
        <Button
          type="close"
          onClick={() => {
            setIsClosingModal(true);
          }}
        >
          <img src={CerrarIcon} className="size-4" alt="close" />
        </Button>
      </div>

      <div className="font-[Roboto] mb-2">
        <h2 className="text-lg font-semibold">Productiones Registradas</h2>
        <h1 className="text-sm text-gray-500">
          Lista de todas las producciones registradas en el sistema
        </h1>
      </div>

      <div className="w-full p-5 border border-gray-300 rounded-lg mt-4">
        <div className="flex items-center space-x-2 mb-5">
          <img src={DotMenuIcon} alt="menu" className="size-4" />
          <Title>Producciones Registradas</Title>
        </div>
        <div className="flex flex-col gap-4">
          {registeredProductions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay producciones registradas
            </div>
          ) : (
            registeredProductions.map((production) => (
              <ProductionRecord key={production.id} production={production} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
