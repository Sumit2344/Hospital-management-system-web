import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";

dotenv.config({ path: "./config.env" });

const doctors = [
  {
    firstName: "Aarav",
    lastName: "Sharma",
    email: "aarav.sharma@zeecareplus.com",
    phone: "9876500001",
    gender: "Male",
    doctorDepartment: "Cardiology",
  },
  {
    firstName: "Diya",
    lastName: "Patel",
    email: "diya.patel@zeecareplus.com",
    phone: "9876500002",
    gender: "Female",
    doctorDepartment: "Neurology",
  },
  {
    firstName: "Rohan",
    lastName: "Verma",
    email: "rohan.verma@zeecareplus.com",
    phone: "9876500003",
    gender: "Male",
    doctorDepartment: "Orthopedics",
  },
  {
    firstName: "Anaya",
    lastName: "Mehta",
    email: "anaya.mehta@zeecareplus.com",
    phone: "9876500004",
    gender: "Female",
    doctorDepartment: "Dermatology",
  },
  {
    firstName: "Kabir",
    lastName: "Reddy",
    email: "kabir.reddy@zeecareplus.com",
    phone: "9876500005",
    gender: "Male",
    doctorDepartment: "Pediatrics",
  },
  {
    firstName: "Ira",
    lastName: "Kapoor",
    email: "ira.kapoor@zeecareplus.com",
    phone: "9876500006",
    gender: "Female",
    doctorDepartment: "Oncology",
  },
  {
    firstName: "Vivaan",
    lastName: "Nair",
    email: "vivaan.nair@zeecareplus.com",
    phone: "9876500007",
    gender: "Male",
    doctorDepartment: "Radiology",
  },
  {
    firstName: "Saanvi",
    lastName: "Iyer",
    email: "saanvi.iyer@zeecareplus.com",
    phone: "9876500008",
    gender: "Female",
    doctorDepartment: "ENT",
  },
  {
    firstName: "Reyansh",
    lastName: "Gupta",
    email: "reyansh.gupta@zeecareplus.com",
    phone: "9876500009",
    gender: "Male",
    doctorDepartment: "Physical Therapy",
  },
  {
    firstName: "Myra",
    lastName: "Singh",
    email: "myra.singh@zeecareplus.com",
    phone: "9876500010",
    gender: "Female",
    doctorDepartment: "Cardiology",
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const doctor of doctors) {
      const exists = await User.findOne({ email: doctor.email });
      if (exists) {
        continue;
      }

      await User.create({
        ...doctor,
        password: "doctor123",
        role: "Doctor",
      });
    }

    console.log("10 sample doctors are ready for appointments.");
  } catch (error) {
    console.error("Doctor seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedDoctors();
