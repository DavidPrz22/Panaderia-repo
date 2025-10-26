import { ClientesAccordion } from "../ui/accordion";


export default function Principal() {
    return (
    <div className="flex-1 px-0 py-4">
    <header className="mt-0 w-full">
            <div className="w-full max-w-full px-12">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex flex-col items-center justify-between mb-5 w-full">
                        <div className="flex gap-3 items-center pr-0 w-full">
                            <ClientesAccordion />
                        </div>
                    </div>
                </div>
            </div>
    </header>
    </div>
    );
};