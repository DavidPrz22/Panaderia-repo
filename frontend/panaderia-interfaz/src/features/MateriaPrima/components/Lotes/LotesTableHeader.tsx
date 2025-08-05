export const LotesTableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <div className="grid grid-cols-7 justify-between px-8 py-4 border-b border-t border-gray-300 bg-white font-bold font-[Roboto] text-sm">
      {headers.map((header) => (
        <div key={header}>{header}</div>
      ))}
    </div>
  );
};
