import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useProductionContext } from "@/context/ProductionContext"
import { useProductionDetailsQuery } from "../hooks/queries/ProductionQueries"

export const ProductionPagination = () => {
    const { detailPage, setDetailPage } = useProductionContext();
    const { data: productionDetails } = useProductionDetailsQuery();

    if (!productionDetails) return null;
    
    return (
        <Pagination >
            <PaginationContent>
                {
                    detailPage > 1 && (
                        <PaginationItem>
                            <PaginationPrevious onClick={() => {setDetailPage(detailPage - 1)}} />
                        </PaginationItem>
                    )
                }

                {
                    productionDetails?.total_pages && productionDetails?.total_pages > 1 && (
                        Array.from({ length: productionDetails?.total_pages }, (_, index) => index + 1).map((page) => (
                            page === detailPage ? (
                                <PaginationItem key={page}>
                                    <PaginationLink onClick={() => {setDetailPage(page)}} isActive>{page}</PaginationLink>
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={page}>
                                    <PaginationLink onClick={() => {setDetailPage(page)}}>{page}</PaginationLink>
                                </PaginationItem>
                            )
                        ))
                    )
                }
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                {
                    detailPage < (productionDetails!.total_pages) && (
                        <PaginationItem>
                            <PaginationNext onClick={() => {setDetailPage(detailPage + 1)}} />
                        </PaginationItem>
                    )
                }
            </PaginationContent>
        </Pagination>
    )
}