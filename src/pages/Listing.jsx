import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/a11y";

import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        className="swiper-main"
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.isDiscounted
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.subHeadline}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.isDiscounted && (
          <p className="discountPrice">
            Discounted by ${listing.regularPrice - listing.discountedPrice}
          </p>
        )}
        <div>
          <ul className="listingDetailsList">
            <li>
              {listing.miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              miles
            </li>
            <li>
              {listing.displacement
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              cc
            </li>
            <li>{listing.cleanTitle && "Clean title"} </li>
            <li>
              {listing.testRide
                ? "Owner allows test rides"
                : "Owner does not allow test rides"}{" "}
            </li>
          </ul>
        </div>

        <div className="listing-description-box">
          {listing.description && <p>{listing.description}</p>}
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
            id="contactOwner-button"
          >
            Contact Owner
          </Link>
        )}

        {listing.type === "rent" && (
          <Link
            style={{ marginTop: "1rem" }}
            to={"/category/rent"}
            className="primaryButton"
            id="contactOwner-button"
          >
            Go Back
          </Link>
        )}

        {listing.type === "sale" && (
          <Link
            style={{ marginTop: "1rem" }}
            to={"/category/sale"}
            className="primaryButton"
            id="contactOwner-button"
          >
            Go Back
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
