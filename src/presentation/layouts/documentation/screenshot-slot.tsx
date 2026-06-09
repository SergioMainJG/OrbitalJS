import { Show } from 'solid-js';
import type { Component } from 'solid-js';

export type ScreenshotSlotProps = {
  id: string;
  title: string;
  description: string;
  expectedCapture: string;
  imageUrl?: string;
  alt?: string;
  heightClass?: string;
};

const ScreenshotSlot: Component<ScreenshotSlotProps> = (props) => (
  <figure
    id={props.id}
    class="border-primary/40 bg-primary/5 rounded-3xl border-2 border-dashed p-6 print:break-inside-avoid"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p class="text-primary mb-2 text-sm font-semibold tracking-[0.18em] uppercase">
          <Show when={props.imageUrl} fallback={props.title}>
            Captura del sistema
          </Show>
        </p>
        <h3 class="text-base-content text-xl font-bold">{props.title}</h3>
        <p class="text-base-content/75 mt-3 leading-7">{props.description}</p>
      </div>
    </div>

    <div class="mt-6">
      <Show
        when={props.imageUrl}
        fallback={
          <div class="border-base-300 bg-base-100 text-base-content/60 flex min-h-72 items-center justify-center rounded-2xl border border-dashed p-8 text-center">
            <div>
              <p class="text-base-content/70 text-lg font-bold">{props.expectedCapture}</p>
            </div>
          </div>
        }
      >
        <div
          class={`border-base-300 bg-base-200/30 flex items-center justify-center overflow-hidden rounded-2xl border p-2 shadow-md ${props.heightClass || 'h-48 md:h-64'}`}
        >
          <img
            src={props.imageUrl}
            alt={props.alt || props.title}
            loading="lazy"
            decoding="async"
            class="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      </Show>
    </div>

    <figcaption class="text-base-content/65 mt-4 text-sm leading-7">
      <Show when={props.imageUrl} fallback={props.description}>
        Figura {props.id}: {props.expectedCapture}
      </Show>
    </figcaption>
  </figure>
);

export default ScreenshotSlot;
