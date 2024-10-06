import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

// User Registration
export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            ...req.body,
            password: hash,
        });

        await newUser.save();
        res.status(200).json({ message: "User has been created" });
    } catch (err) {
        console.error("Error during user registration:", err);
        next(err);
    }
};

// User Login
export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            console.log("User not found:", req.body.username);
            return res.status(404).json({ message: "User not found!" });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            console.log("Invalid credentials for user:", req.body.username);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Ensure the JWT secret is available
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        console.log("JWT_SECRET is set correctly");

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            jwtSecret, // Use the secret from environment variables
            { expiresIn: '1h' } // Optional: Token expiration time
        );

        // Decode the token to check for `isAdmin`
        const decodedToken = jwt.decode(token);
        console.log("Decoded token:", decodedToken);

        const { password, isAdmin, ...otherDetails } = user._doc;
        res
          .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure cookies in production
            sameSite: 'Strict', // Adjust based on your needs
          })
          .status(200)
          .json({ details: { ...otherDetails }, isAdmin });
    } catch (err) {
        console.error("Error during login:", err.message);
        next(err);
    }
};