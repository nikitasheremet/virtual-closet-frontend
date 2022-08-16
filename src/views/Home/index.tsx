import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ImageUpload from "../../components/Home/ImageUpload";
import ImageCard from "../../components/Home/ImageCard";
import ImageDetails from "../../components/Home/ImageDetails";
import serverRequest from "../../helpers/serverRequest";
import Navbar from "../../components/Navbar";
import { ImageDetailsInterface } from "../../components/Home/types/ImageTypes";
import styled from "styled-components";
import { ReactComponent as AddIcon } from "../../assests/add-button.svg";

function Main() {
  let history = useHistory();
  const [userImages, setUserImages] = useState<ImageDetailsInterface[]>([]);
  const [isUploadModalShown, toggleUploadModalShownState] = useState(false);
  const [isImageDetailsShown, togglIsImageDetailsShown] = useState(false);
  const [selectedImageDetails, setImageDetails] = useState<
    ImageDetailsInterface | {}
  >({});
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const addPictureClick = (): void => {
    toggleUploadModalShownState(true);
  };
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTags((state) => [...state, e.target.name]);
    } else {
      setSelectedTags((state) =>
        state.filter((selectedTag) => selectedTag !== e.target.name)
      );
    }
  };

  useEffect(() => {
    const arrayOfTags = userImages.reduce((allTags, userImage) => {
      if (userImage.tags) {
        return [...allTags, ...userImage.tags];
      } else {
        return allTags;
      }
    }, [] as string[]);

    setTags(Array.from(new Set(arrayOfTags)));
  }, [userImages]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const result = await serverRequest(
          "get",
          `image/showPictures`,
          {},
          history
        );
        if (result) {
          console.log(result);
          setUserImages(result);
        }
      } catch (err) {
        console.log("Could not fetch images", err);
      }
    }
    fetchImages();
  }, [history]);
  const filterImagesBasedOnTags = (image) => {
    if (!selectedTags.length) {
      return true;
    }
    const selectedTagsPresentInImageTag = image.tags
      ?.map((imageTag) => {
        if (selectedTags.includes(imageTag)) {
          return imageTag;
        } else {
          return undefined;
        }
      })
      .filter((tag) => tag);
    if (selectedTagsPresentInImageTag?.length) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <>
      <Navbar />
      <div>
        <AddImageButton onClick={addPictureClick}>
          <AddIcon width="100%" />
        </AddImageButton>
        {isUploadModalShown && (
          <ImageUpload
            toggleUploadModalShownState={toggleUploadModalShownState}
            setUserImages={setUserImages}
          ></ImageUpload>
        )}
        {tags.map((tag) => {
          return (
            <div key={tag + Number(tag)}>
              <input
                type="checkbox"
                onChange={handleTagChange}
                checked={selectedTags.includes(tag)}
                id={tag}
                className="tag-checkbox-filter"
                name={tag}
              ></input>
              <label htmlFor={tag}>{tag}</label>
            </div>
          );
        })}
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
        >
          {userImages?.map((image) => {
            if (filterImagesBasedOnTags(image)) {
              return (
                <ImageCard
                  toggleIsImageDetailsShown={togglIsImageDetailsShown}
                  setImageDetails={setImageDetails}
                  key={image._id}
                  imageDetails={image}
                />
              );
            } else {
              return undefined;
            }
          })}
        </div>
        <div>
          {isImageDetailsShown && (
            <ImageDetails
              setUserImages={setUserImages}
              toggleIsImageDetailsShown={togglIsImageDetailsShown}
              selectedImageDetails={selectedImageDetails}
              setImageDetails={setImageDetails}
            ></ImageDetails>
          )}
        </div>
      </div>
    </>
  );
}

export default Main;

const AddImageButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 10px;
  border-radius: 50px;
  height: 80px;
  width: 80px;
  font-size: 60px;
  font-weight: lighter;
`;
