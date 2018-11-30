import React from "react";

const Carousel = React.memo(() => (
  <div className="row justify-content-center">
    <div
      id="carousel"
      className="carousel slide carousel-fade w-75"
      data-ride="carousel"
    >
      <ol className="carousel-indicators">
        <li data-target="#carousel" data-slide-to="0" className="active" />
        <li data-target="#carousel" data-slide-to="1" />
        <li data-target="#carousel" data-slide-to="2" />
      </ol>
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            className="d-block w-100"
            src="/public/images/camera1.jpg"
            alt="First slide"
          />
        </div>
        <div className="carousel-item">
          <img
            className="d-block w-100"
            src="/public/images/notebook1.jpg"
            alt="Second slide"
          />
        </div>
        <div className="carousel-item">
          <img
            className="d-block w-100"
            src="/public/images/phone3.jpg"
            alt="Third slide"
          />
        </div>
      </div>
      <a
        className="carousel-control-prev"
        href="#carousel"
        role="button"
        data-slide="prev"
      >
        <span className="fas fa-chevron-left fa-4x" aria-hidden="true" />
        <span className="sr-only">Previous</span>
      </a>
      <a
        className="carousel-control-next"
        href="#carousel"
        role="button"
        data-slide="next"
      >
        <span className="fas fa-chevron-right fa-4x" aria-hidden="true" />
        <span className="sr-only">Next</span>
      </a>
    </div>
  </div>
));

export default Carousel;
