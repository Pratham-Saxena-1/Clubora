import { ChevronLeft, ChevronRight } from 'lucide-react';

function HostPagination({ currentPage, totalPages, totalEntries, pageSize, onPageChange }) {
  const startEntry = (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  return (
    <div className="host-pagination">
      <span className="host-pagination__info">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </span>
      <div className="host-pagination__controls">
        <button
          className="host-pagination__btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} strokeWidth={2} />
          <span>Prev</span>
        </button>
        <span className="host-pagination__page">
          {currentPage} / {totalPages}
        </span>
        <button
          className="host-pagination__btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

export default HostPagination;
