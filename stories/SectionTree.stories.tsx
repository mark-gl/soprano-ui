import type { Meta, StoryObj } from "@storybook/react";
import { SectionTree } from "../src/section-tree/SectionTree";
import views from "./data/views.json";
import playlists from "./data/playlists.json";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

const meta = {
  title: "Example/SectionTree",
  component: SectionTree,
  tags: ["autodocs"],
  args: {
    sections: [
      {
        id: "views",
        name: "Library",
        emptyMessage: "No views enabled",
        children: views,
      },
      {
        id: "playlists",
        name: "Playlists",
        emptyMessage: "No playlists",
        children: playlists,
      },
      {
        id: "empty",
        name: "Empty",
        emptyMessage: "Example empty section",
        children: [],
      },
    ],
    FolderOpenIcon: () => <div>V</div>,
    FolderClosedIcon: () => <div>&gt;</div>,
  },
} satisfies Meta<typeof SectionTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => (
    <Allotment>
      <div style={{ fontFamily: "Segoe UI" }}>
        <SectionTree {...args} />
      </div>
      <div></div>
    </Allotment>
  ),
};
