import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ReportViewHeaderProps {
    title: string;
    description: string;
    showDownload?: boolean;
    onBack: () => void;
    onDownload: () => void;
    isDownloading: boolean;
}

export const ReportViewHeader = ({
    title,
    description,
    showDownload = true,
    onBack,
    onDownload,
    isDownloading
}: ReportViewHeaderProps) => {
    return (
        <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {description}
                    </CardDescription>
                </div>
            </div>
            {showDownload && (
                <Button
                    onClick={onDownload}
                    disabled={isDownloading}
                    variant="outline"
                    className="gap-2"
                >
                    {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {isDownloading ? "Generando..." : "Descargar PDF"}
                </Button>
            )}
        </CardHeader>
    );
};
