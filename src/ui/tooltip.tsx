import { type Component, Show } from 'solid-js';
import { tooltip } from '@/state/tooltip-store';

const Tooltip: Component = () => {
  return (
    <Show when={tooltip()}>
      {(tip) => {
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

        let left = tip().x + 15;
        let top = tip().y + 15;

        if (left + 280 > viewportWidth) {
          left = tip().x - 295;
        }

        if (top + 200 > viewportHeight) {
          top = tip().y - 215;
        }

        return (
          <div
            style={{
              position: 'fixed',
              left: `${left}px`,
              top: `${top}px`,
              'background-color': 'rgba(0, 0, 0, 0.95)',
              'backdrop-filter': 'blur(8px)',
              'border-radius': '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 16px',
              'font-family': 'monospace',
              'font-size': '12px',
              color: '#fff',
              'z-index': '2000',
              'max-width': '280px',
              'pointer-events': 'none',
              'box-shadow': '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                'font-weight': 'bold',
                'border-bottom': '1px solid rgba(255,255,255,0.2)',
                'padding-bottom': '6px',
                'margin-bottom': '8px',
                'font-size': '13px',
              }}
            >
              {tip().title}
            </div>

            {tip().content.map((line, idx) => (
              <div
                style={{
                  'margin-bottom': idx < tip().content.length - 1 ? '6px' : '0',
                  'line-height': '1.4',
                  'font-size': '11px',
                  color: '#ccc',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        );
      }}
    </Show>
  );
};

export default Tooltip;
