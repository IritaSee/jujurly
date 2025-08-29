import React from "react";
import Slider from "react-slick";

interface AppCarouselProps {
  children: React.ReactNode;
  settings?: object;
  dataAos?: string;
  dataAosDelay?: string;
}

const AppCarousel: React.FC<AppCarouselProps> = (props) => {
  const settings = {
    dots: true,

    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 5,
    //       slidesToScroll: 5,
    //     },
    //   },
    //   {
    //     breakpoint: 1280,
    //     settings: {
    //       slidesToShow: 4,
    //       slidesToScroll: 4,
    //     },
    //   },
    //   {
    //     breakpoint: 1010,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 3,
    //     },
    //   },
    //   {
    //     breakpoint: 768,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 2,
    //     },
    //   },
    //   {
    //     breakpoint: 640,
    //     settings: {
    //       slidesToShow: 1,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
  };
  return (
    <Slider
      data-aos={props.dataAos}
      data-aos-delay={props.dataAosDelay}
      {...(props.settings ? props.settings : settings)}
      className="h-auto "
    >
      {props.children}
    </Slider>
  );
};

export default AppCarousel;
