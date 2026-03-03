import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";


const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });

    return doctors;
};

const getDoctorById = async (id: string) => {
    const doctro = await prisma.doctor.findUnique({
        where: {
            id
        }, include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });


    return doctro;
};


const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
    const doctorExist = await prisma.doctor.findUnique({
        where: {
            id
        }
    });

    if (!doctorExist) {
        throw new AppError(status.NOT_FOUND, "Doctor not found")
    };

    const { doctor: doctorData, specialties } = payload;

    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: { id },
                data: { ...doctorData }
            })
        }

        if (specialties && specialties.length > 0) {
            for (const specialty of specialties) {
                const { specialtyId, shouldDelete } = specialty;
                if (shouldDelete) {
                    await tx.doctorSpecialty.delete({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId,
                            }
                        }
                    })
                } else {
                    await tx.doctorSpecialty.upsert({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId
                            }
                        },
                        create: {
                            doctorId: id,
                            specialtyId
                        },
                        update: {}
                    })
                }
            }
        }
    })

    const doctor = await getDoctorById(id);

    return doctor;

}




export const doctorService = {
    getAllDoctors,
    getDoctorById,
    updateDoctor
};