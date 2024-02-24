import type { Meta, StoryObj } from "@storybook/react";
import DragGridApp from "./example/DragGridApp";

const meta = {
  title: "Example/DragGrid",
  component: DragGridApp,
  tags: ["autodocs"],
} satisfies Meta<typeof DragGridApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
