import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const [inputValue, setInputValue] = useState(
		table.getState().pagination.pageIndex + 1,
	);

	useEffect(() => {
		const handler = setTimeout(() => {
			const page = inputValue - 1;
			if (page >= 0 && page < table.getPageCount()) {
				table.setPageIndex(page);
			}
		}, 300); // 300ms debounce

		return () => {
			clearTimeout(handler);
		};
	}, [inputValue, table]);

	return (
		<div className="flex items-center px-2 mb-4 w-full justify-between">
			<div className="flex items-center space-x-2">
				<p className="text-sm font-medium">Rows per page</p>
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger className="h-8 w-[70px]">
						<SelectValue placeholder={table.getState().pagination.pageSize} />
					</SelectTrigger>
					<SelectContent side="top">
						{[10, 20, 25, 30, 40, 50].map((pageSize) => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="flex items-center space-x-2">
				<Button
					variant="outline"
					size="icon"
					className="hidden size-8 lg:flex"
					onClick={() => setInputValue(1)}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Go to first page</span>
					<ChevronsLeft />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => {
						setInputValue(table.getState().pagination.pageIndex);
					}}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Go to previous page</span>
					<ChevronLeft />
				</Button>

				<div className="flex items-center space-x-2">
					<span className="text-sm font-medium">Page</span>
					<Input
						type="number"
						min={1}
						max={table.getPageCount()}
						value={inputValue}
						onChange={(e) => {
							const asNumber = Number.parseInt(e.target.value, 10);
							if (
								!Number.isNaN(asNumber) &&
								asNumber > 0 &&
								asNumber <= table.getPageCount()
							) {
								setInputValue(asNumber);
							} else {
								toast.error("You cannot go to that page.");
								setInputValue(table.getState().pagination.pageIndex + 1);
							}
						}}
						className="w-16 text-center border rounded-md text-sm no-step"
					/>
					<span className="text-sm font-medium">of {table.getPageCount()}</span>
				</div>

				<Button
					variant="outline"
					size="icon"
					className="size-8"
					onClick={() => {
						setInputValue(table.getState().pagination.pageIndex + 2);
					}}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Go to next page</span>
					<ChevronRight />
				</Button>
				<Button
					variant="outline"
					size="icon"
					className="hidden size-8 lg:flex"
					onClick={() => {
						setInputValue(table.getPageCount());
					}}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Go to last page</span>
					<ChevronsRight />
				</Button>
			</div>
		</div>
	);
}
