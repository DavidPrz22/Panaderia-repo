
import type { searchResults } from "../types/types";

interface ResultItemProps {
    result: searchResults;
    onClick: () => void;
}

export const ResultItem: React.FC<ResultItemProps> = ({ result, onClick }) => {

    return (
    <button
        onClick={onClick}
        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
    >
        <div className="flex items-center space-x-3">
        <span className="text-xl">{result.type}</span>
        <div className="flex-1">
            <div className="font-medium text-gray-900">{result.nombre_producto}</div>
            {result.metadata?.description && (
                <div className="text-sm text-gray-500">{result.metadata.description}</div>
            )}
        </div>
        </div>
    </button>
    );
};