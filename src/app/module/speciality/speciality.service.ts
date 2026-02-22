import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async(payload:Speciality):Promise<Speciality> => {
    const speciaity = await prisma.speciality.create({
        data: payload
    })
    return speciaity;   
};


const getAllSpeciality = async():Promise<Speciality[]> => {
    const specialites = await prisma.speciality.findMany();
    return specialites;
};

const deleteSpeciality = async(id:string):Promise<Speciality> => {
    const speciality = await prisma.speciality.delete({
        where : {id}
     });
    return speciality;
};


export const specialityService = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality
}