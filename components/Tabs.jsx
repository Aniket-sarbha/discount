"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName
}) => {
  const [active, setActive] = useState(propTabs[0]);
  const [tabs, setTabs] = useState(propTabs);

  const moveSelectedTabToTop = (idx) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);

  return (<>
    <div
      className={cn(
        "flex flex-row items-center justify-center flex-wrap [perspective:1000px] relative overflow-hidden no-visible-scrollbar max-w-full w-full mt-[4rem] ",
        containerClassName
      )}>
      {propTabs.map((tab, idx) => (
        <div 
          key={tab.title} 
          className="mx-7 w-full sm:w-auto">
          <button
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            className={cn(
              "relative px-4 py-2 rounded-full w-full sm:w-auto text-center b",
              tabClassName
            )}
            style={{
              transformStyle: "preserve-3d",
            }}>
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-red-600 rounded-full ",
                  activeTabClassName
                )} />
            )}

            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        </div>
      ))}
    </div>
    
      <div className="flex justify-center items-center w-full">
        <FadeInDiv
          tabs={tabs}
          active={active}
          key={active.value}
          hovering={hovering}
          className={cn("mt-32", contentClassName)} />
      </div>
  
  </>);
};

const FadeInDiv = ({
  className,
  tabs,
  hovering
}) => {
  const isActive = (tab) => {
    return tab.value === tabs[0].value;
  };
  return (
    <div className="relative w-full max-w-6xl min-h-[50rem] mx-auto px-4">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            scale: 1 - idx * 0.1,
            top: hovering ? idx * -50 : 0,
            zIndex: -idx,
            opacity: idx < 3 ? 1 - idx * 0.1 : 0,
          }}
          animate={{
            y: isActive(tab) ? [0, 40, 0] : 0,
          }}
          className={cn(
            "w-full h-full absolute top-0 left-0",
            "md:h-[40rem] sm:h-[30rem] h-[25rem]",
            className
          )}>
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};

export default Tabs;