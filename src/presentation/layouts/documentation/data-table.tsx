import { For } from 'solid-js';
import type { Component } from 'solid-js';

export type TableRow = {
  first: string;
  second: string;
  third?: string;
};

export type DataTableProps = {
  headers: [string, string, string];
  rows: TableRow[];
};

const DataTable: Component<DataTableProps> = (props) => (
  <div class="border-base-300 overflow-x-auto rounded-2xl border print:break-inside-avoid">
    <table class="table w-full text-sm">
      <thead class="bg-base-200 text-base-content">
        <tr>
          <For each={props.headers}>
            {(header) => <th class="px-4 py-4 text-left font-bold">{header}</th>}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.rows}>
          {(row) => (
            <tr class="border-base-300 border-t align-top">
              <td class="text-base-content px-4 py-4 font-semibold">{row.first}</td>
              <td class="text-base-content/75 px-4 py-4">{row.second}</td>
              <td class="text-base-content/75 px-4 py-4">{row.third}</td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  </div>
);

export default DataTable;
