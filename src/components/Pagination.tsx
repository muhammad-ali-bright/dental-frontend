import React, { useState, useCallback, useMemo, KeyboardEvent, ChangeEvent, FormEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

interface PaginationNavigationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

const PaginationNavigation: React.FC<PaginationNavigationProps> = ({
    totalPages,
    currentPage,
    setCurrentPage
}) => {
    // const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [showSlider, setShowSlider] = useState<boolean>(false);
    const [jumpToPage, setJumpToPage] = useState<string>("");

    const handlePageChange = useCallback(
        (page: number) => {
            if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
                setShowSlider(false);
            }
        },
        [totalPages]
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "ArrowLeft") {
                handlePageChange(currentPage - 1);
            } else if (e.key === "ArrowRight") {
                handlePageChange(currentPage + 1);
            }
        },
        [currentPage, handlePageChange]
    );

    const visiblePages = useMemo(() => {
        const pages: number[] = [];
        const maxVisiblePages = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    const handleJumpToPage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const page = parseInt(jumpToPage);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            handlePageChange(page);
            setJumpToPage("");
        }
    };

    return (
        <div
            className="w-full max-w-4xl mx-auto p-4"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="flex items-center justify-center space-x-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-200 ${currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`}
                    aria-label="Previous page"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div className="relative flex flex-col items-center w-64">
                    <div className="flex items-center space-x-2 w-full">
                        <input
                            type="range"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handlePageChange(parseInt(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div className="mt-2">
                        <form onSubmit={handleJumpToPage} className="flex space-x-2">
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={jumpToPage}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setJumpToPage(e.target.value)
                                }
                                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Jump"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200"
                            >
                                Go
                            </button>
                        </form>
                    </div>
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-200 ${currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        }`}
                    aria-label="Next page"
                >
                    <ChevronRightIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </div>
        </div>
    );
};

export default PaginationNavigation;
