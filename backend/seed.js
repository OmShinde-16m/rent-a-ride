import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/userModel.js";
import Vehicle from "./models/vehicleModel.js";
import MasterData from "./models/masterDataModel.js";
import Booking from "./models/BookingModel.js";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

dotenv.config();

const mongoUri = process.env.mongo_uri;

const seedData = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await MasterData.deleteMany({});
    console.log("Cleared existing data");

    try {
      await User.collection.dropIndex("phoneNumber_1");
    } catch (e) {}

    const hashedPasswordAdmin = bcryptjs.hashSync("admin123", 10);
    const hashedPasswordUser = bcryptjs.hashSync("user123", 10);
    const hashedPasswordVendor = bcryptjs.hashSync("vendor123", 10);

    const admin = await User.create({
      username: "admin",
      email: "admin@rentaride.com",
      password: hashedPasswordAdmin,
      isAdmin: true,
      isUser: false,
      isVendor: false,
    });
    console.log("Admin created:", admin.email);

    const testUser = await User.create({
      username: "testuser",
      email: "testuser@rentaride.com",
      password: hashedPasswordUser,
      isUser: true,
      isAdmin: false,
      isVendor: false,
    });
    console.log("Test user created:", testUser.email);

    const testVendor = await User.create({
      username: "testvendor",
      email: "testvendor@rentaride.com",
      password: hashedPasswordVendor,
      isVendor: true,
      isUser: false,
      isAdmin: false,
    });
    console.log("Test vendor created:", testVendor.email);

    const masterLocations = [
      { id: uuidv4(), district: "Kochi", location: "kalamassery : volkswagen", type: "location" },
      { id: uuidv4(), district: "Kochi", location: "cheranallur : volkswagen", type: "location" },
      { id: uuidv4(), district: "Kottayam", location: "ettumanoor : skoda service", type: "location" },
      { id: uuidv4(), district: "Kottayam", location: "kottayam : railway station", type: "location" },
      { id: uuidv4(), district: "Kottayam", location: "thellakom : volkswagen", type: "location" },
      { id: uuidv4(), district: "Trivandrum", location: "Nh 66 bybass : kochuveli railway station", type: "location" },
      { id: uuidv4(), district: "Trivandrum", location: "tampanur : central railway station", type: "location" },
      { id: uuidv4(), district: "Trivandrum", location: "kazhakootam : railway station", type: "location" },
      { id: uuidv4(), district: "Thrissur", location: "thrissur : railway station", type: "location" },
      { id: uuidv4(), district: "Thrissur", location: "valarkavu : near ganam theater", type: "location" },
      { id: uuidv4(), district: "Thrissur", location: "paliyekara : evm mg", type: "location" },
      { id: uuidv4(), district: "Calicut", location: "calicut : railway", type: "location" },
      { id: uuidv4(), district: "Calicut", location: "calicut : airport", type: "location" },
      { id: uuidv4(), district: "Calicut", location: "pavangad : evm nissan", type: "location" },
    ];

    const masterCars = [
      { id: uuidv4(), model: "Alto 800", variant: "manual", type: "car", brand: "maruthi" },
      { id: uuidv4(), model: "Alto 800", variant: "automatic", type: "car", brand: "maruthi" },
      { id: uuidv4(), model: "SKODA SLAVIA PETROL AT", variant: "automatic", type: "car", brand: "skoda" },
      { id: uuidv4(), model: "NISSAN MAGNITE PETROL MT", variant: "manual", type: "car", brand: "nissan" },
      { id: uuidv4(), model: "SKODA KUSHAQ Petrol MT", variant: "manual", type: "car", brand: "skoda" },
      { id: uuidv4(), model: "SKODA KUSHAQ Petrol AT", variant: "automatic", type: "car", brand: "skoda" },
      { id: uuidv4(), model: "MG HECTOR Petrol MT", variant: "manual", type: "car", brand: "mg" },
      { id: uuidv4(), model: "MG HECTOR Petrol AT", variant: "automatic", type: "car", brand: "mg" },
      { id: uuidv4(), model: "MG HECTOR Diesel MT", variant: "manual", type: "car", brand: "mg" },
      { id: uuidv4(), model: "NISSAN TERRANO Diesel MT", variant: "manual", type: "car", brand: "nissan" },
      { id: uuidv4(), model: "NISSAN KICKS Petrol MT", variant: "manual", type: "car", brand: "nissan" },
      { id: uuidv4(), model: "NISSAN KICKS Petrol AT", variant: "automatic", type: "car", brand: "nissan" },
      { id: uuidv4(), model: "VW TAIGUN Petrol MT", variant: "manual", type: "car", brand: "volkswagen" },
      { id: uuidv4(), model: "HYUNDAI ALCAZAR Diesel AT", variant: "automatic", type: "car", brand: "hyundai" },
      { id: uuidv4(), model: "CITROEN C3 Petrol MT", variant: "manual", type: "car", brand: "citroen" },
      { id: uuidv4(), model: "ISUZU MUX Diesel AT", variant: "automatic", type: "car", brand: "isuzu" },
      { id: uuidv4(), model: "MG HECTOR PLUS Petrol MT", variant: "manual", type: "car", brand: "mg" },
      { id: uuidv4(), model: "MG HECTOR PLUS Petrol AT", variant: "automatic", type: "car", brand: "mg" },
      { id: uuidv4(), model: "MARUTI SWIFT Petrol AT", variant: "automatic", type: "car", brand: "maruthi" },
      { id: uuidv4(), model: "DATSUN REDI GO Petrol MT", variant: "manual", type: "car", brand: "DATSUN" },
      { id: uuidv4(), model: "VW AMEO Diesel MT", variant: "manual", type: "car", brand: "volkswagen" },
      { id: uuidv4(), model: "SKODA RAPID Petrol MT", variant: "manual", type: "car", brand: "skoda" },
      { id: uuidv4(), model: "MARUTI DZIRE Petrol MT", variant: "manual", type: "car", brand: "maruthi" },
      { id: uuidv4(), model: "VW VENTO Petrol MT", variant: "manual", type: "car", brand: "volkswagen" },
      { id: uuidv4(), model: "VW POLO Petrol MT", variant: "manual", type: "car", brand: "volkswagen" },
      { id: uuidv4(), model: "VW POLO Petrol AT", variant: "automatic", type: "car", brand: "volkswagen" },
    ];

    await MasterData.insertMany([...masterLocations, ...masterCars]);
    console.log("Master data seeded");

    const vehicles = [
      {
        registeration_number: "KL 01 AB 1234",
        car_title: "Maruti Alto 800",
        car_description: "Best budget car for city rides",
        company: "Maruti",
        name: "Alto 800",
        model: "Alto 800",
        year_made: 2022,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 5,
        price: 800,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "hatchback",
        location: "kalamassery : skoda service",
        district: "Kochi",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://cdna.artelmea.com/original/5793Maruti_Suzuki_Alto_800_(black).jpg"],
      },
      {
        registeration_number: "KL 01 AB 5678",
        car_title: "Skoda Slavia",
        car_description: "Premium sedan with great features",
        company: "Skoda",
        name: "Slavia",
        model: "SKODA SLAVIA PETROL AT",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "automatic",
        seats: 5,
        price: 2500,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "sedan",
        location: "kalamassery : volkswagen",
        district: "Kochi",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://cdna.artelmea.com/original/5797Skoda_Slavia.jpg"],
      },
      {
        registeration_number: "KL 01 CD 9012",
        car_title: "MG Hector",
        car_description: "Luxury SUV with advanced features",
        company: "MG",
        name: "Hector",
        model: "MG HECTOR Petrol MT",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 5,
        price: 3500,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "suv",
        location: "kottayam : railway station",
        district: "Kottayam",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500"],
      },
      {
        registeration_number: "KL 01 EF 3456",
        car_title: "Volkswagen Polo",
        car_description: "German engineering at its best",
        company: "Volkswagen",
        name: "Polo",
        model: "VW POLO Petrol MT",
        year_made: 2022,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 5,
        price: 1800,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "hatchback",
        location: "thrissur : railway station",
        district: "Thrissur",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500"],
      },
      {
        registeration_number: "KL 01 GH 7890",
        car_title: "Hyundai Alcazar",
        car_description: "Premium 7-seater SUV",
        company: "Hyundai",
        name: "Alcazar",
        model: "HYUNDAI ALCAZAR Diesel AT",
        year_made: 2023,
        fuel_type: "diesel",
        transmition: "automatic",
        seats: 7,
        price: 3000,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "suv",
        location: "calicut : railway",
        district: "Calicut",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500"],
      },
      {
        registeration_number: "KL 01 IJ 1122",
        car_title: "Nissan Magnite",
        car_description: "Compact SUV with power",
        company: "Nissan",
        name: "Magnite",
        model: "NISSAN MAGNITE PETROL MT",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 5,
        price: 1500,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "suv",
        location: "Nh 66 bybass : kochuveli railway station",
        district: "Trivandrum",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1618889484698-442e60f9d2a5?w=500"],
      },
      {
        registeration_number: "KL 01 KL 3344",
        car_title: "Maruti Swift",
        car_description: "Popular hatchback",
        company: "Maruti",
        name: "Swift",
        model: "MARUTI SWIFT Petrol AT",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "automatic",
        seats: 5,
        price: 1200,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "hatchback",
        location: "ettumanoor : skoda service",
        district: "Kottayam",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500"],
      },
      {
        registeration_number: "KL 01 MN 5566",
        car_title: "Skoda Rapid",
        car_description: "Mid-size sedan",
        company: "Skoda",
        name: "Rapid",
        model: "SKODA RAPID Petrol MT",
        year_made: 2022,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 5,
        price: 2000,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "sedan",
        location: "valarkavu : near ganam theater",
        district: "Thrissur",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1549399542-7e3f8f79d5b7?w=500"],
      },
      {
        registeration_number: "KL 01 OP 7788",
        car_title: "MG Hector Plus",
        car_description: "7-seater premium SUV",
        company: "MG",
        name: "Hector Plus",
        model: "MG HECTOR PLUS Petrol MT",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 7,
        price: 3800,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "suv",
        location: "calicut : airport",
        district: "Calicut",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500"],
      },
      {
        registeration_number: "KL 01 QR 9900",
        car_title: "Maruti Dzire",
        car_description: "Compact sedan",
        company: "Maruti",
        name: "Dzire",
        model: "MARUTI DZIRE Petrol MT",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 5,
        price: 1100,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "sedan",
        location: "thellakom : volkswagen",
        district: "Kottayam",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: true,
        addedBy: "admin",
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1580273916550-e323be2eb5fa?w=500"],
      },
    ];

    await Vehicle.insertMany(vehicles);
    console.log("Vehicles seeded");

    const vendorVehicles = [
      {
        registeration_number: "KL 11 V 0001",
        car_title: "Vendor Honda City",
        car_description: "Vendor's car for rent",
        company: "Honda",
        name: "City",
        model: "Honda City",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "automatic",
        seats: 5,
        price: 2000,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "sedan",
        location: "kalamassery : skoda service",
        district: "Kochi",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: false,
        addedBy: testVendor._id.toString(),
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1527842891421-42eec6e703ea?w=500"],
      },
      {
        registeration_number: "KL 11 V 0002",
        car_title: "Vendor Toyota Innova",
        car_description: "Vendor's SUV for rent",
        company: "Toyota",
        name: "Innova Crysta",
        model: "Toyota Innova",
        year_made: 2022,
        fuel_type: "diesel",
        transmition: "automatic",
        seats: 7,
        price: 3500,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "suv",
        location: "kottayam : railway station",
        district: "Kottayam",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: false,
        addedBy: testVendor._id.toString(),
        isAdminApproved: true,
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500"],
      },
    ];

    await Vehicle.insertMany(vendorVehicles);
    console.log("Vendor vehicles seeded");

    // Add pending vendor vehicles for admin approval
    const pendingVendorVehicles = [
      {
        registeration_number: "KL 12 P 0001",
        car_title: "Hyundai Creta",
        car_description: "Pending approval vehicle",
        company: "Hyundai",
        name: "Creta",
        model: "Hyundai Creta",
        year_made: 2024,
        fuel_type: "petrol",
        transmition: "automatic",
        seats: 5,
        price: 2200,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "suv",
        location: "thrissur : railway station",
        district: "Thrissur",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: false,
        addedBy: testVendor._id.toString(),
        isAdminApproved: false, // Pending approval
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500"],
      },
      {
        registeration_number: "KL 12 P 0002",
        car_title: "Kia Seltos",
        car_description: "Pending approval vehicle",
        company: "Kia",
        name: "Seltos",
        model: "Kia Seltos",
        year_made: 2023,
        fuel_type: "petrol",
        transmition: "manual",
        seats: 5,
        price: 1800,
        base_package: "500km",
        with_or_without_fuel: false,
        car_type: "suv",
        location: "calicut : railway",
        district: "Calicut",
        isDeleted: "false",
        isBooked: false,
        isAdminAdded: false,
        addedBy: testVendor._id.toString(),
        isAdminApproved: false, // Pending approval
        isRejected: false,
        image: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500"],
      },
    ];

    await Vehicle.insertMany(pendingVendorVehicles);
    console.log("Pending vendor vehicles seeded");

    const allVehicles = await Vehicle.find({});

    if (allVehicles.length > 0) {
      const bookings = [
        {
          vehicleId: allVehicles[0]._id,
          userId: testUser._id,
          pickupDate: new Date("2026-05-01"),
          dropOffDate: new Date("2026-05-05"),
          pickUpLocation: allVehicles[0].location,
          pickUpDistrict: allVehicles[0].district,
          dropOffLocation: allVehicles[0].location,
          totalPrice: allVehicles[0].price * 4,
          razorpayOrderId: "ORDER_SEED_1",
          razorpayPaymentId: "PAYMENT_SEED_1",
          status: "tripCompleted",
        },
        {
          vehicleId: allVehicles[1]._id,
          userId: testUser._id,
          pickupDate: new Date("2026-06-10"),
          dropOffDate: new Date("2026-06-15"),
          pickUpLocation: allVehicles[1].location,
          pickUpDistrict: allVehicles[1].district,
          dropOffLocation: allVehicles[1].location,
          totalPrice: allVehicles[1].price * 5,
          razorpayOrderId: "ORDER_SEED_2",
          razorpayPaymentId: "PAYMENT_SEED_2",
          status: "booked",
        },
        {
          vehicleId: allVehicles[2]?._id,
          userId: testUser._id,
          pickupDate: new Date("2026-07-01"),
          dropOffDate: new Date("2026-07-03"),
          pickUpLocation: allVehicles[2]?.location || "kalamassery : skoda service",
          pickUpDistrict: allVehicles[2]?.district || "Kochi",
          dropOffLocation: allVehicles[2]?.location || "kalamassery : skoda service",
          totalPrice: 3000,
          razorpayOrderId: "ORDER_SEED_3",
          razorpayPaymentId: "PAYMENT_SEED_3",
          status: "onTrip",
        },
      ].filter(b => b.vehicleId);

      if (bookings.length > 0) {
        await Booking.insertMany(bookings);
        console.log("Bookings seeded");
      }
    }

    console.log("\n=== SEED COMPLETE ===");
    console.log("Login credentials:");
    console.log("Admin: admin@rentaride.com / admin123");
    console.log("User: testuser@rentaride.com / user123");
    console.log("Vendor: testvendor@rentaride.com / vendor123");

  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seedData();