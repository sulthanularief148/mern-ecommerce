export const handleAxiosError = (error, fallbackMessage = "Something went wrong") => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.message) {
        return error.message.includes("Network Error")
            ? "Network error. Please check your internet connection."
            : fallbackMessage;
    }
    return fallbackMessage;
};
