import axios from 'axios';

const UPLOAD_URL = 'https://neupgroup.com/content/bridge/api/upload.php';

interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export const uploadFile = async (file: File, contentid: string, name?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('platform', 'neup-suite');
  formData.append('userid', 'suite');
  formData.append('contentid', contentid);
  if (name) {
    formData.append('name', name);
  }

  try {
    const response = await axios.post<UploadResponse>(UPLOAD_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success && response.data.url) {
      return response.data.url;
    } else {
      throw new Error(response.data.message || 'File upload failed.');
    }
  } catch (error) {
    console.error('Upload error:', error);
    if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'An unknown upload error occurred.');
    }
    throw new Error('An unknown upload error occurred.');
  }
};
