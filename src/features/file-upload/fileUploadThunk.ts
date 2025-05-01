import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosFormDataInstance } from "../../utils/axiosInstance";

interface UploadResponse {
  resultTable: any[];
  resultFile: string;
}

export const bulkUploadInventory = createAsyncThunk<
  UploadResponse,
  FormData,
  { rejectValue: string }
>(
  'fileUpload/bulkUploadInventory',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosFormDataInstance.post(
        `/bulk-upload/medicine`,
        formData
      );

      return response.data.data as UploadResponse;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Upload failed');
    }
  }
);
