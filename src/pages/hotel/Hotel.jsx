import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch"; 
import { SearchContext } from "../../context/SearchContext.js";
import { AuthContext } from "../../context/AuthContext.js";
import Reserve from "../../components/reserve/Reserve.jsx";
import axios from "axios";

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const Hotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const { data, loading, error } = useFetch(`/hotels/find/${id}`);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { dates, options } = useContext(SearchContext);

  const pricePerNight = data?.cheapestPrice || 0;

  const startDate = dates?.[0]?.startDate ? new Date(dates[0].startDate) : new Date();
  const endDate = dates?.[0]?.endDate ? new Date(dates[0].endDate) : new Date(startDate.setDate(startDate.getDate() + 1));

  function dayDifference(date1, date2) {
    if (!date1 || !date2) return 1;
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays || 1;
  }

  const days = dayDifference(endDate, startDate);
  const rooms = options?.room || 1;
  const totalCost = days * pricePerNight * rooms;

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleMove = (direction) => {
    const newSlideNumber = direction === "l" 
      ? (slideNumber === 0 ? 5 : slideNumber - 1) 
      : (slideNumber === 5 ? 0 : slideNumber + 1);

    setSlideNumber(newSlideNumber);
  };

  const handleClick = () => {
    if (user) {
      setOpenModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleOpen = (index) => {
    setSlideNumber(index);
    setOpen(true);
  };

  const handleBookRoom = async (roomId) => {
    if (!roomId) {
      alert("Please select a room.");
      return;
    }

    try {
      const response = await axios.post('/api/bookings/book', {
        roomId,
        bookingDates: [startDate.toISOString(), endDate.toISOString()], // Your booking dates
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error.response.data.message);
      alert("Error: " + error.response.data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <Header type="list" />
      {loading ? (
        "Loading..."
      ) : error ? (
        <div>Error fetching hotel data. Please try again later.</div>
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                {data?.photos && (
                  <img
                    src={data.photos[slideNumber]?.src || "fallback-image-url.jpg"}
                    alt=""
                    className="sliderImg"
                  />
                )}
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <button className="bookNow" onClick={handleClick}>Reserve or Book Now!</button>
            <h1 className="hotelTitle">{data?.name}</h1>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data?.address}</span>
            </div>
            <span className="hotelDistance">
              Excellent location – {data?.distance} from center
            </span>
            <span className="hotelPriceHighlight">
              Book a stay over {formatCurrency(pricePerNight)} at this property and get a free airport taxi
            </span>
            <div className="hotelImages">
              {data?.photos?.map((photo, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={photo.src}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">{data?.title}</h1>
                <p className="hotelDesc">
                  {data?.desc}
                </p>
              </div>
              <div className="hotelDetailsPrice">
                <h1>Select your rooms:</h1>
                {data.roomNumbers && data.roomNumbers.length > 0 ? (
                  <div>
                    {data.roomNumbers.map((room, i) => (
                      <div key={i} className="roomOption">
                        <input
                          type="radio"
                          name="selectedRoom"
                          value={room._id}
                          onChange={() => setSelectedRoomId(room._id)}
                        />
                        <label>{`Room ${room.number} - $${room.price}`}</label>
                      </div>
                    ))}
                    <button onClick={() => handleBookRoom(selectedRoomId)}>
                      Reserve or Book Now!
                    </button>
                  </div>
                ) : (
                  <p>No rooms available.</p>
                )}
                <h2>
                  <b>{formatCurrency(totalCost)}</b> ({days} {days === 1 ? "night" : "nights"})
                </h2>
              </div>
            </div>
          </div>
          <MailList />
          <Footer />
        </div>
      )}
      {openModal && <Reserve setOpen={setOpenModal} hotelId={id} />}
    </div>
  );
};

export default Hotel;
