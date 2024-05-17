import React, { useEffect, useState } from "react";
import "./TileGroup.scss";
import TrailCard from "../TrailCard/TrailCard";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FcFilledFilter } from "react-icons/fc";
import Popover from "@mui/material/Popover";

const TileGroup = (props) => {
    const slideLeft = () => {
        const slider = document.getElementById(`slider${props.childNo}`);
        slider.scrollLeft -= 325;
    };

    const slideRight = () => {
        const slider = document.getElementById(`slider${props.childNo}`);
        slider.scrollLeft += 325;
    };

    const handleArrowVisibility = () => {
        const slider = document.getElementById(`slider${props.childNo}`);
        const leftArrow = document.getElementById(`arrow-left${props.childNo}`);
        const rightArrow = document.getElementById(
            `arrow-right${props.childNo}`
        );

        if (!slider) return;

        if (
            slider.scrollLeft === 0 ||
            slider.scrollWidth <= slider.clientWidth
        ) {
            leftArrow.style.display = "none";
        } else {
            leftArrow.style.display = "block";
        }

        if (
            slider.scrollWidth <= slider.clientWidth ||
            slider.scrollLeft + slider.clientWidth >= slider.scrollWidth
        ) {
            rightArrow.style.display = "none";
        } else {
            rightArrow.style.display = "block";
        }
    };

    useEffect(() => {
        handleArrowVisibility();
        const slider = document.getElementById(`slider${props.childNo}`);
        if (slider) slider.addEventListener("scroll", handleArrowVisibility);
    });

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getFilterContent = () => {
        if (!props.popoverContent) return <></>;
        return (
            <>
                <FcFilledFilter className="filter-icon" onClick={handleClick} />
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    {props.popoverContent}
                </Popover>
            </>
        );
    };

    return (
        <div className="tile-group">
            <div className="title-container">
                <span className="title">
                    {props.title} &nbsp; &nbsp;
                    {getFilterContent()}
                </span>
            </div>
            <div className="tile-group-parent">
                {props?.trails?.length > 0 ? (
                    <>
                        <MdChevronLeft
                            className="arrow arrow-left"
                            id={`arrow-left${props.childNo}`}
                            size={40}
                            onClick={slideLeft}
                        />
                        <div
                            id={"slider" + props.childNo}
                            className="tile-group-container disable-scrollbars"
                        >
                            {props?.trails?.map((trail, index) => {
                                return (
                                    <div
                                        className="trail-card-parent"
                                        key={index}
                                    >
                                        <TrailCard trail={trail} />
                                    </div>
                                );
                            })}
                        </div>
                        <MdChevronRight
                            className="arrow arrow-right"
                            id={`arrow-right${props.childNo}`}
                            size={40}
                            onClick={slideRight}
                        />
                    </>
                ) : (
                    <div className="empty-trails">
                        <h1>No Matching Trails!</h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TileGroup;
