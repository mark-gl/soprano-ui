import type { Meta, StoryObj } from "@storybook/react";
import { MediaSlider } from "../src/media-slider/MediaSlider";

const meta = {
  title: "Example/MediaSlider",
  component: MediaSlider,
  tags: ["autodocs"],
} satisfies Meta<typeof MediaSlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
