import { useContext, useEffect, useState } from 'react';
import './Images.css';
import axios from 'axios';
import config from '../config';
import Loader from 'react-loader-spinner';
import SelectedTagContext from '../SelectedTagContext';

export default function Images() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const {selectedTag} = useContext(SelectedTagContext);

    useEffect(() => {
        const getImages = async () => {
            setLoading(true);
            const href = (selectedTag === 'all') ? config.host + 'api/images' : config.host + 'api/filteredImages?tag=' + selectedTag;
            await axios.get(href).then((res) => {
                setImages(res.data);
                setLoading(false);
            });
        }
        getImages();
    }, [selectedTag]);
    
    return(
        <div className="container">
            {
                loading ?
                <Loader 
                    type="Puff"
                    height={30}
                    width={30}
                    color="#145a8c"/>
                :
                <div className="imageContainer">
                    {
                        images.map(image => {
                            return(
                                <div className="image" key={image.id}>
                                    <img src={image.link} alt={image.name}></img>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    );
}