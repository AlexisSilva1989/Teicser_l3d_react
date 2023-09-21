import React, { useState } from "react";
import { CardContent } from "../../../Data/Models/Binnacle/Timeline";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation } from "swiper/core";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

interface Props {
  event: CardContent;
}

const TimeLineCardContent = ({ event }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const isExpandible =
    event?.cardDetailedText && event.cardDetailedText.length > 180;

  SwiperCore.use([Navigation, Autoplay]);

  const truncateDescription = `${event?.cardDetailedText?.slice(0, 180)} ...`;
  const componentsLength = event?.components?.length || 0;
  return (
    <div key={event.id} className="w-100">
      {event.images && (
        <div className="mb-3">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: ".timeline-slider-next",
              prevEl: ".timeline-slider-prev",
            }}
            centeredSlides
            centeredSlidesBounds
            autoplay={{
              delay: 5000,
            }}
            style={{
              position: "relative",
              borderRadius: 8,
            }}
          >
            {event.images.map((image) => (
              <SwiperSlide
                key={image.id}
                style={{
                  background: `URL("${image.url}")`,
                  height: "224px",
                  width: "224px",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              ></SwiperSlide>
            ))}
            <div
              className="timeline-slider-prev"
              style={{
                position: "absolute",
                left: 4,
                top: "50%",
                zIndex: 20,
                width: 18,
                height: 18,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "var(--warning)",
                cursor: "pointer",
                color: "var(--dark)",
                transform: "translateY(-50%)",
                borderRadius: "50%",
              }}
            >
              <i className="fas fa-angle-left" />
            </div>
            <div
              className="timeline-slider-next"
              style={{
                position: "absolute",
                right: 4,
                top: "50%",
                zIndex: 20,
                width: 18,
                height: 18,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "var(--warning)",
                cursor: "pointer",
                color: "var(--dark)",
                transform: "translateY(-50%)",
                borderRadius: "50%",
              }}
            >
              <i className="fas fa-angle-right" />
            </div>
          </Swiper>
        </div>
      )}
      <div>
        <div
          className="mb-3 border rounded py-2 d-flex flex-column"
          style={{
            height: "100%",
            maxHeight: 88,
            overflowY: componentsLength > 2 ? "scroll" : "auto",
            gap: 2,
          }}
        >
          {event.components?.map((component) => (
            <div className="bg-light px-2" key={component.id}>
              <div className="font-weight-bold" style={{ fontSize: 10 }}>
                {component.name}
              </div>
              <div className="font-weight-bold" style={{ fontSize: 10 }}>
                N° parte: {component.part_number}
              </div>
            </div>
          ))}
        </div>
        <div>
          {isExpandible
            ? isExpanded
              ? event.cardDetailedText
              : truncateDescription
            : event.cardDetailedText}
          <span
            onClick={() => setIsExpanded((state) => !state)}
            style={{
              cursor: "pointer",
              color: "var(--primary)",
              textDecoration: "underline",
              padding: "2px 1px",
              zIndex: 20,
            }}
          >
            {isExpandible && (isExpanded ? "Leer menos" : "Leer más")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimeLineCardContent;
