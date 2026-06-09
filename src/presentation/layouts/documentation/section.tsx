import type { Component, JSX } from 'solid-js';

export type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: JSX.Element;
};

const Section: Component<SectionProps> = (props) => (
  <section
    id={props.id}
    class="doc-section border-base-300 print:border-base-300 scroll-mt-24 border-t py-12 print:py-8"
  >
    <div class="mb-6">
      {props.eyebrow && (
        <p class="text-primary mb-2 text-sm font-semibold tracking-[0.22em] uppercase">
          {props.eyebrow}
        </p>
      )}
      <h2 class="text-base-content text-3xl font-bold tracking-tight md:text-4xl">{props.title}</h2>
    </div>
    <div class="text-base-content/80 space-y-6 text-base leading-8">{props.children}</div>
  </section>
);

export default Section;
