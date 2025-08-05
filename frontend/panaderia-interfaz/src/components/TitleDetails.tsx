export const TitleDetails = ({children}: {children: React.ReactNode}) => {
  return (
    <h2 className="text-xl font-semibold font-[Roboto] text-blue-600 border-b border-gray-300 pb-2">
      {children}
    </h2>
  );
};