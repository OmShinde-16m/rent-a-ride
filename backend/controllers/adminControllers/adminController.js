import User from "../../models/userModel.js";
import Vehicle from "../../models/vehicleModel.js";
import Booking from "../../models/BookingModel.js";

export const adminAuth = async (req,res,next)=> {
    try{
        if(req.user.isAdmin){
            res.status(200).json({message:"admin loged in successfully"})
        }
        else{
            res.status(403).json({message:"only acces for admins"})
        }
        
    }
    catch(error){
        next(error)
    }
}

export const adminProfiile = async (req,res,next)=> {
    try{

    }
    catch(error){
        next(error)
    }
}

export const getDashboardStats = async (req, res, next) => {
    try {
        const totalVehicles = await Vehicle.countDocuments({ isDeleted: "false" });
        const totalBookings = await Booking.countDocuments({});
        const totalUsers = await User.countDocuments({ isUser: true });
        const totalVendors = await User.countDocuments({ isVendor: true });
        
        const bookings = await Booking.find({});
        const totalEarnings = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        res.status(200).json({
            totalVehicles,
            totalBookings,
            totalUsers,
            totalVendors,
            totalEarnings
        });
    } catch (error) {
        next(error);
    }
};

