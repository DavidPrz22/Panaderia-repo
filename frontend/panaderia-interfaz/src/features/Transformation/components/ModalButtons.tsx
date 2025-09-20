

export const ModalButtons = ({ onEdit, onDelete, loading }) => {
    return (
        <>
        <div className="flex gap-2 start-end justify-end ">
            <button className="bg-white text-blue-600 font-semibold border-2 border-blue-500 px-4 py-2 rounded-full hover:bg-blue-400 transition-colors"
            onClick={onEdit}
                disabled={loading}
                >
                Modificar
            </button>
            <button className="bg-white text-red-600 font-semibold border-2 border-red-500 px-4 py-2 rounded-full hover:bg-red-400 transition-colors"
                onClick={onDelete}
                disabled={loading}
                >
                Eliminar
            </button>
        </div>
        </>
    );
}