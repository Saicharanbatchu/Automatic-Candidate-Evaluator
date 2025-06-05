import './Ab.css';
import { useState } from 'react'

const products = [
  {
    id: 1,
    title: "RESUME CLASSIFICATION",
    description: "Resume classification is the process of automatically categorizing resumes into predefined job roles or skill categories using machine learning or rule-based algorithms.",
    img: "ima/mykap.png",
    bgColor: "rgb(84, 81, 122)",
    textColor: "rgb(255, 255, 255)",
    link: "http://localhost:5173/Home",
  },
  {
    id: 2,
    title: "RESUME PARSING INFO",
    description: "Resume parsing is the automated extraction of important details like name, skills, education, and experience from resumes using algorithms or AI.",
    img: "ima/rrp.png",
    bgColor: "rgb(77, 77, 77)",
    textColor: "rgb(255, 255, 255)",
    link: "http://localhost:5173/Home",
  },
  {
    id: 3,
    title: "RESUME RANKING",
    description: "Resume ranking is the process of automatically evaluating and ordering resumes based on their relevance to a specific job description or set of criteria.",
    img: "ima/p1dp.png",
    bgColor: "rgb(0, 0, 0)",
    textColor: "rgb(255, 255, 255)",
    link: "http://localhost:5173/Home",
  },
];

function About() {

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleMenuClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="proj" id="proj">
      <div className="heading"><p>PRODUCTS WE OFFER</p></div>
      <br /><br /><br />
      <div className="navBottom">
        {products.map((product, idx) => (
          <h3 key={product.id} className="menuItem" onClick={() => handleMenuClick(idx)}>
            <p>{product.title}</p>
          </h3>
        ))}
      </div>

      <div className="slider">
        <div
          className="sliderWrapper"
          style={{ transform: `translateX(${-100 * currentSlide}vw)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="sliderItem">
              <img src={product.img} alt={product.title} className="sliderImg" />
              <div
                className="sliderBg"
                style={{ backgroundColor: product.bgColor }}
              ></div>
              <h1 className="sliderTitle">{product.title}</h1>
              <h2
                className="sliderPrice"
                style={{ color: product.textColor }}
              >
                {product.description}
              </h2>
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <button className="buyButton">Visit Element</button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
