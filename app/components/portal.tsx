import type { FC, ReactNode} from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface props {
  children: ReactNode;
  wrapperId: string;
}

const createWrapper = (wrapperId: string) => {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("id", wrapperId);
  document.body.appendChild(wrapper);
  return wrapper;
};

export const Portal: FC<props> = ({ children, wrapperId }) => {
  const [wrapper, setWrapper] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById(wrapperId);
    let created = false;

    if (!el) {
      created = true;
      el = createWrapper(wrapperId);
    }

    setWrapper(el);

    return () => {
      if (created && el?.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [wrapperId]);

  if (!wrapper) return null;

  return createPortal(children, wrapper);
};
