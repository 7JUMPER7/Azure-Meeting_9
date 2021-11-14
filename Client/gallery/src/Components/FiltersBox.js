import './FiltersBox.css';
import axios from 'axios';
import config from '../config';
import {useContext, useEffect, useState} from 'react';
import Loader from "react-loader-spinner";
import SelectedTagContext from '../SelectedTagContext';

export default function FiltersBox() {
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const {setSelectedTag} = useContext(SelectedTagContext);

    useEffect(() => {
        const getTags = async () => {
            await axios.get(config.host + 'api/tags').then((res) => {
                let arr = res.data;
                arr.splice(0, 0, {name: 'all'});
                setTags(arr);
            });
        }
        getTags();
    }, []);

    const uploadFile = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('file', e.target.querySelector('input').files[0]);

        axios.post(config.host + 'api/upload', formData).then(() => {
            setLoading(false);
        }).catch(() => setLoading(false));
    };

    return(
        <div className="container">
            <label>Tags:
                <select onChange={e => setSelectedTag(e.target.value)}>
                    {
                        tags.map((tag, i) => {
                            return(
                                <option key={i}>{tag.name}</option>
                            )
                        })
                    }
                </select>
            </label>
            <div className="uploader">
                {
                loading ?
                <Loader 
                    type="Puff"
                    height={30}
                    width={30}
                    color="#145a8c"/>
                :
                <form onSubmit={(e) => uploadFile(e)}>
                    <span>Load new image:</span>
                    <input type="file"></input>
                    <input type="submit" value="Upload"></input>
                </form>
                }
            </div>
        </div>
    );
}