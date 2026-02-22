/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpeciality = catchAsync(
    async(req: Request, res: Response) => {
        const Payload = req.body;
        const result = await specialityService.createSpeciality(Payload);
        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: "Speciality created successfully",
            data: result
        });
    }
);


const getAllSpeciality = catchAsync(
    async(req: Request, res: Response) => {
        const result = await specialityService.getAllSpeciality();
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Speciality fetched successfully",
            data: result
        });
    }
);


const deleteSpeciality = catchAsync(
    async(req: Request, res: Response) => {
        const id = req.params.id;
        const result = await specialityService.deleteSpeciality(id as string);
        sendResponse(res, {
            httpStatusCode: 200,
            success: true,
            message: "Speciality deleted successfully",
            data: result
        });
    }
)




export const specialityController = {
    createSpeciality,
    getAllSpeciality,
    deleteSpeciality
};