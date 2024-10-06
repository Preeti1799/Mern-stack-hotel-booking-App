import Hotel from "../models/Hotel.js";
export const createHotel = async (req,res,next)=>{
    const newHotel = new Hotel(req.body);

try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
} catch (err) {
   next(err);
}
  }
export const updateHotel = async (req,res,next)=>{
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
             req.params.id, 
            { $set: req.body },
            { new:true }
        );
       res.status(200).json(updatedHotel);
     } catch (err) {
   next(err);
 }
  }
export const deleteHotel = async (req,res,next)=>{
    try {
        await Hotel.findByIdAndDelete(req.params.id);
           res.status(200).json("Hotel has been deleted.");
       } catch (err) {
         next(err);
 }
  }
export const getHotel = async (req,res,next)=>{
    try {
        const hotel = await Hotel.findById(req.params.id);
          res.status(200).json(hotel);
      } catch (err) {
   next(err);
 }
  }
  export const getHotels = async (req, res, next) => {
    const { min, max, featured, limit, ...others } = req.query;
  
    try {
      // Construct the query object
      const query = {
        ...others,
        cheapestPrice: { $gt: min || 1, $lt: max || 999 },
      };
  
      // Handle featured explicitly and convert to boolean
      if (featured !== undefined) {
        query.featured = featured === 'true'; // Convert 'true'/'false' strings to boolean
      }
  
      // Log the final query for debugging
      console.log('Query being sent to MongoDB:', query);
  
      // Convert limit to a number or set a default value if not provided
      const limitValue = Number(limit) || 10;
  
      // Execute the query and apply the limit
      const hotels = await Hotel.find(query).limit(limitValue);
  
      // Return the result
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };
  
  

  export const countByCity = async (req, res, next) => {
    // Check if cities query parameter is provided
    if (!req.query.cities) {
        return res.status(400).json({ error: "Cities query parameter is required." });
    }

    const cities = req.query.cities.split(",");
    
    try {
        // Map cities to counts
        const list = await Promise.all(cities.map(async (city) => {
            const count = await Hotel.countDocuments({ city });
            return { city, count };
        }));

        // Respond with the list of counts
        res.status(200).json(list);
    } catch (err) {
        next(err); // Pass the error to the error handling middleware
    }
};
export const countByType = async (req,res,next)=>{
  try{
  const hotelCount = await Hotel.countDocuments({type:"hotel"})
  const apartmentCount = await Hotel.countDocuments({ type:"apartment" });
  const resortCount = await Hotel.countDocuments({ type:"resort" });
  const villaCount = await Hotel.countDocuments({ type:"villa" });
  const cabinCount = await Hotel.countDocuments({ type:"cabin" }); 

        res.status(200).json ([
          {type: "hotel", count:hotelCount },
          {type: "apartments", count: apartmentCount },
          {type: "resorts", count: resortCount },
          {type: "villas", count: villaCount },
          {type: "cabins", count: cabinCount },
        ]);
    } catch (err) {
      next(err);
}
};

import Room from "../models/Room.js";

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  }catch (err) {
    next(err);
  }
};