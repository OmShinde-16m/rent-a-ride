import User from "../../models/userModel.js";
import Vehicle from "../../models/vehicleModel.js";
import Booking from "../../models/BookingModel.js";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import { errorHandler } from "../../utils/error.js";


const expireDate = new Date(Date.now() + 3600000);

export const vendorSignup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hadshedPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({
      username,
      password: hadshedPassword,
      email,
      isVendor: true,
    });
    await user.save();
    res.status(200).json({ message: "vendor created successfully" });
  } catch (error) {
    next(error);
  }
};

export const vendorSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validVendor = await User.findOne({ email }).lean();
    if (!validVendor || !validVendor.isVendor) {
      return next(errorHandler(404,"user not found"))
    }
    const validPassword = bcryptjs.compareSync(password, validVendor.password);
    if (!validPassword) {
      return next(errorHandler(404,"wrong credentials"));
    }
   
    const token = Jwt.sign({ id: validVendor._id }, process.env.ACCESS_TOKEN);
    const refreshToken = Jwt.sign({ id: validVendor._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });

    await User.updateOne({ _id: validVendor._id }, { refreshToken });

    const { password: hadshedPassword, ...rest } = validVendor;

    res.status(200).json({
      ...rest,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const vendorSignout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "vendor signedout successfully" });
  } catch (error) {
    next(error);
  }
};


//vendor login or signup with google

export const vendorGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).lean();
    if (user && user.isVendor) {
      const { password: hashedPassword, ...rest } = user;
      const accessToken = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
        expiresIn: "15m",
      });
      const refreshToken = Jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
        expiresIn: "7d",
      });

      await User.updateOne({ _id: user._id }, { refreshToken });

      res
        .status(200)
        .json({
          ...rest,
          accessToken,
          refreshToken,
        });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        profilePicture: req.body.photo,
        password: hashedPassword,
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        isVendor:true,
      });
      try{
        const savedUser = await newUser.save();
        const userObject = savedUser.toObject();
     
        const accessToken = Jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN, {
          expiresIn: "15m",
        });
        const refreshToken = Jwt.sign({ id: newUser._id }, process.env.REFRESH_TOKEN, {
          expiresIn: "7d",
        });

        await User.updateOne({ _id: newUser._id }, { refreshToken });

        const { password: hashedPassword2, ...rest } = userObject;
        res
          .status(200)
          .json({
            ...rest,
            accessToken,
            refreshToken,
          });
      }
      catch(error){
        if(error.code === 11000){
          return next(errorHandler(409,"email already in use"))
        }
        next(error)
      }
     
    }
  } catch (error) {
    next(error);
  }
};

export const getVendorDashboardStats = async (req, res, next) => {
  try {
    const vendorId = req.user;
    
    console.log("=== VENDOR DASHBOARD STATS REQUEST ===");
    console.log("Vendor ID from token:", vendorId);
    console.log("Vendor ID type:", typeof vendorId);
    
    // Query for vendor's vehicles
    const vendorVehicles = await Vehicle.find({ 
      addedBy: vendorId, 
      isDeleted: { $ne: "true" } 
    });
    
    console.log("Query criteria:", { addedBy: vendorId, isDeleted: { $ne: "true" } });
    console.log("Found vendor vehicles:", vendorVehicles.length);
    
    if (vendorVehicles.length > 0) {
      console.log("Sample vehicle addedBy:", vendorVehicles[0].addedBy);
      console.log("Sample vehicle addedBy type:", typeof vendorVehicles[0].addedBy);
    }
    
    const vehicleIds = vendorVehicles.map(v => v._id);
    
    // Query for bookings on vendor's vehicles
    const bookings = await Booking.find({ vehicleId: { $in: vehicleIds } });
    
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => b.status === "booked" || b.status === "onTrip").length;
    const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const result = {
      totalVehicles: vendorVehicles.length,
      totalBookings,
      activeBookings,
      totalEarnings
    };

    console.log("Dashboard stats result:", result);
    console.log("=== END VENDOR DASHBOARD STATS ===\n");

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching vendor dashboard stats:", error);
    next(error);
  }
};
