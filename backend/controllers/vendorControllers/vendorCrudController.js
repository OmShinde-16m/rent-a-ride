import { errorHandler } from "../../utils/error.js";
import vehicle from "../../models/vehicleModel.js";

import { uploader } from "../../utils/cloudinaryConfig.js";
import { base64Converter } from "../../utils/multer.js";
import Vehicle from "../../models/vehicleModel.js";

// vendor add vehicle
export const vendorAddVehicle = async (req, res, next) => {
  try {
    console.log("Vendor Add Vehicle Request:", {
      body: Object.keys(req.body),
      filesCount: req.files ? req.files.length : 0,
      userId: req.user,
    });

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(errorHandler(400, "Request body cannot be empty"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      fuel_type,
      description,
      seat,
      transmition_type,
      registeration_end_date,
      insurance_end_date,
      polution_end_date,
      car_type,
      location,
      district,
    } = req.body;

    // Use authenticated user's ID as addedBy (more secure than trusting request body)
    const vendorId = req.user;

    // Validate required fields
    if (!registeration_number || !company || !name || !model || !fuel_type || !seat || !transmition_type) {
      return next(errorHandler(400, "Missing required fields"));
    }

    const uploadedImages = [];

    // Handle image upload if images are provided
    if (req.files && req.files.length > 0) {
      //converting the buffer to base64
      const encodedFiles = base64Converter(req);

      try {
        //mapping over encoded files and uploading to cloudinary
        await Promise.all(
          encodedFiles.map(async (cur) => {
            try {
              const result = await uploader.upload(cur.data, {
                public_id: cur.filename,
              });
              uploadedImages.push(result.secure_url);
            } catch (error) {
              console.error("Cloudinary upload error:", error.message);
            }
          })
        );
      } catch (error) {
        console.error("Image conversion error:", error);
        return next(errorHandler(500, "Could not process images: " + error.message));
      }
    }

    try {
      const addVehicle = new vehicle({
        registeration_number,
        company,
        name,
        image: uploadedImages.length > 0 ? uploadedImages : [],
        model,
        car_title: title,
        car_description: description,
        base_package,
        price,
        year_made,
        fuel_type,
        seats: seat,
        transmition: transmition_type,
        insurance_end: insurance_end_date,
        registeration_end: registeration_end_date,
        pollution_end: polution_end_date,
        car_type,
        created_at: Date.now(),
        location,
        district,
        isAdminAdded: "false",
        addedBy: vendorId,
        isAdminApproved: false,
      });

      await addVehicle.save();
      res.status(200).json({
        message: "Vehicle added successfully",
      });
    } catch (error) {
      console.error("Database save error:", error);
      if (error.code === 11000) {
        return next(errorHandler(409, "Vehicle already exists"));
      }
      next(errorHandler(500, "Failed to save vehicle: " + error.message));
    }
  } catch (error) {
    console.error("Vendor Add Vehicle Error:", error);
    next(errorHandler(500, "Vehicle upload failed: " + error.message));
  }
};

//edit vendorVehicles
export const vendorEditVehicles = async (req, res, next) => {
  try {
    //get the id of vehicle to edit through req.params
    const vehicle_id = req.params.id;

    if (!vehicle_id) {
      return next(errorHandler(401, "cannot be empty"));
    }

    if (!req.body || !req.body.formData) {
      return next(errorHandler(404, "Add data to edit first"));
    }

    const {
      registeration_number,
      company,
      name,
      model,
      title,
      base_package,
      price,
      year_made,
      description,
      Seats,
      transmitionType,
      Registeration_end_date,
      insurance_end_date,
      polution_end_date,
      carType,
      fuelType,
      vehicleLocation,
      vehicleDistrict,
    } = req.body.formData;

    try {
      const edited = await Vehicle.findByIdAndUpdate(
        vehicle_id,
        {
          registeration_number,
          company,
          name,
          model,
          car_title: title,
          car_description: description,
          base_package,
          price,
          year_made,
          fuel_type: fuelType,
          seats: Seats,
          transmition: transmitionType,
          insurance_end: insurance_end_date,
          registeration_end: Registeration_end_date,
          pollution_end: polution_end_date,
          car_type: carType,
          updated_at: Date.now(),
          location: vehicleLocation,
          district: vehicleDistrict,
          //also resetting adminApproval or rejection when editing data so data request is send again
          isAdminApproved: false,
          isRejected: false,
        },

        { new: true }
      );
      if (!edited) {
        return next(errorHandler(404, "data with this id not found"));
      }

      res.status(200).json(edited);
    } catch (error) {
      if (error.code == 11000 && error.keyPattern && error.keyValue) {
        const duplicateField = Object.keys(error.keyPattern)[0];
        const duplicateValue = error.keyValue[duplicateField];

        return next(
          errorHandler(
            409,
            `${duplicateField} '${duplicateValue}' already exists`
          )
        );
      }
    }
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "something went wrong"));
  }
};

//delete vendor Vehcile soft delete
export const vendorDeleteVehicles = async (req, res, next) => {
  try {
    const vehicle_id = req.params.id;
    const softDeleted = await vehicle.findOneAndUpdate(
      { _id: vehicle_id },
      { isDeleted: "true" },
      { new: true }
    );
    if (!softDeleted) {
      next(errorHandler(400, "vehicle not found"));
      return;
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error while vendorDeleteVehilces"));
  }
};

//show vendor vehicles
export const showVendorVehicles = async (req, res, next) => {
  try {
    // Use req.user from verifyToken middleware (more secure than req.body)
    // Fall back to req.body._id for backward compatibility
    const vendorId = req.user || (req.body && req.body._id);

    if (!vendorId) {
      return next(errorHandler(400, "User ID not found"));
    }

    console.log("Fetching vehicles for vendor:", vendorId);

    const vendorsVehicles = await Vehicle.find({
      isDeleted: { $ne: "true" },
      addedBy: vendorId,
    });

    console.log("Found vehicles:", vendorsVehicles.length);

    res.status(200).json(vendorsVehicles);
  } catch (error) {
    console.error("Error in showVendorVehicles:", error);
    next(errorHandler(500, "Error in showVendorVehicles"));
  }
};
