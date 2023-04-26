import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.png";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.png";
import Slider from "../components/Slider";

function Listings() {
  return (
    <div className="listings">
      <header>
        <p style={{ textAlign: "center" }} className="pageHeader">
          Listings
        </p>
      </header>

      <main>
        <Slider />
        <p className="listingsCategoryHeading">Categories</p>
        <div className="listingsCategories">
          <Link to="category/sale">
            <img
              src={sellCategoryImage}
              alt="sell"
              className="listingsCategoryImg"
            />
            <p className="listingsCategoryName">Motorcycles for sale</p>
          </Link>
          <Link to="category/rent">
            <img
              src={rentCategoryImage}
              alt="rent"
              className="listingsCategoryImg"
            />
            <p className="listingsCategoryName">Motorcycles for rent</p>
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Listings;
