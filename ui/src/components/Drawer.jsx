import React from "react";

const Drawer = ({ content = null, drawerHidden, setDrawerHidden }) => {
  const drawerClass = drawerHidden ? "drawer-menu hide" : "drawer-menu";

  return (
    <aside className={drawerClass}>
      <nav className="drawer-content">{content}</nav>
      <div className="overlay-top" onClick={() => setDrawerHidden(true)} />
      <div className="overlay-left" onClick={() => setDrawerHidden(true)} />
      <div className="overlay-right" onClick={() => setDrawerHidden(true)} />
    </aside>
  );
};

export default Drawer;
