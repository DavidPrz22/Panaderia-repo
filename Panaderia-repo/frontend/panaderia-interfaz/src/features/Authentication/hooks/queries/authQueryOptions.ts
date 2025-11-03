export const createUserDataQueryOptions = () => {
  return {
    queryKey: ["userData"],
    staleTime: Infinity,
  };
};
