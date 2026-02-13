"use client";

import { useMemo } from "react";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DOTS = "...";

function range(start: number, end: number) {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
}

function getPaginationRange({
  totalPages,
  page,
  siblingCount
}: {
  totalPages: number;
  page: number;
  siblingCount: number;
}) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(page - siblingCount, 1);
  const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftRange = range(1, 3 + siblingCount * 2);
    return [...leftRange, DOTS, totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightRange = range(totalPages - (2 + siblingCount * 2), totalPages);
    return [1, DOTS, ...rightRange];
  }

  const middleRange = range(leftSiblingIndex, rightSiblingIndex);
  return [1, DOTS, ...middleRange, DOTS, totalPages];
}

export function Pagination({
  page,
  totalItems,
  pageSize,
  onPageChange,
  className,
  siblingCount = 1
}: {
  page: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  siblingCount?: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPage = Math.min(Math.max(page, 1), totalPages);

  const paginationRange = useMemo(
    () =>
      getPaginationRange({
        totalPages,
        page: clampedPage,
        siblingCount
      }),
    [totalPages, clampedPage, siblingCount]
  );

  const start = totalItems === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const end = totalItems === 0 ? 0 : Math.min(totalItems, clampedPage * pageSize);

  if (totalItems === 0) {
    return (
      <div className={cx("pagination", className)}>
        <div className="pagination-info">No entries</div>
      </div>
    );
  }

  return (
    <div className={cx("pagination", className)}>
      <div className="pagination-info">
        Showing {start}-{end} of {totalItems}
      </div>
      {totalPages > 1 ? (
        <div className="pagination-list">
          <button
            className="btn small ghost pagination-btn"
            type="button"
            onClick={() => onPageChange(clampedPage - 1)}
            disabled={clampedPage === 1}
          >
            Prev
          </button>
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <span className="pagination-ellipsis" key={`dots-${index}`}>
                  ...
                </span>
              );
            }
            const value = pageNumber as number;
            const isActive = value === clampedPage;
            return (
              <button
                key={value}
                className={cx("btn small pagination-btn", isActive ? "" : "ghost")}
                type="button"
                onClick={() => onPageChange(value)}
                aria-current={isActive ? "page" : undefined}
              >
                {value}
              </button>
            );
          })}
          <button
            className="btn small ghost pagination-btn"
            type="button"
            onClick={() => onPageChange(clampedPage + 1)}
            disabled={clampedPage === totalPages}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
