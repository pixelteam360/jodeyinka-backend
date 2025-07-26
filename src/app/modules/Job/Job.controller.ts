import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { JobService } from "./Job.service";

const createJob = catchAsync(async (req, res) => {
  const result = await JobService.createJobIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Job Registered successfully!",
    data: result,
  });
});

const myJobs = catchAsync(async (req, res) => {
  const result = await JobService.myJobs(req.user.id);
  sendResponse(res, {
    message: "Job retrieved successfully",
    data: result,
  });
});

const updateJob = catchAsync(async (req, res) => {
  const result = await JobService.updateJob(
    req.body,
    req.user.id,
    req.params.id
  );
  sendResponse(res, {
    message: "Job updated successfully!",
    data: result,
  });
});

export const JobController = {
  createJob,
  myJobs,
  updateJob,
};
