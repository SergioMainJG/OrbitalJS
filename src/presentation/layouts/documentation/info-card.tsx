import type { Component } from 'solid-js';

export type CardItem = {
  title: string;
  body: string;
};

const InfoCard: Component<CardItem> = (props) => (
  <article class="border-base-300 bg-base-100 rounded-2xl border p-6 shadow-sm print:break-inside-avoid">
    <h3 class="text-base-content mb-3 text-lg font-bold">{props.title}</h3>
    <p class="text-base-content/75 leading-7">{props.body}</p>
  </article>
);

export default InfoCard;
