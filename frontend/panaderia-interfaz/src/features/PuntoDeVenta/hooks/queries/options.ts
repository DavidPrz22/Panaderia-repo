import { checkIsActive, BCVRate } from "../../api/api"

export const isActiveCajaOptions = {
    queryKey: ['is-active-caja'],
    queryFn: () => checkIsActive(),
    staleTime: Infinity
}

export const bcvRateOptions = {
  queryKey: ["bcv-rate"],
  queryFn: BCVRate,
  staleTime: Infinity,
};
