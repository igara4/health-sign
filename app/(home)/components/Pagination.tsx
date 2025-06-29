"use client";

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

  return (
    <div className="flex justify-center items-center w-full overflow-x-auto">
      <button
        onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
        className="px-6 py-2 rounded-full text-center font-bold"
      >
        ←
      </button>

      <div className="flex space-x-4 items-center justify-center overflow-x-auto whitespace-nowrap px-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`h-10 aspect-square leading-none flex items-center justify-center rounded-full border border-gray-400 ${
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
        className="px-6 py-2 rounded-full text-center font-bold"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
