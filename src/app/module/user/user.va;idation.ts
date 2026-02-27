import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorSchema = z.object({
    password: z.string("Password is required").min(6, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
    doctor: z.object({
        name: z.string("Name is required").min(5, "Name must be at least 5 characters long").max(30, "Name must be at most 30 characters long"),
        profilephoto: z.string("Profile photo URL is required").url("Profile photo must be a valid URL"),
        email: z.email("Invalid email address"),
        contactNumber: z.string("Contact number is required").length(11, "Contact number must be exactly 11 digits").regex(/^01\d+$/, "Contact number must start with 01 and contain only digits"),
        address: z.string("Address is required").min(5, "Address must be at least 5 characters long").max(100, "Address must be at most 100 characters long")
            .optional(),
        registrationNumber: z.string("Registration number is required"),
        experience: z.int("Experience must be an integer").nonnegative("Experience cannot be negative"),
        gender: z.enum([Gender.MALE, Gender.FEMALE], "Gender must be either 'MALE' or 'FEMALE'"),
        appointmentFee: z.number("Appointment fee must be a number").nonnegative("Appointment fee cannot be negative"),
        qualification: z.string("Qualification is required").min(2, "Qualification must be at least 2 characters long").max(50, "Qualification must be at most 50 characters long"),
        currentWorkingPlace: z.string("Current working place is required").min(2, "Current working place must be at least 2 characters long").max(50, "Current working place must be at most 50 characters long"),
        designation: z.string("Designation is required").min(2, "Designation must be at least 2 characters long").max(50, "Designation must be at most 50 characters long")
    }),
    specialites: z.array(z.uuid("Speciality ID must be a valid UUID")).min(1, "At least one speciality is required")

})