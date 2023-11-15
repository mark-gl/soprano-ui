import React from "react";
import * as RadixSlider from "./Slider";
import { SliderProps } from "./Slider";

export const MediaSlider = React.forwardRef<HTMLDivElement, SliderProps>(
  (props, forwardedRef) => {
    return (
      <RadixSlider.Root {...props} ref={forwardedRef}>
        <RadixSlider.Track>
          <RadixSlider.Range />
        </RadixSlider.Track>
        <RadixSlider.Thumb />
      </RadixSlider.Root>
    );
  }
);
