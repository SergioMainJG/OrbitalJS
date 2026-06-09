import { For } from 'solid-js';
import type { Component } from 'solid-js';

export type FormulaBlockProps = {
  title: string;
  formulas: string[];
  note?: string;
};

const FormulaBlock: Component<FormulaBlockProps> = (props) => (
  <figure class="border-base-300 bg-base-200/60 rounded-2xl border p-5 print:break-inside-avoid">
    <figcaption class="text-base-content/60 mb-3 text-sm font-semibold tracking-[0.18em] uppercase">
      {props.title}
    </figcaption>
    <div class="space-y-3">
      <For each={props.formulas}>
        {(formula) => (
          <pre class="bg-base-100 text-base-content overflow-x-auto rounded-xl p-4 font-mono text-sm leading-7">
            <code>{formula}</code>
          </pre>
        )}
      </For>
    </div>
    {props.note && <p class="text-base-content/70 mt-4 text-sm leading-7">{props.note}</p>}
  </figure>
);

export default FormulaBlock;
