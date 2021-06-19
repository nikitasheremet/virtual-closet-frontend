import { Fragment, useEffect, useState } from "react";
import axios from "axios"
import {
    Link,
    useHistory
  } from "react-router-dom";
import ImageUpload from "./ImageUpload";

function Main() {
  const [userImages, setUserImages] = useState([])
  const [isUploadModalShown, toggleUploadModalShownState] = useState(false)
  const addPictureClick = () => {
    toggleUploadModalShownState(true)
  }

  
    let history = useHistory();
    async function fetchImages() {
        const authToken = localStorage.getItem('closetlyToken')
        if (authToken) {
            const pictureList = await axios.get('http://localhost:3000/showPictures', {headers: {'Authorization': `Basic ${authToken}`}}).catch(err => {
                if (err.response.status === 403) {
                    history.push('/login')
                } 
            })
            if (pictureList && pictureList.data) {
              setUserImages(pictureList.data)
            }
            
        } else {
            history.push('/login')
        }
        
    }

    useEffect(() => {
        fetchImages()
        // eslint-disable-next-line
    }, [])
 return (
  <Fragment>
      <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/account">Account</Link>
            </li>
            <li>
              <Link to="/login">Login Page</Link>
            </li>
          </ul>
        </nav>
      <div>
        <div>
          <button onClick={addPictureClick}>Add Picture</button>
          {isUploadModalShown && <ImageUpload toggleUploadModalShownState={toggleUploadModalShownState} setUserImages={setUserImages}></ImageUpload>}
        </div>
        {userImages.map(image => {
          return (<img key={image.name} src={image.url} alt="" width="200px"/>)
        })}
      </div>
  </Fragment>
 )
}

export default Main;