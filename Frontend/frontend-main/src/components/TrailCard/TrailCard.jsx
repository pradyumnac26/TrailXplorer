import React from "react";
import { Link } from "react-router-dom";
import styles from "./TrailCard.module.css";
import { getImageURL } from "../../requests";

const TrailCard = (props) => {
    const dataToSend = { props };
    const getTags = () => {
        const tags = [];
        for (let i = 0; i < Math.min(props?.trail?.features.length, 4); i++) {
            tags.push(
                <span key={props?.trail?.features[i]}>
                    {props?.trail?.features[i]}
                </span>
            ); // Use the feature as a key if it's unique
        }
        return tags;
    };

    const getStars = () => {
        const stars = [];
        let rating = Number(props?.trail?.avg_rating);
        for (let i = 0; i < 5; i++) {
            stars.push(
                <i
                    key={i} // Add a unique key prop here
                    className={`fa ${
                        rating >= 1
                            ? "fa-star"
                            : rating > 0
                            ? "fa-star-half-o"
                            : "fa-star-o"
                    } ${styles.fa}`}
                    aria-hidden="true"
                ></i>
            );
            rating--;
        }
        return stars;
    };

    return (
        <Link
            to={{
                pathname: `/${props.trail.state_name}/${props.trail.trail_id}`,
                state: { trail: dataToSend.trail }, // Pass the trail data in the state object
            }}
            style={{ textDecoration: "none" }}
        >
            {" "}
            {/* Use props.trail.id or any identifier */}
            <button className={styles.card}>
                <div className={styles.poster}>
                    <img
                        alt="trail"
                        src={
                            props?.trail?.photo_references
                                ? getImageURL(props?.trail?.trail_id, 0)
                                : "https://images.pexels.com/photos/554609/pexels-photo-554609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        }
                    />
                </div>
                <div className={styles.details}>
                    <h2 className={styles.capitalize}>
                        {props?.trail?.name}
                        <br></br>
                        <span>
                            {props?.trail?.city_name +
                                ", " +
                                props?.trail?.state_name}
                        </span>
                    </h2>
                    <div className={styles.rating}>
                        {getStars()}
                        <span>{props?.trail?.avg_rating}/5</span>
                    </div>
                    <div className={styles.tags}>{getTags()}</div>
                    <div className={styles.info}>
                        <p>{props?.trail?.description}</p>
                    </div>
                </div>
            </button>
        </Link>
    );
};

export default TrailCard;
