import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

function CreateListing() {
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    miles: 1,
    displacement: 1,
    cleanTitle: false,
    testRide: false,
    subHeadline: "",
    isDiscounted: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    description: "",
  });

  const {
    type,
    name,
    miles,
    displacement,
    cleanTitle,
    testRide,
    subHeadline,
    isDiscounted,
    regularPrice,
    discountedPrice,
    images,
    description,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setLoading(true);

    // Store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    // delete formDataCopy.address
    !formDataCopy.isDiscounted && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div id="create-listing-page" className="profile">
      <header>
        <p className="pageHeader">Create a listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sale" ? "formButtonActive" : "formButton"}
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>

          <label className="formLabel">Name</label>
          <input
            className="formInputName"
            type="text"
            id="name"
            value={name}
            onChange={onMutate}
            maxLength="32"
            minLength="10"
            required
          />

          <div className="miles-displacement">
            <div>
              <label className="formLabel">Miles</label>
              <input
                className="formInputSmall"
                type="number"
                id="miles"
                value={miles}
                onChange={onMutate}
                min="1"
                max="100,000"
                required
              />
            </div>
            <div>
              <label className="formLabel">Displacement</label>
              <input
                className="formInputSmall"
                type="number"
                id="displacement"
                value={displacement}
                onChange={onMutate}
                min="1"
                max="3000"
                required
              />
            </div>
          </div>

          <label className="formLabel">Clean title on hand</label>
          <div className="formButtons">
            <button
              className={cleanTitle ? "formButtonActive" : "formButton"}
              type="button"
              id="cleanTitle"
              value={true}
              onClick={onMutate}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              className={
                !cleanTitle && cleanTitle !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="cleanTitle"
              value={false}
              onClick={onMutate}
            >
              no
            </button>
          </div>
          <label className="formLabel">Test ride available</label>
          <div className="formButtons">
            <button
              className={testRide ? "formButtonActive" : "formButton"}
              type="button"
              id="testRide"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !testRide && testRide !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="testRide"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Sub headline</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="subHeadline"
            value={subHeadline}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Discount</label>
          <div className="formButtons">
            <button
              className={isDiscounted ? "formButtonActive" : "formButton"}
              type="button"
              id="isDiscounted"
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !isDiscounted && isDiscounted !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              type="button"
              id="isDiscounted"
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              type="number"
              className="formInputSmall"
              id="regularPrice"
              value={regularPrice}
              onChange={onMutate}
              min="50"
              max="750000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ / Month</p>}
          </div>

          {isDiscounted && (
            <>
              <label className="formLabel">Discounted Price</label>
              <input
                type="number"
                className="formInputSmall"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required={isDiscounted}
              />
            </>
          )}

          <label className="formLabel">Description</label>
          <textarea
            className="formInputAddress"
            type="text"
            id="description"
            value={description}
            onChange={onMutate}
            required
          />

          <label className="formLabel">Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6).
          </p>
          <input
            type="file"
            className="formInputFile"
            id="images"
            onChange={onMutate}
            max="6"
            accept=".jpg,.png,.jpeg"
            multiple
            required
          />

          <button
            id="create-listing-button"
            className="primaryButton createListingButton"
            type="submit"
          >
            Create Listing
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateListing;
