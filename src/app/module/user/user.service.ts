import { Role, Speciality } from "../../../generated/prisma/client"
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
    const specialties: Speciality[] = [];

    for (const specialityId of payload.specialites) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specialityId
            }
        })
        if (!speciality) {
            throw new Error(`Speciality with id ${specialityId} not found`);
        }
        specialties.push(speciality);
    }

    const userExist = await prisma.user.findUnique({
        where: {
            email: payload.doctor.email
        }
    })

    if (userExist) {
        throw new Error(`User with email ${payload.doctor.email} already exists`);
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: Role.DOCTOR,
            name: payload.doctor.name,
            needPasswordChange: true
        }
    })


    try {
        const result = await prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor,

                }
            })

            

            const doctorSpecialityData = specialties.map((specialty) => {
                return {
                    doctorId: doctorData.id,
                    specialityId: specialty.id
                }
            })

            await tx.doctorSpeciality.createMany({
                data: doctorSpecialityData
            })

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilephoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            status: true,
                            emailVerified: true,
                            image: true,
                            isDeleted: true,
                            deletedAt: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    },
                    specialities: {
                        select: {
                            speciality: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            }
                        }
                    }
                }
            })

            return doctor;
        })

        return result;
    } catch (error) {
        console.error("Error creating doctor:", error);
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
    }

}


export const userService = {
    createDoctor
}