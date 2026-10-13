import { useRef, useEffect } from 'react';

/**
 * Universal Desktop Mouse Drag-to-Scroll Hook
 * Enables smooth horizontal click-and-drag scrolling on desktop browsers.
 * Automatically adds cursor-grab and select-none classes and prevents
 * accidental click events while actively dragging.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;

    // Apply baseline styling
    element.classList.add('cursor-grab', 'select-none');

    const onMouseDown = (e: MouseEvent) => {
      // Primary left-click only
      if (e.button !== 0) return;
      isDown = true;
      isDragging = false;
      startX = e.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
      element.classList.add('cursor-grabbing');
      element.classList.remove('cursor-grab');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const currentX = e.pageX - element.offsetLeft;
      const walk = currentX - startX;

      if (Math.abs(walk) > 4) {
        isDragging = true;
        e.preventDefault();
      }

      element.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      element.classList.remove('cursor-grabbing');
      element.classList.add('cursor-grab');
    };

    const onMouseLeave = () => {
      if (!isDown) return;
      isDown = false;
      element.classList.remove('cursor-grabbing');
      element.classList.add('cursor-grab');
    };

    const onClickCapture = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        isDragging = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && e.deltaY !== 0) {
        if (element.scrollWidth > element.clientWidth) {
          e.preventDefault();
          element.scrollLeft += e.deltaY;
        }
      }
    };

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onMouseUp);
    element.addEventListener('click', onClickCapture, true);
    element.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('click', onClickCapture, true);
      element.removeEventListener('wheel', onWheel);
    };
  }, []);

  return ref;
}
