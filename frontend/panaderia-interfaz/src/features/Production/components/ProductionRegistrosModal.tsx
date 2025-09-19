import { useProductionContext } from "@/context/ProductionContext";
import { ProductionRegistrosContainer } from "./ProductionRegistrosContainer";
import { useEffect } from "react";
import "@/styles/animations.css";

export const ProductionRegistrosModal = () => {
  const {
    showProductionRegistros,
    setShowProductionRegistros,
    isClosingModal,
    setIsClosingModal,
  } = useProductionContext();

  const handleClose = () => {
    setIsClosingModal(true);
  };

  const handleAnimationEnd = () => {
    if (isClosingModal) {
      setShowProductionRegistros(false);
      setIsClosingModal(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) handleClose();
  };

  if (!showProductionRegistros) return <></>;

  return (
    <div
      onClick={handleClickOutside}
      onAnimationEnd={handleAnimationEnd}
      className={`fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-(--z-index-over-header-bar) ${isClosingModal ? "animate-fadeOutModal" : "animate-fadeInModal"}`}
    >
      <ProductionRegistrosContainer />
    </div>
  );
};
