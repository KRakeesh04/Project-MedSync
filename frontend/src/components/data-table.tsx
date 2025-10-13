import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { type Table as Table_, flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface DataTableProps<TData> {
	table: Table_<TData>;
	errorCode?: number | null;
}
export function DataTable<TData>({ table, errorCode }: DataTableProps<TData>) {
	const [noResultsMessage, setNoResultsMessage] = useState("No results.");

	useEffect(() => {
		if (errorCode && errorCode === 404) {
			setNoResultsMessage("No results found.");
		}
	}, [errorCode]);

	return (
		<>
			<DataTablePagination table={table} />
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="cursor-pointer select-none text-center bg-muted"
											onClick={(event) =>
												header.column.getToggleSortingHandler()?.(event)
											}
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
											{{
												asc: " ↑",
												desc: " ↓",
											}[header.column.getIsSorted() as string] ?? null}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={table.getAllColumns().length}
									className="h-24 text-center"
								>
									{noResultsMessage}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
