import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import { defaultDoctors } from "./data/defaultDoctors.js";

dotenv.config({ path: "./config.env" });

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const doctor of defaultDoctors) {
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
