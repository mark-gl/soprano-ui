import { Allotment } from "allotment";
import React from "react";
import { SectionTree } from "../../src/section-tree/SectionTree";
import views from "../data/views.json";
import playlists from "../data/playlists.json";
import { TreeProps } from "react-arborist/dist/module/types/tree-props";
import { TreeItem, Section } from "../../src/section-tree/treeTypes";
import "allotment/dist/style.css";

export function ExampleEnvironment(
  props: TreeProps<TreeItem> & {
    sections?: Section[];
    FolderOpenIcon: () => JSX.Element;
    FolderClosedIcon: () => JSX.Element;
  }
) {
  const [sections] = React.useState([
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
  ]);

  return (
    <div style={{ fontFamily: "Segoe UI", height: "500px" }}>
      <Allotment>
        <SectionTree {...props} sections={sections} />
        <div></div>
      </Allotment>
    </div>
  );
}
