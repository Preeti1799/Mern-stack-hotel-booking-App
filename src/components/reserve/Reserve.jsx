import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./reserve.css";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import useFetch from "../../hooks/useFetch";
import { useState, useContext } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios"; // Import axios for making API requests

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const date = new Date(start.getTime());

    let list = [];

    while (date <= end) {
      list.push(new Date(date.getTime()));
      date.setDate(date.getDate() + 1);
    }

    return list;  // Return the list of dates
  };

  // Ensure dates is not undefined or null before accessing its properties
  const alldates = dates && dates.length > 0 
    ? getDatesInRange(dates[0].startDate, dates[0].endDate) 
    : [];

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some(date =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const handleClick = async () => {
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          return axios.put(`/rooms/availability/${roomId}`, {
            dates: alldates,
          });
        })
      );
      alert("Rooms reserved successfully!");
      setOpen(false);
    } catch (err) {
      console.error("Error reserving rooms:", err);
    }
  };

  console.log("Selected rooms:", selectedRooms);
  console.log("Fetched data:", data);

  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon 
          icon={faCircleXmark} 
          className="rClose" 
          onClick={() => setOpen(false)} 
        />
        <span>Select your rooms:</span>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error fetching rooms: {error.message}</div>
        ) : data.length === 0 ? (
          <div>No rooms available.</div>
        ) : (
          data.map((item) => (
            <div className="rItem" key={item._id}>
              <div className="rItemInfo">
                <div className="rTitle">{item.title || "No title available"}</div>
                <div className="rDesc">{item.desc || "No description available"}</div>
                <div className="rMax">
                  Max people: <b>{item.maxPeople || "N/A"}</b>
                </div>
                <div className="rPrice">{item.price || "N/A"}</div>
              </div>
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          ))
        )}
        <button onClick={handleClick} className="rButton">Reserve Now!</button>
      </div>
    </div>
  );
};

export default Reserve;
