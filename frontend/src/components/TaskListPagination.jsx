import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
const TaskListPagination = ({
  handleNext,
  handlePre,
  handlePageChange,
  page,
  totalPages,
}) => {
  const currentPage = Number(page) || 1;
  const total = Number(totalPages) || 1;

  const generatePages = () => {
    const pages = [];

    if (total <= 4) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (currentPage <= 2) {
      pages.push(1, 2, 3, "...", total);
    } else if (currentPage >= total - 1) {
      pages.push(1, "...", total - 2, total - 1, total);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        total
      );
    }

    return pages;
  };

  const pageToShow = generatePages();

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={currentPage === 1 ? undefined : handlePre}
              className={cn(
                "cursor-pointer",
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {pageToShow.map((p, index) => (
            <PaginationItem key={index}>
              {p === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={p === currentPage}
                  onClick={() => handlePageChange(p)}
                  className="cursor-pointer"
                >
                  {String(p)} {/* đảm bảo là string */}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={currentPage === total ? undefined : handleNext}
              className={cn(
                "cursor-pointer",
                currentPage === total && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TaskListPagination;
