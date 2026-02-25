import { prisma } from "../../lib/prisma";


const getAllDoctors = async () => {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    });

    return doctors;
};

const getDoctorById = async(id: string) => {
    const doctro = await prisma.doctor.findUnique({
        where : {
            id
        },include: {
            user: true,
            specialities: {
                include: {
                    speciality: true
                }
            }
        }
    });


    return doctro;
}




export const doctorService = {
    getAllDoctors,
    getDoctorById
};