import Booking from '../../models/BookingModel.js'
import Vehicle from '../../models/vehicleModel.js'
import { errorHandler } from '../../utils/error.js'
import mongoose from 'mongoose'

export const vendorBookings = async (req, res, next) => {
    try {
        // Use the authenticated vendor's ID from verifyToken middleware
        const vendorId = req.user;

        if (!vendorId) {
            return next(errorHandler(401, "Vendor not authenticated"));
        }

        // First find all vehicles belonging to this vendor
        const vendorVehicles = await Vehicle.find({
            addedBy: vendorId,
            isDeleted: { $ne: "true" }
        });

        const vehicleIds = vendorVehicles.map(v => v._id);

        if (vehicleIds.length === 0) {
            return res.status(200).json([]);
        }

        // Then fetch only bookings for those vehicles
        const bookings = await Booking.aggregate([
            {
                $match: {
                    vehicleId: { $in: vehicleIds }
                }
            },
            {
                $lookup: {
                    from: "vehicles",
                    localField: "vehicleId",
                    foreignField: "_id",
                    as: "vehicleDetails",
                },
            },
            {
                $unwind: {
                    path: "$vehicleDetails",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);

        res.status(200).json(bookings);
    } catch (error) {
        console.log(error);
        next(errorHandler(500, "error in vendorBookings"));
    }
};