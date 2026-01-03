import { FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReportCard, ReportView } from "../../types/types";

interface ReportsMenuProps {
    reports: ReportCard[];
    onSelectReport: (id: ReportView) => void;
}

export const ReportsMenu = ({ reports, onSelectReport }: ReportsMenuProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
                <Card
                    key={report.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                    onClick={() => onSelectReport(report.id)}
                >
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className={`p-3 rounded-lg bg-muted ${report.color}`}>
                            <report.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <CardDescription>{report.description}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{report.count} registros</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
