import React, { useState } from "react";
import { CardContent } from "../../../Data/Models/Binnacle/Timeline";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation } from "swiper/core";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import ScrollBar from "react-perfect-scrollbar";

interface Props {
  event: CardContent;
}

const TimeLineCardContent = ({ event }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  SwiperCore.use([Navigation, Autoplay]);

  return (
    <div
      key={event.id}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <ScrollBar className="w-100 d-flex flex-column" style={{ gap: 16 }}>
        {event.events?.map((eventItem, index) => {
          const isExpandible =
            eventItem?.description && eventItem.description.length > 180;
          const componentsLength = eventItem?.components?.length || 0;
          const truncateDescription = `${eventItem?.description?.slice(
            0,
            180
          )} ...`;
          const length = event.events?.length || 0;

          const descriptionsWithLinksAsATag = eventItem?.description?.replace(
            /((http|https):\/\/[^\s]+)/g,
            (url) => `\n<a href="${url}" target="_blank">${url}</a>\n`
          );

          const URLsFromDescriptionList = eventItem?.description?.match(
            /((http|https):\/\/[^\s]+)/g
          );

          return (
            <div
              style={{
                borderBottom:
                  index === length - 1
                    ? "none"
                    : "1.5px solid var(--secondary)",
                paddingBottom: 16,
              }}
            >
              <h2
                className="mb-2"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1c5bd8",
                }}
              >
                {eventItem.title}
              </h2>
              <small
                className="mb-2"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--secondary)",
                }}
              >
                {eventItem.equipment}
              </small>

              {eventItem.media && (
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
                    {eventItem.media.map((image) => (
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
                {(eventItem?.components?.length ?? 0) > 0 && (
                  <div
                    className="mb-3 border rounded py-2 d-flex flex-column"
                    style={{
                      height: "100%",
                      maxHeight: 88,
                      overflowY: componentsLength > 2 ? "scroll" : "auto",
                      gap: 2,
                    }}
                  >
                    {eventItem.components?.map((component) => (
                      <div className="bg-light px-2 d-flex " key={component.id}>
                        <div
                          style={{
                            padding: "0 8px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <span>{component.location}</span>
                        </div>
                        <div>
                          <div
                            className="font-weight-bold"
                            style={{ fontSize: 10 }}
                          >
                            {component.name}
                          </div>
                          <div
                            className="font-weight-bold"
                            style={{ fontSize: 10 }}
                          >
                            N° parte: {component.part_number}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  {isExpandible ? (
                    isExpanded ? (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: descriptionsWithLinksAsATag,
                        }}
                      ></p>
                    ) : (
                      truncateDescription
                    )
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: descriptionsWithLinksAsATag,
                      }}
                    ></p>
                  )}

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
        })}
      </ScrollBar>
    </div>
  );
};

export default TimeLineCardContent;
