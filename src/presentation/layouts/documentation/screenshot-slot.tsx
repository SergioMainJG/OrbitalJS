import { Show, createSignal } from 'solid-js';
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

const ScreenshotSlot: Component<ScreenshotSlotProps> = (props) => {
  const [isZoomed, setIsZoomed] = createSignal(false);

  const toggleZoom = () => {
    const doc = document as unknown as { startViewTransition?: (cb: () => void) => void };
    if (!doc.startViewTransition) {
      setIsZoomed(!isZoomed());
      return;
    }
    doc.startViewTransition(() => setIsZoomed(!isZoomed()));
  };

  return (
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
              style={{ 'view-transition-name': isZoomed() ? 'none' : `img-expand-${props.id}` }}
              onClick={toggleZoom}
              class="max-h-full max-w-full cursor-zoom-in rounded-lg object-contain transition-transform duration-200 hover:scale-[1.02]"
            />
          </div>
        </Show>
      </div>

      <figcaption class="text-base-content/65 mt-4 text-sm leading-7">
        <Show when={props.imageUrl} fallback={props.description}>
          Figura {props.id}: {props.expectedCapture}
        </Show>
      </figcaption>

      <Show when={isZoomed()}>
        <div
          class="bg-base-300/90 fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center backdrop-blur-sm"
          onClick={toggleZoom}
        >
          <img
            src={props.imageUrl}
            alt={props.alt || props.title}
            class="max-h-[95vh] max-w-[95vw] rounded-xl object-contain shadow-2xl"
            style={{ 'view-transition-name': `img-expand-${props.id}` }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </Show>
    </figure>
  );
};

export default ScreenshotSlot;
