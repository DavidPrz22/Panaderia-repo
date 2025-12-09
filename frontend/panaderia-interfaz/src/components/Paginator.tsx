import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination"

type PaginatorProps = {
  pages: number[];
  currentPage: number;
  previousPage?: boolean;
  nextPage?: boolean;
  onClickPage: (p: number) => void;
  onClickPrev: () => void;
  onClickNext: () => void;
}

export function Paginator({ previousPage, pages, nextPage, onClickPage, onClickPrev, onClickNext, currentPage }: PaginatorProps) {

  const getVisiblePages = () => {
    // If 5 or fewer pages, show all
    if (pages.length <= 5) {
      return pages;
    }

    const currentIndex = pages.findIndex(p => p === currentPage);

    // Show first 5 pages if current page is near the start
    if (currentIndex < 3) {
      return pages.slice(0, 5);
    }

    // Show last 5 pages if current page is near the end
    if (currentIndex >= pages.length - 3) {
      return pages.slice(pages.length - 5);
    }

    // Show 2 pages before and 2 pages after current page
    return pages.slice(currentIndex - 2, currentIndex + 3);
  }

  const visiblePages = getVisiblePages();
  const currentIndex = pages.findIndex(p => p === currentPage);

  // Show left ellipsis if there are pages before the visible range
  const showLeftEllipsis = pages.length > 5 && currentIndex >= 3;

  // Show right ellipsis if there are pages after the visible range
  const showRightEllipsis = pages.length > 5 && currentIndex < pages.length - 3;

  return (
    <Pagination >
      <PaginationContent >

        {previousPage && (
          <PaginationItem>
            <PaginationPrevious onClick={onClickPrev} className="cursor-pointer" />
          </PaginationItem>
        )}

        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {visiblePages.map(p => (
          <PaginationItem key={p}>
            <PaginationLink onClick={() => onClickPage(p)} className={p === currentPage ? "bg-primary text-primary-foreground hover:bg-primary/20" : "cursor-pointer"}> {p + 1} </PaginationLink>
          </PaginationItem>
        ))}

        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {nextPage && (
          <PaginationItem>
            <PaginationNext onClick={onClickNext} className="cursor-pointer" />
          </PaginationItem>
        )}

      </PaginationContent>
    </Pagination>
  )
}
