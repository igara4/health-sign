"use client";

import { useEffect, useState } from "react";

interface Props {
  posts: number;
  itemsPerPage?: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({
  posts,
  itemsPerPage = 9,
  currentPage,
  setCurrentPage,
}: Props) => {
  const totalPages = Math.max(1, Math.ceil(posts / itemsPerPage));
  const [visiblePages, setVisiblePages] = useState(7);

  useEffect(() => {
    const updateVisiblePages = () => {
      if (window.innerWidth < 640) {
        setVisiblePages(5);
      }
    };
    updateVisiblePages();
    window.addEventListener("resize", updateVisiblePages);
    return () => window.removeEventListener("resize", updateVisiblePages);
  }, []);

  const startPage = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(visiblePages / 2),
      totalPages - visiblePages + 1
    )
  );
  const endPage = Math.min(totalPages, startPage + visiblePages - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex justify-center items-center w-full">
      <button
        onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
        className="px-4 sm:px-6 py-2 rounded-full text-center font-bold"
      >
        ←
      </button>

      <div className="flex items-center justify-center space-x-1 sm:space-x-2">
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`h-9 w-9 sm:h-10 sm:w-10 leading-none flex items-center justify-center rounded-full border border-gray-400 ${
              currentPage === num
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
        }
        className="px-4 sm:px-6 py-2 rounded-full text-center font-bold"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
