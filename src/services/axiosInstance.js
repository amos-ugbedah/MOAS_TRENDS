import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://zonkfsgqhujoglkyojbi.supabase.co/rest/v1", // Supabase REST API base URL
  timeout: 6000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvbmtmc2dxaHVqb2dsa3lvamJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDM1ODcsImV4cCI6MjA1OTI3OTU4N30.3n9FSrLwgooxZHQjpCub-UGVA6XAtM4wu_W737BHDXo", // Replace with your Supabase anon key
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvbmtmc2dxaHVqb2dsa3lvamJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MDM1ODcsImV4cCI6MjA1OTI3OTU4N30.3n9FSrLwgooxZHQjpCub-UGVA6XAtM4wu_W737BHDXo`, // Replace with your Supabase anon key
  },
});

export default axiosInstance;
