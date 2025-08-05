import type { ReactNode } from "react";

export type childrenProp = {
    children: ReactNode;
  };
  
export type ProductosIntermediosFormSharedProps = {
    title: string;
    isUpdate?: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
};