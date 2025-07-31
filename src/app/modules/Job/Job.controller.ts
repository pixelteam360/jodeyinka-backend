import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { jobFilterableFields } from "./Job.costant";
import { JobService } from "./Job.service";

const createJob = catchAsync(async (req, res) => {
  const result = await JobService.createJobIntoDb(req.body, req.user.id);
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

const getAllJobs = catchAsync(async (req, res) => {
  const filters = pick(req.query, jobFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await JobService.getAllJobs(filters, options);
  sendResponse(res, {
    message: "Jobs retrieved successfully!",
    data: result,
  });
});

const singleJob = catchAsync(async (req, res) => {
  const result = await JobService.singleJob(req.params.id);
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

const applyForJob = catchAsync(async (req, res) => {
  const result = await JobService.applyForJob(
    req.body,
    req.params.id,
    req.user.id,
    req.user.role
  );
  sendResponse(res, {
    message: "Job applied successfully",
    data: result,
  });
});

const jobApplications = catchAsync(async (req, res) => {
  const result = await JobService.jobApplications(req.params.id);
  sendResponse(res, {
    message: "Job applications retrieved successfully",
    data: result,
  });
});

const acceptApplication = catchAsync(async (req, res) => {
  const result = await JobService.acceptApplication(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Job applications accepted successfully",
    data: result,
  });
});

const deleteApplication = catchAsync(async (req, res) => {
  const result = await JobService.deleteApplication(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Applications deleted successfully",
    data: result,
  });
});

const myAppliedJobs = catchAsync(async (req, res) => {
  const result = await JobService.myAppliedJobs(req.user.id);
  sendResponse(res, {
    message: "Applications deleted successfully",
    data: result,
  });
});

export const JobController = {
  createJob,
  myJobs,
  getAllJobs,
  singleJob,
  updateJob,
  applyForJob,
  jobApplications,
  acceptApplication,
  deleteApplication,
  myAppliedJobs,
};
