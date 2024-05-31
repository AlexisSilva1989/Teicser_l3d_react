import React from "react";
import { Chrono } from "react-chrono";

const TimeLineTest = () => {
  const items = [
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices vestibulum turpis. Sed vel ullamcorper sapien. Donec convallis, erat non placerat tristique, nibh sapien pellentesque risus, sit amet tincidunt eros turpis et sapien. Vivamus eu luctus urna, non scelerisque leo. Fusce non mauris tortor. Suspendisse tincidunt, nunc at interdum faucibus, ante odio rutrum velit, id blandit metus mauris vitae augue. Morbi lacinia lectus id magna ultricies, eget eleifend mauris varius. Aenean convallis ut arcu sed finibus. Vivamus in dolor quam. In hac habitasse platea dictumst. In euismod purus tempus metus eleifend, a tempor magna congue. Donec eget malesuada lorem.",
    },
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      url: "http://www.history.com",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to..",
    },
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      url: "http://www.history.com",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to..",
    },
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      url: "http://www.history.com",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to..",
    },
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      url: "http://www.history.com",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to..",
    },
    {
      title: "May 1940",
      cardTitle: "Dunkirk",
      url: "http://www.history.com",
      cardSubtitle:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      cardDetailedText:
        "Men of the British Expeditionary Force (BEF) wade out to..",
      media: {
        type: "IMAGE",
        source: {
          url: "data:image/jpeg;base64,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",
        },
      },
    },
  ];

  return (
    <div style={{ width: "100%", height: "900px" }}>
      <Chrono
        items={items}
        mode="VERTICAL_ALTERNATING"
        cardHeight={"auto"}
        verticalItems={{
          expandedCardProps: {
            showCloseButton: false,
            button: <button>Custom a Here</button>,
          },
        }}
      />
    </div>
  );
};

export default TimeLineTest;
