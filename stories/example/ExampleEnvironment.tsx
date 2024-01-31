import { Allotment } from "allotment";
import React from "react";
import { SectionTree } from "../../src/section-tree/SectionTree";
import views from "../data/views.json";
import playlists from "../data/playlists.json";
import { TreeProps } from "react-arborist/dist/module/types/tree-props";
import { TreeItem, Section } from "../../src/section-tree/treeTypes";
import {
  createTreeNode,
  moveTreeNode,
} from "../../src/section-tree/treeOperations";
import "allotment/dist/style.css";

export function ExampleEnvironment(
  props: TreeProps<TreeItem> & {
    sections?: Section[];
    FolderOpenIcon: () => JSX.Element;
    FolderClosedIcon: () => JSX.Element;
    onMoveWithinSection: (args: {
      sectionId: string;
      movedItemId: string;
      newParentId: string | null;
      newIndex: number;
    }) => void;
  }
) {
  const [sections, setSections] = React.useState([
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

  const updateSection = (sectionId: string, newData: TreeItem[]) => {
    setSections(
      sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            children: newData,
          };
        }
        return section;
      }) as Section[]
    );
  };

  const createItem = (sectionId: string, isFolder?: boolean) => {
    const sectionIndex = sections.findIndex(
      (section) => section.id === sectionId
    );
    const newTree = createTreeNode(sections[sectionIndex].children, {
      newData: {
        id: "new-item-" + Math.random(),
        name: "New item",
        children: isFolder ? [] : undefined,
      },
    });
    updateSection(sectionId, newTree);
  };

  return (
    <div style={{ fontFamily: "Segoe UI", height: "500px" }}>
      <Allotment>
        <SectionTree
          {...props}
          sections={sections}
          onMoveWithinSection={(args) => {
            const sectionIndex = sections.findIndex(
              (section) => section.id === args.sectionId
            );
            const newTree = moveTreeNode(sections[sectionIndex].children, {
              id: args.movedItemId,
              parentId: args.newParentId,
              index: args.newIndex,
            });
            updateSection(args.sectionId, newTree);
          }}
        />
        <div>
          {sections.map((section) => (
            <React.Fragment key={section.id}>
              <button onClick={() => createItem(section.id)}>
                Add item to {section.name}
              </button>
              <button onClick={() => createItem(section.id, true)}>
                Add folder to {section.name}
              </button>
              <br />
            </React.Fragment>
          ))}
        </div>
      </Allotment>
    </div>
  );
}
