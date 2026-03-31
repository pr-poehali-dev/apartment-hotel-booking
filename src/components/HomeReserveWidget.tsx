import { useEffect } from 'react';

type HomeReserveWindow = Window & {
  homereserve?: { initWidgetSearch: (opts: object) => void };
};

export default function HomeReserveWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://homereserve.ru/widget.js';
    document.body.appendChild(script);

    script.onload = () => {
      const w = window as HomeReserveWindow;
      if (w.homereserve) {
        w.homereserve.initWidgetSearch({
          token: 'luXPRdtb8v',
          apartments: [316497, 328846, 339280, 339281, 315718, 316514, 322708, 339498, 318590, 316491, 311665, 315845, 328831],
          tag: 'сайт',
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="hr-widget" />;
}
