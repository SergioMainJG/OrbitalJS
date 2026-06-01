import { createSignal } from "solid-js";
import type { TooltipData } from "@/types/tooltip-data.interface";

const [tooltip, setTooltip] = createSignal<TooltipData | null>(null);

export { tooltip, setTooltip };
