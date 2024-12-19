import React from "react";
import eyeIcon from '../assets/eye-white.svg';
import './navigation.css';

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1 className="text-black">
                  <img
                    src={eyeIcon}
                    alt="Eye Icon"
                    className="eye-icon-header"
                  />
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <a
                  href="#features"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Learn More
                </a>{" "}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={true}
                  className="video-background"
                  style={{ marginTop: 100}}
                >
                  <source src={require("../assets/intro.mp4")} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
