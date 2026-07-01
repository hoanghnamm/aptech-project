import axios from "axios";

/**
 * Hàm gửi ảnh lên backend Node.js để phân tích (Dùng Axios)
 * @param {File} file - File ảnh người dùng upload từ máy
 * @returns {Promise<Object>} - Trả về dữ liệu JSON chứa kết quả phân tích (predictions)
 */
export const analyzeDogImage = async (file) => {
  // Tạo FormData để đóng gói file ảnh
  const formData = new FormData();
  formData.append("image", file);

  try {
    // Gửi request POST bằng Axios
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/v1/ai/analyze`,
      formData,
      {
        headers: {
          // Bắt buộc đối với request gửi file (multipart)
          "Content-Type": "multipart/form-data",
        },
      },
    );

    // Axios tự động parse JSON, dữ liệu trả về từ backend nằm trong .data
    return response.data;
  } catch (error) {
    if (error.response) {
      // Thêm , { cause: error } vào sau chuỗi thông báo
      throw new Error(
        error.response.data.error || "Có lỗi từ vũ trụ máy chủ rồi! 🛸",
        { cause: error },
      );
    } else if (error.request) {
      throw new Error(
        "Không thể kết nối đến máy chủ. Kiểm tra lại backend xem bật chưa ông ơi! 🛑",
        { cause: error },
      );
    } else {
      throw new Error(error.message || "Lỗi mạng hoặc lỗi không xác định! 🌐", {
        cause: error,
      });
    }
  }
};
