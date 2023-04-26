import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";
import roadIcon from "../assets/svg/roadIcon.svg";
import pistonIcon from "../assets/svg/pistonIcon.svg";

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink"
      >
        <img
          src={listing.imgUrls[0]}
          alt="{listing.name}"
          className="categoryListingImg"
        />
        <div className="categoryListingDetails">
          <p className="categoryListingName">{listing.name}</p>
          <p className="categoryListingLocation">{listing.subHeadline}</p>
          <p className="categoryListingPrice">
            $
            {listing.isDiscounted
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / Month"}
          </p>

          <div className="categoryListingInfoDiv">
            <div className="listingItem-stats-icons">
              <img style={{ paddingTop: "3%" }} src={roadIcon} alt="road" />
              <p className="categoryListingInfoText">
                {listing.miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                miles
              </p>
            </div>

            <div className="listingItem-stats-icons">
              <img style={{ paddingTop: "3%" }} src={pistonIcon} alt="piston" />
              <p className="categoryListingInfoText">
                {listing.displacement
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                cc
              </p>
            </div>
          </div>
        </div>
      </Link>
      <div className="edit-items">
        {onDelete && (
          <DeleteIcon
            className="removeIcon"
            fill="rgb(231, 76, 60)"
            onClick={() => onDelete(listing.id, listing.name)}
          />
        )}

        {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
      </div>
    </li>
  );
}

export default ListingItem;
